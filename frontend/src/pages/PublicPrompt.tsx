import { useEffect, useState } from 'react'
import { API_BASE } from '../lib/api'
import { useParams } from 'react-router-dom'

export default function PublicPrompt() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    if (!id) return
    fetch(`${API_BASE}/api/share/public/${id}`).then(r=>r.json()).then(setData).catch(e=>setErr(String(e)))
  }, [id])
  if (err) return <div className="p-6">Error</div>
  if (!data) return <div className="p-6">Loading...</div>
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">{data.title}</h2>
      <pre className="whitespace-pre-wrap">{data.body}</pre>
    </div>
  )
}


