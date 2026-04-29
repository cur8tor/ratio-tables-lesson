import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import ContinueButton from './ContinueButton'
import ProgressBar from './ProgressBar'
import QuestionPrompt from './QuestionPrompt'

type LessonShellProps = {
  step: number
  total: number
  prompt: string
  canContinue: boolean
  isCorrect: boolean
  onContinue: () => void
  onBack: () => void
  onForward: () => void
  canGoBack: boolean
  canGoForward: boolean
  cfuStatuses: Array<boolean | null>
  buttonLabel?: string
  buttonWarning?: boolean
  children: ReactNode
}

const LessonShell = ({
  step,
  total,
  prompt,
  canContinue,
  isCorrect,
  onContinue,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
  cfuStatuses,
  buttonLabel,
  buttonWarning = false,
  children,
}: LessonShellProps) => {
  return (
    <div className="relative min-h-screen bg-bg text-primary">
      <ProgressBar
        step={step}
        total={total}
        onBack={onBack}
        onForward={onForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        cfuStatuses={cfuStatuses}
      />
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-4 pb-36 pt-20">
        <div className="w-full space-y-8">
          <QuestionPrompt text={prompt} />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex w-full justify-center"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <div
        className={`fixed bottom-0 left-0 right-0 border-t py-3 backdrop-blur ${
          isCorrect ? 'border-accent/30 bg-accent/15' : 'border-secondary/20 bg-white/95'
        }`}
      >
        <div className="flex justify-center">
          <ContinueButton
            onClick={onContinue}
            disabled={!canContinue}
            success={isCorrect}
            warning={buttonWarning}
            label={buttonLabel}
          />
        </div>
      </div>
    </div>
  )
}

export default LessonShell
