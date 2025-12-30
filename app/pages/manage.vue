<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCurriculumStore } from '~/stores/curriculum'
import { 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  ChevronLeft, 
  LayoutDashboard,
  Target,
  Layers,
  FileText,
  GripVertical
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const auth = useAuthStore()
const curriculumStore = useCurriculumStore()
const router = useRouter()

onMounted(async () => {
  await auth.fetchUser()
  if (!auth.authenticated) {
    router.push('/')
    return
  }
  await curriculumStore.loadFromDrive()
})

const activeDomainId = ref('')

const metaForm = ref({
  goal: '',
  duration_days: 0,
  daily_study_hours: ''
})

watch(() => curriculumStore.curriculum.meta, (newMeta) => {
  if (newMeta) {
    metaForm.value = { ...newMeta }
  }
}, { immediate: true, deep: true })

const saveMeta = () => {
  curriculumStore.updateMeta(metaForm.value)
  toast.success('Meta information updated')
}

// Domain management
const newDomainId = ref('')
const newDomainTitle = ref('')

const addDomain = () => {
  if (!newDomainId.value || !newDomainTitle.value) {
    toast.error('Please provide ID and Title')
    return
  }
  curriculumStore.addDomain(newDomainId.value, {
    title: newDomainTitle.value,
    estimated_days: 30,
    sections: {}
  })
  newDomainId.value = ''
  newDomainTitle.value = ''
  toast.success('Pathway added')
}

const deleteDomain = (id: string) => {
  if (confirm('Are you sure you want to delete this pathway?')) {
    curriculumStore.deleteDomain(id)
    if (activeDomainId.value === id) activeDomainId.value = ''
    toast.success('Pathway removed')
  }
}

// Section/Topic management
const newSectionTitle = ref('')
const addSection = (domainId: string) => {
  if (!newSectionTitle.value) return
  const id = newSectionTitle.value.toLowerCase().replace(/\s+/g, '_')
  curriculumStore.updateSection(domainId, id, {
    title: newSectionTitle.value,
    topics: []
  })
  newSectionTitle.value = ''
  toast.success('Section added')
}

const deleteSection = (domainId: string, sectionId: string) => {
  if (confirm('Delete this section?')) {
    curriculumStore.deleteSection(domainId, sectionId)
    toast.success('Section removed')
  }
}

const addTopic = (domainId: string, sectionId: string) => {
  const domain = curriculumStore.curriculum[domainId]
  if (domain && domain.sections[sectionId]) {
    domain.sections[sectionId].topics.push({
      name: 'New Topic',
      estimated_time_hours: 2,
      interview_frequency_score: 3,
      status: 'pending',
      material: []
    })
    curriculumStore.saveToDrive()
  }
}

const deleteTopic = (domainId: string, sectionId: string, index: number) => {
  const domain = curriculumStore.curriculum[domainId]
  if (domain && domain.sections[sectionId]) {
    domain.sections[sectionId].topics.splice(index, 1)
    curriculumStore.saveToDrive()
  }
}

const addMaterial = (topic: any) => {
  topic.material.push('')
}

const removeMaterial = (topic: any, index: number) => {
  topic.material.splice(index, 1)
}
const handleManualSync = async () => {
  const syncPromise = curriculumStore.saveToDrive()
  toast.promise(syncPromise, {
    loading: 'Syncing to Google Drive...',
    success: 'Progress synced successfully!',
    error: 'Failed to sync with Drive'
  })
}
</script>

<template>
  <div class="min-vh-100 bg-dark text-white py-5">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between mb-5">
        <div class="d-flex align-items-center gap-3">
          <NuxtLink to="/dashboard" class="btn btn-outline-secondary btn-icon rounded-circle">
            <ChevronLeft :size="20" />
          </NuxtLink>
          <div>
            <h1 class="h2 fw-bold mb-0">Manage Curriculum</h1>
            <p class="text-white-50 small mb-0">Configure your study goal and paths</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button @click="handleManualSync" class="btn btn-primary d-flex align-items-center gap-2">
            <Save :size="18" /> Sync to Drive
          </button>
        </div>
      </div>

      <div class="row g-4">
        <!-- Sidebar: Meta & Domains -->
        <div class="col-lg-4">
          <div class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 mb-4">
            <div class="card-body p-4">
              <h5 class="card-title d-flex align-items-center gap-2 mb-4">
                <Target :size="20" class="text-primary" /> Goal Configuration
              </h5>
              <div class="mb-3">
                <label class="form-label small text-white-50">Career Goal</label>
                <input v-model="metaForm.goal" type="text" class="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none" />
              </div>
              <div class="mb-3">
                <label class="form-label small text-white-50">Duration (Days)</label>
                <input v-model.number="metaForm.duration_days" type="number" class="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none" />
              </div>
              <div class="mb-4">
                <label class="form-label small text-white-50">Daily Hours</label>
                <input v-model="metaForm.daily_study_hours" type="text" class="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none" />
              </div>
              <button @click="saveMeta" class="btn btn-outline-primary w-100 btn-sm">Update Goal</button>
            </div>
          </div>

          <div class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4">
            <div class="card-body p-4">
              <h5 class="card-title d-flex align-items-center gap-2 mb-4">
                <Layers :size="20" class="text-primary" /> Pathways
              </h5>
              
              <div class="list-group list-group-flush mb-4 rounded-3 overflow-hidden border border-secondary border-opacity-25">
                <div 
                  v-for="domain in curriculumStore.domains" 
                  :key="domain.id"
                  class="list-group-item bg-dark border-secondary border-opacity-25 d-flex align-items-center justify-content-between py-3 cursor-pointer"
                  :class="{ 'border-primary': activeDomainId === domain.id, 'bg-opacity-50': activeDomainId !== domain.id }"
                  @click="activeDomainId = domain.id"
                >
                  <span class="fw-medium text-white">{{ domain.title }}</span>
                  <div class="d-flex gap-2">
                    <button @click.stop="deleteDomain(domain.id)" class="btn btn-icon btn-sm text-danger hover-bg-danger bg-opacity-10">
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25">
                <p class="small text-white-50 mb-2">New Pathway</p>
                <input v-model="newDomainId" placeholder="ID (e.g. DSA)" class="form-control form-control-sm bg-dark text-white border-secondary border-opacity-25 mb-2 shadow-none" />
                <input v-model="newDomainTitle" placeholder="Title (e.g. Data Structures)" class="form-control form-control-sm bg-dark text-white border-secondary border-opacity-25 mb-3 shadow-none" />
                <button @click="addDomain" class="btn btn-primary btn-sm w-100">Add Pathway</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content: Sections & Topics -->
        <div class="col-lg-8">
          <div v-if="!activeDomainId" class="h-100 d-flex flex-column align-items-center justify-content-center border border-dashed border-secondary border-opacity-25 rounded-4 p-5 text-white-50">
            <Layers :size="48" class="mb-3 opacity-25" />
            <p>Select a pathway to manage its content</p>
          </div>

          <div v-else>
            <div class="d-flex align-items-center justify-content-between mb-4">
              <h3 class="h4 fw-bold mb-0">{{ curriculumStore.curriculum[activeDomainId].title }} Content</h3>
              <div class="input-group input-group-sm w-auto">
                <input v-model="newSectionTitle" placeholder="New section title" class="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none" />
                <button @click="addSection(activeDomainId)" class="btn btn-primary d-flex align-items-center gap-1">
                  <Plus :size="16" /> Add Section
                </button>
              </div>
            </div>

            <div v-for="(section, sId) in curriculumStore.curriculum[activeDomainId].sections" :key="sId" class="mb-4">
              <div class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 overflow-hidden">
                <div class="card-header bg-dark bg-opacity-25 border-bottom border-secondary border-opacity-25 p-3 d-flex align-items-center justify-content-between">
                  <div class="d-flex align-items-center gap-2">
                    <input v-model="section.title" type="text" class="form-control form-control-sm bg-transparent border-0 text-white fw-bold shadow-none p-0" @change="curriculumStore.saveToDrive" />
                  </div>
                  <div class="d-flex gap-2">
                    <button @click="addTopic(activeDomainId, String(sId))" class="btn btn-sm btn-outline-primary py-0 px-2 d-flex align-items-center gap-1">
                      <Plus :size="14" /> Topic
                    </button>
                    <button @click="deleteSection(activeDomainId, String(sId))" class="btn btn-sm btn-icon text-danger hover-bg-danger bg-opacity-10">
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>
                <div class="card-body p-3">
                  <div class="d-flex flex-column gap-3">
                    <div v-for="(topic, tIdx) in section.topics" :key="tIdx" class="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25">
                      <div class="row g-3 align-items-center mb-3">
                        <div class="col">
                          <input v-model="topic.name" type="text" class="form-control form-control-sm bg-transparent border-0 border-bottom border-secondary border-opacity-25 text-white fw-medium shadow-none p-0" @change="curriculumStore.saveToDrive" />
                        </div>
                        <div class="col-auto">
                          <button @click="deleteTopic(activeDomainId, String(sId), tIdx)" class="btn btn-icon btn-sm text-danger opacity-50 hover-opacity-100">
                            <Trash2 :size="16" />
                          </button>
                        </div>
                      </div>
                      
                      <div class="row g-3 mb-3">
                        <div class="col-md-4">
                          <label class="small text-white-50 mb-1">Time (Hrs)</label>
                          <input v-model.number="topic.estimated_time_hours" type="number" class="form-control form-control-sm bg-dark text-white border-secondary border-opacity-25 shadow-none" @change="curriculumStore.saveToDrive" />
                        </div>
                        <div class="col-md-4">
                          <label class="small text-white-50 mb-1">Frequency (1-5)</label>
                          <input v-model.number="topic.interview_frequency_score" type="number" min="1" max="5" class="form-control form-control-sm bg-dark text-white border-secondary border-opacity-25 shadow-none" @change="curriculumStore.saveToDrive" />
                        </div>
                        <div class="col-md-4">
                          <label class="small text-white-50 mb-1">Status</label>
                          <select v-model="topic.status" class="form-select form-select-sm bg-dark text-white border-secondary border-opacity-25 shadow-none" @change="curriculumStore.saveToDrive">
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <div class="d-flex align-items-center justify-content-between mb-2">
                          <label class="small text-white-50">Study Materials (URLs)</label>
                          <button @click="addMaterial(topic)" class="btn btn-link btn-sm text-primary p-0 text-decoration-none">+ Add URL</button>
                        </div>
                        <div v-for="(url, uIdx) in topic.material" :key="uIdx" class="input-group input-group-sm mb-2">
                          <input v-model="topic.material[uIdx]" type="text" class="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none" @change="curriculumStore.saveToDrive" />
                          <button @click="removeMaterial(topic, uIdx)" class="btn btn-outline-danger border-secondary border-opacity-25 opacity-50 hover-opacity-100">
                            <Trash2 :size="14" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor-pointer {
  cursor: pointer;
}

.hover-bg-danger:hover {
  background-color: rgba(220, 53, 69, 0.1) !important;
}

.ls-wider {
  letter-spacing: 0.05em;
}

.border-dashed {
  border-style: dashed !important;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
