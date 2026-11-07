export default function LoadingCards({ count = 4 }) {
  return <div className="loading-skeleton-grid" role="status" aria-label="Loading content">{Array.from({ length: count }, (_, index) => <div className="loading-skeleton" key={index} />)}</div>
}
