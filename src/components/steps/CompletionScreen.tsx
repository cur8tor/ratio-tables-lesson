type CompletionScreenProps = {
  onRestart: () => void
}

const CompletionScreen = ({ onRestart }: CompletionScreenProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 text-center">
      <h2 className="text-5xl font-semibold text-primary">Lesson complete!</h2>
      <button
        type="button"
        onClick={onRestart}
        className="h-14 min-w-[300px] rounded-full bg-[#2F3136] px-8 text-2xl font-medium text-white transition hover:brightness-110 sm:min-w-[420px]"
      >
        Continue
      </button>
    </div>
  )
}

export default CompletionScreen
