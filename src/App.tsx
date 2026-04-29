import type { DragEvent } from 'react'
import { useMemo, useState } from 'react'
import Hexagon from './components/primitives/Hexagon'
import Trapezoid from './components/primitives/Trapezoid'

type Screen = 'map' | 'level1' | 'level2' | 'level3' | 'boss' | 'arenaComplete'
type ShapeType = 'hex' | 'trap' | 'tri' | 'rhomb'

const Triangle = ({ className = '' }: { className?: string }) => (
  <svg viewBox="-20 -20 40 40" className={className} aria-hidden="true">
    <polygon points="0,-16 14,8 -14,8" fill="#16A34A" stroke="#1F2937" strokeWidth="1.3" />
  </svg>
)

const Rhombus = ({ className = '' }: { className?: string }) => (
  <svg viewBox="-20 -20 40 40" className={className} aria-hidden="true">
    <polygon points="0,-14 14,0 0,14 -14,0" fill="#2563EB" stroke="#1F2937" strokeWidth="1.3" />
  </svg>
)

const ShapeToken = ({ type, className = '' }: { type: ShapeType; className?: string }) => {
  if (type === 'hex') return <Hexagon size={14} fill="#FFD63B" className={className} />
  if (type === 'trap') return <Trapezoid size={14} direction="up" className={className} />
  if (type === 'tri') return <Triangle className={className} />
  return <Rhombus className={className} />
}

const CourseMap = ({
  completed,
  onOpenLevel,
  onOpenBoss,
}: {
  completed: boolean[]
  onOpenLevel: (index: number) => void
  onOpenBoss: () => void
}) => {
  const bossUnlocked = completed.every(Boolean)
  return (
    <div className="min-h-screen bg-bg px-6 py-6">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between border-b border-secondary/20 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight">Ratio Arena</h1>
        <p className="text-sm text-secondary">3 levels + boss battle</p>
      </header>
      <main className="mx-auto mt-8 grid w-full max-w-6xl gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-secondary/20 bg-surface p-6">
          <h2 className="text-2xl font-semibold">Proportional Reasoning</h2>
          <p className="mt-3 text-secondary">
            Unlock each level, then complete the boss battle by building and reusing the unit rate.
          </p>
          <div className="mt-6 space-y-3">
            {[
              'Level 1 - Trapezoids and hexagons',
              'Level 2 - Green triangles',
              'Level 3 - Blue rhombuses',
            ].map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => onOpenLevel(index)}
                className="flex w-full items-center justify-between rounded-xl border border-secondary/20 bg-white px-4 py-3 text-left hover:border-accent/60"
              >
                <span>{label}</span>
                <span className={completed[index] ? 'text-accent' : 'text-secondary'}>
                  {completed[index] ? 'Complete' : 'Start'}
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="flex flex-col justify-between rounded-3xl border border-blue-300/80 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600">BOSS BATTLE</p>
            <h3 className="mt-2 text-3xl font-semibold">Complete the Arena</h3>
            <p className="mt-3 text-secondary">
              Build a ratio table from draggable shapes, create your unit-rate fraction, then solve a
              word problem.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBoss}
            disabled={!bossUnlocked}
            className="mt-6 h-12 rounded-full bg-blue-600 px-6 font-medium text-white disabled:cursor-not-allowed disabled:bg-secondary/40"
          >
            {bossUnlocked ? 'Enter boss battle' : 'Finish levels to unlock'}
          </button>
        </section>
      </main>
    </div>
  )
}

