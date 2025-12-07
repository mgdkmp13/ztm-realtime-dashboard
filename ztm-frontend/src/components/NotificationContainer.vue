<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="notificationClasses(notification.type)"
        class="notification-card px-6 py-4 rounded-2xl shadow-2xl max-w-md"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component :is="getIcon(notification.type)" class="w-5 h-5" />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <span class="text-xl">&times;</span>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, h } from 'vue'

const notifications = ref([])

const notificationClasses = (type) => {
  const classes = {
    success: 'bg-purple-50 border-l-4 border-purple-400 text-purple-900',
    error: 'bg-rose-50 border-l-4 border-rose-400 text-rose-900',
    warning: 'bg-pink-50 border-l-4 border-pink-400 text-pink-900',
    info: 'bg-pink-50 border-l-4 border-pink-400 text-pink-900'
  }
  return classes[type] || classes.info
}

const getIcon = (type) => {
  const icons = {
    success: () => h('svg', { class: 'w-5 h-5 text-purple-500', fill: 'currentColor', viewBox: '0 0 20 20' }, 
      h('path', { 'fill-rule': 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z', 'clip-rule': 'evenodd' })
    ),
    error: () => h('svg', { class: 'w-5 h-5 text-rose-500', fill: 'currentColor', viewBox: '0 0 20 20' },
      h('path', { 'fill-rule': 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z', 'clip-rule': 'evenodd' })
    ),
    warning: () => h('svg', { class: 'w-5 h-5 text-pink-500', fill: 'currentColor', viewBox: '0 0 20 20' },
      h('path', { 'fill-rule': 'evenodd', d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z', 'clip-rule': 'evenodd' })
    ),
    info: () => h('svg', { class: 'w-5 h-5 text-pink-500', fill: 'currentColor', viewBox: '0 0 20 20' },
      h('path', { 'fill-rule': 'evenodd', d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z', 'clip-rule': 'evenodd' })
    )
  }
  return icons[type] || icons.info
}

const addNotification = (event) => {
  notifications.value.push(event.detail)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const handleRemove = (event) => {
  removeNotification(event.detail.id)
}

onMounted(() => {
  window.addEventListener('app-notification', addNotification)
  window.addEventListener('app-notification-remove', handleRemove)
})

onUnmounted(() => {
  window.removeEventListener('app-notification', addNotification)
  window.removeEventListener('app-notification-remove', handleRemove)
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
