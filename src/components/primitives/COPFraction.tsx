type COPFractionProps = {
  numerator: number
  denominator: number
  label: string
}

const COPFraction = ({ numerator, denominator, label }: COPFractionProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-center text-sm text-secondary">{label}</div>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-medium leading-none">{numerator}</span>
        <span className="my-1 h-px w-12 bg-accent/70" />
        <span className="text-4xl font-medium leading-none">{denominator}</span>
      </div>
    </div>
  )
}

export default COPFraction
