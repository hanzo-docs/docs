'use client'

import { useEffect, useState } from 'react'

import { Action } from '@/components/action'
import { Status } from '@/components/status'
import { iam } from '@/lib/iam'

export default function CallbackPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    iam()
      .handleCallback(window.location.href)
      .then(() => {
        window.location.href = '/docs'
      })
      .catch(() => setError('Authentication failed. Please try again.'))
  }, [])

  if (error)
    return (
      <Status
        title="Sign in failed"
        note={error}
        action={
          <Action tone="loud" render="a" href="/login" mt={6} rounded={999}>
            Try again
          </Action>
        }
      />
    )

  return <Status note="Signing in…" />
}
