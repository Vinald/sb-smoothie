import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import SmoothieCard from "../component/smoothieCard";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("smoothie").select().eq("voided", false);
      console.log("Supabase response:", { data, error });
      if (error) {
        setFetchError(error.message);
        console.error("Error fetching data:", error);
        setData(null);
      } else {
        setData(data);
        setFetchError(null);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page home">
      <h2>Home</h2>
      {fetchError && <p>Error: {fetchError}</p>}
      {data && (
        <div className="smoothies">
          <div className="smoothie-grid">
            {data.map((smoothie) => (
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
