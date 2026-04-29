type ContinueButtonProps = {
  onClick: () => void
  disabled: boolean
}

const ContinueButton = ({ onClick, disabled }: ContinueButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-12 min-w-48 rounded-xl bg-accent px-6 text-base font-medium text-slate-900 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:bg-secondary/40 disabled:text-primary/50"
    >
      Continue
    </button>
  )
}

export default ContinueButton
