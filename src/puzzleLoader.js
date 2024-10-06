import { format, parseISO, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const loadPuzzle = async (date) => {
  try {
    console.log(`Attempting to load puzzle for date: ${date}`);
    // Convert the date string to a Date object in EST
    const estDate = startOfDay(toZonedTime(parseISO(date), 'America/New_York'));
    // Format the date to match your file naming convention
    const formattedDate = format(estDate, 'yyyy-MM-dd');
    const puzzleModule = await import(`./puzzles/${formattedDate}.js`);
    const puzzle = puzzleModule.default;
    
    if (!puzzle) {
      throw new Error('Puzzle data is undefined or null');
    }
    
    console.log('Puzzle loaded successfully:', puzzle);
    return puzzle;
  } catch (error) {
    console.error(`Failed to load puzzle for date ${date}:`, error);
    throw error;
  }
};