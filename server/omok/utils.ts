// eslint-disable-next-line import/prefer-default-export
export function extractPositions<T>(data: { position: T }[]) {
  return data.map(({ position }) => position);
}
