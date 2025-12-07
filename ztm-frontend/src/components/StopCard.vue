<template>
  <div class="card hover:shadow-lg transition-all duration-300" :class="{ 'h-[540px]': !showAll && hasDepartures }" data-test="stop-card">
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{{ stop.stopDesc }}</h3>
        <p class="text-sm text-pink-600 font-medium">Przystanek ID: {{ stop.stopId }}</p>
      </div>
      <button
        @click="$emit('delete', stop.id)"
        v-tooltip="'Usuń przystanek'"
        class="bg-rose-400 hover:bg-rose-500 text-white p-2 rounded-full transition-all shadow-md"
        data-test="delete-button"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>

    <!-- Live Data -->
    <div v-if="hasDepartures">
      <div class="mb-2 text-xs text-gray-500">
        Ostatnia aktualizacja: {{ formatTime(stop.liveData.lastUpdate) }}
      </div>
      
      <div class="space-y-2">
        <DepartureItem
          v-for="departure in limitedDepartures"
          :key="departure.id"
          :departure="departure"
          data-test="departure-item"
        />
      </div>

      <button
        v-if="allDepartures.length > maxDepartures"
        @click="showAll = !showAll"
        class="mt-4 w-full flex items-center justify-center gap-2 text-sm text-pink-500 hover:text-pink-600 font-semibold transition-all py-2 hover:bg-pink-50 rounded-xl"
      >
        <span>{{ showAll ? 'Pokaż mniej' : `Pokaż więcej (${allDepartures.length - maxDepartures})` }}</span>
        <svg 
          class="w-5 h-5 transition-transform duration-300" 
          :class="{ 'rotate-180': showAll }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </div>

    <!-- Brak danych -->
    <div v-else-if="stop.liveData && allDepartures.length === 0" class="text-center py-4 text-gray-500">
      <p>Brak odjazdów w najbliższym czasie</p>
    </div>

    <!-- Błąd pobierania -->
    <div v-else-if="stop.error" class="text-center py-4 text-red-500">
      <p>{{ stop.error }}</p>
    </div>

    <!-- Ładowanie -->
    <div v-else class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400 mx-auto"></div>
      <p class="mt-2 text-pink-600 text-sm font-medium">Pobieranie danych...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DepartureItem from './DepartureItem.vue'
import dayjs from 'dayjs'

const props = defineProps({
  stop: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])

const showAll = ref(false)
const maxDepartures = 3

const allDepartures = computed(() => {
  if (!props.stop.liveData) return []
  return props.stop.liveData.departures || []
})

const hasDepartures = computed(() => {
  return props.stop.liveData && allDepartures.value.length > 0
})

const limitedDepartures = computed(() => {
  return showAll.value 
    ? allDepartures.value 
    : allDepartures.value.slice(0, maxDepartures)
})

const formatTime = (time) => {
  if (!time) return 'N/A'
  if (time.includes('T')) {
    return dayjs(time).format('HH:mm:ss')
  }
  return dayjs(time).format('HH:mm:ss')
}
</script>
