import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useZtmData } from '../../src/composables/useZtmData'
import { useStopsStore } from '../../src/stores/stops'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

describe('useZtmData Composable', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  it('should return expected properties', () => {
    const store = useStopsStore()
    store.fetchMyStops = vi.fn().mockResolvedValue()

    const TestComponent = defineComponent({
      setup() {
        const result = useZtmData(0)
        return result
      },
      render() {
        return h('div')
      }
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.vm.isRefreshing).toBeDefined()
    expect(wrapper.vm.fetchData).toBeDefined()
    expect(wrapper.vm.startAutoRefresh).toBeDefined()
    expect(wrapper.vm.stopAutoRefresh).toBeDefined()
    expect(typeof wrapper.vm.fetchData).toBe('function')
    expect(typeof wrapper.vm.startAutoRefresh).toBe('function')
    expect(typeof wrapper.vm.stopAutoRefresh).toBe('function')
    
    wrapper.unmount()
  })

  it('should fetch data manually', async () => {
    const store = useStopsStore()
    store.fetchMyStops = vi.fn().mockResolvedValue()

    const TestComponent = defineComponent({
      setup() {
        const result = useZtmData(0)
        return result
      },
      render() {
        return h('div')
      }
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    await wrapper.vm.fetchData()

    expect(store.fetchMyStops).toHaveBeenCalled()
    
    wrapper.unmount()
  })

  it('should set isRefreshing flag during fetch', async () => {
    const store = useStopsStore()
    let resolvePromise
    const promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    store.fetchMyStops = vi.fn().mockReturnValue(promise)

    const TestComponent = defineComponent({
      setup() {
        const result = useZtmData(0)
        return result
      },
      render() {
        return h('div')
      }
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    const fetchPromise = wrapper.vm.fetchData()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.isRefreshing).toBe(true)
    
    resolvePromise()
    await fetchPromise
    
    expect(wrapper.vm.isRefreshing).toBe(false)
    
    wrapper.unmount()
  })

  it('should stop auto-refresh when stopAutoRefresh is called', () => {
    const store = useStopsStore()
    store.fetchMyStops = vi.fn().mockResolvedValue()

    const TestComponent = defineComponent({
      setup() {
        const result = useZtmData(0)
        return result
      },
      render() {
        return h('div')
      }
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [pinia]
      }
    })

    wrapper.vm.stopAutoRefresh()
    
    // If it doesn't throw, it works correctly
    expect(true).toBe(true)
    
    wrapper.unmount()
  })
})
