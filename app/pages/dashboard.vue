<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCurriculumStore } from '~/stores/curriculum'
import { BookOpen, CheckCircle, Circle, ExternalLink, Calendar, Send, ArrowRight, Loader2, Database, Cloud, Settings, Edit } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const auth = useAuthStore()
const curriculumStore = useCurriculumStore()
const router = useRouter()

const selectedDomainId = ref(curriculumStore.domains[0]?.id || 'LLD')
const selectedDomain = computed(() => curriculumStore.domains.find(d => d.id === selectedDomainId.value) || curriculumStore.domains[0])
const selectedSectionId = ref(null as string | null)
const selectedTopic = ref(null as any)
const repoLink = ref('')
const isSubmitting = ref(false)
const showEditGoalModal = ref(false)
const metaForm = ref({
  goal: '',
  duration_days: 120,
  daily_study_hours: '2-3'
})

// Initialize meta form when curriculum is loaded
watch(() => curriculumStore.curriculum.meta, (newMeta) => {
  if (newMeta) {
    metaForm.value = { ...newMeta }
  }
}, { immediate: true, deep: true })

const handleEditGoal = () => {
  curriculumStore.updateMeta(metaForm.value)
  showEditGoalModal.value = false
  toast.success('Study goal updated!')
}

// Initialize and protect route
onMounted(async () => {
  await auth.fetchUser()
  if (!auth.authenticated) {
    router.push('/')
    return
  }
  await curriculumStore.loadFromDrive()
})

const selectDomain = (id: string) => {
  selectedDomainId.value = id
  selectedSectionId.value = null
}

const openTopic = (topic: any, sectionId: string) => {
  selectedTopic.value = { ...topic, sectionId }
  repoLink.value = topic.repoLink || ''
}

