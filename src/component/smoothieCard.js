import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { voidSmoothie } from '../services/smoothieService'

const SmoothieCard = ({ smoothie, onDelete }) => {
  const { session } = useAuth()

  const handleDelete = async (e) => {
    e.preventDefault()
    const { error } = await voidSmoothie(smoothie.id)
    if (!error) onDelete(smoothie.id)
  }

  return (
    <Link to={'/' + smoothie.id} className="smoothie-card">
      {smoothie.image_url && (
        <img src={smoothie.image_url} alt={smoothie.title} className="smoothie-image" />
      )}
      <h3>{smoothie.title}</h3>
      <p>{smoothie.method}</p>
      <div className="rating">{smoothie.rating}</div>
      {session && (
        <button className="delete-btn" onClick={handleDelete}>
          <i className="material-icons">delete</i>
        </button>
      )}
    </Link>
  )
}

export default SmoothieCard
