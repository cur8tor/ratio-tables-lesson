import { useState } from 'react'
import LessonShell from './components/lesson/LessonShell'
import CompletionScreen from './components/steps/CompletionScreen'
import Step1Concrete from './components/steps/Step1Concrete'
import Step2ConcreteScaled from './components/steps/Step2ConcreteScaled'
import Step3Table from './components/steps/Step3Table'
import Step4TableWithCOP from './components/steps/Step4TableWithCOP'
import Step5Inverse from './components/steps/Step5Inverse'

const PROMPTS = [
  'A teacher needs a quick rule for pattern block kits. What is the number of trapezoids per hexagon?',
  'Use that rule to find the total trapezoids for this larger set.',
  'Fill in the table.',
  'How many trapezoids do 5 hexagons need?',
  'If you used 14 trapezoids, how many hexagons did you fill?',
]

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [canContinue, setCanContinue] = useState(false)

  const isComplete = currentStep >= PROMPTS.length

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
      total={PROMPTS.length}
      prompt={PROMPTS[currentStep]}
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
