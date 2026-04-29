type CompletionScreenProps = {
  onRestart: () => void
}

const CompletionScreen = ({ onRestart }: CompletionScreenProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-5 text-center">
      <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-accent/15 text-4xl">
        ✅
      </div>
      <h2 className="text-5xl font-semibold text-primary">Lesson complete!</h2>
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Total XP</p>
      <p className="text-7xl font-bold leading-none text-primary">
        125 <span className="align-top text-2xl text-accent">✦</span>
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-16 h-14 min-w-[300px] rounded-full bg-[#2F3136] px-8 text-2xl font-medium text-white transition hover:brightness-110 sm:min-w-[420px]"
      >
        Continue
      </button>
    </div>
  )
}

export default CompletionScreen
