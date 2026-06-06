import { useEffect, useState } from 'react'
import supabase from '../config/supabaseClient'
import { fetchSmoothies } from '../services/smoothieService'

const PAGE_SIZE = 9

const useSmoothies = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [ratingFilter, setRatingFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setPage(1)
  }, [ratingFilter])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)
      const { data, error, count } = await fetchSmoothies({ page, pageSize: PAGE_SIZE, ratingFilter })
      if (!isMounted) return
      if (error) {
        setFetchError(error.message)
        setData([])
      } else {
        setData(data)
        setTotalCount(count)
        setFetchError(null)
      }
      setLoading(false)
    }

    load()

    const channel = supabase
      .channel('smoothie-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'smoothie' }, load)
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [page, ratingFilter])

  const removeById = (id) => setData((prev) => prev.filter((s) => s.id !== id))
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return {
    data, loading, fetchError,
    ratingFilter, setRatingFilter,
    page, setPage, totalPages,
    removeById,
  }
}

export default useSmoothies
