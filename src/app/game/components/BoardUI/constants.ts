export const PIXEL_OFFSET = 0.5;
export const CONFIG = {
  COLOR: {
    BOARD: '#caab93',
    DOT: '#333',
    LINE: '#333',
    GEUMSU: 'rgba(200, 0, 0, 0.8)',
    HIGHLIGHT: { FILL: 'green', STROKE: 'black' },
  },
  SIZE: { DOT: 2, GEUMSU: 3 },
  LINE_WIDTH: { STONE: 1, BOARD: 2, GEUMSU: 3, HIGHLIGHT: 1 },
  BOARD: {
    WIDTH: 500,
    HEIGHT: 500,
    SIZE: 14,
    PADDING: 50,
  },
  RATIO: 2,
} as const;
export const CANVAS = {
  WIDTH: (CONFIG.BOARD.WIDTH + 2 * CONFIG.BOARD.PADDING) * CONFIG.RATIO,
  HEIGHT: (CONFIG.BOARD.HEIGHT + 2 * CONFIG.BOARD.PADDING) * CONFIG.RATIO,
};
