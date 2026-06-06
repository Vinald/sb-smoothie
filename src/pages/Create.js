import { useState } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient"

const Create = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [method, setMethod] = useState('')
  const [rating, setRating] = useState('')
  const [image, setImage] = useState(null)
  const [formError, setFormError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !method || !rating) {
      setFormError('Please fill in all the fields correctly.')
      return
    }
    setLoading(true)

    let image_url = null
    if (image) {
      const fileName = `${Date.now()}-${image.name}`
      const { error: uploadError } = await supabase.storage
        .from('smoothies')
        .upload(fileName, image)
      if (uploadError) {
        setFormError('Image upload failed. Please try again.')
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('smoothies').getPublicUrl(fileName)
      image_url = urlData.publicUrl
    }

    const { error } = await supabase
      .from('smoothie')
      .insert([{ title, method, rating, image_url }])

    if (error) {
      setFormError('Could not create the smoothie. Please try again.')
    } else {
      setFormError(null)
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

        <label htmlFor="image">Image (optional):</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button disabled={loading}>
          {loading ? 'Creating...' : 'Create Smoothie Recipe'}
        </button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default Create
