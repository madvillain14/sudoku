# Sudoku

A minimal, single-page sudoku game with a pink flow-field background and a Tao Te Ching chapter shown on completion.

**Play it here:** https://madvillain14.github.io/sudoku/

No build step, no dependencies — just static HTML, CSS, and vanilla JS.

## Features

- Four difficulty levels: easy, medium, hard, expert
- Pencil marks (candidate digits)
- Keyboard controls: `1`–`9` to place, arrow keys to move, `Backspace` to clear
- Mistake tracking and limited hints
- Normal / zen (fullscreen) modes
- Pause with a 3D "sink into the screen" effect
- Win animation that dissolves the grid and reveals a Tao Te Ching chapter letter by letter

## Playing

1. Pick a difficulty on the welcome screen.
2. Click a cell (or use arrow keys) and type a number, or tap the number pad.
3. Click a small ghost number inside an empty cell to toggle a pencil mark.
4. Solve the board to see a random chapter of the Tao Te Ching.

## Running locally

Because the app uses ES modules and `fetch()`, opening `index.html` directly with `file://` will not work. Use any static server, e.g.:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

More detailed local-run instructions are in [instructions.md](instructions.md).

## Project structure

```
index.html        app, styles, and game logic
animations.js     background flow-field animation
taoTeChing/       81 chapters of the Tao Te Ching (Stephen Mitchell translation)
```

## Credits

- Tao Te Ching translation: Stephen Mitchell.
- Background animation inspired by Chapter 39 ("FlowingPattern") of *The Way of Code*.
