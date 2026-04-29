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
  children: ReactNode
}

const LessonShell = ({
  step,
  total,
  prompt,
  canContinue,
  onContinue,
  children,
}: LessonShellProps) => {
  return (
    <div className="relative min-h-screen bg-bg text-primary">
      <ProgressBar step={step} total={total} />
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 pb-32 pt-12">
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
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <ContinueButton onClick={onContinue} disabled={!canContinue} />
      </div>
    </div>
  )
}

export default LessonShell
