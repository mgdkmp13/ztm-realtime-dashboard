import { ref } from 'vue'

/**
 * Composable do wyświetlania powiadomień
 */
export function useNotification() {
  const notifications = ref([])
  let idCounter = 0

  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = idCounter++
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message, duration) => addNotification(message, 'success', duration)
  const error = (message, duration) => addNotification(message, 'error', duration)
  const warning = (message, duration) => addNotification(message, 'warning', duration)
  const info = (message, duration) => addNotification(message, 'info', duration)

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
}
