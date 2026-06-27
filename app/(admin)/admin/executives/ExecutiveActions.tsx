'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'

export default function ExecutiveActions({
  id,
  isActive,
  name,
}: {
  id: string
  isActive: boolean
  name: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)

  async function callApi(action: string) {
    setLoading(true)
    const res = await fetch(`/api/admin/executives/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setLoading(false)
    if (res.ok) router.refresh()
    else alert('Action failed — check console')
  }

  if (confirmRemove) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: '#ef4444' }}>Remove {name}?</span>
        <button
          disabled={loading}
          onClick={() => callApi('remove').then(() => setConfirmRemove(false))}
          className="text-xs font-bold px-2 py-1 rounded-lg text-white disabled:opacity-50"
          style={{ backgroundColor: '#ef4444' }}
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirmRemove(false)}
          className="text-xs font-semibold px-2 py-1 rounded-lg border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-gray)' }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <button
        disabled={loading}
        onClick={() => callApi(isActive ? 'deactivate' : 'reactivate')}
        title={isActive ? 'Suspend account' : 'Reactivate account'}
        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border disabled:opacity-50 transition-colors hover:bg-gray-50"
        style={{ borderColor: 'var(--color-border)', color: isActive ? '#f59e0b' : '#10b981' }}
      >
        {isActive
          ? <><ToggleRight className="w-3.5 h-3.5" /> Suspend</>
          : <><ToggleLeft className="w-3.5 h-3.5" /> Reactivate</>
        }
      </button>
      <button
        disabled={loading}
        onClick={() => setConfirmRemove(true)}
        title="Permanently remove executive"
        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border disabled:opacity-50 transition-colors hover:bg-red-50"
        style={{ borderColor: '#fca5a5', color: '#ef4444' }}
      >
        <Trash2 className="w-3.5 h-3.5" /> Remove
      </button>
    </div>
  )
}
