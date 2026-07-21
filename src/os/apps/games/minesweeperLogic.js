// Pure Minesweeper board logic — no React, no DOM, no Date.now(). The only
// randomness (mine placement) is injected via an `rng` parameter so callers
// (tests included) can swap in a deterministic generator; everything else
// here is a plain function of its arguments, easy to unit-test in isolation.

export const DIFFICULTIES = {
    beginner: { id: 'beginner', label: 'Beginner', cols: 9, rows: 9, mines: 10 },
    intermediate: { id: 'intermediate', label: 'Intermediate', cols: 16, rows: 16, mines: 40 },
    expert: { id: 'expert', label: 'Expert', cols: 30, rows: 16, mines: 99 },
};

export const FLAG = { NONE: 'none', FLAG: 'flag', QUESTION: 'question' };

const makeCell = () => ({ mine: false, revealed: false, flag: FLAG.NONE, adjacent: 0, wrongFlag: false });

export const createBoard = (cols, rows) => {
    const cells = new Array(cols * rows);
    for (let i = 0; i < cells.length; i++) cells[i] = makeCell();
    return cells;
};

export const indexOf = (col, row, cols) => row * cols + col;
export const colOf = (index, cols) => index % cols;
export const rowOf = (index, cols) => Math.floor(index / cols);

export const neighborsOf = (index, cols, rows) => {
    const col = colOf(index, cols);
    const row = rowOf(index, cols);
    const out = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const c = col + dc;
            const r = row + dr;
            if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
            out.push(indexOf(c, r, cols));
        }
    }
    return out;
};

// Recomputes `.adjacent` for every non-mine cell from scratch. Returns a NEW
// board array — never mutates the one passed in.
export const computeAdjacency = (board, cols, rows) =>
    board.map((cell, i) => {
        if (cell.mine) return cell;
        let count = 0;
        for (const n of neighborsOf(i, cols, rows)) if (board[n].mine) count++;
        return { ...cell, adjacent: count };
    });

// Places `mineCount` mines on a pristine `board`, never on `safeIndex` or its
// neighbors (so the first click always opens a little breathing room) unless
// the board is too small/dense to spare that whole zone, in which case it
// falls back to only sparing the clicked cell itself. Returns a NEW board
// with mines placed and adjacency counts filled in.
export const placeMines = (board, cols, rows, mineCount, safeIndex, rng = Math.random) => {
    const forbidden = new Set([safeIndex, ...neighborsOf(safeIndex, cols, rows)]);
    const total = cols * rows;

    let pool = [];
    for (let i = 0; i < total; i++) if (!forbidden.has(i)) pool.push(i);
    if (pool.length < mineCount) {
        pool = [];
        for (let i = 0; i < total; i++) if (i !== safeIndex) pool.push(i);
    }

    const mines = new Set();
    const bag = pool.slice();
    for (let i = 0; i < mineCount && bag.length > 0; i++) {
        const pick = Math.floor(rng() * bag.length);
        mines.add(bag[pick]);
        bag.splice(pick, 1);
    }

    const withMines = board.map((cell, i) => ({ ...cell, mine: mines.has(i) }));
    return computeAdjacency(withMines, cols, rows);
};

// Flood-fill reveal starting at `index`: opens the contiguous region of
// zero-adjacency cells plus the single ring of numbered cells bordering it.
// Never reveals flagged cells (classic behavior — unflag first) or mines.
// Returns a NEW board array.
export const floodFill = (board, cols, rows, index) => {
    const next = board.map((cell) => ({ ...cell }));
    const stack = [index];
    const seen = new Set();
    while (stack.length) {
        const i = stack.pop();
        if (seen.has(i)) continue;
        seen.add(i);
        const cell = next[i];
        if (!cell || cell.flag !== FLAG.NONE || cell.revealed || cell.mine) continue;
        cell.revealed = true;
        if (cell.adjacent === 0) {
            for (const n of neighborsOf(i, cols, rows)) if (!seen.has(n)) stack.push(n);
        }
    }
    return next;
};

// Reveals a single cell. No-ops on flagged/already-revealed cells (matches
// classic behavior — a left click on a flagged cell does nothing). Zero
// cells cascade via floodFill; mines report `hitMine: true`.
export const revealCell = (board, cols, rows, index) => {
    const cell = board[index];
    if (!cell || cell.revealed || cell.flag !== FLAG.NONE) return { board, hitMine: false };
    if (cell.mine) {
        const next = board.map((c, i) => (i === index ? { ...c, revealed: true } : c));
        return { board: next, hitMine: true };
    }
    if (cell.adjacent === 0) return { board: floodFill(board, cols, rows, index), hitMine: false };
    const next = board.map((c, i) => (i === index ? { ...c, revealed: true } : c));
    return { board: next, hitMine: false };
};

// Chord: if a revealed numbered cell's flagged-neighbor count already
// matches its number, reveal all of its remaining unflagged neighbors.
export const chordReveal = (board, cols, rows, index) => {
    const cell = board[index];
    if (!cell || !cell.revealed || cell.mine || cell.adjacent === 0) return { board, hitMine: false };
    const neighbors = neighborsOf(index, cols, rows);
    const flagged = neighbors.filter((n) => board[n].flag === FLAG.FLAG).length;
    if (flagged !== cell.adjacent) return { board, hitMine: false };

    let current = board;
    let hitMine = false;
    for (const n of neighbors) {
        if (current[n].flag !== FLAG.NONE || current[n].revealed) continue;
        const result = revealCell(current, cols, rows, n);
        current = result.board;
        if (result.hitMine) hitMine = true;
    }
    return { board: current, hitMine };
};

// none -> flag -> question -> none. No-ops on already-revealed cells.
export const cycleFlag = (board, index) => {
    const cell = board[index];
    if (!cell || cell.revealed) return board;
    const order = [FLAG.NONE, FLAG.FLAG, FLAG.QUESTION];
    const next = order[(order.indexOf(cell.flag) + 1) % order.length];
    return board.map((c, i) => (i === index ? { ...c, flag: next } : c));
};

export const countFlags = (board) => board.reduce((n, c) => n + (c.flag === FLAG.FLAG ? 1 : 0), 0);

// Win the moment every non-mine cell is revealed — flags are irrelevant.
export const isWin = (board, mineCount) => {
    let revealedSafe = 0;
    for (const cell of board) if (cell.revealed && !cell.mine) revealedSafe++;
    return revealedSafe === board.length - mineCount;
};

export const revealAllMines = (board) => board.map((c) => (c.mine ? { ...c, revealed: true } : c));

export const markWrongFlags = (board) => board.map((c) => (!c.mine && c.flag === FLAG.FLAG ? { ...c, wrongFlag: true } : c));

export const autoFlagRemaining = (board) => board.map((c) => (c.mine && c.flag !== FLAG.FLAG ? { ...c, flag: FLAG.FLAG } : c));
