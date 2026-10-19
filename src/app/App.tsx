import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Journey } from '@/journey/Journey'
import { useJourney } from '@/journey/store'

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })

export function App() {
  const lang = useJourney((s) => s.lang)
  /* the page's language follows the chosen one, so screen readers and the Devanagari font follow too */
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <QueryClientProvider client={queryClient}>
      <Journey />
    </QueryClientProvider>
  )
}
