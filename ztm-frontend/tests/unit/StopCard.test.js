import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StopCard from '../../src/components/StopCard.vue'

describe('StopCard Component', () => {
  const mockStop = {
    id: 1,
    stopId: 2019,
    stopDesc: 'Miszewskiego',
    liveData: {
      lastUpdate: '2024-12-04 19:00:00',
      delay: [
        {
          routeId: 9,
          delayInSeconds: 60,
          estimatedTime: '19:05',
          theoreticalTime: '19:04',
          headsign: 'Strzyża PKM',
          status: 'REALTIME'
        },
        {
          routeId: 123,
          delayInSeconds: 0,
          estimatedTime: '19:10',
          theoreticalTime: '19:10',
          headsign: 'Wrzeszcz',
          status: 'SCHEDULED'
        }
      ]
    }
  }

  it('renders stop information correctly', () => {
    const wrapper = mount(StopCard, {
      props: {
        stop: mockStop
      }
    })

    expect(wrapper.text()).toContain('Miszewskiego')
    expect(wrapper.text()).toContain('ID: 2019')
  })

  it('renders departure items', () => {
    const wrapper = mount(StopCard, {
      props: {
        stop: mockStop
      }
    })

    const departures = wrapper.findAll('[data-test="departure-item"]')
    expect(departures.length).toBe(2)
  })

  it('displays last update time', () => {
    const wrapper = mount(StopCard, {
      props: {
        stop: mockStop
      }
    })

    expect(wrapper.text()).toContain('Last update:')
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(StopCard, {
      props: {
        stop: mockStop
      }
    })

    const deleteButton = wrapper.find('[data-test="delete-button"]')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')[0]).toEqual([1])
  })

  it('shows no departures message when delay array is empty', () => {
    const stopWithoutDepartures = {
      ...mockStop,
      liveData: {
        lastUpdate: '2024-12-04 19:00:00',
        delay: []
      }
    }

    const wrapper = mount(StopCard, {
      props: {
        stop: stopWithoutDepartures
      }
    })

    expect(wrapper.text()).toContain('No upcoming departures')
  })
})
