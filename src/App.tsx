import { useState } from 'react'
import LessonShell from './components/lesson/LessonShell'
import CompletionScreen from './components/steps/CompletionScreen'
import Step4TableWithCOP from './components/steps/Step4TableWithCOP'
import Step5Inverse from './components/steps/Step5Inverse'
import Step6WordProblem from './components/steps/Step6WordProblem'
import StepScaleBalance from './components/steps/StepScaleBalance'

function App() {
  const prompts = [
    'Balance the scale with 1 hexagon on the left.',
    'Now balance 2 hexagons on the left.',
    'Next: balance 3 hexagons on the left.',
    'Use the COP column to scale to 5 hexagons.',
    'Reverse the direction: go from trapezoids back to hexagons.',
    'Word problem: if there are 16 trapezoids, how many hexagons?',
  ]
  const [currentStep, setCurrentStep] = useState(0)
  const [canContinue, setCanContinue] = useState(false)

  const isComplete = currentStep >= prompts.length

  const advanceStep = () => {
    if (!isComplete) {
      setCurrentStep((step) => step + 1)
      setCanContinue(false)
    }
  }

  const renderStep = () => {
    if (currentStep === 0)
      return <StepScaleBalance hexCount={1} onReadyChange={setCanContinue} onCorrect={advanceStep} />
    if (currentStep === 1)
      return <StepScaleBalance hexCount={2} onReadyChange={setCanContinue} onCorrect={advanceStep} />
    if (currentStep === 2)
      return <StepScaleBalance hexCount={3} onReadyChange={setCanContinue} onCorrect={advanceStep} />
    if (currentStep === 3)
      return <Step4TableWithCOP onReadyChange={setCanContinue} onCorrect={advanceStep} />
    if (currentStep === 4) return <Step5Inverse onReadyChange={setCanContinue} onCorrect={advanceStep} />
    if (currentStep === 5) return <Step6WordProblem onReadyChange={setCanContinue} onCorrect={advanceStep} />
    return null
  }

  if (isComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <CompletionScreen
          onRestart={() => {
            setCurrentStep(0)
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
      prompt={prompts[currentStep]}
      canContinue={canContinue}
      onContinue={() => {
        if (canContinue) {
          advanceStep()
        }
      }}
    >
      {renderStep()}
    </LessonShell>
  )
}

export default App
