import { useState } from 'react'
import LessonShell from './components/lesson/LessonShell'
import CompletionScreen from './components/steps/CompletionScreen'
import StepIntroGoal from './components/steps/StepIntroGoal'
import StepScaleBalance from './components/steps/StepScaleBalance'
import StepTableStarter from './components/steps/StepTableStarter'

function App() {
  const prompts = [
    'Let’s set a goal before we begin.',
    'Balance 1 hexagon.',
    'Balance 2 hexagons.',
    'Create your own different balanced hanger.',
    'Complete row 1 in the table.',
    'Add row 2 for 3 hexagons.',
    'Add row 3 for 10 trapezoids.',
    'Check for understanding: 4 hexagons -> ? trapezoids.',
    'Check for understanding: 14 trapezoids -> ? hexagons.',
    'Final check: 9 hexagons -> ? trapezoids.',
  ]
  const [currentStep, setCurrentStep] = useState(0)
  const [canPressCheck, setCanPressCheck] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [checkFn, setCheckFn] = useState<() => void>(() => () => {})

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
    const common = {
      onReadyChange: setCanPressCheck,
      onCorrect: advanceStep,
      onCorrectChange: setIsCorrect,
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
      canContinue={canPressCheck}
      isCorrect={isCorrect}
      canGoBack={currentStep > 0}
      onBack={() => {
        setCurrentStep((step) => Math.max(0, step - 1))
        setCanPressCheck(false)
        setIsCorrect(false)
        setCheckFn(() => () => {})
      }}
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
