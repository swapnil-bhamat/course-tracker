<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { LayoutDashboard, LogOut, GraduationCap } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">
    <header class="glass-card m-3 px-4 py-3 sticky-top z-3">
      <div class="container-fluid d-flex align-items-center justify-content-between p-0">
        <div class="d-flex align-items-center gap-2">
          <GraduationCap class="text-primary" :size="32" />
          <h1 class="h4 mb-0 font-weight-bold font-heading text-white">SA Journey Tracker</h1>
        </div>
        
        <nav v-if="auth.authenticated" class="d-flex align-items-center gap-4">
          <NuxtLink to="/dashboard" class="d-flex align-items-center gap-2 text-decoration-none text-light hover-primary transition-colors">
            <LayoutDashboard :size="20" />
            <span class="d-none d-sm-inline">Dashboard</span>
          </NuxtLink>
          
          <div class="vr bg-border opacity-25" style="height: 24px;"></div>
          
          <div class="d-flex align-items-center gap-3">
            <img :src="auth.user?.picture" alt="Avatar" class="rounded-circle border border-primary border-opacity-25" width="32" height="32" />
            <span class="small d-none d-md-inline text-light">{{ auth.user?.name }}</span>
            <button @click="handleLogout" class="btn btn-link p-1 text-light hover-danger" title="Logout">
              <LogOut :size="20" />
            </button>
          </div>
        </nav>
      </div>
    </header>

    <main class="flex-grow-1">
      <div class="container py-4">
        <slot />
      </div>
    </main>

    <footer class="py-5 text-center text-muted small">
      <div class="container">
        <p class="mb-0">&copy; 2024 Solution Architect Journey Tracker. Built with Nuxt 3 & Bootstrap.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hover-primary:hover {
  color: var(--primary) !important;
}
.hover-danger:hover {
  color: #f87171 !important;
}
</style>
