import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import SmoothieCard from "../component/smoothieCard";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [data, setData] = useState(null);
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("smoothie")
        .select()
        .eq("voided", false)
        .order("created_at", { ascending: false });
      if (error) {
        setFetchError(error.message);
        setData(null);
      } else {
        setData(data);
        setFetchError(null);
      }
    };
    fetchData();
  }, []);

  const filtered = data
    ? ratingFilter === "all"
      ? data
      : data.filter((s) => s.rating === Number(ratingFilter))
    : null;

  return (
    <div className="page home">
      <div className="home-header">
        <h2>Smoothies</h2>
        <div className="filter">
          <label htmlFor="rating-filter">Filter by rating:</label>
          <select
            id="rating-filter"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">All</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
              <option key={r} value={r}>{r} star{r !== 1 ? "s" : ""}</option>
            ))}
          </select>
        </div>
      </div>
      {fetchError && <p>Error: {fetchError}</p>}
      {filtered && (
        <div className="smoothies">
          <div className="smoothie-grid">
            {filtered.map((smoothie) => (
              <SmoothieCard
                key={smoothie.id}
                smoothie={smoothie}
                onDelete={(id) => setData(prev => prev.filter(s => s.id !== id))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
