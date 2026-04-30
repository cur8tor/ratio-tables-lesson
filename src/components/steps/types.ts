export type ScaleControls = {
  canAddHex: boolean
  canAddTrap: boolean
  onAddHex: () => void
  onAddTrap: () => void
}

export type StepComponentProps = {
  onReadyChange: (ready: boolean) => void
  onCorrect: () => void
  onSubmitCheck?: () => void
  onCorrectChange?: (isCorrect: boolean) => void
  registerCheck?: (checkFn: () => boolean) => void
  registerScaleControls?: (controls: ScaleControls | null) => void
}
