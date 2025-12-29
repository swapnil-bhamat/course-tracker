<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { GraduationCap, ArrowRight, ShieldCheck, Database, Cloud } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

watchEffect(() => {
  if (auth.authenticated) {
    router.push('/dashboard')
  }
})

onMounted(async () => {
  if (auth.authenticated) {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div class="container py-5 mt-5">
    <div class="row min-vh-75 align-items-center justify-content-center text-center">
      <div class="col-lg-10 col-xl-8">
        <div class="d-inline-flex p-3 bg-primary bg-opacity-10 rounded-4 mb-4">
          <GraduationCap class="text-primary" :size="48" />
        </div>
        
        <h1 class="display-3 font-weight-bold font-heading mb-4 text-white">
          Master Software Architecture
        </h1>
        
        <p class="lead text-muted mb-5 px-md-5">
          Track your journey from Developer to Solution Architect. 
          Deep dive into LLD, HLD, and AWS with a structured curriculum synchronized across your Google workspace.
        </p>

        <div class="d-flex flex-wrap justify-content-center gap-3 mb-5">
          <a href="/api/auth/login" class="btn btn-primary btn-lg px-5 py-3 rounded-3 d-flex align-items-center gap-2">
            Start Your Journey
            <ArrowRight :size="20" />
          </a>
        </div>

        <div class="row g-4 mt-5">
          <div class="col-md-4">
            <div class="glass-card p-4 h-100 text-start">
              <ShieldCheck class="text-primary mb-3" :size="32" />
              <h5 class="font-weight-bold text-white mb-2">Google Drive Sync</h5>
              <p class="small text-muted mb-0">Your progress data is stored securely as a JSON file in your own Google Drive.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="glass-card p-4 h-100 text-start">
              <Cloud class="text-primary mb-3" :size="32" />
              <h5 class="font-weight-bold text-white mb-2">Calendar Integration</h5>
              <p class="small text-muted mb-0">Schedule study sessions directly to your Google Calendar with one click.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="glass-card p-4 h-100 text-start">
              <Database class="text-primary mb-3" :size="32" />
              <h5 class="font-weight-bold text-white mb-2">Comprehensive Data</h5>
              <p class="small text-muted mb-0">Expertly curated topics covering SOLID, Scalability, AWS, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  background: linear-gradient(to right, #fff, var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
}
.min-vh-75 {
  min-height: 75vh;
}
</style>
