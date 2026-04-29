import { useCallback, useState } from 'react'
import LessonShell from './components/lesson/LessonShell'
import CompletionScreen from './components/steps/CompletionScreen'
import StepIntroGoal from './components/steps/StepIntroGoal'
import StepScaleBalance from './components/steps/StepScaleBalance'
import StepTableStarter from './components/steps/StepTableStarter'

function App() {
  const prompts = ['', '', '', '', '', '', '', '', '', '']
  const [screen, setScreen] = useState<'home' | 'lesson'>('home')
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
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
