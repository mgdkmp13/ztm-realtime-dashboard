/**
 * Dyrektywa v-tooltip
 * Dodaje prosty tooltip do elementu
 * 
 * Użycie: <button v-tooltip="'Kliknij aby usunąć'">X</button>
 */
export const vTooltip = {
  mounted(el, binding) {
    el.style.position = 'relative'
    
    const tooltip = document.createElement('div')
    tooltip.textContent = binding.value
    tooltip.className = 'tooltip hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-50'
    
    el.appendChild(tooltip)
    
    el.addEventListener('mouseenter', () => {
      tooltip.classList.remove('hidden')
    })
    
    el.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden')
    })
  },
  
  updated(el, binding) {
    const tooltip = el.querySelector('.tooltip')
    if (tooltip) {
      tooltip.textContent = binding.value
    }
  },
  
  unmounted(el) {
    const tooltip = el.querySelector('.tooltip')
    if (tooltip) {
      tooltip.remove()
    }
  }
}

export default vTooltip
