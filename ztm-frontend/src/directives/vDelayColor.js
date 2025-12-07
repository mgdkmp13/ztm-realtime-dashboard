/**
 * Dyrektywa v-delay-color
 * Automatycznie koloruje element w zależności od wartości opónienia
 * 
 * Użycie: <span v-delay-color="delayInSeconds">+5 min</span>
 */
export const vDelayColor = {
  mounted(el, binding) {
    updateDelayColor(el, binding.value)
  },
  updated(el, binding) {
    updateDelayColor(el, binding.value)
  }
}

function updateDelayColor(el, delayInSeconds) {
  el.classList.remove('text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600', 'text-gray-600')
  
  if (delayInSeconds === null || delayInSeconds === undefined) {
    el.classList.add('text-gray-600')
    return
  }

  const delay = parseInt(delayInSeconds)

  if (delay <= 0) {
    // Na czas lub wcześniej
    el.classList.add('text-green-600')
    el.style.fontWeight = 'normal'
  } else if (delay <= 60) {
    // Małe opóźnienie (do 1 minuty)
    el.classList.add('text-yellow-600')
    el.style.fontWeight = '500'
  } else if (delay <= 180) {
    // średnie opóźnienie (1-3 minuty)
    el.classList.add('text-orange-600')
    el.style.fontWeight = '600'
  } else {
    // Duże opóźnienie (powyżej 3 minut)
    el.classList.add('text-red-600')
    el.style.fontWeight = 'bold'
  }
}

export default vDelayColor
