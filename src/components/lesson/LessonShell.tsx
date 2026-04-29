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
  onContinue: () => void
  onBack: () => void
  canGoBack: boolean
  buttonLabel?: string
  children: ReactNode
}

const LessonShell = ({
  step,
  total,
  prompt,
  canContinue,
  onContinue,
  onBack,
  canGoBack,
  buttonLabel,
  children,
}: LessonShellProps) => {
  return (
    <div className="relative min-h-screen bg-bg text-primary">
      <ProgressBar step={step} total={total} onBack={onBack} canGoBack={canGoBack} />
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
      <div className="fixed bottom-0 left-0 right-0 border-t border-secondary/20 bg-white/95 py-3 backdrop-blur">
        <div className="flex justify-center">
          <ContinueButton onClick={onContinue} disabled={!canContinue} label={buttonLabel} />
        </div>
      </div>
    </div>
  )
}

export default LessonShell
