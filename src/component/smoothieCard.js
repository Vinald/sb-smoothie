import { Link } from 'react-router-dom'

const SmoothieCard = ({ smoothie }) => {
  return (
    <Link to={"/" + smoothie.id} className="smoothie-card">
      <h3>{smoothie.title}</h3>
      <p>{smoothie.method}</p>
      <div className="rating">{smoothie.rating}</div>
    </Link>
  )
}

export default SmoothieCard