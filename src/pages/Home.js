import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";
import SmoothieCard from "../component/smoothieCard";

const PAGE_SIZE = 9;

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [ratingFilter]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      let query = supabase
        .from("smoothie")
        .select("*", { count: "exact" })
        .eq("voided", false)
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (ratingFilter !== "all") {
        query = query.eq("rating", Number(ratingFilter));
      }

      const { data, error, count } = await query;
      if (!isMounted) return;

      if (error) {
        setFetchError(error.message);
        setData([]);
      } else {
        setData(data);
        setTotalCount(count);
        setFetchError(null);
      }
      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel("smoothie-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "smoothie" }, fetchData)
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [page, ratingFilter]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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

      {fetchError && <p className="error">{fetchError}</p>}
      {loading && <p className="loading">Loading smoothies...</p>}

      {!loading && !fetchError && data.length === 0 && (
        <p className="empty">
          No smoothies found{ratingFilter !== "all" ? ` with a ${ratingFilter}-star rating` : ""}.
        </p>
      )}

      {!loading && data.length > 0 && (
        <div className="smoothies">
          <div className="smoothie-grid">
            {data.map((smoothie) => (
              <SmoothieCard
                key={smoothie.id}
                smoothie={smoothie}
                onDelete={(id) => setData((prev) => prev.filter((s) => s.id !== id))}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span>{page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
