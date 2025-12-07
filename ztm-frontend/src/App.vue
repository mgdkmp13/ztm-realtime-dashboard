<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <AppHeader />
    <NotificationContainer />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import NotificationContainer from './components/NotificationContainer.vue'
</script>