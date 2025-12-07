<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-8">Zarządzaj Przystankami</h1>

    <!-- Formularz dodawania -->
    <div class="mb-8">
      <AddStopForm />
    </div>

    <!-- Lista przystanków -->
    <div class="mb-6">
      <h2 class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-6">Twoje Przystanki</h2>
      
      <div v-if="stopsStore.isLoading && stopsStore.myStops.length === 0" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-400 mx-auto mb-4"></div>
        <p class="text-pink-600 font-semibold text-lg">Ładowanie przystanków...</p>
      </div>

      <div v-else-if="stopsStore.myStops.length === 0" class="card text-center py-12">
        <svg class="w-20 h-20 text-pink-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <h3 class="text-2xl font-bold text-pink-600 mb-3">Brak przystanków</h3>
        <p class="text-gray-600 text-lg">Użyj formularza powyżej, aby dodać swój pierwszy przystanek!</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StopCard
          v-for="stop in stopsStore.myStops"
          :key="stop.id"
          :stop="stop"
          @delete="handleDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted } from 'vue'
import { useStopsStore } from '@/stores/stops'
import AddStopForm from '@/components/AddStopForm.vue'
import StopCard from '@/components/StopCard.vue'

const stopsStore = useStopsStore()
const notify = inject('notify')

onMounted(async () => {
  await stopsStore.fetchMyStops()
})

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
