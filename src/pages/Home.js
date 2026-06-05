import supabase from "../config/supabaseClient"
import { useEffect, useState } from "react"

const Home = () => {
  const [fetchError, setFetchError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
      .from("sb-smoothie")
      .select()
      if (error) {
        setFetchError(error.message)
        console.error("Error fetching data:", error)
        setData(null)
      } else {
        setData(data)
        setFetchError(null)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="page home">
      <h2>Home</h2>
      {fetchError && <p>Error: {fetchError}</p>}
      {data && (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.title} {item.rating} {item.methods}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home