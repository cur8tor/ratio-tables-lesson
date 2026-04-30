type ContinueButtonProps = {
  onClick: () => void
  disabled: boolean
  success?: boolean
  warning?: boolean
  label?: string
  ariaLabel?: string
}

const ContinueButton = ({
  onClick,
  disabled,
  success = false,
  warning = false,
  label = 'Check',
  ariaLabel = 'Check',
}: ContinueButtonProps) => {
  const bgClass = success ? 'bg-accent' : warning ? 'bg-[#EAB308]' : 'bg-[#2F3136]'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`h-14 min-w-[180px] rounded-full px-6 text-2xl font-medium text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:bg-secondary/40 disabled:text-white/60 sm:min-w-[420px] sm:px-8 ${bgClass}`}
    >
      {label}
    </button>
  )
}

export default ContinueButton
