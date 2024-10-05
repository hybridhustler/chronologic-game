export async function loadPuzzle(date) {
  try {
    const puzzleModule = await import(`./puzzles/${date}.js`);
    return puzzleModule.default;
  } catch (error) {
    console.error(`Failed to load puzzle for date ${date}:`, error);
    return null;
  }
}