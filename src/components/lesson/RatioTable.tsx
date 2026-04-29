import Hexagon from '../primitives/Hexagon'
import NumberInput, { type InputStatus } from '../primitives/NumberInput'
import Trapezoid from '../primitives/Trapezoid'

type ShapeCell = { kind: 'shape'; shape: 'hex' | 'trap'; count: number }
type NumberCell = { kind: 'number'; value: number }
type FractionCell = {
  kind: 'fraction'
  top: number
  bottom: number
}
type InputCell = {
  kind: 'input'
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  status: InputStatus
  correct: number
}

export type Cell = ShapeCell | NumberCell | InputCell | FractionCell
export type Row = { hex: Cell; cop: Cell; trap: Cell }

type RatioTableProps = {
  rows: Row[]
}

const renderShapeCell = (shape: 'hex' | 'trap', count: number) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {Array.from({ length: count }).map((_, index) =>
        shape === 'hex' ? (
          <Hexagon key={index} size={10} fill="#FFD63B" className="h-5 w-5" />
        ) : (
          <Trapezoid
            key={index}
            size={10}
            fit="tight"
            direction={index % 2 === 0 ? 'up' : 'down'}
            className="h-3 w-5"
          />
        ),
      )}
    </div>
  )
}

const renderCell = (cell: Cell) => {
  if (cell.kind === 'shape') {
    return renderShapeCell(cell.shape, cell.count)
  }

  if (cell.kind === 'number') {
    return <span className="text-lg text-primary">{cell.value}</span>
  }

  if (cell.kind === 'fraction') {
    return (
      <div className="mx-auto flex w-16 flex-col items-center">
        <div className="mb-1 h-8 w-10 rounded-md border border-secondary/30 bg-white text-center text-base leading-8 text-primary">
          {cell.top}
        </div>
        <div className="h-px w-10 bg-secondary/40" />
        <div className="mt-1 h-8 w-10 rounded-md border border-secondary/30 bg-white text-center text-base leading-8 text-primary">
          {cell.bottom}
        </div>
      </div>
    )
  }

  return (
    <NumberInput
      value={cell.value}
      onChange={cell.onChange}
      onSubmit={cell.onSubmit}
      status={cell.status}
      placeholder="?"
      className="h-10 w-20 text-lg"
      ariaLabel="ratio table input"
    />
  )
}

const RatioTable = ({ rows }: RatioTableProps) => {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-secondary/20 bg-surface">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-secondary/20">
            <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
              Hexagons
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
              COP
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-secondary">
              Trapezoids
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-secondary/15 last:border-none">
              <td className="h-16 px-4 py-2 text-center">{renderCell(row.hex)}</td>
              <td className="h-16 px-4 py-2 text-center">{renderCell(row.cop)}</td>
              <td className="h-16 px-4 py-2 text-center">{renderCell(row.trap)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RatioTable
