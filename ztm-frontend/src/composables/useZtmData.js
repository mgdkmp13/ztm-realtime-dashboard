import { ref, onMounted, onUnmounted } from 'vue'
import { useStopsStore } from '@/stores/stops'

/**
 * Composable do zarządzania danymi ZTM
 * Automatyczne odświeżanie danych co określony interwał
 */
export function useZtmData(autoRefreshInterval = 30000) {
  const stopsStore = useStopsStore()
  const isRefreshing = ref(false)
  const refreshTimer = ref(null)

  const fetchData = async () => {
    isRefreshing.value = true
    try {
      await stopsStore.fetchMyStops()
    } finally {
      isRefreshing.value = false
    }
  }

  const startAutoRefresh = () => {
    if (refreshTimer.value) return 
    
    refreshTimer.value = setInterval(async () => {
      await fetchData()
    }, autoRefreshInterval)
  }

  const stopAutoRefresh = () => {
    if (refreshTimer.value) {
      clearInterval(refreshTimer.value)
      refreshTimer.value = null
    }
  }

  onMounted(() => {
    fetchData()
    if (autoRefreshInterval > 0) {
      startAutoRefresh()
    }
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    isRefreshing,
    fetchData,
    startAutoRefresh,
    stopAutoRefresh
  }
}
