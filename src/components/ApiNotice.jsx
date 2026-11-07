export default function ApiNotice({ message }) {
  if (!message) return null
  return <p className="inline-api-note" role="status">{message}</p>
}
