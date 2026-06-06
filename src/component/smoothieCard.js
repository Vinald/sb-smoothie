import { Link } from 'react-router-dom'
import supabase from '../config/supabaseClient'

const SmoothieCard = ({ smoothie, onDelete }) => {
  const handleDelete = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from('smoothie')
      .update({ voided: true })
      .eq('id', smoothie.id)
    if (!error) onDelete(smoothie.id)
  }

  return (
    <Link to={"/" + smoothie.id} className="smoothie-card">
      <h3>{smoothie.title}</h3>
      <p>{smoothie.method}</p>
      <div className="rating">{smoothie.rating}</div>
      <button className="delete-btn" onClick={handleDelete}>
        <i className="material-icons">delete</i>
      </button>
    </Link>
  )
}

export default SmoothieCard