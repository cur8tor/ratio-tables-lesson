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
    'Complete the first table row.',
  ]
  const [currentStep, setCurrentStep] = useState(0)
  const [scalePhase, setScalePhase] = useState<0 | 1 | 2>(0)
  const [canContinue, setCanContinue] = useState(false)

  const isComplete = currentStep >= prompts.length

  const advanceStep = () => {
    if (!isComplete) {
      setCurrentStep((step) => step + 1)
      setCanContinue(false)
    }
  }

  const renderStep = () => {
    if (currentStep === 0) return <StepIntroGoal onReadyChange={setCanContinue} onCorrect={advanceStep} />
    if (currentStep === 1)
      return <StepScaleBalance phase={scalePhase} onReadyChange={setCanContinue} onCorrect={advanceStep} />
    if (currentStep === 2) return <StepTableStarter onReadyChange={setCanContinue} onCorrect={advanceStep} />
    return null
  }

  const currentPrompt =
    currentStep === 1
      ? scalePhase === 0
        ? 'Balance 1 hexagon.'
        : scalePhase === 1
          ? 'Balance 2 hexagons.'
          : 'Create your own different balanced hanger.'
      : prompts[currentStep]

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <CompletionScreen
          onRestart={() => {
            setCurrentStep(0)
            setScalePhase(0)
            setCanContinue(false)
          }}
        />
      </div>
    )
  }

  return (
    <LessonShell
      step={currentStep + 1}
      total={prompts.length}
      prompt={currentPrompt}
      canContinue={canContinue}
      canGoBack={currentStep > 0}
      onBack={() => {
        setCurrentStep((step) => {
          const nextStep = Math.max(0, step - 1)
          if (nextStep < 1) {
            setScalePhase(0)
          }
          return nextStep
        })
        setCanContinue(false)
      }}
      buttonLabel={currentStep === 0 ? 'Start' : 'Next'}
      onContinue={() => {
        if (canContinue) {
          if (currentStep === 1 && scalePhase < 2) {
            setScalePhase((phase) => (phase + 1) as 0 | 1 | 2)
            setCanContinue(false)
            return
          }
          advanceStep()
        }
      }}
    >
      {renderStep()}
    </LessonShell>
  )
}

export default App
