import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAttractionImage, getDestinationImage } from '@/lib/images'
import {
  getDestinationActivities,
  getDestinationBySlug
} from '@/lib/queries/destinations'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function DestinationPage ({ params }: PageProps) {
  const { slug } = await params

  const destination = await getDestinationBySlug(slug)

  if (!destination) {
    notFound()
  }

  const activities = await getDestinationActivities(slug)
  const destinationImage = getDestinationImage(slug)

  return (
    <main className='min-h-screen bg-slate-950 text-white'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-5'>
          <Link href='/' className='text-xl font-bold tracking-tight'>
            Trip<span className='text-cyan-400'>Graph</span>
          </Link>

          <nav className='flex items-center gap-6 text-sm'>
            <Link
              href='/'
              className='text-slate-400 transition hover:text-white'
            >
              Destinations
            </Link>

            <Link
              href='/graph'
              className='text-slate-300 transition hover:text-white'
            >
              Graph Explorer →
            </Link>
          </nav>
        </div>
      </header>

      <div className='mx-auto max-w-7xl px-6 py-10'>
        {/* Back */}
        <Link
          href='/'
          className='inline-flex items-center text-sm text-slate-400 transition hover:text-white'
        >
          ← Back to destinations
        </Link>

        {/* Hero */}
        <section className='mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]'>
          <div className='relative h-[420px]'>
            <img
              src={destinationImage}
              alt={`${destination.name} travel`}
              className='h-full w-full object-cover'
            />

            <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent' />

            <div className='absolute bottom-0 left-0 right-0 p-8 sm:p-10'>
              <div className='inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm'>
                Destination
              </div>

              <h1 className='mt-5 text-5xl font-bold tracking-tight sm:text-6xl'>
                {destination.name}
              </h1>

              <p className='mt-5 max-w-2xl text-lg leading-8 text-slate-300'>
                {destination.description}
              </p>

              <div className='mt-7'>
                <Link
                  href={`/graph?destination=${destination.slug}`}
                  className='inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300'
                >
                  Explore in Graph →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3'>
          <StatCard
            label='Attractions'
            value={destination.attractions.length}
          />

          <StatCard label='Activities' value={activities.length} />

          <StatCard
            label='Connected destinations'
            value={destination.connectedDestinations.length}
          />
        </section>

        {/* Relationship explanation */}
        <section className='mt-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400'>
              ✦
            </div>

            <div>
              <h2 className='font-semibold'>
                Discover {destination.name} through connections
              </h2>

              <p className='mt-1 text-sm leading-6 text-slate-400'>
                This information is connected through the graph: attractions,
                activities, restaurants and nearby destinations are represented
                as relationships rather than isolated records.
              </p>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className='mt-8 grid gap-6 lg:grid-cols-2'>
          {/* Attractions */}
          <ContentCard
            title='Attractions'
            subtitle='Places worth exploring'
            icon='◆'
          >
            {destination.attractions.length > 0 ? (
              <div className='space-y-3'>
                {destination.attractions.map(attraction => (
                  <div
                    key={attraction.name}
                    className='group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-violet-400/30 hover:bg-white/[0.05]'
                  >
                    <div className='relative h-44 overflow-hidden'>
                      <img
                        src={getAttractionImage(attraction.name, slug)}
                        alt={attraction.name}
                        className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                      />

                      <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent' />

                      <div className='absolute bottom-3 left-4'>
                        <span className='rounded-full bg-black/40 px-3 py-1 text-xs text-slate-200 backdrop-blur-sm'>
                          Attraction
                        </span>
                      </div>
                    </div>

                    <div className='p-4'>
                      <h3 className='font-medium'>{attraction.name}</h3>

                      <p className='mt-1 text-sm leading-6 text-slate-400'>
                        {attraction.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message='No attractions found.' />
            )}
          </ContentCard>

          {/* Activities */}
          <ContentCard
            title='Things to do'
            subtitle='Activities discovered through the graph'
            icon='✦'
          >
            {activities.length > 0 ? (
              <div className='grid gap-3 sm:grid-cols-2'>
                {activities.map(activity => (
                  <div
                    key={activity.name}
                    className='rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4 transition hover:border-cyan-400/30'
                  >
                    <h3 className='font-medium text-cyan-300'>
                      {activity.name}
                    </h3>

                    <p className='mt-1 text-sm leading-6 text-slate-400'>
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message='No activities found.' />
            )}
          </ContentCard>

          {/* Restaurants */}
          <ContentCard title='Restaurants' subtitle='Places to eat' icon='●'>
            {destination.restaurants.length > 0 ? (
              <div className='space-y-3'>
                {destination.restaurants.map(restaurant => (
                  <div
                    key={restaurant.name}
                    className='flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4'
                  >
                    <h3 className='font-medium'>{restaurant.name}</h3>

                    <span className='shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400'>
                      {restaurant.cuisine}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message='No restaurants found.' />
            )}
          </ContentCard>

          {/* Connected destinations */}
          <ContentCard
            title='Connected destinations'
            subtitle='Places connected to this destination'
            icon='↔'
          >
            {destination.connectedDestinations.length > 0 ? (
              <div className='grid gap-3 sm:grid-cols-2'>
                {destination.connectedDestinations.map(connected => (
                  <Link
                    key={connected.slug}
                    href={`/destinations/${connected.slug}`}
                    className='group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.06]'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-xs text-slate-500'>CONNECTED_TO</p>

                        <span className='mt-1 block font-medium'>
                          {connected.name}
                        </span>
                      </div>

                      <span className='text-cyan-400 transition group-hover:translate-x-1'>
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState message='No connected destinations found.' />
            )}
          </ContentCard>
        </section>

        {/* Relationship overview */}
        <section className='mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-8'>
          <div className='text-center'>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-cyan-400'>
              Graph relationships
            </p>

            <h2 className='mt-3 text-2xl font-semibold'>
              How {destination.name} fits into the graph
            </h2>
          </div>

          <div className='mt-8 flex flex-wrap items-center justify-center gap-3 text-sm'>
            <GraphNode label={destination.name} type='Destination' active />

            <GraphArrow label='HAS_ATTRACTION' />

            <GraphNode
              label={`${destination.attractions.length} attractions`}
              type='Attraction'
            />

            <GraphArrow label='OFFERS' />

            <GraphNode
              label={`${activities.length} activities`}
              type='Activity'
            />

            <GraphArrow label='CONNECTED_TO' />

            <GraphNode
              label={`${destination.connectedDestinations.length} destinations`}
              type='Destination'
            />
          </div>
        </section>

        {/* Graph CTA */}
        <section className='mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-8 sm:p-10'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm font-medium text-cyan-400'>
                Interactive exploration
              </p>

              <h2 className='mt-2 text-2xl font-semibold'>
                Explore the complete {destination.name} graph.
              </h2>

              <p className='mt-2 max-w-xl text-sm leading-6 text-slate-400'>
                Follow relationships between destinations, attractions and
                activities using the interactive graph explorer.
              </p>
            </div>

            <Link
              href={`/graph?destination=${destination.slug}`}
              className='shrink-0 rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-300'
            >
              Open Graph Explorer →
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className='border-t border-white/10'>
        <div className='mx-auto max-w-7xl px-6 py-8 text-sm text-slate-500'>
          TripGraph · A graph-powered travel explorer
        </div>
      </footer>
    </main>
  )
}

/* =========================================================
   Components
   ========================================================= */

function StatCard ({ label, value }: { label: string; value: number }) {
  return (
    <div className='rounded-2xl border border-white/10 bg-white/[0.03] p-5'>
      <p className='text-2xl font-bold text-cyan-400'>{value}</p>

      <p className='mt-1 text-sm text-slate-400'>{label}</p>
    </div>
  )
}

function ContentCard ({
  title,
  subtitle,
  icon,
  children
}: {
  title: string
  subtitle: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <section className='rounded-2xl border border-white/10 bg-white/[0.02] p-6'>
      <div className='flex items-start gap-3'>
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sm text-cyan-400'>
          {icon}
        </div>

        <div>
          <h2 className='text-xl font-semibold'>{title}</h2>

          <p className='mt-1 text-sm text-slate-500'>{subtitle}</p>
        </div>
      </div>

      <div className='mt-5'>{children}</div>
    </section>
  )
}

function GraphNode ({
  label,
  type,
  active = false
}: {
  label: string
  type: string
  active?: boolean
}) {
  return (
    <div
      className={`rounded-xl border px-5 py-3 text-center ${
        active
          ? 'border-cyan-400/30 bg-cyan-400/10'
          : 'border-white/10 bg-white/[0.03]'
      }`}
    >
      <p className={`text-xs ${active ? 'text-cyan-400' : 'text-slate-500'}`}>
        {type}
      </p>

      <p className='mt-1 font-medium'>{label}</p>
    </div>
  )
}

function GraphArrow ({ label }: { label: string }) {
  return (
    <div className='flex flex-col items-center px-1'>
      <span className='text-[10px] text-slate-600'>{label}</span>

      <span className='text-slate-600'>→</span>
    </div>
  )
}

function EmptyState ({ message }: { message: string }) {
  return (
    <div className='rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500'>
      {message}
    </div>
  )
}
