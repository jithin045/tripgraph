'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import GraphExplorer from '@/components/GraphExplorer'

const destinations = [
  {
    name: 'Munnar',
    slug: 'munnar',
    description: 'Tea plantations & misty mountains',
    image: '...'
  },
  {
    name: 'Wayanad',
    slug: 'wayanad',
    description: 'Forests, waterfalls & nature',
    image: '...'
  },
  {
    name: 'Kochi',
    slug: 'kochi',
    description: 'Heritage, culture & coastal life',
    image: '...'
  },
  {
    name: 'Alleppey',
    slug: 'alleppey',
    description: 'Backwaters & waterways',
    image: '...'
  }
]

type GraphData = {
  nodes: {
    id: string
    label: string
    type: string
  }[]
  relationships: {
    source: string
    target: string
    type: string
  }[]
}

export default function GraphPageClient () {
  const searchParams = useSearchParams()

  const destinationFromUrl = searchParams.get('destination')

  const initialDestination = destinations.some(
    destination => destination.slug === destinationFromUrl
  )
    ? destinationFromUrl!
    : 'munnar'

  const [selectedDestination, setSelectedDestination] =
    useState(initialDestination)

  const [graph, setGraph] = useState<GraphData | null>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    if (
      destinationFromUrl &&
      destinations.some(destination => destination.slug === destinationFromUrl)
    ) {
      setSelectedDestination(destinationFromUrl)
    }
  }, [destinationFromUrl])

  useEffect(() => {
    async function loadGraph () {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/graph/${selectedDestination}`, {
          cache: 'no-store'
        })

        if (!response.ok) {
          throw new Error(`Failed to load graph (${response.status})`)
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || 'Failed to load graph')
        }

        setGraph(data.graph)
      } catch (error) {
        console.error('Graph loading error:', error)

        setGraph(null)

        setError(
          'Unable to load the graph. Please check the database connection and try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadGraph()
  }, [selectedDestination, retryKey])

  function handleDestinationChange (slug: string) {
    setSelectedDestination(slug)

    // Update the browser URL without a full page reload.
    const url = new URL(window.location.href)

    url.searchParams.set('destination', slug)

    window.history.replaceState({}, '', url.toString())
  }

  function handleRetry () {
    setRetryKey(current => current + 1)
  }

  return (
    <div>
      {/* Destination selector */}
      <div className='mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <div>
            <p className='text-sm font-medium text-slate-400'>
              Select destination
            </p>

            <p className='mt-1 text-xs text-slate-500'>
              Choose a destination to explore its connections
            </p>

            <div className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              {destinations.map(destination => {
                const isSelected = selectedDestination === destination.slug

                return (
                  <button
                    key={destination.slug}
                    type='button'
                    onClick={() => handleDestinationChange(destination.slug)}
                    className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-cyan-400/50 bg-cyan-400/10 shadow-lg shadow-cyan-400/5'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {destination.name.charAt(0)}
                      </div>

                      {isSelected && (
                        <span className='rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-medium text-cyan-300'>
                          Selected
                        </span>
                      )}
                    </div>

                    <h3
                      className={`mt-4 font-semibold ${
                        isSelected ? 'text-cyan-300' : 'text-white'
                      }`}
                    >
                      {destination.name}
                    </h3>

                    <p className='mt-1 text-xs text-slate-500'>
                      Explore {destination.name} connections
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {graph && !loading && (
          <div className='rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400'>
            <span className='text-white'>{graph.nodes.length}</span> nodes
            <span className='mx-2 text-slate-700'>·</span>
            <span className='text-white'>
              {graph.relationships.length}
            </span>{' '}
            relationships
          </div>
        )}
      </div>

      {/* Graph explanation */}
      <div className='mb-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] px-5 py-4'>
        <p className='text-sm leading-6 text-slate-400'>
          Exploring{' '}
          <span className='font-medium text-cyan-300'>
            {
              destinations.find(
                destination => destination.slug === selectedDestination
              )?.name
            }
          </span>{' '}
          and its connected travel experiences. Follow relationships to discover
          attractions, activities, restaurants and other destinations.
        </p>
      </div>

      {/* Legend */}
      <div className='mb-5 flex flex-wrap gap-3'>
        <Legend label='Destination' className='border-cyan-400 text-cyan-300' />

        <Legend
          label='Attraction'
          className='border-violet-400 text-violet-300'
        />

        <Legend
          label='Activity'
          className='border-emerald-400 text-emerald-300'
        />

        <Legend
          label='Restaurant'
          className='border-amber-400 text-amber-300'
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className='flex h-[650px] items-center justify-center rounded-3xl border border-white/10 bg-slate-950'>
          <div className='text-center'>
            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400' />

            <p className='mt-4 text-sm text-slate-400'>
              Loading {selectedDestination} graph...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className='flex h-[650px] items-center justify-center rounded-3xl border border-red-400/20 bg-red-400/[0.03]'>
          <div className='max-w-md px-6 text-center'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10 text-red-300'>
              !
            </div>

            <p className='mt-4 text-lg font-medium text-red-300'>
              Unable to load graph
            </p>

            <p className='mt-2 text-sm leading-6 text-slate-500'>{error}</p>

            <button
              onClick={handleRetry}
              className='mt-5 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium transition hover:bg-white/15'
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Graph */}
      {!loading && !error && graph && (
        <GraphExplorer
          nodes={graph.nodes}
          relationships={graph.relationships}
        />
      )}

      {/* Empty */}
      {!loading && !error && !graph && (
        <div className='flex h-[650px] items-center justify-center rounded-3xl border border-white/10'>
          <div className='text-center'>
            <p className='text-lg font-medium'>No graph data</p>

            <p className='mt-2 text-sm text-slate-500'>
              There are no connections available for this destination.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Legend ({ label, className }: { label: string; className: string }) {
  return (
    <div
      className={`rounded-full border bg-white/[0.03] px-3 py-1.5 text-xs ${className}`}
    >
      {label}
    </div>
  )
}
