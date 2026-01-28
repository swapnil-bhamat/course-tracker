<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useCurriculumStore } from "~/stores/curriculum";
import {
  Settings,
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  LayoutDashboard,
  Target,
  Layers,
  Clock,
  Zap,
  Briefcase,
  GraduationCap,
  FileText,
  Activity,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

const auth = useAuthStore();
const curriculumStore = useCurriculumStore();
const router = useRouter();

onMounted(async () => {
  await auth.fetchUser();
  if (!auth.authenticated) {
    router.push("/");
    return;
  }
  await curriculumStore.loadFromDrive();
});

const activeTrackId = ref("");
const activeSection = ref("meta"); // meta, tracks, defaults, consistency, weekly, career, interview, artifacts

// Helper to add item to array
const addItem = (arr: any[], defaultValue: any = "") => {
  arr.push(defaultValue);
  curriculumStore.saveToDrive();
};

// Helper to remove item from array
const removeItem = (arr: any[], index: number) => {
  arr.splice(index, 1);
  curriculumStore.saveToDrive();
};

const saveAll = () => {
  curriculumStore.saveToDrive();
  toast.success("All changes saved to Drive");
};

// Track management
const newTrackId = ref("");
const newTrackTitle = ref("");

const addTrack = () => {
  if (!newTrackId.value || !newTrackTitle.value) {
    toast.error("Please provide ID and Title");
    return;
  }
  curriculumStore.addTrack(newTrackId.value, {
    title: newTrackTitle.value,
    topics: [],
  });
  newTrackId.value = "";
  newTrackTitle.value = "";
  toast.success("Track added");
};

const deleteTrack = (id: string) => {
  if (confirm("Are you sure you want to delete this track?")) {
    curriculumStore.deleteTrack(id);
    if (activeTrackId.value === id) activeTrackId.value = "";
    toast.success("Track removed");
  }
};

const addTopic = (trackId: string) => {
  const track = curriculumStore.curriculum.STUDY_TRACK?.[trackId];
  if (track) {
    track.topics.push({
      name: "New Topic",
      status: "pending",
      micro_task: "",
      last_touched_date: null,
    });
    curriculumStore.saveToDrive();
  }
};

const deleteTopic = (trackId: string, index: number) => {
  const track = curriculumStore.curriculum.STUDY_TRACK?.[trackId];
  if (track) {
    track.topics.splice(index, 1);
    curriculumStore.saveToDrive();
  }
};
</script>

<template>
  <div class="min-vh-100 bg-dark text-white py-5">
    <div class="container-fluid px-5">
      <!-- Header -->
      <div class="d-flex align-items-center justify-content-between mb-5">
        <div class="d-flex align-items-center gap-3">
          <NuxtLink
            to="/dashboard"
            class="btn btn-outline-secondary btn-icon rounded-circle"
          >
            <ChevronLeft :size="20" />
          </NuxtLink>
          <div>
            <h1 class="h2 fw-bold mb-0">Manage Curriculum</h1>
            <p class="text-white-50 small mb-0">
              Full configuration of your learning path
            </p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button
            @click="saveAll"
            class="btn btn-primary d-flex align-items-center gap-2"
          >
            <Save :size="18" /> Sync to Drive
          </button>
        </div>
      </div>

      <div class="row g-4" v-if="curriculumStore.curriculum.meta">
        <!-- Sidebar Navigation -->
        <div class="col-lg-3">
          <div class="card bg-secondary bg-opacity-10 border-school border-opacity-25 rounded-4 position-sticky" style="top: 20px">
             <div class="list-group list-group-flush rounded-4 overflow-hidden">
                <button @click="activeSection = 'meta'" class="list-group-item list-group-item-action bg-transparent text-white border-secondary border-opacity-25 py-3" :class="{ 'bg-primary bg-opacity-25': activeSection === 'meta' }">
                    <Target :size="18" class="me-2" /> Meta & Goals
                </button>
                <button @click="activeSection = 'tracks'" class="list-group-item list-group-item-action bg-transparent text-white border-secondary border-opacity-25 py-3" :class="{ 'bg-primary bg-opacity-25': activeSection === 'tracks' }">
                    <Layers :size="18" class="me-2" /> Study Tracks
                </button>
                <button @click="activeSection = 'defaults'" class="list-group-item list-group-item-action bg-transparent text-white border-secondary border-opacity-25 py-3" :class="{ 'bg-primary bg-opacity-25': activeSection === 'defaults' }">
                    <Settings :size="18" class="me-2" /> Global Defaults
                </button>
                <button @click="activeSection = 'consistency'" class="list-group-item list-group-item-action bg-transparent text-white border-secondary border-opacity-25 py-3" :class="{ 'bg-primary bg-opacity-25': activeSection === 'consistency' }">
                    <Activity :size="18" class="me-2" /> Consistency Model
                </button>
                <button @click="activeSection = 'weekly'" class="list-group-item list-group-item-action bg-transparent text-white border-secondary border-opacity-25 py-3" :class="{ 'bg-primary bg-opacity-25': activeSection === 'weekly' }">
                    <Clock :size="18" class="me-2" /> Weekly Control
                </button>
                <button @click="activeSection = 'career'" class="list-group-item list-group-item-action bg-transparent text-white border-secondary border-opacity-25 py-3" :class="{ 'bg-primary bg-opacity-25': activeSection === 'career' }">
                    <Briefcase :size="18" class="me-2" /> Career Target
                </button>
                 <button @click="activeSection = 'interview'" class="list-group-item list-group-item-action bg-transparent text-white border-secondary border-opacity-25 py-3" :class="{ 'bg-primary bg-opacity-25': activeSection === 'interview' }">
                    <GraduationCap :size="18" class="me-2" /> Interview Readiness
                </button>
                <button @click="activeSection = 'artifacts'" class="list-group-item list-group-item-action bg-transparent text-white border-secondary border-opacity-25 py-3" :class="{ 'bg-primary bg-opacity-25': activeSection === 'artifacts' }">
                    <FileText :size="18" class="me-2" /> Output Artifacts
                </button>
             </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-lg-9">
            
            <!-- META SECTION -->
            <div v-if="activeSection === 'meta'" class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 p-4">
                <h4 class="mb-4 text-primary">Meta Configuration</h4>
                
                <div class="mb-3">
                    <label class="form-label text-white-50">Main Goal</label>
                    <input v-model="curriculumStore.curriculum.meta.goal" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                </div>
                
                 <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label text-white-50">Duration (Days)</label>
                        <input type="number" v-model.number="curriculumStore.curriculum.meta.duration_days" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                    </div>
                 </div>

                 <div class="mb-3">
                    <label class="form-label text-white-50">Preparation Philosophy</label>
                    <textarea v-model="curriculumStore.curriculum.meta.preparation_philosophy" class="form-control bg-dark text-white border-secondary border-opacity-25" rows="2" @change="curriculumStore.saveToDrive"></textarea>
                 </div>

                 <h5 class="mt-4 mb-3 text-info">Career Context</h5>
                 <div class="row g-3">
                     <div class="col-md-6">
                         <label class="small text-white-50">Experience Years</label>
                         <input v-model="curriculumStore.curriculum.meta.career_context.experience_years" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                     </div>
                     <div class="col-md-6">
                         <label class="small text-white-50">Current State</label>
                         <input v-model="curriculumStore.curriculum.meta.career_context.current_state" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                     </div>
                     <div class="col-12">
                         <label class="small text-white-50">Strategy</label>
                         <textarea v-model="curriculumStore.curriculum.meta.career_context.strategy" class="form-control bg-dark text-white border-secondary border-opacity-25" rows="2" @change="curriculumStore.saveToDrive"></textarea>
                     </div>
                      <div class="col-12">
                         <label class="small text-white-50">Financial State</label>
                         <input v-model="curriculumStore.curriculum.meta.career_context.financial_state" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                     </div>
                     <div class="col-12">
                         <label class="small text-white-50">Constraints</label>
                         <div v-for="(constraint, idx) in curriculumStore.curriculum.meta.career_context.constraints" :key="idx" class="d-flex gap-2 mb-2">
                             <input v-model="curriculumStore.curriculum.meta.career_context.constraints[idx]" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                             <button @click="removeItem(curriculumStore.curriculum.meta.career_context.constraints, idx)" class="btn btn-sm btn-outline-danger"><Trash2 :size="14"/></button>
                         </div>
                         <button @click="addItem(curriculumStore.curriculum.meta.career_context.constraints)" class="btn btn-sm btn-outline-primary"><Plus :size="14"/> Add Constraint</button>
                     </div>
                 </div>
            </div>

            <!-- TRACKS SECTION -->
            <div v-if="activeSection === 'tracks'" class="row g-4">
                 <div class="col-lg-4">
                     <div class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 h-100">
                         <div class="card-header bg-transparent border-secondary border-opacity-25 p-3">
                             <h5 class="mb-0">Tracks</h5>
                         </div>
                         <div class="list-group list-group-flush overflow-auto" style="max-height: 400px;">
                             <div v-for="track in curriculumStore.domains" :key="track.id" 
                                  class="list-group-item bg-transparent text-white border-secondary border-opacity-25 d-flex justify-content-between align-items-center cursor-pointer"
                                  :class="{'bg-primary bg-opacity-25': activeTrackId === track.id}"
                                  @click="activeTrackId = track.id">
                                  <span>{{ track.title }}</span>
                                  <button @click.stop="deleteTrack(track.id)" class="btn btn-icon btn-sm text-danger"><Trash2 :size="14"/></button>
                             </div>
                         </div>
                         <div class="p-3 border-top border-secondary border-opacity-25">
                            <input v-model="newTrackId" placeholder="ID" class="form-control form-control-sm bg-dark text-white mb-2" />
                            <input v-model="newTrackTitle" placeholder="Title" class="form-control form-control-sm bg-dark text-white mb-2" />
                            <button @click="addTrack" class="btn btn-sm btn-primary w-100">Add Track</button>
                         </div>
                     </div>
                 </div>
                 <div class="col-lg-8">
                     <div v-if="activeTrackId && curriculumStore.curriculum.STUDY_TRACK[activeTrackId]" class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 p-3">
                         <div class="d-flex justify-content-between mb-3">
                             <h5 class="mb-0">{{ curriculumStore.curriculum.STUDY_TRACK[activeTrackId].title }} Topics</h5>
                             <button @click="addTopic(activeTrackId)" class="btn btn-sm btn-primary"><Plus :size="16"/> Add Topic</button>
                         </div>
                          <div class="d-flex flex-column gap-3">
                            <div v-for="(topic, tIdx) in curriculumStore.curriculum.STUDY_TRACK[activeTrackId].topics" :key="tIdx" class="p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25">
                                 <div class="d-flex gap-2 mb-2">
                                     <input v-model="topic.name" class="form-control form-control-sm bg-transparent border-0 border-bottom border-secondary text-white fw-bold" @change="curriculumStore.saveToDrive" />
                                     <button @click="deleteTopic(activeTrackId, tIdx)" class="btn btn-icon btn-sm text-danger"><Trash2 :size="16"/></button>
                                 </div>
                                 <div class="row g-2">
                                     <div class="col-8">
                                         <input v-model="topic.micro_task" placeholder="Micro-task" class="form-control form-control-sm bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                                     </div>
                                     <div class="col-4">
                                         <select v-model="topic.status" class="form-select form-select-sm bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive">
                                             <option value="pending">Pending</option>
                                             <option value="in_progress">In Progress</option>
                                             <option value="completed">Completed</option>
                                         </select>
                                     </div>
                                 </div>
                            </div>
                         </div>
                     </div>
                 </div>
            </div>

             <!-- GLOBAL DEFAULTS SECTION -->
            <div v-if="activeSection === 'defaults' && curriculumStore.curriculum.GLOBAL_DEFAULTS" class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 p-4">
                <h4 class="mb-4 text-primary">Global Defaults</h4>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label text-white-50">Block Minutes</label>
                        <input type="number" v-model.number="curriculumStore.curriculum.GLOBAL_DEFAULTS.calendar_block_minutes" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                    </div>
                     <div class="col-md-6">
                        <label class="form-label text-white-50">Fallback Minutes</label>
                        <input type="number" v-model.number="curriculumStore.curriculum.GLOBAL_DEFAULTS.fallback_block_minutes" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                    </div>
                    <div class="col-12">
                        <label class="form-label text-white-50">Success Definition</label>
                        <input v-model="curriculumStore.curriculum.GLOBAL_DEFAULTS.success_definition" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                    </div>
                     <div class="col-12">
                        <label class="form-label text-white-50">Progress Metric</label>
                        <input v-model="curriculumStore.curriculum.GLOBAL_DEFAULTS.progress_metric" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                    </div>
                     <div class="col-12">
                         <label class="small text-white-50">Preferred Time Windows</label>
                         <div v-for="(window, idx) in curriculumStore.curriculum.GLOBAL_DEFAULTS.preferred_time_windows" :key="idx" class="d-flex gap-2 mb-2">
                             <input v-model="curriculumStore.curriculum.GLOBAL_DEFAULTS.preferred_time_windows[idx]" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                             <button @click="removeItem(curriculumStore.curriculum.GLOBAL_DEFAULTS.preferred_time_windows, idx)" class="btn btn-sm btn-outline-danger"><Trash2 :size="14"/></button>
                         </div>
                         <button @click="addItem(curriculumStore.curriculum.GLOBAL_DEFAULTS.preferred_time_windows)" class="btn btn-sm btn-outline-primary"><Plus :size="14"/> Add Window</button>
                     </div>
                </div>
            </div>

            <!-- CONSISTENCY MODEL SECTION -->
            <div v-if="activeSection === 'consistency' && curriculumStore.curriculum.CONSISTENCY_MODEL" class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 p-4">
                 <h4 class="mb-4 text-primary">Consistency Model</h4>
                 <div class="mb-4">
                      <label class="small text-white-50">Rules</label>
                         <div v-for="(rule, idx) in curriculumStore.curriculum.CONSISTENCY_MODEL.rules" :key="idx" class="d-flex gap-2 mb-2">
                             <input v-model="curriculumStore.curriculum.CONSISTENCY_MODEL.rules[idx]" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                             <button @click="removeItem(curriculumStore.curriculum.CONSISTENCY_MODEL.rules, idx)" class="btn btn-sm btn-outline-danger"><Trash2 :size="14"/></button>
                         </div>
                     <button @click="addItem(curriculumStore.curriculum.CONSISTENCY_MODEL.rules)" class="btn btn-sm btn-outline-primary"><Plus :size="14"/> Add Rule</button>
                 </div>
                 
                 <h5 class="text-info">Energy Modes</h5>
                 <div class="row">
                     <div v-for="(config, mode) in curriculumStore.curriculum.CONSISTENCY_MODEL.energy_modes" :key="mode" class="col-md-6">
                         <div class="p-3 border border-secondary border-opacity-25 rounded-3">
                             <h6 class="text-capitalize text-white">{{ mode }}</h6>
                              <label class="small text-white-50">Minutes</label>
                              <input type="number" v-model.number="config.calendar_block_minutes" class="form-control form-control-sm bg-dark text-white border-secondary border-opacity-25 mb-2" @change="curriculumStore.saveToDrive" />
                               <label class="small text-white-50">Allowed Actions</label>
                               <div v-for="(action, aIdx) in config.allowed_actions" :key="aIdx" class="d-flex gap-2 mb-1">
                                   <input v-model="config.allowed_actions[aIdx]" class="form-control form-control-sm bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive"/>
                                    <button @click="removeItem(config.allowed_actions, aIdx)" class="btn btn-sm btn-icon text-danger"><Trash2 :size="12"/></button>
                               </div>
                               <button @click="addItem(config.allowed_actions)" class="btn btn-sm btn-link p-0 text-decoration-none">+ Add Action</button>
                         </div>
                     </div>
                 </div>
            </div>

            <!-- WEEKLY CONTROL SECTION -->
             <div v-if="activeSection === 'weekly' && curriculumStore.curriculum.WEEKLY_CONTROL" class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 p-4">
                 <h4 class="mb-4 text-primary">Weekly Control</h4>
                 <div class="row g-3">
                      <div class="col-md-12">
                        <label class="form-label text-white-50">Current Weekly Focus</label>
                        <input v-model="curriculumStore.curriculum.WEEKLY_CONTROL.weekly_focus" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                    </div>
                     <div class="col-md-6">
                        <label class="form-label text-white-50">Max Active Topics</label>
                        <input type="number" v-model.number="curriculumStore.curriculum.WEEKLY_CONTROL.max_active_topics" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                    </div>
                     <div class="col-md-6">
                        <label class="form-label text-white-50">Weekly Review (Minutes)</label>
                        <input type="number" v-model.number="curriculumStore.curriculum.WEEKLY_CONTROL.weekly_review_minutes" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                    </div>
                 </div>
                 <h5 class="mt-4 text-info">Adaptation Rules</h5>
                 <div class="row g-3">
                      <div class="col-md-6">
                          <label class="small text-white-50">Missed Sessions</label>
                          <textarea v-model="curriculumStore.curriculum.WEEKLY_CONTROL.adaptation_rules.missed_sessions" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive"></textarea>
                      </div>
                      <div class="col-md-6">
                          <label class="small text-white-50">Low Energy</label>
                          <textarea v-model="curriculumStore.curriculum.WEEKLY_CONTROL.adaptation_rules.low_energy" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive"></textarea>
                      </div>
                 </div>
             </div>

             <!-- CAREER TARGET SECTION -->
             <div v-if="activeSection === 'career' && curriculumStore.curriculum.CAREER_TARGET" class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 p-4">
                 <h4 class="mb-4 text-primary">Career Target</h4>
                 <div class="row g-4">
                     <div class="col-md-6">
                         <h6 class="text-success">Target Roles</h6>
                         <div v-for="(role, idx) in curriculumStore.curriculum.CAREER_TARGET.target_roles" :key="idx" class="d-flex gap-2 mb-2">
                             <input v-model="curriculumStore.curriculum.CAREER_TARGET.target_roles[idx]" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                             <button @click="removeItem(curriculumStore.curriculum.CAREER_TARGET.target_roles, idx)" class="btn btn-sm btn-outline-danger"><Trash2 :size="14"/></button>
                         </div>
                         <button @click="addItem(curriculumStore.curriculum.CAREER_TARGET.target_roles)" class="btn btn-sm btn-outline-primary"><Plus :size="14"/> Add Role</button>
                     </div>
                     <div class="col-md-6">
                         <h6 class="text-danger">Avoid Roles</h6>
                         <div v-for="(role, idx) in curriculumStore.curriculum.CAREER_TARGET.avoid_roles" :key="idx" class="d-flex gap-2 mb-2">
                             <input v-model="curriculumStore.curriculum.CAREER_TARGET.avoid_roles[idx]" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                             <button @click="removeItem(curriculumStore.curriculum.CAREER_TARGET.avoid_roles, idx)" class="btn btn-sm btn-outline-danger"><Trash2 :size="14"/></button>
                         </div>
                         <button @click="addItem(curriculumStore.curriculum.CAREER_TARGET.avoid_roles)" class="btn btn-sm btn-outline-primary"><Plus :size="14"/> Add Role</button>
                     </div>
                 </div>
             </div>
                
              <!-- ARTIFACTS SECTION -->
             <div v-if="activeSection === 'artifacts' && curriculumStore.curriculum.OUTPUT_ARTIFACTS" class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 p-4">
                 <h4 class="mb-4 text-primary">Output Artifacts</h4>
                 <div class="mb-3">
                     <label class="text-white-50">Storage Location</label>
                     <input v-model="curriculumStore.curriculum.OUTPUT_ARTIFACTS.storage" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                 </div>
                  <h6 class="text-info">Artifact Types</h6>
                  <div v-for="(type, idx) in curriculumStore.curriculum.OUTPUT_ARTIFACTS.types" :key="idx" class="d-flex gap-2 mb-2">
                         <input v-model="curriculumStore.curriculum.OUTPUT_ARTIFACTS.types[idx]" class="form-control bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive" />
                         <button @click="removeItem(curriculumStore.curriculum.OUTPUT_ARTIFACTS.types, idx)" class="btn btn-sm btn-outline-danger"><Trash2 :size="14"/></button>
                  </div>
                  <button @click="addItem(curriculumStore.curriculum.OUTPUT_ARTIFACTS.types)" class="btn btn-sm btn-outline-primary"><Plus :size="14"/> Add Type</button>
             </div>

              <!-- INTERVIEW READINESS SECTION -->
             <div v-if="activeSection === 'interview' && curriculumStore.curriculum.INTERVIEW_READINESS" class="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 p-4">
                 <h4 class="mb-4 text-primary">Interview Readiness</h4>
                 
                 <div class="mb-4 text-warning border-start border-warning border-4 ps-3">
                     <p class="mb-1 text-white-50 small">Application Rule</p>
                     <p class="lead mb-0">{{ curriculumStore.curriculum.INTERVIEW_READINESS.application_readiness_gate.rule }}</p>
                 </div>

                 <h5 class="text-info mt-4">Round Mapping</h5>
                 <div class="row g-3">
                     <div v-for="(conf, round) in curriculumStore.curriculum.INTERVIEW_READINESS.round_mapping" :key="round" class="col-md-6">
                         <div class="p-3 border border-secondary border-opacity-25 rounded-3 h-100">
                             <h6 class="text-white fw-bold">{{ round }}</h6>
                             <div class="mb-2">
                                 <label class="small text-white-50">Expected Output</label>
                                 <textarea v-model="conf.expected_output" class="form-control form-control-sm bg-dark text-white border-secondary border-opacity-25" rows="2" @change="curriculumStore.saveToDrive"></textarea>
                             </div>
                             <label class="small text-white-50">Focus Areas</label>
                              <div v-for="(focus, fIdx) in conf.focus" :key="fIdx" class="d-flex gap-2 mb-1">
                                    <input v-model="conf.focus[fIdx]" class="form-control form-control-sm bg-dark text-white border-secondary border-opacity-25" @change="curriculumStore.saveToDrive"/>
                                    <button @click="removeItem(conf.focus, fIdx)" class="btn btn-sm btn-icon text-danger"><Trash2 :size="12"/></button>
                               </div>
                               <button @click="addItem(conf.focus)" class="btn btn-sm btn-link p-0 text-decoration-none">+ Add Focus</button>
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

.border-opacity-25 {
    border-color: rgba(255, 255, 255, 0.25) !important;
}

/* Custom scrollbar for track list */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