const LevelScreen = ({
  title,
  shapeType,
  perHex,
  question,
  answer,
  onBack,
  onComplete,
}: {
  title: string
  shapeType: ShapeType
  perHex: number
  question: string
  answer: number
  onBack: () => void
  onComplete: () => void
}) => {
  const [fills, setFills] = useState<number[]>([0, 0, 0])
  const [value, setValue] = useState('')
  const covered = fills.every((count) => count >= perHex)
  const correct = Number(value) === answer && covered

  return (
    <div className="min-h-screen bg-bg px-6 py-6">
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={onBack} className="text-sm text-secondary hover:text-primary">
          Back to map
        </button>
        <h2 className="mt-4 text-3xl font-semibold">{title}</h2>
        <p className="mt-2 text-secondary">{question}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="relative h-72 rounded-2xl border border-secondary/20 bg-surface p-4">
            {fills.map((count, index) => (
              <div
                key={index}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  if (event.dataTransfer.getData('shape') === shapeType) {
                    setFills((current) =>
                      current.map((c, i) => (i === index ? Math.min(perHex, c + 1) : c)),
                    )
                  }
                }}
                className="absolute rounded-xl border border-secondary/20 bg-white p-1"
                style={{
                  left: `${10 + index * 25}%`,
                  top: `${15 + (index % 2) * 28}%`,
                  transform: `rotate(${index % 2 ? 6 : -6}deg)`,
                }}
              >
                <div className="relative h-20 w-20">
                  <Hexagon size={22} fill="none" className="h-full w-full" />
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="absolute inset-0">
                      {shapeType === 'trap' ? (
                        <Trapezoid
                          size={22}
                          direction={i === 0 ? 'up' : 'down'}
                          className="h-full w-full"
                          stroke="#1F2937"
                          strokeWidth={1.1}
                        />
                      ) : shapeType === 'tri' ? (
                        <Triangle className="h-full w-full" />
                      ) : (
                        <Rhombus className="h-full w-full" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="relative h-72 rounded-2xl border border-secondary/20 bg-surface p-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('shape', shapeType)}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  left: `${8 + (index % 5) * 18}%`,
                  top: `${12 + Math.floor(index / 5) * 35}%`,
                  transform: `rotate(${index % 2 ? 8 : -8}deg)`,
                }}
              >
                <ShapeToken type={shapeType} className="h-10 w-10" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm text-secondary">Answer:</span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="h-11 w-28 rounded-xl border border-secondary/30 px-3 text-lg"
            type="number"
          />
          <button
            type="button"
            onClick={() => {
              if (correct) onComplete()
            }}
            className="h-11 rounded-xl bg-accent px-5 font-medium text-white"
          >
            Check
          </button>
          <span className={correct ? 'text-accent' : 'text-secondary'}>
            {correct ? 'Correct! Continue.' : `Cover all hexagons, then enter ${answer}.`}
          </span>
        </div>
      </div>
    </div>
  )
}

const BossBattle = ({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) => {
  const [topHex, setTopHex] = useState(0)
  const [topTrap, setTopTrap] = useState(0)
  const [numTrap, setNumTrap] = useState(0)
  const [denHex, setDenHex] = useState(0)
  const [copiedFraction, setCopiedFraction] = useState(false)
  const [knownTrap, setKnownTrap] = useState('16')
  const [unknownHex, setUnknownHex] = useState('')

  const unitReady = numTrap > 0 && denHex > 0
  const solved =
    copiedFraction &&
    unitReady &&
    Number(unknownHex) === (Number(knownTrap) * denHex) / numTrap &&
    topHex > 0 &&
    topTrap > 0

  const dropShape = (
    event: DragEvent<HTMLDivElement>,
    accept: ShapeType,
    setter: (fn: (count: number) => number) => void,
  ) => {
    event.preventDefault()
    if (event.dataTransfer.getData('shape') === accept) {
      setter((count) => count + 1)
    }
  }

  const shapeCount = (type: ShapeType, count: number) => (
    <div className="flex min-h-12 flex-wrap items-center justify-center gap-1 rounded-lg border border-secondary/20 bg-white p-2">
      {count === 0 ? (
        <span className="text-xs text-secondary">drop {type}</span>
      ) : (
        Array.from({ length: Math.min(count, 8) }).map((_, index) => (
          <ShapeToken key={`${type}-${index}`} type={type} className="h-5 w-5" />
        ))
      )}
      {count > 8 ? <span className="text-xs text-secondary">+{count - 8}</span> : null}
    </div>
  )

  return (
    <div className="min-h-screen bg-bg px-6 py-6">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={onBack} className="text-sm text-secondary hover:text-primary">
          Back to map
        </button>
        <h2 className="mt-4 text-3xl font-semibold">Boss battle - Ratio Arena</h2>
        <p className="mt-2 max-w-3xl text-secondary">
          Word problem: In your pattern-block set, you found a stable relationship between hexagons
          and trapezoids. If there are 16 trapezoids, how many hexagons are there?
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-secondary/20">
          <table className="w-full border-collapse bg-surface">
            <thead>
              <tr className="border-b border-secondary/20">
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Hexagons</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">COP</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Trapezoids</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-secondary/20">
                <td className="px-4 py-3">
                  <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => dropShape(e, 'hex', setTopHex)}>
                    {shapeCount('hex', topHex)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="grid grid-cols-1 gap-1 rounded-lg border border-secondary/20 bg-white p-2">
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => dropShape(e, 'trap', setNumTrap)}
                    >
                      {shapeCount('trap', numTrap)}
                    </div>
                    <div className="h-px bg-secondary/30" />
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => dropShape(e, 'hex', setDenHex)}
                    >
                      {shapeCount('hex', denHex)}
                    </div>
                    {unitReady ? (
                      <div
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData('fraction', 'ready')}
                        className="mt-2 cursor-grab rounded-lg border border-accent/40 bg-accent/10 px-2 py-1 text-center text-sm font-medium text-accent"
                      >
                        Unit rate {numTrap}/{denHex} (drag down)
                      </div>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => dropShape(e, 'trap', setTopTrap)}>
                    {shapeCount('trap', topTrap)}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <input
                    value={unknownHex}
                    onChange={(event) => setUnknownHex(event.target.value)}
                    placeholder="unknown"
                    className="h-11 w-32 rounded-lg border border-secondary/30 px-3"
                    type="number"
                  />
                </td>
                <td className="px-4 py-3">
                  <div
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault()
                      if (event.dataTransfer.getData('fraction') === 'ready') {
                        setCopiedFraction(true)
                      }
                    }}
                    className="flex h-14 items-center justify-center rounded-lg border border-dashed border-secondary/30 bg-white text-sm"
                  >
                    {copiedFraction ? `Using ${numTrap}/${denHex}` : 'Drag completed unit rate here'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input
                    value={knownTrap}
                    onChange={(event) => setKnownTrap(event.target.value)}
                    className="h-11 w-32 rounded-lg border border-secondary/30 px-3"
                    type="number"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-secondary/20 bg-surface p-4">
          <p className="text-sm text-secondary">Shape bucket (drag from here, bucket stays full):</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {(['hex', 'trap', 'tri', 'rhomb'] as ShapeType[]).map((type) => (
              <div
                key={type}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('shape', type)}
                className="flex cursor-grab items-center gap-2 rounded-xl border border-secondary/20 bg-white px-3 py-2"
              >
                <ShapeToken type={type} className="h-8 w-8" />
                <span className="text-sm text-secondary">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onComplete}
            disabled={!solved}
            className="h-11 rounded-xl bg-accent px-5 font-medium text-white disabled:cursor-not-allowed disabled:bg-secondary/40"
          >
            Complete arena
          </button>
          <span className={solved ? 'text-accent' : 'text-secondary'}>
            {solved
              ? 'Arena complete! You built and reused a unit rate.'
              : 'Build top row + fraction, drag fraction down, then solve unknown hexagons.'}
          </span>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>('map')
  const [completed, setCompleted] = useState<boolean[]>([false, false, false])

  const allComplete = useMemo(() => completed.every(Boolean), [completed])

  if (screen === 'level1') {
    return (
      <LevelScreen
        title="Level 1 - Trapezoids"
        shapeType="trap"
        perHex={2}
        question="Match shapes to discover the ratio. How many trapezoids for 3 hexagons?"
        answer={6}
        onBack={() => setScreen('map')}
        onComplete={() => {
          setCompleted((current) => current.map((v, i) => (i === 0 ? true : v)))
          setScreen('map')
        }}
      />
    )
  }

  if (screen === 'level2') {
    return (
      <LevelScreen
        title="Level 2 - Green triangles"
        shapeType="tri"
        perHex={6}
        question="Now try a new decomposition. How many triangles for 3 hexagons?"
        answer={18}
        onBack={() => setScreen('map')}
        onComplete={() => {
          setCompleted((current) => current.map((v, i) => (i === 1 ? true : v)))
          setScreen('map')
        }}
      />
    )
  }

  if (screen === 'level3') {
    return (
      <LevelScreen
        title="Level 3 - Blue rhombuses"
        shapeType="rhomb"
        perHex={3}
        question="Final prep level. How many rhombuses for 3 hexagons?"
        answer={9}
        onBack={() => setScreen('map')}
        onComplete={() => {
          setCompleted((current) => current.map((v, i) => (i === 2 ? true : v)))
          setScreen('map')
        }}
      />
    )
  }

  if (screen === 'boss') {
    return (
      <BossBattle
        onBack={() => setScreen('map')}
        onComplete={() => setScreen('arenaComplete')}
      />
    )
  }

  if (screen === 'arenaComplete') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <div className="max-w-xl rounded-3xl border border-secondary/20 bg-white p-8 text-center">
          <h2 className="text-3xl font-semibold">Arena complete</h2>
          <p className="mt-3 text-secondary">
            You finished all 3 levels and solved the boss battle by building and reusing a constant
            ratio.
          </p>
          <button
            type="button"
            onClick={() => setScreen('map')}
            className="mt-6 rounded-xl bg-accent px-6 py-3 font-medium text-white"
          >
            Back to course map
          </button>
        </div>
      </div>
    )
  }

  return (
    <CourseMap
      completed={completed}
      onOpenLevel={(index) => setScreen((`level${index + 1}` as Screen))}
      onOpenBoss={() => {
        if (allComplete) {
          setScreen('boss')
        }
      }}
    />
  )
}

export default App
