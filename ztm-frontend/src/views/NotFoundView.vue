<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-50 to-purple-100">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <svg class="mx-auto h-40 w-40 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      
      <h1 class="text-7xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-6">404</h1>
      <h2 class="text-3xl font-bold text-pink-600 mb-6">Strona nie znaleziona</h2>
      <p class="text-gray-700 text-lg mb-10">
        Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
      </p>
      
      <div class="space-x-4">
        <router-link 
          to="/dashboard" 
          class="btn btn-primary"
        >
          Powrót do Dashboard
        </router-link>
        
        <router-link 
          to="/stops" 
          class="btn btn-secondary"
        >
          Moje Przystanki
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic needed for 404 page
</script>
