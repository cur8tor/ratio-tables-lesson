export type TrapezoidDirection = 'up' | 'down'

const SQRT_THREE_OVER_TWO = Math.sqrt(3) / 2

export const hexagonPoints = (size: number): [number, number][] => {
  const h = size * SQRT_THREE_OVER_TWO
  return [
    [size, 0],
    [size / 2, -h],
    [-size / 2, -h],
    [-size, 0],
    [-size / 2, h],
    [size / 2, h],
  ]
}

export const trapezoidPoints = (
  size: number,
  direction: TrapezoidDirection,
): [number, number][] => {
  const h = size * SQRT_THREE_OVER_TWO
  if (direction === 'down') {
    return [
      [-size, 0],
      [size, 0],
      [size / 2, h],
      [-size / 2, h],
    ]
  }

  return [
    [size, 0],
    [size / 2, -h],
    [-size / 2, -h],
    [-size, 0],
  ]
}

export const pointsToString = (points: [number, number][]): string =>
  points.map(([x, y]) => `${x},${y}`).join(' ')
