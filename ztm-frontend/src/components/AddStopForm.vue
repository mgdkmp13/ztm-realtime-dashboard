<template>
  <div class="card">
    <h2 class="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-6">Dodaj Nowy Przystanek</h2>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <!-- ID przystanku -->
        <div>
          <label class="label" for="stopId">ID Przystanku (stopId)</label>
          <input
            id="stopId"
            v-model.number="form.stopId"
            type="number"
            class="input"
            placeholder="np. 2019"
            required
            min="1"
          />
        </div>

        <!-- Opis -->
        <div>
          <label class="label" for="stopDesc">Opis Przystanku</label>
          <input
            id="stopDesc"
            v-model="form.stopDesc"
            type="text"
            class="input"
            placeholder="np. Miszewskiego"
            required
            maxlength="200"
          />
        </div>

        <!-- Sugestie popularnych przystanków -->
        <div class="bg-pink-50 p-4 rounded-xl border border-pink-200">
          <p class="text-sm font-bold text-pink-700 mb-3">Popularne przystanki:</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              v-for="suggested in suggestedStops"
              :key="suggested.id"
              type="button"
              @click="selectSuggested(suggested)"
              class="text-left px-4 py-3 bg-white rounded-xl hover:bg-pink-100 transition-all shadow-sm text-sm border border-pink-100"
            >
              <span class="font-semibold text-pink-700">{{ suggested.name }}</span>
              <span class="text-pink-400 ml-2">({{ suggested.id }})</span>
            </button>
          </div>
        </div>

        <!-- Przyciski -->
        <div class="flex space-x-3">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-primary flex-1"
          >
            <span v-if="!isSubmitting">Dodaj Przystanek</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Dodawanie...
            </span>
          </button>
          <button
            type="button"
            @click="resetForm"
            class="btn btn-secondary"
          >
            Wyczyść
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useStopsStore } from '@/stores/stops'

const stopsStore = useStopsStore()
const notify = inject('notify')

const form = ref({
  stopId: null,
  stopDesc: ''
})

const isSubmitting = ref(false)

const suggestedStops = [
  { id: 2019, name: 'Miszewskiego' },
  { id: 1089, name: 'Główny Dworzec PKP' },
  { id: 1001, name: 'Politechnika' },
  { id: 1234, name: 'Oliwa SKM' },
  { id: 115, name: 'Wrzeszcz PKP' },
  { id: 2301, name: 'Hala Olivia' }
]

const selectSuggested = (stop) => {
  form.value.stopId = stop.id
  form.value.stopDesc = stop.name
}

const handleSubmit = async () => {
  if (!form.value.stopId || !form.value.stopDesc) {
    notify.warning('Wypełnij wszystkie pola')
    return
  }

  isSubmitting.value = true

  try {
    const result = await stopsStore.addStop(form.value.stopId, form.value.stopDesc)
    
    if (result.success) {
      notify.success('Przystanek został dodany!')
      resetForm()
    } else {
      notify.error(result.error || 'Nie udało się dodać przystanku')
    }
  } catch (error) {
    notify.error('Wystąpił błąd podczas dodawania przystanku')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    stopId: null,
    stopDesc: ''
  }
}
</script>
