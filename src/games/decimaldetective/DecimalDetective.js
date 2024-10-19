import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const generateDailyNumber = () => {
  const today = format(new Date(), 'yyyyMMdd');
  const seed = parseInt(today, 10);
  const rng = (seed) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  return Number((rng(seed) * 99 + 1).toFixed(2));
};

const getColorForGuess = (guess, answer) => {
  const diff = Math.abs(guess - answer);
  if (diff > 10) return 'bg-red-500';
  if (diff > 1) return 'bg-orange-500';
  return 'bg-green-500';
};

const DecimalDetective = () => {
  const [dailyNumber, setDailyNumber] = useState(generateDailyNumber());
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [hintCount, setHintCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGiveUpDialog, setShowGiveUpDialog] = useState(false);

  useEffect(() => {
    setDailyNumber(generateDailyNumber());
  }, []);

  const handleGuess = () => {
    const guessNumber = Number(currentGuess);
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
      alert('Please enter a valid number between 1 and 100');
      return;
    }
    
    const newGuesses = [...guesses, guessNumber];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (guessNumber.toFixed(2) === dailyNumber.toFixed(2)) {
      setGameOver(true);
    } else if (newGuesses.length >= 20) {
      setShowGiveUpDialog(true);
    }
  };

  const handleHint = () => {
    const lastGuess = guesses[guesses.length - 1] || 50;
    const hintNumber = lastGuess + (dailyNumber - lastGuess) / 2;
    setCurrentGuess(hintNumber.toFixed(2));
    setHintCount(hintCount + 1);
  };

  const handleGiveUp = () => {
    setGameOver(true);
    setShowGiveUpDialog(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const sortedGuesses = [...guesses].sort((a, b) => 
    Math.abs(a - dailyNumber) - Math.abs(b - dailyNumber)
  );

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Decimal Detective</h1>
      <div className="mb-4">
        <input
          type="number"
          step="0.01"
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={gameOver}
          placeholder="Enter your guess (1-100)"
          className="w-full p-2 border rounded"
          autoFocus
        />
      </div>
      <div className="flex space-x-2 mb-4">
        <button onClick={handleGuess} disabled={gameOver} className="px-4 py-2 bg-blue-500 text-white rounded">Guess</button>
        <button onClick={handleHint} disabled={gameOver} className="px-4 py-2 bg-blue-500 text-white rounded">Hint</button>
        <button onClick={() => alert("Guess the daily number between 1 and 100 with 2 decimal places. The color of your guess indicates how close you are: red (far), orange (closer), green (very close). Try to solve it in 20 guesses or less!")} className="px-4 py-2 bg-gray-500 text-white rounded">How to Play</button>
      </div>
      <div className="mb-4">
        <p>Guesses: {guesses.length} | Hints: {hintCount}</p>
      </div>
      <div className="space-y-2">
        {sortedGuesses.map((guess, index) => (
          <div
            key={index}
            className={`p-2 rounded text-white ${getColorForGuess(guess, dailyNumber)}`}
          >
            {guess.toFixed(2)}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <h2 className="font-bold">Game Over!</h2>
          <p>
            {guesses[guesses.length - 1].toFixed(2) === dailyNumber.toFixed(2) 
              ? `Congratulations! You found the number in ${guesses.length} guesses.`
              : `The correct number was ${dailyNumber.toFixed(2)}.`}
          </p>
        </div>
      )}
      {showGiveUpDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h2 className="font-bold mb-2">20 Guesses Reached</h2>
            <p className="mb-4">You've made 20 guesses. Would you like to give up or continue playing?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowGiveUpDialog(false)} className="px-4 py-2 bg-blue-500 text-white rounded">Continue</button>
              <button onClick={handleGiveUp} className="px-4 py-2 bg-red-500 text-white rounded">Give Up</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecimalDetective;