export type StepComponentProps = {
  onReadyChange: (ready: boolean) => void
  onCorrect: () => void
  onCorrectChange?: (isCorrect: boolean) => void
  registerCheck?: (checkFn: () => void) => void
}
