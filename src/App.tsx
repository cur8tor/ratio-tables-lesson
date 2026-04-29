import { useCallback, useState } from 'react'
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
  const [hasChecked, setHasChecked] = useState(false)
  const [checkFn, setCheckFn] = useState<(() => void) | null>(null)
  const [isCheckRegistered, setIsCheckRegistered] = useState(false)
  const [cfuStatuses, setCfuStatuses] = useState<Array<boolean | null>>([null, null, null])

  const isComplete = currentStep >= prompts.length

  const advanceStep = () => {
    if (!isComplete) {
      setCurrentStep((step) => step + 1)
      setCanPressCheck(false)
      setIsCorrect(false)
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
      setIsCorrect(ok)
      if (currentStep >= 7 && currentStep <= 9) {
        const cfuIndex = currentStep - 7
        setCfuStatuses((current) =>
          current.map((status, index) => (index === cfuIndex ? ok : status)),
        )
      }
    },
    [currentStep],
  )

  const handleRegisterCheck = useCallback((fn: () => void) => {
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
    if (currentStep === 1)
      return <StepScaleBalance {...common} fixedHex={1} initialTrap={0} />
    if (currentStep === 2)
      return <StepScaleBalance {...common} fixedTrap={6} initialHex={2} />
    if (currentStep === 3)
      return <StepScaleBalance {...common} fixedTrap={10} initialHex={3} />
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
            setHasChecked(false)
            setCheckFn(null)
            setIsCheckRegistered(false)
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
      canContinue={currentStep === 0 ? true : canPressCheck && isCheckRegistered}
      isCorrect={isCorrect}
      canGoBack={currentStep > 0}
      canGoForward={currentStep < prompts.length - 1}
      onBack={() => {
        setCurrentStep((step) => Math.max(0, step - 1))
        setCanPressCheck(false)
        setIsCorrect(false)
        setHasChecked(false)
        setCheckFn(null)
        setIsCheckRegistered(false)
      }}
      onForward={() => {
        setCurrentStep((step) => Math.min(prompts.length - 1, step + 1))
        setCanPressCheck(false)
        setIsCorrect(false)
        setHasChecked(false)
        setCheckFn(null)
        setIsCheckRegistered(false)
      }}
      cfuStatuses={cfuStatuses}
      buttonLabel={currentStep === 0 ? 'Start' : isCorrect ? 'Continue' : hasChecked ? 'Try again' : 'Check'}
      buttonWarning={currentStep > 0 && hasChecked && !isCorrect}
      onContinue={() => {
        if (currentStep === 0) {
          advanceStep()
          return
        }
        if (!canPressCheck || !isCheckRegistered || !checkFn) return
        if (isCorrect) {
          advanceStep()
          return
        }
        setHasChecked(true)
        checkFn()
      }}
    >
      {renderStep()}
    </LessonShell>
  )
}

export default App
