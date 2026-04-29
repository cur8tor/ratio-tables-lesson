import { useState } from 'react'
import LessonShell from './components/lesson/LessonShell'
import CompletionScreen from './components/steps/CompletionScreen'
import StepIntroGoal from './components/steps/StepIntroGoal'
import StepScaleBalance from './components/steps/StepScaleBalance'
import StepTableStarter from './components/steps/StepTableStarter'

function App() {
  const prompts = [
    'Goal',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]
  const [currentStep, setCurrentStep] = useState(0)
  const [canPressCheck, setCanPressCheck] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [checkFn, setCheckFn] = useState<() => void>(() => () => {})
  const [cfuStatuses, setCfuStatuses] = useState<Array<boolean | null>>([null, null, null])

  const isComplete = currentStep >= prompts.length

  const advanceStep = () => {
    if (!isComplete) {
      setCurrentStep((step) => step + 1)
      setCanPressCheck(false)
      setIsCorrect(false)
      setCheckFn(() => () => {})
    }
  }

  const renderStep = () => {
    const handleCorrectChange = (ok: boolean) => {
      setIsCorrect(ok)
      if (currentStep >= 7 && currentStep <= 9) {
        const cfuIndex = currentStep - 7
        setCfuStatuses((current) =>
          current.map((status, index) => (index === cfuIndex ? ok : status)),
        )
      }
    }

    const common = {
      onReadyChange: setCanPressCheck,
      onCorrect: advanceStep,
      onCorrectChange: handleCorrectChange,
      registerCheck: (fn: () => void) => setCheckFn(() => fn),
    }

    if (currentStep === 0) return <StepIntroGoal {...common} />
    if (currentStep === 1) return <StepScaleBalance {...common} targetHex={1} />
    if (currentStep === 2) return <StepScaleBalance {...common} targetHex={2} />
    if (currentStep === 3)
      return (
        <StepScaleBalance
          {...common}
          targetHex={2}
          requireDifferentFrom={{ hex: 2, trap: 4 }}
        />
      )
    if (currentStep === 4)
      return <StepTableStarter {...common} given={{ hex: 1 }} answer={2} showScale />
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

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <CompletionScreen
          onRestart={() => {
            setCurrentStep(0)
            setCanPressCheck(false)
            setIsCorrect(false)
            setCheckFn(() => () => {})
            setCfuStatuses([null, null, null])
          }}
        />
      </div>
    )
  }

  return (
    <LessonShell
      step={Math.min(prompts.length, currentStep + 1 + (isCorrect ? 1 : 0))}
      total={prompts.length}
      prompt={prompts[currentStep]}
      canContinue={canPressCheck}
      isCorrect={isCorrect}
      canGoBack={currentStep > 0}
      onBack={() => {
        setCurrentStep((step) => Math.max(0, step - 1))
        setCanPressCheck(false)
        setIsCorrect(false)
        setCheckFn(() => () => {})
      }}
      cfuStatuses={cfuStatuses}
      buttonLabel={currentStep === 0 ? 'Start' : isCorrect ? 'Continue' : 'Check'}
      onContinue={() => {
        if (!canPressCheck) return
        if (isCorrect) {
          advanceStep()
          return
        }
        checkFn()
      }}
    >
      {renderStep()}
    </LessonShell>
  )
}

export default App
