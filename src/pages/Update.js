import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchSmoothieById, updateSmoothie } from '../services/smoothieService'
import { uploadImage } from '../services/storageService'

const Update = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [method, setMethod] = useState('')
  const [rating, setRating] = useState('')
  const [image, setImage] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await fetchSmoothieById(id)
      if (error) {
        navigate('/', { replace: true })
      } else {
        setTitle(data.title)
        setMethod(data.method)
        setRating(data.rating)
        setExistingImageUrl(data.image_url)
      }
    }
    load()
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    setLoading(true)

    let image_url = existingImageUrl
    if (image) {
      try {
        image_url = await uploadImage(image)
      } catch {
        setFormError('Image upload failed. Make sure the "smoothies" storage bucket exists in Supabase.')
        setLoading(false)
        return
      }
    }

    const { error } = await updateSmoothie(id, { title, method, rating, image_url })
    if (error) {
      setFormError('Could not update the smoothie. Please try again.')
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="method">Method:</label>
        <textarea
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />

        <label htmlFor="rating">Rating (1–10):</label>
        <input
          type="number"
          id="rating"
          value={rating}
          min="1"
          max="10"
          onChange={(e) => setRating(e.target.value)}
        />

        <label htmlFor="image">Image:</label>
        {existingImageUrl && (
          <img src={existingImageUrl} alt="current" className="current-image" />
        )}
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button disabled={loading}>
          {loading ? 'Saving...' : 'Update Smoothie Recipe'}
        </button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default Update
