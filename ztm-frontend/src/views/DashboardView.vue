<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Nagłówek z informacjami -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">Dashboard</h1>
      <p class="text-gray-700 text-lg">
        Witaj, <strong class="text-pink-600">{{ authStore.user?.login }}</strong>! 
        Masz <strong class="text-pink-600">{{ stopsStore.myStops.length }}</strong> zapisanych przystanków.
      </p>
    </div>

    <!-- Statystyki -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="card bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-pink-100 text-sm font-medium">Moje Przystanki</p>
            <p class="text-4xl font-bold mt-1">{{ stopsStore.myStops.length }}</p>
          </div>
          <div class="w-14 h-14 bg-white bg-opacity-25 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-9h2v6H9V9zm0-4h2v2H9V5z"/>
            </svg>
          </div>
        </div>
      </div>


      <div class="card bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-rose-100 text-sm font-medium">Ostatnia Aktualizacja</p>
            <p class="text-xl font-bold mt-1">{{ lastUpdateText }}</p>
          </div>
          <div class="w-14 h-14 bg-white bg-opacity-25 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Przycisk odświeżania -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Twoje Przystanki</h2>
      <button
        @click="refreshData"
        :disabled="isRefreshing"
        class="btn btn-primary flex"
      >
        <svg 
          class="w-5 h-5 mr-2" 
          :class="{ 'animate-spin': isRefreshing }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ isRefreshing ? 'Odświeżanie...' : 'Odśwież' }}
      </button>
    </div>

    <!-- Lista przystanków -->
    <div v-if="stopsStore.isLoading && stopsStore.myStops.length === 0" class="text-center py-12">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-ztm-primary mx-auto mb-4"></div>
      <p class="text-gray-600">Ładowanie przystanków...</p>
    </div>

    <div v-else-if="stopsStore.myStops.length === 0" class="card text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
      <h3 class="text-xl font-semibold text-gray-700 mb-2">Brak przystanków</h3>
      <p class="text-gray-600 mb-4">Dodaj swój pierwszy przystanek, aby śledzić odjazdy!</p>
      <router-link to="/stops" class="btn btn-primary">
        Dodaj Przystanek
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <TransitionGroup name="stop-list">
        <div
          v-for="stop in stopsStore.myStops"
          :key="stop.id"
          class="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
        >
          <StopCard
            :stop="stop"
            @delete="handleDelete"
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStopsStore } from '@/stores/stops'
import { useZtmData } from '@/composables/useZtmData'
import StopCard from '@/components/StopCard.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pl'

dayjs.extend(relativeTime)
dayjs.locale('pl')

const authStore = useAuthStore()
const stopsStore = useStopsStore()
const notify = inject('notify')

// Automatyczne odświeżanie co 30 sekund
const { isRefreshing, fetchData } = useZtmData(30000)

const totalDepartures = computed(() => {
  return stopsStore.myStops.reduce((total, stop) => {
    return total + (stop.liveData?.delay?.length || 0)
  }, 0)
})

const lastUpdateText = computed(() => {
  if (!stopsStore.lastUpdate) return 'Nigdy'
  return dayjs(stopsStore.lastUpdate).fromNow()
})

const refreshData = async () => {
  await fetchData()
  notify.success('Dane zostały odświeżone')
}

const handleDelete = async (id) => {
  if (!confirm('Czy na pewno chcesz usunąć ten przystanek?')) return
  
  const result = await stopsStore.deleteStop(id)
  if (result.success) {
    notify.success('Przystanek został usunięty')
  } else {
    notify.error(result.error || 'Nie udało się usunąć przystanku')
  }
}
</script>