const formatGoogleCalendarUrl = () => {
  if (!selectedTopic.value) return ''
  
  const title = encodeURIComponent(`Study: ${selectedTopic.value.name}`)
  const details = encodeURIComponent(`Study session for ${selectedTopic.value.name}\n\nResources:\n${selectedTopic.value.material.join('\n')}`)
  
  // Default to 1 hour starting from the next full hour
  const start = new Date()
  start.setHours(start.getHours() + 1, 0, 0, 0)
  const end = new Date(start.getTime() + 60 * 60000)
  
  const formatGDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const dates = `${formatGDate(start)}/${formatGDate(end)}`
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`
}

const submitAssignment = async () => {
  if (!repoLink.value) {
    toast.error('Please provide a repository link')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const response = await $fetch('/api/assignment/check', {
      method: 'POST',
      body: {
        repoLink: repoLink.value,
        topicTitle: selectedTopic.value.name
      }
    })

    if (response.status === 'warning') {
      toast.warning(response.message)
    } else {
      curriculumStore.completeTopic(selectedDomainId.value, selectedTopic.value.sectionId, selectedTopic.value.name, repoLink.value)
      toast.success(response.message || 'Assignment submitted and progress saved!')
    }
  } catch (error) {
    console.error('Assignment check failed', error)
    curriculumStore.completeTopic(selectedDomainId.value, selectedTopic.value.sectionId, selectedTopic.value.name, repoLink.value)
    toast.success('Assignment submitted and progress saved!')
  } finally {
    isSubmitting.value = false
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-success'
    case 'in_progress': return 'text-primary'
    default: return 'text-muted'
  }
}
</script>

<template>
  <div v-if="auth.authenticated" class="position-relative">
    <!-- Loading Overlay -->
    <div v-if="curriculumStore.loading" 
         class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 backdrop-blur d-flex align-items-center justify-content-center z-3">
      <Loader2 class="animate-spin text-primary" :size="48" />
    </div>

    <!-- Header -->
    <header class="d-flex align-items-center justify-content-between mb-5">
      <div>
        <div class="d-flex align-items-center gap-3 mb-1">
          <h1 class="h2 fw-bold mb-0 text-white">{{ curriculumStore.curriculum.meta?.goal || 'Study Planner' }}</h1>
          <button @click="showEditGoalModal = true" class="btn btn-icon btn-sm text-white-50 hover-text-white p-0 shadow-none border-0">
            <Edit :size="16" />
          </button>
        </div>
        <div class="d-flex align-items-center gap-3 text-white-50 small">
          <span class="d-flex align-items-center gap-1">
            <Calendar :size="14" /> {{ curriculumStore.curriculum.meta?.duration_days || 0 }} Days Plan
          </span>
          <span class="d-flex align-items-center gap-1">
            <Database :size="14" /> {{ curriculumStore.curriculum.meta?.daily_study_hours || '0' }} Hours Daily
          </span>
        </div>
      </div>
      <div class="d-flex gap-3">
        <NuxtLink to="/manage" class="btn btn-outline-primary rounded-pill px-4 btn-sm d-flex align-items-center gap-2">
          <Settings :size="16" /> Manage
        </NuxtLink>
      </div>
    </header>

    <div v-if="curriculumStore.domains.length > 0" class="row g-4">
      <!-- Sidebar: Domains -->
      <aside class="col-12 col-lg-3">
        <h2 class="h5 font-weight-bold font-heading mb-4 px-2 text-white">Pathways</h2>
        <div class="d-grid gap-3">
          <div v-for="domain in curriculumStore.domains" :key="domain.id" 
               @click="selectDomain(domain.id)"
               class="glass-card p-3 cursor-pointer border transition-all d-flex align-items-center gap-3"
               :class="selectedDomainId === domain.id ? 'border-primary' : 'border-transparent hover-bg-soft'">
            <div class="p-2 bg-primary bg-opacity-10 rounded-3">
              <BookOpen v-if="domain.id === 'LLD'" :size="20" class="text-primary" />
              <Database v-else-if="domain.id === 'HLD'" :size="20" class="text-primary" />
              <Cloud v-else :size="20" class="text-primary" />
            </div>
            <span class="font-weight-medium text-white">{{ domain.title }}</span>
          </div>
        </div>
      </aside>

      <!-- Main: Sections & Topics -->
      <section v-if="selectedDomain" class="col-12 col-lg-9">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h2 class="h3 font-weight-bold font-heading text-white mb-0">{{ selectedDomain.title }}</h2>
          <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small">
            {{ selectedDomain.estimated_days }} Days Plan
          </span>
        </div>

        <div v-for="(section, sectionId) in selectedDomain.sections" :key="sectionId" class="mb-5">
          <h4 class="h5 text-white-50 mb-3 px-2 d-flex align-items-center gap-2">
            <ArrowRight :size="16" class="text-primary" />
            {{ section.title }}
          </h4>
          <div class="d-grid gap-2">
            <div v-for="topic in section.topics" :key="topic.name" 
                 @click="openTopic(topic, String(sectionId))"
                 class="glass-card p-3 d-flex align-items-center justify-content-between border border-transparent transition-all cursor-pointer hover-scale">
              <div class="d-flex align-items-center gap-3">
                <div class="flex-shrink-0">
                  <CheckCircle v-if="topic.status === 'completed'" class="text-success" :size="20" />
                  <Circle v-else :class="getStatusColor(topic.status)" :size="20" />
                </div>
                <div>
                  <h6 class="mb-0 text-white font-weight-bold">{{ topic.name }}</h6>
                  <div class="d-flex gap-2 mt-1">
                    <span class="badge bg-secondary bg-opacity-25 text-white-50 small" style="font-size: 0.65rem;">
                      {{ topic.estimated_time_hours }}h
                    </span>
                    <span class="badge bg-info bg-opacity-10 text-info small" style="font-size: 0.65rem;">
                      Freq: {{ topic.interview_frequency_score }}/5
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight class="text-white-50 opacity-25" :size="16" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Empty State -->
    <div v-else-if="!curriculumStore.loading" class="text-center py-5">
      <div class="mb-4">
        <Database :size="64" class="text-white-50 opacity-25" />
      </div>
      <h3 class="h4 text-white mb-3">No Curriculum Data Found</h3>
      <p class="text-white-50 mb-4">Sync your curriculum from the Manage section to get started.</p>
      <NuxtLink to="/manage" class="btn btn-primary px-4 py-2 rounded-pill">
        Go to Manage Section
      </NuxtLink>
    </div>

    <!-- Modal: Topic Detail -->
    <div v-if="selectedTopic" 
         class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 backdrop-blur d-flex align-items-center justify-content-center p-3 z-3">
      <div class="glass-card w-100 shadow-lg animate-in fade-in scale-in" style="max-width: 700px;">
        <div class="p-4 p-md-5">
          <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2 class="h2 font-weight-bold font-heading text-white mb-1">{{ selectedTopic.name }}</h2>
              <span class="text-muted small text-uppercase ls-wider">Estimated Time: {{ selectedTopic.estimated_time_hours }} Hours</span>
            </div>
            <button @click="selectedTopic = null" class="btn btn-link text-muted p-0 border-0 fs-3">&times;</button>
          </div>
          
          <div class="mb-5">
            <h6 class="text-white text-uppercase small ls-wider font-weight-bold mb-3 opacity-75">Resources & Materials</h6>
            <div class="d-grid gap-2">
              <a v-for="url in selectedTopic.material" 
                 :key="url" :href="url" target="_blank"
                 class="d-flex align-items-center justify-content-between p-3 bg-secondary bg-opacity-10 rounded-3 border border-secondary border-opacity-10 text-decoration-none text-light hover-bg-soft transition-colors">
                <span class="small font-weight-medium text-white-50 text-truncate me-3" style="max-width: 400px;">{{ url }}</span>
                <ExternalLink :size="16" class="text-primary" />
              </a>
              <p v-if="!selectedTopic.material?.length" class="text-white-50 small fst-italic">No materials added for this topic.</p>
            </div>
          </div>

          <div class="pt-4 border-top border-secondary border-opacity-25">
            <h6 class="text-white text-uppercase small ls-wider font-weight-bold mb-3 opacity-75">Schedule Study Session</h6>
            
            <div class="d-grid">
              <a :href="formatGoogleCalendarUrl()" target="_blank"
                 class="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-3">
                <ExternalLink :size="18" />
                Create via Google Calendar
              </a>
            </div>

            <div class="mt-5">
              <h6 class="text-white text-uppercase small ls-wider font-weight-bold mb-3 opacity-75 d-flex align-items-center gap-2">
                Assignment Submission
                <span v-if="selectedTopic.status === 'completed'" class="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 rounded-pill px-2 py-1" style="font-size: 0.6rem;">Completed</span>
              </h6>
              <div class="input-group input-group-lg bg-dark bg-opacity-50 rounded-3 overflow-hidden">
                <input v-model="repoLink" class="form-control bg-transparent border-secondary border-opacity-25 text-white placeholder-muted-light" placeholder="GitHub repository link..." />
                <button @click="submitAssignment" :disabled="isSubmitting" 
                        class="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm">
                  <Loader2 v-if="isSubmitting" class="animate-spin" :size="18" />
                  <Send v-else :size="18" />
                  <span class="d-none d-sm-inline">{{ isSubmitting ? 'Submitting...' : 'Submit' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Goal Modal -->
    <BModal v-model="showEditGoalModal" title="Configure Study Goal" hide-footer centered header-bg-variant="dark" header-text-variant="white" body-bg-variant="dark" body-text-variant="white" content-class="border-secondary border-opacity-25 rounded-4 overflow-hidden">
      <div class="p-2">
        <div class="mb-3">
          <label class="form-label small text-white-50">Career Goal</label>
          <input v-model="metaForm.goal" type="text" class="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none" placeholder="e.g. Become a strong Software Architect" />
        </div>
        <div class="row g-3 mb-4">
          <div class="col-6">
            <label class="form-label small text-white-50">Duration (Days)</label>
            <input v-model.number="metaForm.duration_days" type="number" class="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none" />
          </div>
          <div class="col-6">
            <label class="form-label small text-white-50">Daily Hours</label>
            <input v-model="metaForm.daily_study_hours" type="text" class="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none" placeholder="e.g. 2-3" />
          </div>
        </div>
        <div class="d-grid">
          <button @click="handleEditGoal" class="btn btn-primary py-2 fw-bold">Save Configuration</button>
        </div>
      </div>
    </BModal>
  </div>
</template>


<style scoped>
.backdrop-blur {
  backdrop-filter: blur(8px);
}
.hover-bg-soft:hover {
  background-color: rgba(255, 255, 255, 0.03) !important;
}
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.01);
  border-color: rgba(255, 255, 255, 0.2) !important;
}
.ls-wider {
  letter-spacing: 0.05em;
}
.placeholder-muted-light::placeholder {
  color: rgba(148, 163, 184, 0.5) !important;
}
</style>
