type CompletionScreenProps = {
  onRestart: () => void
}

const CompletionScreen = ({ onRestart }: CompletionScreenProps) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-3xl font-semibold text-primary">Nice work.</h2>
      <p className="max-w-lg text-base text-secondary">
        You used the constant of proportionality (2/1) to scale a ratio in both
        directions.
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-4 rounded-xl border border-accent/50 px-6 py-3 text-sm font-medium text-accent transition hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        Restart lesson
      </button>
    </div>
  )
}

export default CompletionScreen
