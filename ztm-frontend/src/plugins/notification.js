/**
 * Plugin do globalnych powiadomień
 * Udostępnia $notify w każdym komponencie
 */

const NotificationPlugin = {
  install(app) {
    const notifications = []

    const notify = {
      success(message, duration = 3000) {
        this.show(message, 'success', duration)
      },
      error(message, duration = 5000) {
        this.show(message, 'error', duration)
      },
      warning(message, duration = 4000) {
        this.show(message, 'warning', duration)
      },
      info(message, duration = 3000) {
        this.show(message, 'info', duration)
      },
      show(message, type = 'info', duration = 3000) {
        const id = Date.now()
        const notification = { id, message, type, duration }
        
        notifications.push(notification)
        
        window.dispatchEvent(new CustomEvent('app-notification', {
          detail: notification
        }))

        if (duration > 0) {
          setTimeout(() => {
            this.remove(id)
          }, duration)
        }

        return id
      },
      remove(id) {
        window.dispatchEvent(new CustomEvent('app-notification-remove', {
          detail: { id }
        }))
      }
    }

    // Globalnie dostępne jako $notify
    app.config.globalProperties.$notify = notify
    
    app.provide('notify', notify)
  }
}

export default NotificationPlugin
