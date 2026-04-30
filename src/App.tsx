import { useCallback, useState } from 'react'
import LessonShell from './components/lesson/LessonShell'
import CompletionScreen from './components/steps/CompletionScreen'
import StepIntroGoal from './components/steps/StepIntroGoal'
import StepScaleBalance from './components/steps/StepScaleBalance'
import StepTableStarter from './components/steps/StepTableStarter'

function App() {
  const prompts = ['', '', '', '', '', '', '', '', '', '']
  const faqItems = [
    {
      title: 'About this project',
      paragraphs: [
        'A 7th grade ratio and proportional reasoning lesson, built for the Brilliant Math Learning Designer application.',
        'Ratio tables are the keystone of 7th grade math. Once a student can build one, they can solve almost every ratio problem on the state test: unit rate, percent change, scaled figures, unit conversion, even setting up equations of the form y = kx from a word problem. The same table scaffolds expressions, equations, and the integer arithmetic students will need for solving for x. Build the table once, and it becomes a manipulative the student carries through the rest of the year and into 8th grade.',
        'So Ratio Path is built around a single core idea: the ratio table is the manipulative we are teaching. Not a worksheet. Not a way to organize work. A tool that makes information from a word problem, a graph, or a real situation legible and operable. Everything else in the lesson, the balance scale, the hexagon and trapezoid pattern blocks, the column for the constant of proportionality, exists to give the student a way into that table.',
      ],
    },
    {
      title: 'Why these specific design choices',
      paragraphs: [
        'Why a balance scale. A scale physicalizes the equivalence at the heart of a ratio. Two trapezoids on one side and one hexagon on the other do not just have the same value, they balance. A 7th grader who has spent years balancing equations to solve for x already has an intuition for what that means. The scale primes the algebraic move that comes one unit later, when the same students are asked to balance an equation. Same metaphor, different abstraction.',
        'Why hexagons and trapezoids specifically. The 2:1 relationship between a yellow hexagon and two red trapezoids is structural, not arbitrary. Two trapezoids physically reassemble into one hexagon. The student does not have to take it on faith that 2 traps = 1 hex. They can see it. That makes the constant of proportionality, when it appears later as the fraction 2/1, feel like a naming of something they already know rather than a new concept introduced from outside.',
        'Why the CRA progression. Concrete-Representational-Abstract is the framework I rely on most in my own classroom. In Ratio Path, the progression is explicit: students manipulate scales (concrete), watch a table emerge from those scales with shape icons in the cells (representational), then work in a table of pure numerals where the constant of proportionality is named below as a stacked fraction (abstract). The lesson ends with an inverse problem because solving forward is recall, while solving in reverse is evidence the relationship has actually been internalized.',
        'Why a single arc, not a sampler. Most introductory online math content hops between contexts. Ratio Path does not. The same scale, same shapes, same table, and same fraction appear across all 10 steps, growing in abstraction but never replaced. The intent is for a student to leave the lesson with one durable mental object they can carry into the next lesson on percent change, into a unit conversion problem, into a scaled figure on a coordinate plane. The manipulative travels.',
      ],
    },
    {
      title: 'What this is and is not',
      paragraphs: [
        'This is a single Lesson 1 in a planned three-lesson arc. Lesson 2 (Scaling Up) introduces the constant of proportionality formally and connects the table to y = kx. Lesson 3 (Ratio Tables) extends the same table to percent problems, unit conversion, and scaled figures. Together the three lessons cover the bulk of 7.RP, the New York State 7th grade ratio and proportional relationships standard, on a single conceptual path.',
        'Lesson 1 is a working interactive. Lessons 2 and 3 are placeholders on the home screen for now. The intent of this submission is to demonstrate the design of one fully-realized lesson, not the breadth of a curriculum.',
      ],
    },
    {
      title: 'A few things this lesson is opinionated about',
      paragraphs: [
        'It does not lead with definitions. The word ratio does not appear until after students have balanced three scales by hand. Definitions land harder when they name something the learner has already done.',
        'It does not separate the manipulative from the abstraction. The scale stays visible during the table problems as a thinking tool, not a tutorial that disappears after the introduction. Students who are stuck on the inverse problem in Step 6 can glance back at the scale and reconstruct the relationship. The crutch is intentional.',
        'It treats the constant of proportionality as the through-line, not a side concept. In 7th grade math, the COP is the single most useful object: it is the slope, it is the unit rate, it is k in y = kx, it is the conversion factor. Naming it once, in the right way, with the right manipulative behind it, pays off across an entire year of math instruction. Lesson 1 plants that seed. Lessons 2 and 3 grow it.',
      ],
    },
    {
      title: 'About the build',
      paragraphs: [
        'I built Ratio Path in React and TypeScript with Tailwind and Framer Motion, deployed on Vercel at lessons.tannermartz.com. The pedagogy and the build are both mine. Source: github.com/cur8tor/ratio-tables-lesson.',
        'Before teaching, I studied Design and Computer Science at Tulane. I am currently a TFA corps member teaching 7th grade math at School in the Square in Washington Heights, finishing my second year alongside my M.S.Ed. in Special Education at Hunter College. The lesson reflects strategies I use in my classroom every day: pattern blocks, balance metaphors, ratio tables as a default organizing tool, and CRA progressions for any concept that students struggle to visualize. My final masters paper is on student motivation and technology integration in the classroom.',
        'Tanner Martz, tannermartz.com',
      ],
    },
  ]
  const [screen, setScreen] = useState<'home' | 'lesson'>('home')
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [canPressCheck, setCanPressCheck] = useState(false)
  const [stepPassed, setStepPassed] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [checkFn, setCheckFn] = useState<(() => boolean) | null>(null)
  const [isCheckRegistered, setIsCheckRegistered] = useState(false)
  const [cfuStatuses, setCfuStatuses] = useState<Array<boolean | null>>([null, null, null])

  const isComplete = currentStep >= prompts.length

  const resetLessonState = useCallback(() => {
    setCurrentStep(0)
    setCanPressCheck(false)
    setStepPassed(false)
    setHasChecked(false)
    setCheckFn(null)
    setIsCheckRegistered(false)
    setCfuStatuses([null, null, null])
  }, [])

  const advanceStep = () => {
    if (!isComplete) {
      setCurrentStep((step) => step + 1)
      setCanPressCheck(false)
      setStepPassed(false)
      setHasChecked(false)
      setCheckFn(null)
      setIsCheckRegistered(false)
    }
  }

  const handleReadyChange = useCallback((ready: boolean) => {
    setCanPressCheck(ready)
  }, [])

  const handleCorrectChange = useCallback(
    (ok: boolean) => {
      if (ok) setStepPassed(true)
      if (currentStep >= 7 && currentStep <= 9) {
        const cfuIndex = currentStep - 7
        setCfuStatuses((current) =>
          current.map((status, index) => (index === cfuIndex ? ok : status)),
        )
      }
    },
    [currentStep],
  )

  const handleRegisterCheck = useCallback((fn: () => boolean) => {
    setCheckFn(() => fn)
    setIsCheckRegistered(true)
  }, [])

  const renderStep = () => {
    const common = {
      onReadyChange: handleReadyChange,
      onCorrect: advanceStep,
      onCorrectChange: handleCorrectChange,
      registerCheck: handleRegisterCheck,
    }

    if (currentStep === 0) return <StepIntroGoal {...common} />
    if (currentStep === 1) return <StepScaleBalance {...common} fixedHex={1} initialTrap={0} />
    if (currentStep === 2) return <StepScaleBalance {...common} fixedTrap={6} initialHex={0} />
    if (currentStep === 3) return <StepScaleBalance {...common} fixedTrap={10} initialHex={0} />
    if (currentStep === 4) return <StepTableStarter {...common} given={{ hex: 1 }} answer={2} showScale />
    if (currentStep === 5)
      return (
        <StepTableStarter
          {...common}
          given={{ hex: 3 }}
          answer={6}
          showScale
          history={[{ hex: 1, trap: 2 }]}
        />
      )
    if (currentStep === 6)
      return (
        <StepTableStarter
          {...common}
          given={{ trap: 10 }}
          answer={5}
          showScale
          history={[
            { hex: 1, trap: 2 },
            { hex: 3, trap: 6 },
          ]}
        />
      )
    if (currentStep === 7) return <StepTableStarter {...common} given={{ hex: 4 }} answer={8} />
    if (currentStep === 8) return <StepTableStarter {...common} given={{ trap: 14 }} answer={7} />
    if (currentStep === 9) return <StepTableStarter {...common} given={{ hex: 9 }} answer={18} />
    return null
  }

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-[#F3F4F6] px-4 pb-32 pt-8 text-primary">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="rounded-3xl border border-[#BFE8CB] bg-[#E8F7EC] p-8 text-center">
            <h1 className="text-4xl font-semibold text-primary">Ratio Path</h1>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setSelectedLevel(1)}
              className="w-full rounded-2xl border-2 border-[#6C8CFF] bg-white px-6 py-4 text-left shadow-[0_4px_0_0_#6C8CFF]"
            >
              <p className="text-sm font-semibold tracking-wide text-[#4F63C7]">LEVEL 1</p>
              <p className="text-2xl font-semibold text-primary">Setting Up Ratios</p>
            </button>

            <div className="w-full rounded-2xl border border-secondary/20 bg-white px-6 py-4 opacity-60">
              <p className="text-sm font-semibold tracking-wide text-secondary">LEVEL 2</p>
              <p className="text-2xl font-semibold text-primary">Scaling Up</p>
            </div>

            <div className="w-full rounded-2xl border border-secondary/20 bg-white px-6 py-4 opacity-60">
              <p className="text-sm font-semibold tracking-wide text-secondary">LEVEL 3</p>
              <p className="text-2xl font-semibold text-primary">Ratio Tables</p>
            </div>
          </div>

          <div className="rounded-2xl border border-secondary/20 bg-white p-4">
            <h2 className="px-2 pb-3 text-lg font-semibold text-primary">About This Demo</h2>
            <div className="space-y-2">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <div key={item.title} className="overflow-hidden rounded-xl border border-secondary/20">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex((current) => (current === index ? null : index))}
                      className="flex w-full items-center justify-between bg-[#F8FAFC] px-4 py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-primary">{item.title}</span>
                      <span className="text-base font-semibold text-secondary">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen ? (
                      <div className="bg-white px-4 py-3">
                        <div className="space-y-3">
                          {item.paragraphs.map((paragraph) => (
                            <p key={paragraph} className="text-sm leading-relaxed text-secondary">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {selectedLevel === 1 ? (
          <div className="fixed bottom-0 left-0 right-0 border-t border-secondary/20 bg-white/95 p-4 backdrop-blur">
            <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3">
              <h2 className="text-2xl font-semibold text-primary">Setting Up Ratios</h2>
              <button
                type="button"
                onClick={() => {
                  resetLessonState()
                  setScreen('lesson')
                }}
                className="h-14 min-w-[280px] rounded-full bg-[#2F3136] px-8 text-2xl font-medium text-white transition hover:brightness-110 sm:min-w-[360px]"
              >
                Start lesson
              </button>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <CompletionScreen
          onRestart={() => {
            resetLessonState()
            setScreen('home')
            setSelectedLevel(1)
          }}
        />
      </div>
    )
  }

  return (
    <LessonShell
      step={currentStep + 1}
      total={prompts.length}
      prompt={prompts[currentStep]}
      canContinue={currentStep === 0 ? true : canPressCheck && isCheckRegistered}
      isCorrect={stepPassed}
      canGoBack={currentStep > 0}
      canGoForward={currentStep < prompts.length - 1}
      onBack={() => {
        setCurrentStep((step) => Math.max(0, step - 1))
        setCanPressCheck(false)
        setStepPassed(false)
        setHasChecked(false)
        setCheckFn(null)
        setIsCheckRegistered(false)
      }}
      onForward={() => {
        setCurrentStep((step) => Math.min(prompts.length - 1, step + 1))
        setCanPressCheck(false)
        setStepPassed(false)
        setHasChecked(false)
        setCheckFn(null)
        setIsCheckRegistered(false)
      }}
      onClose={() => {
        setScreen('home')
        setSelectedLevel(null)
      }}
      cfuStatuses={cfuStatuses}
      buttonLabel={currentStep === 0 ? '▶' : stepPassed ? '→' : hasChecked ? '↻' : '✓'}
      buttonAriaLabel={
        currentStep === 0 ? 'Start' : stepPassed ? 'Continue' : hasChecked ? 'Try again' : 'Check'
      }
      buttonWarning={currentStep > 0 && hasChecked && !stepPassed}
      onContinue={() => {
        if (currentStep === 0) {
          advanceStep()
          return
        }
        if (!canPressCheck || !isCheckRegistered || !checkFn) return
        if (stepPassed) {
          advanceStep()
          return
        }
        const ok = checkFn()
        setHasChecked(true)
        if (ok) {
          advanceStep()
        }
      }}
    >
      {renderStep()}
    </LessonShell>
  )
}

export default App
