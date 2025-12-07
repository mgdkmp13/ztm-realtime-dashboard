<template>
  <div class="map-container w-full h-full">
    <div id="map" ref="mapContainer" class="w-full h-full rounded-lg"></div>
    <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p class="text-gray-600">Ładowanie mapy OpenStreetMap...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  stops: {
    type: Array,
    default: () => []
  },
  favoriteStops: {
    type: Array,
    default: () => []
  },
  center: {
    type: Object,
    default: () => ({ lat: 54.3520, lng: 18.6466 }) // Gdańsk center
  },
  zoom: {
    type: Number,
    default: 12
  }
})

const emit = defineEmits(['addToFavorites'])

const mapContainer = ref(null)
const isLoading = ref(true)
let map = null
const markers = []
let currentZoom = 12

// Konfiguracja wyświetlania
const ZOOM_THRESHOLD_LOW = 11  
const ZOOM_THRESHOLD_HIGH = 13 
const MAX_MARKERS_LOW = 100    
const MAX_MARKERS_MID = 500    
const MAX_MARKERS_HIGH = 2516  

if (typeof window !== 'undefined') {
  window.addStopToFavorites = (stopId) => {
    emit('addToFavorites', stopId)
  }
}

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

onMounted(() => {
  initMap()
  addMarkers()
  isLoading.value = false
})

watch(() => props.stops, () => {
  if (map) {
    updateMarkers()
  }
}, { deep: true })

const initMap = () => {
  if (!mapContainer.value) return
  
  map = L.map(mapContainer.value).setView([props.center.lat, props.center.lng], props.zoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)
  
  map.on('zoomend', () => {
    const newZoom = map.getZoom()
    if (Math.abs(newZoom - currentZoom) >= 1) {
      currentZoom = newZoom
      console.log('Zoom zmieniony na:', currentZoom)
      updateMarkers()
    }
  })
  
  map.on('moveend', () => {
    updateMarkers()
  })
}

const getMaxMarkersForZoom = (zoom) => {
  if (zoom < ZOOM_THRESHOLD_LOW) return MAX_MARKERS_LOW
  if (zoom < ZOOM_THRESHOLD_HIGH) return MAX_MARKERS_MID
  return MAX_MARKERS_HIGH
}

const getVisibleStops = () => {
  const zoom = map.getZoom()
  const maxMarkers = getMaxMarkersForZoom(zoom)
  const bounds = map.getBounds()
  
  const favorites = props.stops.filter(stop => stop.isFavorite)
  
  const visibleStops = props.stops
    .filter(stop => !stop.isFavorite && bounds.contains([stop.lat, stop.lng]))
  
  const center = map.getCenter()
  const limitedStops = visibleStops
    .map(stop => ({
      ...stop,
      distance: Math.pow(stop.lat - center.lat, 2) + Math.pow(stop.lng - center.lng, 2)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxMarkers - favorites.length)
  
  return [...favorites, ...limitedStops]
}

const addMarkers = () => {
  if (!map) return
  
  currentZoom = map.getZoom()
  
  clearMarkers()
  
  const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const favoriteIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
  
  const visibleStops = getVisibleStops()
  console.log(`Renderuję ${visibleStops.length} markerów (zoom: ${currentZoom})`)
  
  visibleStops.forEach(stop => {
    if (stop.lat && stop.lng) {
      const icon = stop.isFavorite ? favoriteIcon : defaultIcon
      
      const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(map)

      const favoriteBadge = stop.isFavorite 
        ? '<span style="background: #ec4899; color: #ffffff; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; display: inline-block; margin-bottom: 8px;">⭐ ULUBIONY</span>'
        : ''

      const addToFavButton = !stop.isFavorite
        ? `<button onclick="window.addStopToFavorites(${stop.stopId})" style="background: #ec4899; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 8px; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;" onmouseover="this.style.background='#db2777'" onmouseout="this.style.background='#ec4899'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>Dodaj do ulubionych</button>`
        : ''

      let popupContent = `
        <div style="padding: 12px; min-width: 200px; font-family: system-ui;">
          ${favoriteBadge}
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: ${stop.isFavorite ? '#ec4899' : '#2563eb'};">${stop.stopDesc || stop.stopName || 'Przystanek'}</h3>
          <p style="font-size: 14px; color: #4b5563; margin-bottom: 4px;">ID: <strong>${stop.stopId}</strong></p>
          ${addToFavButton}
        </div>
      `
      
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      })
      
      markers.push({ stopId: stop.stopId, marker })
    }
  })
}

const clearMarkers = () => {
  markers.forEach(({ marker }) => {
    map.removeLayer(marker)
  })
  markers.length = 0
}

const updateMarkers = () => {
  addMarkers()
}

onUnmounted(() => {
  clearMarkers()
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

#map {
  z-index: 0;
  width: 100%;
  height: 100%;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

:deep(.leaflet-popup-content) {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
}

:deep(.leaflet-popup-tip) {
  box-shadow: 0 3px 14px rgba(0,0,0,0.15);
}
</style>
