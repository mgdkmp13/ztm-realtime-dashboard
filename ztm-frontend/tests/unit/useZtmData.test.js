import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useZtmData } from '../src/composables/useZtmData'

vi.mock('../src/api/axios', () => ({
  default: {
    get: vi.fn()
  }
}))

import axios from '../src/api/axios'

describe('useZtmData Composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should fetch user stops successfully', async () => {
    const mockStops = [
      { id: 1, stopId: 2019, stopDesc: 'Miszewskiego' }
    ]
    
    axios.get.mockResolvedValueOnce({ data: mockStops })

    const { stops, loading, error, fetchUserStops } = useZtmData()

    await fetchUserStops()

    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(stops.value).toEqual(mockStops)
  })

  it('should handle error when fetching stops fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'))

    const { stops, error, fetchUserStops } = useZtmData()

    await fetchUserStops()

    expect(error.value).toBe('Failed to fetch stops')
    expect(stops.value).toEqual([])
  })

  it('should add stop successfully', async () => {
    const newStop = { id: 1, stopId: 2019, stopDesc: 'Miszewskiego' }
    axios.post.mockResolvedValueOnce({ data: newStop })

    const { addStop } = useZtmData()

    const result = await addStop(2019, 'Miszewskiego')

    expect(result).toBe(true)
    expect(axios.post).toHaveBeenCalledWith('/stop', {
      stopId: 2019,
      stopDesc: 'Miszewskiego'
    })
  })

  it('should delete stop successfully', async () => {
    axios.delete.mockResolvedValueOnce({ data: { success: true } })

    const { deleteStop } = useZtmData()

    const result = await deleteStop(1)

    expect(result).toBe(true)
    expect(axios.delete).toHaveBeenCalledWith('/stop/1')
  })
})
