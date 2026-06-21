'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'What IR firm should I look for?',
  'How do I file a material change report?',
  'What is a transfer agent and do I need one?',
  'How does the RFQ system work?',
]

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [configured, setConfigured] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  async function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput('')

    const userMsg: Message = { role: 'user', content }
    const next = [...messages, userMsg]
    setMessages(next)
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (data.error?.includes('API key')) {
        setConfigured(false)
        setMessages(prev => [...prev, { role: 'assistant', content: 'The AI Assistant is not yet configured. Add your ANTHROPIC_API_KEY to .env.local to activate it.' }])
      } else if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-105"
        style={{ backgroundColor: 'var(--color-navy)' }}
        aria-label="Open AI Assistant">
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border" style={{ borderColor: 'var(--color-border)' }}>
          {/* Header */}
          <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-navy)', borderRadius: '1rem 1rem 0 0' }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Enlisted AI</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Ask anything about your listing</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: 380 }}>
            {messages.length === 0 && (
              <div>
                <p className="text-sm mb-3" style={{ color: 'var(--color-gray)' }}>
                  Hi! I&apos;m your Enlisted AI — ask me about service providers, compliance, or how to use the platform.
                </p>
                <div className="space-y-2">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="w-full text-left text-xs px-3 py-2 rounded-xl border transition-colors hover:border-blue-300"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-navy)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                    <Bot className="w-3.5 h-3.5" style={{ color: 'var(--color-navy)' }} />
                  </div>
                )}
                <div className="max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                  style={{
                    backgroundColor: m.role === 'user' ? 'var(--color-navy)' : '#f3f4f6',
                    color: m.role === 'user' ? 'white' : 'var(--color-gray-dark)',
                    borderRadius: m.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                  }}>
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--color-gold-light)' }}>
                    <User className="w-3.5 h-3.5" style={{ color: 'var(--color-gold)' }} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-blue-light)' }}>
                  <Bot className="w-3.5 h-3.5" style={{ color: 'var(--color-navy)' }} />
                </div>
                <div className="px-3 py-2 rounded-2xl" style={{ backgroundColor: '#f3f4f6' }}>
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-gray)' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Ask anything…"
                className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--color-border)' }}
              />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40"
                style={{ backgroundColor: 'var(--color-navy)' }}>
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-center mt-2" style={{ color: 'var(--color-gray-light)' }}>
              Not legal or financial advice.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
