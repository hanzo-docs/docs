'use client'

import { useEffect, useState } from 'react'

import { Action } from '@/components/action'
import { Status } from '@/components/status'
import { iam } from '@/lib/iam'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Already signed in — including in ANOTHER tab, now that the session is not
    // scoped to this one.
    if (iam().getAccessToken()) {
      window.location.href = '/docs'
      return
    }
    iam()
      .signinRedirect()
      .catch(() => setError('Failed to load authentication. Please try again.'))
  }, [])

  if (error)
    return (
      <Status
        title="Sign in error"
        note={error}
        action={
          <Action tone="loud" render="button" type="button" onPress={() => window.location.reload()} mt={6} rounded={999}>
            Try again
          </Action>
        }
      />
    )

  return <Status note="Redirecting to sign in…" />
}
