import useSmoothies from '../hooks/useSmoothies'
import SmoothieCard from '../component/smoothieCard'

const Home = () => {
  const {
    data, loading, fetchError,
    ratingFilter, setRatingFilter,
    page, setPage, totalPages,
    removeById, silentRefresh,
  } = useSmoothies()

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
              <option key={r} value={r}>{r} star{r !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {fetchError && <p className="error">{fetchError}</p>}
      {loading && <p className="loading">Loading smoothies...</p>}

      {!loading && !fetchError && data.length === 0 && (
        <p className="empty">
          No smoothies found{ratingFilter !== 'all' ? ` with a ${ratingFilter}-star rating` : ''}.
        </p>
      )}

      {!loading && data.length > 0 && (
        <div className="smoothies">
          <div className="smoothie-grid">
            {data.map((smoothie) => (
              <SmoothieCard
                key={smoothie.id}
                smoothie={smoothie}
                onDelete={(id) => { removeById(id); silentRefresh() }}
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
  )
}

export default Home
