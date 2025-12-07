<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100 px-4">
    <div class="max-w-md w-full">
      <!-- Logo i tytuł -->
      <div class="text-center mb-8">
        <div class="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <span class="text-white font-bold text-5xl">Z</span>
        </div>
        <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">ZTM Gdańsk</h1>
        <p class="text-gray-600 mt-3 text-lg">Utwórz nowe konto</p>
      </div>

      <!-- Formularz rejestracji -->
      <div class="card">
        <form @submit.prevent="handleRegister">
          <div class="space-y-4">
            <!-- Login -->
            <div>
              <label class="label" for="login">Login</label>
              <input
                id="login"
                v-model="form.login"
                type="text"
                class="input"
                placeholder="Wpisz login"
                required
                minlength="3"
                autocomplete="username"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="label" for="password">Hasło</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="input"
                placeholder="Wpisz hasło"
                required
                minlength="6"
                autocomplete="new-password"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="label" for="password">Potwierdź Hasło</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                class="input"
                placeholder="Wpisz hasło ponownie"
                required
                minlength="6"
                autocomplete="new-password"
              />
            </div>

            <!-- Error message -->
            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ error }}</p>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="btn btn-primary w-full"
            >
              <span v-if="!authStore.isLoading">Zarejestruj się</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Rejestracja...
              </span>
            </button>
          </div>
        </form>

        <!-- Link do logowania -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Masz już konto?
            <router-link to="/login" class="text-ztm-primary hover:underline font-semibold">
              Zaloguj się
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const notify = inject('notify')

const form = ref({
  login: '',
  password: '',
  confirmPassword: ''
})

const error = ref(null)

const handleRegister = async () => {
  error.value = null

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Hasła nie są identyczne'
    notify.error('Hasła nie są identyczne')
    return
  }

  const result = await authStore.register(form.value.login, form.value.password)
  
  if (result.success) {
    notify.success('Rejestracja zakończona! Możesz się teraz zalogować.')
    router.push('/login')
  } else {
    error.value = result.error
    notify.error(result.error || 'Rejestracja nie powiodła się')
  }
}
</script>
