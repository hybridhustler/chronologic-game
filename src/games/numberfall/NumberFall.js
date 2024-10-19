import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Play, Pause } from 'lucide-react';

const BOARD_WIDTH = 5;
const BOARD_HEIGHT = 10;
const INITIAL_FALL_SPEED = 1000; // 1 second

const NumberFall = () => {
  const [board, setBoard] = useState(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
  const [currentNumber, setCurrentNumber] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ row: 0, col: Math.floor(BOARD_WIDTH / 2) });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [fallSpeed, setFallSpeed] = useState(INITIAL_FALL_SPEED);

  const generateNumber = useCallback(() => Math.floor(Math.random() * 9) + 1, []);

  const moveNumber = useCallback((direction) => {
    if (isPaused || isGameOver) return;
    setCurrentPosition(prev => ({
      ...prev,
      col: Math.max(0, Math.min(BOARD_WIDTH - 1, prev.col + direction))
    }));
  }, [isPaused, isGameOver]);

  const checkRowSum = useCallback((row) => {
    const sum = row.reduce((acc, num) => acc + (num || 0), 0);
    if (sum >= 25) {
      setScore(prevScore => prevScore + sum);
      return true;
    }
    return false;
  }, []);

  const clearFullRows = useCallback(() => {
    let newBoard = [...board];
    let rowsCleared = 0;

    for (let i = BOARD_HEIGHT - 1; i >= 0; i--) {
      if (newBoard[i].every(cell => cell !== null)) {
        if (checkRowSum(newBoard[i])) {
          newBoard.splice(i, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(null));
          rowsCleared++;
        }
      }
    }

    if (rowsCleared > 0) {
      setBoard(newBoard);
      setFallSpeed(prev => Math.max(100, prev - rowsCleared * 50)); // Increase speed for every row cleared
    }
  }, [board, checkRowSum]);

  const placeNumber = useCallback(() => {
    if (board[currentPosition.row][currentPosition.col] !== null) {
      setIsGameOver(true);
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[currentPosition.row][currentPosition.col] = currentNumber;
    setBoard(newBoard);
    clearFullRows();
    setCurrentNumber(generateNumber());
    setCurrentPosition({ row: 0, col: Math.floor(BOARD_WIDTH / 2) });
  }, [board, currentNumber, currentPosition, clearFullRows, generateNumber]);

  const gameLoop = useCallback(() => {
    if (isPaused || isGameOver) return;

    if (currentPosition.row === BOARD_HEIGHT - 1 || board[currentPosition.row + 1][currentPosition.col] !== null) {
      placeNumber();
    } else {
      setCurrentPosition(prev => ({ ...prev, row: prev.row + 1 }));
    }
  }, [currentPosition, board, isPaused, isGameOver, placeNumber]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') moveNumber(-1);
      if (e.key === 'ArrowRight') moveNumber(1);
      if (e.key === 'ArrowDown') gameLoop();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveNumber, gameLoop]);

  useEffect(() => {
    if (!currentNumber) setCurrentNumber(generateNumber());
    const intervalId = setInterval(gameLoop, fallSpeed);
    return () => clearInterval(intervalId);
  }, [currentNumber, generateNumber, gameLoop, fallSpeed]);

  const restartGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
    setCurrentNumber(generateNumber());
    setCurrentPosition({ row: 0, col: Math.floor(BOARD_WIDTH / 2) });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFallSpeed(INITIAL_FALL_SPEED);
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 to-pink-500 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4">NumberFall</h1>
        <div className="mb-4 text-center">
          <span className="text-2xl font-bold text-purple-600">Score: {score}</span>
        </div>
        <div className="grid grid-cols-5 gap-1 mb-4">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-10 h-10 flex items-center justify-center text-xl font-bold border ${
                  cell === null ? 'border-gray-200' : 'border-purple-500 bg-purple-100'
                } ${
                  rowIndex === currentPosition.row && colIndex === currentPosition.col && !isGameOver
                    ? 'bg-pink-300'
                    : ''
                }`}
              >
                {rowIndex === currentPosition.row && colIndex === currentPosition.col && !isGameOver
                  ? currentNumber
                  : cell}
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => moveNumber(-1)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            ←
          </button>
          <button
            onClick={() => moveNumber(1)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            →
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
        </div>
        {isGameOver && (
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p className="mb-4">Your final score: {score}</p>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded hover:from-purple-600 hover:to-pink-600 transition"
            >
              <RefreshCw className="inline mr-2" size={20} />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberFall;