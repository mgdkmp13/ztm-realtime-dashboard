<template>
  <header class="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 shadow-xl">
    <div class="container mx-auto px-4 py-5 text-white">
      <div class="flex items-center justify-between">
        <!-- Logo i tytuł -->
        <div class="flex items-center space-x-4">
          <router-link to="/dashboard" class="flex items-center space-x-3">
            <div class="w-48 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span class="text-pink-500 font-bold text-2xl">ZTM Gdańsk</span>
            </div>
          </router-link>
        </div>

        <!-- Nawigacja -->
        <nav v-if="isAuthenticated" class="hidden md:flex items-center space-x-6">
          <router-link 
            to="/dashboard" 
            class="text-white hover:text-pink-100 transition-colors"
            active-class="text-pink-100 font-bold underline decoration-2 underline-offset-4"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/stops" 
            class="text-white hover:text-pink-100 transition-colors"
            active-class="text-pink-100 font-bold underline decoration-2 underline-offset-4"
          >
            Moje Przystanki
          </router-link>
          <router-link 
            to="/map" 
            class="text-white hover:text-pink-100 transition-colors"
            active-class="text-pink-100 font-bold underline decoration-2 underline-offset-4"
          >
            Mapa
          </router-link>
        </nav>

        <!-- User menu -->
        <div v-if="isAuthenticated" class="flex items-center space-x-4">
          <span class="text-white font-medium">
            Witaj, <strong class="font-bold">{{ user?.login || 'Użytkownik' }}</strong>
          </span>
          <button 
            @click="handleLogout" 
            class="bg-white text-pink-500 px-5 py-2 rounded-full font-semibold hover:bg-pink-50 transition-all shadow-md"
          >
            Wyloguj
          </button>
        </div>

        <!-- Mobile menu button -->
        <button 
          v-if="isAuthenticated"
          @click="toggleMobileMenu"
          class="md:hidden p-2"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <nav 
        v-if="isAuthenticated && showMobileMenu" 
        class="md:hidden mt-4 pb-4 border-t border-pink-300 pt-4"
      >
        <router-link 
          to="/dashboard" 
          class="block py-2 text-white hover:text-pink-100 transition-colors"
          @click="showMobileMenu = false"
        >
          Dashboard
        </router-link>
        <router-link 
          to="/stops" 
          class="block py-2 text-white hover:text-pink-100 transition-colors"
          @click="showMobileMenu = false"
        >
          Moje Przystanki
        </router-link>
        <router-link 
          to="/map" 
          class="block py-2 text-white hover:text-pink-100 transition-colors"
          @click="showMobileMenu = false"
        >
          Mapa
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useStopsStore } from '@/stores/stops'

const router = useRouter()
const authStore = useAuthStore()
const stopsStore = useStopsStore()
const showMobileMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleLogout = () => {
  authStore.logout()
  stopsStore.clearStops()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-ztm-primary transition-colors;
}
</style>
