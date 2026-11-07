import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function useClinicData(endpoint, fallback = []) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.get(endpoint)
      .then(({ data: response }) => {
        if (active) setData(Array.isArray(response) ? response : [response])
      })
      .catch(() => {
        if (active) setError('Showing sample content while the clinic service is unavailable.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [endpoint])

  return { data, loading, error }
}
