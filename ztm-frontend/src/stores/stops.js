import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useStopsStore = defineStore('stops', {
  state: () => ({
    myStops: [],
    allZtmStops: [],
    isLoading: false,
    error: null,
    lastUpdate: null
  }),

  getters: {
    stopsWithLiveData: (state) => state.myStops,
    availableStops: (state) => state.allZtmStops,
    hasStops: (state) => state.myStops.length > 0
  },

  actions: {
    async fetchMyStops() {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get('/stop')
        this.myStops = response.data
        this.lastUpdate = new Date()
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch stops'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async fetchAllZtmStops() {
      if (this.allZtmStops.length > 0) {
        console.log('Używam cached danych:', this.allZtmStops.length, 'przystanków')
        return { success: true, data: this.allZtmStops }
      }

      this.isLoading = true
      this.error = null
      try {
        console.log('Pobieram dane z CKAN...')
        const response = await fetch('https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json')
        const data = await response.json()
        
        const firstDateKey = Object.keys(data)[0]
        
        const firstDateData = data[firstDateKey]
        if (firstDateData && typeof firstDateData === 'object' && firstDateData.stops) {
        }
        
        const today = new Date().toISOString().split('T')[0]
        
        let stopsArray = data[today]
        
        if (stopsArray && typeof stopsArray === 'object' && stopsArray.stops) {
          stopsArray = stopsArray.stops
        }
        
        if (!stopsArray || !Array.isArray(stopsArray) || stopsArray.length === 0) {
          const dates = Object.keys(data).sort()
          
          for (const date of dates) {
            let dateData = data[date]
            
            if (dateData && typeof dateData === 'object' && dateData.stops) {
              dateData = dateData.stops
            }
            
            if (Array.isArray(dateData) && dateData.length > 0) {
              stopsArray = dateData
              break
            }
          }
        }
        
        if (!Array.isArray(stopsArray) || stopsArray.length === 0) {
          throw new Error('Nie znaleziono danych przystanków w żadnej dacie')
        }
        
        this.allZtmStops = stopsArray.map(stop => ({
          stopId: parseInt(stop.stopId),
          stopCode: stop.stopCode,
          stopName: stop.stopName,
          stopDesc: stop.stopDesc,
          stopLat: stop.stopLat,
          stopLon: stop.stopLon,
          zoneId: stop.zoneId,
          stopUrl: stop.stopUrl
        }))
        
        return { success: true, data: this.allZtmStops }
      } catch (error) {
        console.error('Błąd pobierania przystanków:', error)
        this.error = error.message || 'Failed to fetch ZTM stops'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async addStop(stopId, stopDesc) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.post('/stop', { stopId, stopDesc })
        await this.fetchMyStops() 
        return { success: true, data: response.data }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add stop'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async deleteStop(id) {
      this.isLoading = true
      this.error = null
      try {
        await api.delete(`/stop/${id}`)
        await this.fetchMyStops() 
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete stop'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    clearStops() {
      this.myStops = []
      this.allZtmStops = []
      this.lastUpdate = null
    }
  }
})
