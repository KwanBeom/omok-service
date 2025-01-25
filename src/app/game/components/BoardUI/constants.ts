const BOARD_PADDING_RATIO = 8;
// TODO: 344px이 zfold 사이즈인데, padding까지 포함해서 344로 수렴해야 함.
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
  PADDING_RATIO: 8,
  BOARD: {
    MIN_WIDTH: 344,
    WIDTH: 400,
    HEIGHT: 400,
    SIZE: 14,
    PADDING: 400 / BOARD_PADDING_RATIO,
  },
  RATIO: 2,
} as const;

export const CANVAS = {
  MIN_WIDTH:
    (CONFIG.BOARD.MIN_WIDTH + (2 * CONFIG.BOARD.MIN_WIDTH) / BOARD_PADDING_RATIO) * CONFIG.RATIO,
  WIDTH: (CONFIG.BOARD.WIDTH + 2 * CONFIG.BOARD.PADDING) * CONFIG.RATIO,
  HEIGHT: (CONFIG.BOARD.HEIGHT + 2 * CONFIG.BOARD.PADDING) * CONFIG.RATIO,
};
console.log(CANVAS.MIN_WIDTH); // 얘는 344 * 2 = 688이 되어야 함

export const calculateCanvasSize = () =>
  CONFIG.BOARD.WIDTH + 2 * CONFIG.BOARD.PADDING * CONFIG.RATIO;
