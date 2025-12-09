import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AddStopForm from '../../src/components/AddStopForm.vue'
import { useStopsStore } from '../../src/stores/stops'

describe('AddStopForm Component', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders form elements correctly', () => {
    const wrapper = mount(AddStopForm, {
      global: {
        plugins: [pinia],
        provide: {
          notify: {
            success: vi.fn(),
            error: vi.fn(),
            warning: vi.fn()
          }
        }
      }
    })

    expect(wrapper.find('input#stopId').exists()).toBe(true)
    expect(wrapper.find('input#stopDesc').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('validates stopId as a number', async () => {
    const mockNotify = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    }

    const wrapper = mount(AddStopForm, {
      global: {
        plugins: [pinia],
        provide: {
          notify: mockNotify
        }
      }
    })

    const stopIdInput = wrapper.find('input#stopId')
    const stopDescInput = wrapper.find('input#stopDesc')
    
    await stopDescInput.setValue('Test')
    await stopIdInput.setValue('')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(mockNotify.warning).toHaveBeenCalled()
  })

  it('calls store addStop with valid data', async () => {
    const mockNotify = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    }

    const wrapper = mount(AddStopForm, {
      global: {
        plugins: [pinia],
        provide: {
          notify: mockNotify
        }
      }
    })

    const store = useStopsStore()
    store.addStop = vi.fn().mockResolvedValue({ success: true })

    const stopIdInput = wrapper.find('input#stopId')
    const stopDescInput = wrapper.find('input#stopDesc')

    await stopIdInput.setValue('2019')
    await stopDescInput.setValue('Miszewskiego')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await wrapper.vm.$nextTick()

    expect(store.addStop).toHaveBeenCalledWith(2019, 'Miszewskiego')
  })

  it('clears form after successful submission', async () => {
    const mockNotify = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    }

    const wrapper = mount(AddStopForm, {
      global: {
        plugins: [pinia],
        provide: {
          notify: mockNotify
        }
      }
    })

    const store = useStopsStore()
    store.addStop = vi.fn().mockResolvedValue({ success: true })

    const stopIdInput = wrapper.find('input#stopId')
    const stopDescInput = wrapper.find('input#stopDesc')

    await stopIdInput.setValue('2019')
    await stopDescInput.setValue('Miszewskiego')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(stopIdInput.element.value).toBe('')
    expect(stopDescInput.element.value).toBe('')
  })
})
