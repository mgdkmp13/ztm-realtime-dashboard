import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AddStopForm from '../../src/components/AddStopForm.vue'

describe('AddStopForm Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders form elements correctly', () => {
    const wrapper = mount(AddStopForm)

    expect(wrapper.find('input[placeholder*="Stop ID"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder*="Stop Description"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('validates stopId as a number', async () => {
    const wrapper = mount(AddStopForm)

    const stopIdInput = wrapper.find('input[placeholder*="Stop ID"]')
    await stopIdInput.setValue('abc')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('emits add event with valid data', async () => {
    const wrapper = mount(AddStopForm)

    const stopIdInput = wrapper.find('input[placeholder*="Stop ID"]')
    const stopDescInput = wrapper.find('input[placeholder*="Stop Description"]')

    await stopIdInput.setValue('2019')
    await stopDescInput.setValue('Miszewskiego')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')[0]).toEqual([2019, 'Miszewskiego'])
  })

  it('clears form after successful submission', async () => {
    const wrapper = mount(AddStopForm)

    const stopIdInput = wrapper.find('input[placeholder*="Stop ID"]')
    const stopDescInput = wrapper.find('input[placeholder*="Stop Description"]')

    await stopIdInput.setValue('2019')
    await stopDescInput.setValue('Miszewskiego')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(stopIdInput.element.value).toBe('2019') 
  })
})
