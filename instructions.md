# Sudoku

A single-page sudoku with a pink flow-field background and a Tao Te Ching chapter shown on completion.

## Requirements

- Any modern browser (Chrome, Safari, Firefox, Edge).
- A way to run a tiny local web server. The app uses ES modules and `fetch()` for the chapter files, so opening `index.html` directly with `file://` will not work — you need `http://`.

## Start the website

From inside the `sudoku/` folder, pick one:

### Option 1 — Python (already on macOS and Linux)

```
python3 -m http.server 8000
```

Then open: http://localhost:8000

### Option 2 — Node.js

```
npx serve
```

It will print a local URL (usually `http://localhost:3000`).

### Option 3 — VS Code

Install the **Live Server** extension, then right-click `index.html` → **Open with Live Server**.

## Stop the website

### If the terminal is still running the server (foreground)

Press `Ctrl + C` in that terminal.

### If you started it in the background or lost the terminal

Find and kill whatever is using the port:

```
lsof -ti:8000 | xargs kill -9
```

(Replace `8000` with `3000` if you used `npx serve`.)

## How to play

- Pick a difficulty on the welcome screen (easy / medium / hard / expert).
- Click a cell, then tap a number on the pad above the grid or press `1`–`9` on the keyboard.
- Click a small ghost number inside an empty cell to toggle a pencil mark.
- Wrong digits pulse white and leave a small pink dot in the corner until corrected.
- `pause` hides the board; `restart` clears your progress on the current puzzle.
- Top-left: `normal` / `zen` — zen goes fullscreen; `normal` or `Esc` exits.
- Finish the puzzle to see a random Tao Te Ching chapter.
