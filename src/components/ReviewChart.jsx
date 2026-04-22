function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

function shortLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

function ReviewChart({ reviewHistory }) {
  const days = getLast7Days()
  const countMap = Object.fromEntries(reviewHistory.map(r => [r.date, r.count]))
  const counts = days.map(d => countMap[d] || 0)
  const maxCount = Math.max(...counts, 1)

  return (
    <div className="review-chart">
      {days.map((date, i) => {
        const count = counts[i]
        const heightPct = Math.round((count / maxCount) * 100)
        const isToday = date === new Date().toISOString().split('T')[0]
        return (
          <div key={date} className="chart-col">
            <span className="chart-count">{count > 0 ? count : ''}</span>
            <div className="chart-bar-track">
              <div
                className={`chart-bar ${isToday ? 'chart-bar-today' : ''} ${count === 0 ? 'chart-bar-empty' : ''}`}
                style={{ height: count > 0 ? `${heightPct}%` : '4px' }}
                title={`${date}: ${count} verse${count !== 1 ? 's' : ''}`}
              />
            </div>
            <span className={`chart-label ${isToday ? 'fw-bold' : ''}`}>{shortLabel(date)}</span>
          </div>
        )
      })}
    </div>
  )
}

export default ReviewChart
