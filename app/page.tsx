import Link from 'next/link'
import { destinationImages } from '@/lib/images'
import TravelCarousel from '@/components/TravelCarousel'

const destinations = [
  {
    name: 'Munnar',
    slug: 'munnar',
    description:
      'Tea plantations, misty mountains and peaceful natural landscapes.',
    image: destinationImages.munnar
  },
  {
    name: 'Wayanad',
    slug: 'wayanad',
    description: 'Forests, waterfalls and ancient caves surrounded by nature.',
    image: destinationImages.wayanad
  },
  {
    name: 'Kochi',
    slug: 'kochi',
    description:
      'A historic coastal city filled with culture, heritage and food.',
    image: destinationImages.kochi
  },
  {
    name: 'Alleppey',
    slug: 'alleppey',
    description: "Explore Kerala's famous backwaters and relaxing waterways.",
    image: destinationImages.alleppey
  }
]

const stats = [
  {
    value: '4',
    label: 'Destinations'
  },
  {
    value: '7',
    label: 'Attractions'
  },
  {
    value: '6',
    label: 'Activities'
  },
  {
    value: '5',
    label: 'Restaurants'
  }
]

export default function Home () {
  return (
    <main className='min-h-screen bg-slate-950 text-white'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-5'>
          <Link href='/' className='text-xl font-bold tracking-tight'>
            Trip<span className='text-cyan-400'>Graph</span>
          </Link>

          <nav className='flex items-center gap-6 text-sm text-slate-300'>
            <Link href='/' className='transition hover:text-white'>
              Destinations
            </Link>

            <Link href='/graph' className='transition hover:text-white'>
              Graph Explorer
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className='mx-auto max-w-7xl px-6 pb-20 pt-16'>
        <div className='grid items-center gap-14 lg:grid-cols-[1fr_520px]'>
          {/* Left content */}
          <div className='max-w-2xl'>
            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-300'>
              <span className='h-1.5 w-1.5 rounded-full bg-cyan-400' />
              Graph-powered travel discovery
            </div>

            <h1 className='text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl'>
              Discover places through their{' '}
              <span className='text-cyan-400'>connections.</span>
            </h1>

            <p className='mt-7 max-w-xl text-lg leading-8 text-slate-400'>
              Explore destinations, attractions, activities and restaurants as
              an interconnected travel network. Instead of browsing isolated
              records, discover how everything is connected.
            </p>

            <div className='mt-8 flex flex-wrap gap-3'>
              <Link
                href='/graph'
                className='rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300'
              >
                Explore the Graph →
              </Link>

              <Link
                href='#destinations'
                className='rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white'
              >
                Browse destinations
              </Link>
            </div>

            {/* Small graph stats */}
            <div className='mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-7'>
              <div>
                <p className='text-2xl font-bold text-white'>4</p>
                <p className='mt-1 text-xs text-slate-500'>Destinations</p>
              </div>

              <div>
                <p className='text-2xl font-bold text-white'>7</p>
                <p className='mt-1 text-xs text-slate-500'>Attractions</p>
              </div>

              <div>
                <p className='text-2xl font-bold text-white'>4</p>
                <p className='mt-1 text-xs text-slate-500'>Activities</p>
              </div>

              <div>
                <p className='text-2xl font-bold text-white'>5</p>
                <p className='mt-1 text-xs text-slate-500'>Restaurants</p>
              </div>
            </div>
          </div>

          {/* Right carousel */}
          <div className='relative'>
            <TravelCarousel />

            {/* Decorative glow */}
            <div className='pointer-events-none absolute -bottom-10 -right-10 -z-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl' />
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id='destinations' className='mx-auto max-w-7xl px-6 py-20'>
        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm font-medium uppercase tracking-[0.2em] text-cyan-400'>
              Explore Kerala
            </p>

            <h2 className='mt-2 text-3xl font-semibold'>
              Choose a destination
            </h2>

            <p className='mt-2 text-sm text-slate-400'>
              Explore the places and experiences connected to each destination.
            </p>
          </div>

          <Link
            href='/graph'
            className='text-sm font-medium text-cyan-400 transition hover:text-cyan-300'
          >
            Open Graph Explorer →
          </Link>
        </div>

        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {destinations.map((destination, index) => (
            <Link
              key={destination.slug}
              href={`/destinations/${destination.slug}`}
              className='group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/[0.06]'
            >
              {/* Image */}
              <div className='relative h-52 overflow-hidden'>
                <img
                  src={destination.image}
                  alt={`${destination.name} travel`}
                  className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                />

                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent' />

                <span className='absolute right-4 top-4 text-xs font-medium text-white/60'>
                  0{index + 1}
                </span>
              </div>

              {/* Content */}
              <div className='p-6'>
                <h3 className='text-xl font-semibold'>{destination.name}</h3>

                <p className='mt-3 min-h-20 text-sm leading-6 text-slate-400'>
                  {destination.description}
                </p>

                <div className='mt-6 text-sm font-medium text-cyan-400 transition group-hover:translate-x-1'>
                  Explore destination →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Graph */}
      <section className='border-y border-white/10 bg-white/[0.02]'>
        <div className='mx-auto max-w-7xl px-6 py-20'>
          <div className='grid gap-12 lg:grid-cols-2 lg:items-center'>
            <div>
              <p className='text-sm font-medium uppercase tracking-[0.2em] text-cyan-400'>
                Why a graph?
              </p>

              <h2 className='mt-3 text-3xl font-semibold sm:text-4xl'>
                Travel isn't a collection of isolated records.
              </h2>

              <p className='mt-5 max-w-xl leading-7 text-slate-400'>
                A destination is connected to attractions. Attractions offer
                activities. Destinations connect to other destinations.
                Restaurants belong to destinations.
              </p>

              <p className='mt-4 max-w-xl leading-7 text-slate-400'>
                A graph database makes these relationships first-class data,
                making multi-hop discovery natural and efficient.
              </p>

              <Link
                href='/graph'
                className='mt-7 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300'
              >
                Explore these connections
              </Link>
            </div>

            {/* Relationship visualization */}
            <div className='rounded-3xl border border-white/10 bg-slate-900 p-8'>
              <div className='flex flex-col items-center'>
                {/* Destination */}
                <div className='rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-7 py-4 text-center shadow-lg shadow-cyan-400/5'>
                  <p className='text-xs uppercase tracking-wider text-cyan-400'>
                    Destination
                  </p>

                  <p className='mt-1 text-lg font-semibold text-white'>
                    Munnar
                  </p>
                </div>

                {/* Connection */}
                <div className='my-4 flex flex-col items-center'>
                  <div className='h-8 w-px bg-gradient-to-b from-cyan-400/50 to-violet-400/50' />

                  <span className='rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-[11px] text-slate-400'>
                    Places to explore
                  </span>

                  <div className='h-8 w-px bg-violet-400/50' />
                </div>

                {/* Attractions */}
                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-xl border border-violet-400/20 bg-violet-400/5 px-4 py-3 text-center'>
                    <p className='text-sm font-medium text-violet-300'>
                      Tea Museum
                    </p>
                    <p className='mt-1 text-[11px] text-slate-500'>
                      Attraction
                    </p>
                  </div>

                  <div className='rounded-xl border border-violet-400/20 bg-violet-400/5 px-4 py-3 text-center'>
                    <p className='text-sm font-medium text-violet-300'>
                      Mattupetty Dam
                    </p>
                    <p className='mt-1 text-[11px] text-slate-500'>
                      Attraction
                    </p>
                  </div>
                </div>

                {/* Connection */}
                <div className='my-4 flex flex-col items-center'>
                  <div className='h-8 w-px bg-gradient-to-b from-violet-400/50 to-emerald-400/50' />

                  <span className='rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-[11px] text-slate-400'>
                    Things to do
                  </span>

                  <div className='h-8 w-px bg-emerald-400/50' />
                </div>

                {/* Activities */}
                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-center'>
                    <p className='text-sm font-medium text-emerald-300'>
                      Sightseeing
                    </p>
                    <p className='mt-1 text-[11px] text-slate-500'>Activity</p>
                  </div>

                  <div className='rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-center'>
                    <p className='text-sm font-medium text-emerald-300'>
                      Boating
                    </p>
                    <p className='mt-1 text-[11px] text-slate-500'>Activity</p>
                  </div>
                </div>

                {/* Connected destinations */}
                <div className='my-5 flex flex-col items-center'>
                  <div className='h-8 w-px bg-white/20' />

                  <span className='rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-[11px] text-slate-400'>
                    Nearby destinations
                  </span>

                  <div className='mt-4 flex gap-3'>
                    <div className='rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-3 text-center'>
                      <p className='text-sm font-medium text-cyan-300'>Kochi</p>
                    </div>

                    <div className='rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-3 text-center'>
                      <p className='text-sm font-medium text-cyan-300'>
                        Wayanad
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='mx-auto max-w-7xl px-6 py-20'>
        <div className='rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] px-6 py-12 text-center sm:px-12'>
          <p className='text-sm font-medium uppercase tracking-[0.2em] text-cyan-400'>
            Interactive exploration
          </p>

          <h2 className='mt-3 text-3xl font-semibold'>
            See the travel graph yourself.
          </h2>

          <p className='mx-auto mt-4 max-w-xl text-slate-400'>
            Follow connections between destinations, attractions, activities and
            restaurants in an interactive graph.
          </p>

          <Link
            href='/graph'
            className='mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300'
          >
            Open Graph Explorer →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-white/10'>
        <div className='mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
          <span>TripGraph · A graph-powered travel explorer</span>

          <span>Built with Next.js · React · CognoDB</span>
        </div>
      </footer>
    </main>
  )
}
