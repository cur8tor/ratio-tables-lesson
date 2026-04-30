export type StepComponentProps = {
  onReadyChange: (ready: boolean) => void
  onCorrect: () => void
  onSubmitCheck?: () => void
  onCorrectChange?: (isCorrect: boolean) => void
  registerCheck?: (checkFn: () => boolean) => void
}
