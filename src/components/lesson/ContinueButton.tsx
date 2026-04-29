type ContinueButtonProps = {
  onClick: () => void
  disabled: boolean
  success?: boolean
  label?: string
}

const ContinueButton = ({ onClick, disabled, success = false, label = 'Check' }: ContinueButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-14 min-w-[300px] rounded-full px-8 text-2xl font-medium text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:bg-secondary/40 disabled:text-white/60 sm:min-w-[420px] ${
        success ? 'bg-accent' : 'bg-[#2F3136]'
      }`}
    >
      {label}
    </button>
  )
}

export default ContinueButton
