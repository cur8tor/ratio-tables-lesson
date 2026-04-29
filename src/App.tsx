import { useState } from 'react'
import LessonShell from './components/lesson/LessonShell'
import CompletionScreen from './components/steps/CompletionScreen'
import Step1Concrete from './components/steps/Step1Concrete'
import Step2ConcreteScaled from './components/steps/Step2ConcreteScaled'
import Step3Table from './components/steps/Step3Table'
import Step4TableWithCOP from './components/steps/Step4TableWithCOP'
import Step5Inverse from './components/steps/Step5Inverse'
import Step6WordProblem from './components/steps/Step6WordProblem'

function App() {
  const prompts = [
    'A class kit has hexagons and trapezoids. Find the trapezoids-per-hexagon rule.',
    'Apply the same rule to a bigger set.',
    'Record the pattern in a ratio table.',
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
    if (currentStep === 0) return <Step1Concrete onReadyChange={setCanContinue} onCorrect={advanceStep} />
    if (currentStep === 1)
      return <Step2ConcreteScaled onReadyChange={setCanContinue} onCorrect={advanceStep} />
    if (currentStep === 2) return <Step3Table onReadyChange={setCanContinue} onCorrect={advanceStep} />
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
