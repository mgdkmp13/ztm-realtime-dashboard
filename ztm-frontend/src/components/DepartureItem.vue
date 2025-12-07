<template>
  <div class="flex items-center justify-between p-4 bg-pink-50 rounded-2xl hover:bg-pink-100 transition-all shadow-sm border border-pink-100">
    <div class="flex items-center space-x-4 flex-1">
      <!-- Numer linii -->
      <div class="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-pink-400 to-pink-500 text-white font-bold rounded-full text-xl shadow-md">
        {{ departure.routeShortName || departure.routeId }}
      </div>

      <!-- Kierunek -->
      <div class="flex-1 min-w-0">
        <p class="font-bold text-gray-800 truncate">{{ departure.headsign }}</p>
        <p class="text-xs text-pink-600 font-medium">
          Pojazd: {{ departure.vehicleCode || 'N/A' }}
        </p>
      </div>
    </div>

    <!-- Czasy i opóźnienie -->
    <div class="flex flex-col items-end space-y-1">
      <div class="flex items-center space-x-2">
        <span class="text-xl font-bold text-pink-600">{{ formatTime(departure.estimatedTime) }}</span>
        <span 
          v-if="departure.delayInSeconds && departure.delayInSeconds !== 0"
          v-delay-color="departure.delayInSeconds"
          class="text-xs font-bold"
        >
          {{ formatDelay(departure.delayInSeconds) }}
        </span>
      </div>
      <div class="text-xs text-pink-500 font-medium">
        Planowo: {{ formatTime(departure.theoreticalTime) }}
      </div>
      <div 
        :class="statusClass(departure.status)"
        class="text-xs font-medium px-2 py-1 rounded"
      >
        {{ statusText(departure.status) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  departure: {
    type: Object,
    required: true
  }
})

const formatTime = (time) => {
  if (!time) return 'N/A'
  // Handle both ISO format (2025-12-07T14:59:30Z) and simple format (19:09)
  if (time.includes('T')) {
    return dayjs(time).format('HH:mm')
  }
  return time
}

const formatDelay = (seconds) => {
  if (!seconds || seconds === 0) return ''
  const minutes = Math.floor(Math.abs(seconds) / 60)
  const sign = seconds > 0 ? '+' : '-'
  return `${sign}${minutes} min`
}

const statusClass = (status) => {
  return status === 'REALTIME' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-200 text-gray-700'
}

const statusText = (status) => {
  return status === 'REALTIME' ? 'Na żywo' : 'Rozkład'
}
</script>
