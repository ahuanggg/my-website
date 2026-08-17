import {
    DIFFICULTIES,
    FLAG,
    createBoard,
    neighborsOf,
    computeAdjacency,
    placeMines,
    floodFill,
    revealCell,
    chordReveal,
    cycleFlag,
    countFlags,
    isWin,
} from './minesweeperLogic';

// Builds a board with mines at exact, known indexes (no randomness) so tests
// can assert on precise cell layouts instead of just statistical properties.
const buildBoard = (cols, rows, mineIndexes) => {
    const mines = new Set(mineIndexes);
    const board = createBoard(cols, rows).map((c, i) => ({ ...c, mine: mines.has(i) }));
    return computeAdjacency(board, cols, rows);
};

test('placeMines seeds exactly the requested number of mines', () => {
    const { cols, rows, mines } = DIFFICULTIES.beginner;
    const board = placeMines(createBoard(cols, rows), cols, rows, mines, 0);
    expect(board.filter((c) => c.mine).length).toBe(mines);
});

test('placeMines never mines the clicked cell (first click is always safe)', () => {
    const cols = 9;
    const rows = 9;
    const safeIndex = 40; // center of a 9x9 board
    // run a few times since placement is randomized
    for (let i = 0; i < 20; i++) {
        const board = placeMines(createBoard(cols, rows), cols, rows, 10, safeIndex);
        expect(board[safeIndex].mine).toBe(false);
    }
});

test('placeMines also spares the clicked cell\'s neighbors when the board has room', () => {
    const cols = 9;
    const rows = 9;
    const safeIndex = 40;
    const board = placeMines(createBoard(cols, rows), cols, rows, 10, safeIndex);
    neighborsOf(safeIndex, cols, rows).forEach((n) => expect(board[n].mine).toBe(false));
});

test('placeMines falls back to sparing only the clicked cell on a tiny/dense board', () => {
    // 3x3 board, 8 mines requested — the clicked cell's "neighbor zone" is
    // literally the whole board, so it's impossible to also spare neighbors.
    const cols = 3;
    const rows = 3;
    const safeIndex = 4; // center — its neighbors are the other 8 cells
    const board = placeMines(createBoard(cols, rows), cols, rows, 8, safeIndex);
    expect(board[safeIndex].mine).toBe(false);
    expect(board.filter((c) => c.mine).length).toBe(8);
});

test('floodFill opens a contiguous zero region plus its numbered border, and no further', () => {
    // 4x4 board, single mine tucked in the bottom-right corner (index 15).
    // Clicking the opposite corner should open every other cell.
    const cols = 4;
    const rows = 4;
    const board = buildBoard(cols, rows, [15]);
    const filled = floodFill(board, cols, rows, 0);
    filled.forEach((cell, i) => {
        if (i === 15) expect(cell.revealed).toBe(false); // the mine stays hidden
        else expect(cell.revealed).toBe(true);
    });
});

test('floodFill reveals the numbered cells bordering the zero region but does not cascade past them', () => {
    const cols = 4;
    const rows = 4;
    const board = buildBoard(cols, rows, [15]);
    const filled = floodFill(board, cols, rows, 0);
    // the three cells bordering the mine are numbered ("1"s), not zeros
    [10, 11, 14].forEach((i) => {
        expect(filled[i].revealed).toBe(true);
        expect(filled[i].adjacent).toBe(1);
    });
});

test('floodFill does not cross a flagged cell', () => {
    const cols = 4;
    const rows = 4;
    let board = buildBoard(cols, rows, [15]);
    board = cycleFlag(board, 5); // flag a zero cell inside the open region
    const filled = floodFill(board, cols, rows, 0);
    expect(filled[5].revealed).toBe(false);
    expect(filled[5].flag).toBe(FLAG.FLAG);
});

test('isWin is false while any non-mine cell is still hidden, true once they are all revealed', () => {
    const cols = 3;
    const rows = 3;
    const board = buildBoard(cols, rows, [0]);
    expect(isWin(board, 1)).toBe(false);
    const allRevealed = board.map((c, i) => (i === 0 ? c : { ...c, revealed: true }));
    expect(isWin(allRevealed, 1)).toBe(true);
});

test('isWin ignores flags — a flagged-but-unrevealed safe cell still blocks the win', () => {
    const cols = 3;
    const rows = 3;
    let board = buildBoard(cols, rows, [0]);
    board = board.map((c, i) => (i === 0 || i === 1 ? c : { ...c, revealed: true }));
    board = cycleFlag(board, 1); // flagged, not revealed
    expect(isWin(board, 1)).toBe(false);
});

test('chordReveal only opens neighbors once the flag count matches the cell number', () => {
    // 3x3, single mine at index 0. Cell 1 borders only that mine, so it's a "1".
    const cols = 3;
    const rows = 3;
    let board = buildBoard(cols, rows, [0]);
    board = revealCell(board, cols, rows, 1).board;
    expect(board[1].adjacent).toBe(1);

    // no flags yet — chord is a no-op
    let result = chordReveal(board, cols, rows, 1);
    expect(result.hitMine).toBe(false);
    expect(result.board.filter((c) => c.revealed).length).toBe(1);

    // flag the mine, then chord — every other neighbor should open
    board = cycleFlag(board, 0);
    result = chordReveal(board, cols, rows, 1);
    expect(result.hitMine).toBe(false);
    neighborsOf(1, cols, rows).forEach((n) => {
        if (n !== 0) expect(result.board[n].revealed).toBe(true);
    });
});

test('chordReveal explodes if a flag was on the wrong cell', () => {
    // 3x3, mine at index 0. Flag a SAFE neighbor of cell 1 instead of the
    // real mine — the flag count still matches the "1", so chording detonates it.
    const cols = 3;
    const rows = 3;
    let board = buildBoard(cols, rows, [0]);
    board = revealCell(board, cols, rows, 1).board;
    board = cycleFlag(board, 2); // wrong flag — index 2 is safe
    const result = chordReveal(board, cols, rows, 1);
    expect(result.hitMine).toBe(true);
    expect(result.board[0].revealed).toBe(true); // the real mine got opened
});

test('cycleFlag cycles none -> flag -> question -> none and no-ops on revealed cells', () => {
    let board = createBoard(3, 3);
    board = cycleFlag(board, 0);
    expect(board[0].flag).toBe(FLAG.FLAG);
    expect(countFlags(board)).toBe(1);
    board = cycleFlag(board, 0);
    expect(board[0].flag).toBe(FLAG.QUESTION);
    board = cycleFlag(board, 0);
    expect(board[0].flag).toBe(FLAG.NONE);
    expect(countFlags(board)).toBe(0);

    const revealed = revealCell(buildBoard(3, 3, []), 3, 3, 0).board;
    expect(cycleFlag(revealed, 0)).toBe(revealed); // unchanged — cell is revealed
});
