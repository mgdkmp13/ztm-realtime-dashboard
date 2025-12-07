<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">Mapa Przystanków</h1>
      <p class="text-gray-700 text-lg">Wizualizacja przystanków ZTM w Gdańsku na mapie OpenStreetMap</p>
    </div>

    <!-- Map Component - większa wysokość -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="h-[600px]">
        <MapView 
          :stops="allAvailableStops" 
          :favoriteStops="myFavoriteStops" 
          :zoom="13" 
          @addToFavorites="handleAddToFavorites"
        />
      </div>
    </div>

    <!-- Informacja o mapie -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
        <div class="flex items-start">
          <svg class="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <div>
            <p class="text-base font-semibold text-blue-700 mb-1">Wszystkie przystanki ({{ allAvailableStops.length }})</p>
          </div>
        </div>
      </div>
      
      <div class="bg-pink-50 border-l-4 border-pink-500 p-4">
        <div class="flex items-start">
          <svg class="h-5 w-5 text-pink-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <div>
            <p class="text-base font-semibold text-pink-700 mb-1">Ulubione przystanki ({{ myFavoriteStops.length }})</p>
          </div>
        </div>
      </div>
    </div>



    <!-- Legend -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="space-y-3">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          <div>
            <p class="text-base font-semibold text-gray-700">Zwykłe przystanki - kliknij, aby dodać do ulubionych</p>
          </div>
        </div>
        <div class="flex items-start">
          <svg class="w-5 h-5 text-pink-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          <div>
            <p class="text-base font-semibold text-gray-700">Twoje ulubione przystanki ze szczegółowymi informacjami</p>
          </div>
        </div>
        <div class="flex items-start">
          <svg class="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <div>
            <p class="text-base font-semibold text-gray-700">Kliknij na na wybrany znacznik i wybierz "Dodaj do ulubionych"</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 flex flex-col items-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-ztm-primary mb-4"></div>
        <p class="text-gray-700 font-semibold">Ładowanie danych map...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import MapView from '../components/MapView.vue'
import { useStopsStore } from '@/stores/stops'

const stopsStore = useStopsStore()
const loading = ref(false)
const { proxy } = getCurrentInstance()

onMounted(async () => {
  loading.value = true
  await Promise.all([
    stopsStore.fetchMyStops(),
    stopsStore.fetchAllZtmStops()
  ])
  loading.value = false
})

const allAvailableStops = computed(() => {
  return stopsStore.allZtmStops
    .filter(stop => stop.stopLat && stop.stopLon)
    .map(stop => ({
      stopId: stop.stopId,
      stopDesc: stop.stopName || stop.stopDesc,
      stopName: stop.stopName || stop.stopDesc,
      lat: parseFloat(stop.stopLat),
      lng: parseFloat(stop.stopLon),
      isFavorite: stopsStore.myStops.some(s => s.stopId === stop.stopId)
    }))
})

const myFavoriteStops = computed(() => {
  return stopsStore.myStops
    .map(stop => {
      const ztmStop = stopsStore.allZtmStops.find(s => s.stopId === stop.stopId)
      if (ztmStop && ztmStop.stopLat && ztmStop.stopLon) {
        return {
          ...stop,
          lat: parseFloat(ztmStop.stopLat),
          lng: parseFloat(ztmStop.stopLon),
          stopName: ztmStop.stopName || stop.stopDesc,
          isFavorite: true
        }
      }
      return null
    })
    .filter(Boolean)
})

const handleAddToFavorites = async (stopId) => {
  const ztmStop = stopsStore.allZtmStops.find(s => s.stopId === stopId)
  const stopName = ztmStop ? (ztmStop.stopName || ztmStop.stopDesc) : `Przystanek ${stopId}`
  
  if (ztmStop && (!ztmStop.stopLat || !ztmStop.stopLon)) {
    proxy.$notify.error('Ten przystanek nie ma współrzędnych GPS')
    return
  }
  
  loading.value = true
  const result = await stopsStore.addStop(stopId, stopName)
  loading.value = false
  
  if (result.success) {
    proxy.$notify.success(`Dodano "${stopName}" do ulubionych!`)
  } else {
    proxy.$notify.error(`Błąd: ${result.error}`)
  }
}

</script>