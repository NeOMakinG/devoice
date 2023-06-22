'use client'
import { useState, useEffect, PropsWithChildren, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

const RouteGuard: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const { isConnected } = useAccount()

  const authCheck = useCallback(
    (url: string) => {
      // redirect to login page if accessing a private page and not logged in
      const publicPaths = ['/']
      const path = url.split('?')[0]
      if (!isConnected && !publicPaths.includes(path)) {
        setAuthorized(false)
        router.push('/')
      } else {
        setAuthorized(true)
      }
    },
    [isConnected, router]
  )

  useEffect(() => {
    const url = `${router.pathname}?${router.query}`

    authCheck(url)

    return () => {
      authCheck(url)
    }
  }, [router.pathname, router.query, authCheck])

  return authorized && children
}

export { RouteGuard }
