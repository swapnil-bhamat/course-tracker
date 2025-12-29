<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCurriculumStore } from '~/stores/curriculum'
import { BookOpen, CheckCircle, Circle, ExternalLink, Calendar, Send, ArrowRight, Loader2, Database, Cloud } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const auth = useAuthStore()
const curriculumStore = useCurriculumStore()
const router = useRouter()

const selectedSubjectId = ref(curriculumStore.subjects[0].id)
const selectedSubject = computed(() => curriculumStore.subjects.find(s => s.id === selectedSubjectId.value) || curriculumStore.subjects[0])
const selectedTopic = ref(null as any)
const repoLink = ref('')
const isSubmitting = ref(false)
const isScheduling = ref(false)

// Initialize and protect route
onMounted(async () => {
  await auth.fetchUser()
  if (!auth.authenticated) {
    router.push('/')
    return
  }
  await curriculumStore.loadFromDrive()
})

const selectSubject = (id: string) => {
  selectedSubjectId.value = id
}

const openTopic = (topic: any) => {
  selectedTopic.value = topic
  repoLink.value = topic.repoLink || ''
}

const handleScheduleMeeting = async () => {
  isScheduling.value = true
  await curriculumStore.scheduleMeeting(selectedTopic.value)
  isScheduling.value = false
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
        topicTitle: selectedTopic.value.title
      }
    })

    if (response.status === 'warning') {
      toast.warning(response.message)
    } else {
      curriculumStore.completeTopic(selectedSubject.value.id, selectedTopic.value.id, repoLink.value)
      toast.success(response.message || 'Assignment submitted and progress saved!')
    }
  } catch (error) {
    console.error('Assignment check failed', error)
    // Fallback to simple completion if API fails
    curriculumStore.completeTopic(selectedSubject.value.id, selectedTopic.value.id, repoLink.value)
    toast.success('Assignment submitted and progress saved!')
  } finally {
    isSubmitting.value = false
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

    <div class="row g-4">
      <!-- Sidebar: Subjects -->
      <aside class="col-12 col-lg-3">
        <h2 class="h5 font-weight-bold font-heading mb-4 px-2 text-white">Subjects</h2>
        <div class="d-grid gap-3">
          <div v-for="subject in curriculumStore.subjects" :key="subject.id" 
               @click="selectSubject(subject.id)"
               class="glass-card p-3 cursor-pointer border transition-all d-flex align-items-center gap-3"
               :class="selectedSubject.id === subject.id ? 'border-primary' : 'border-transparent hover-bg-soft'">
            <div class="p-2 bg-primary bg-opacity-10 rounded-3">
              <BookOpen v-if="subject.icon === 'layout'" :size="20" class="text-primary" />
              <Database v-else-if="subject.icon === 'database'" :size="20" class="text-primary" />
              <Cloud v-else :size="20" class="text-primary" />
            </div>
            <span class="font-weight-medium text-white">{{ subject.title }}</span>
          </div>
        </div>
      </aside>

      <!-- Main: Topics List -->
      <section class="col-12 col-lg-9">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h2 class="h3 font-weight-bold font-heading text-white mb-0">{{ selectedSubject.title }}</h2>
          <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small">
            {{ selectedSubject.topics.filter(t => t.completed).length }} / {{ selectedSubject.topics.length }} Completed
          </span>
        </div>

        <div class="d-grid gap-3">
          <div v-for="topic in selectedSubject.topics" :key="topic.id" 
               @click="openTopic(topic)"
               class="glass-card p-4 d-flex align-items-center justify-content-between border border-transparent transition-all cursor-pointer hover-scale">
            <div class="d-flex align-items-center gap-4">
              <div class="flex-shrink-0">
                <CheckCircle v-if="topic.completed" class="text-success" :size="24" />
                <Circle v-else class="text-muted" :size="24" />
              </div>
              <div>
                <h5 class="mb-1 text-white font-weight-bold">{{ topic.title }}</h5>
                <p class="small text-muted mb-0">{{ topic.description }}</p>
              </div>
            </div>
            <ArrowRight class="text-muted" :size="20" />
          </div>
        </div>
      </section>
    </div>

    <!-- Modal: Topic Detail (Using Bootstrap) -->
    <div v-if="selectedTopic" 
         class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 backdrop-blur d-flex align-items-center justify-content-center p-3 z-3">
      <div class="glass-card w-100 shadow-lg animate-in fade-in scale-in" style="max-width: 700px;">
        <div class="p-4 p-md-5">
          <div class="d-flex justify-content-between align-items-start mb-4">
            <h2 class="h2 font-weight-bold font-heading text-white mb-0">{{ selectedTopic.title }}</h2>
            <button @click="selectedTopic = null" class="btn btn-link text-muted p-0 border-0 fs-3">&times;</button>
          </div>
          
          <p class="text-muted fs-6 mb-4 leading-relaxed">{{ selectedTopic.description }}</p>

          <div class="mb-5">
            <h6 class="text-white text-uppercase small ls-wider font-weight-bold mb-3 opacity-75">Study Materials</h6>
            <div class="d-grid gap-2">
              <a v-for="material in selectedTopic.studyMaterials" 
                 :key="material.url" :href="material.url" target="_blank"
                 class="d-flex align-items-center justify-content-between p-3 bg-secondary bg-opacity-10 rounded-3 border border-secondary border-opacity-10 text-decoration-none text-light hover-bg-soft transition-colors">
                <span class="small font-weight-medium text-white-50">{{ material.label }}</span>
                <ExternalLink :size="16" class="text-primary" />
              </a>
            </div>
          </div>

          <div class="d-grid gap-3 pt-4 border-top border-secondary border-opacity-25">
            <button @click="handleScheduleMeeting" :disabled="isScheduling" 
                    class="btn btn-primary btn-lg d-flex align-items-center justify-content-center gap-2 py-3">
              <Loader2 v-if="isScheduling" class="animate-spin" :size="18" />
              <Calendar v-else :size="18" />
              {{ isScheduling ? 'Scheduling...' : 'Schedule Study Session' }}
            </button>

            <div class="mt-4">
              <h6 class="text-white text-uppercase small ls-wider font-weight-bold mb-3 opacity-75 d-flex align-items-center gap-2">
                Assignment Submission
                <span v-if="selectedTopic.completed" class="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 rounded-pill px-2 py-1" style="font-size: 0.6rem;">Completed</span>
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
