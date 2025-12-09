import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StopCard from '../../src/components/StopCard.vue'
import DepartureItem from '../../src/components/DepartureItem.vue'
import { vDelayColor } from '../../src/directives/vDelayColor'

describe('StopCard Component', () => {
  const mockStop = {
    id: 1,
    stopId: 2019,
    stopDesc: 'Miszewskiego',
    liveData: {
      lastUpdate: '2024-12-04 19:00:00',
      departures: [
        {
          id: 1,
          routeId: 9,
          routeShortName: '9',
          delayInSeconds: 60,
          estimatedTime: '19:05',
          theoreticalTime: '19:04',
          headsign: 'Strzyża PKM',
          status: 'REALTIME',
          vehicleCode: 'V123'
        },
        {
          id: 2,
          routeId: 123,
          routeShortName: '123',
          delayInSeconds: 0,
          estimatedTime: '19:10',
          theoreticalTime: '19:10',
          headsign: 'Wrzeszcz',
          status: 'SCHEDULED',
          vehicleCode: 'V456'
        }
      ]
    }
  }

  const mountOptions = {
    global: {
      components: {
        DepartureItem
      },
      directives: {
        tooltip: () => {},
        delayColor: vDelayColor
      }
    }
  }

  it('renders stop information correctly', () => {
    const wrapper = mount(StopCard, {
      props: {
        stop: mockStop
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('Miszewskiego')
    expect(wrapper.text()).toContain('2019')
  })

  it('renders departure items', () => {
    const wrapper = mount(StopCard, {
      props: {
        stop: mockStop
      },
      ...mountOptions
    })

    const departures = wrapper.findAll('[data-test="departure-item"]')
    expect(departures.length).toBe(2)
  })

  it('displays last update time', () => {
    const wrapper = mount(StopCard, {
      props: {
        stop: mockStop
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('Ostatnia aktualizacja:')
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(StopCard, {
      props: {
        stop: mockStop
      },
      ...mountOptions
    })

    const deleteButton = wrapper.find('[data-test="delete-button"]')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual([1])
  })

  it('shows no departures message when departures array is empty', () => {
    const stopWithoutDepartures = {
      ...mockStop,
      liveData: {
        lastUpdate: '2024-12-04 19:00:00',
        departures: []
      }
    }

    const wrapper = mount(StopCard, {
      props: {
        stop: stopWithoutDepartures
      },
      ...mountOptions
    })

    expect(wrapper.text()).toContain('Brak odjazdów')
  })
})
