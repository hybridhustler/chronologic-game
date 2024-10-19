import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, HelpCircle, Clock } from 'lucide-react';

// Mock database - in a real app, this would be fetched from a server
const wordDatabase = [
  { word: "Mail", acceptedRetronyms: ["Snail mail", "Physical mail"] },
  { word: "Guitar", acceptedRetronyms: ["Acoustic guitar"] },
  { word: "Phone", acceptedRetronyms: ["Landline", "Analog phone"] },
  { word: "Television", acceptedRetronyms: ["Analog television", "Standard-definition television"] },
  { word: "Book", acceptedRetronyms: ["Paper book", "Physical book"] },
];

const RetronymRiddles = () => {
  const [currentWord, setCurrentWord] = useState({});
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    getNewWord();
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver]);

  const getNewWord = () => {
    const randomWord = wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
    setCurrentWord(randomWord);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    if (currentWord.acceptedRetronyms.some(retronym => 
        retronym.toLowerCase() === input.toLowerCase())) {
      setScore(score + 10);
      setMessage('Correct! +10 points');
      getNewWord();
    } else {
      setMessage('Not quite. Try again!');
    }
    setInput('');
    inputRef.current.focus();
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsGameOver(false);
    setMessage('');
    getNewWord();
    inputRef.current.focus();
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-4">Retronym Riddles</h1>
        
        <div className="mb-4 text-center">
          <span className="text-2xl font-bold text-green-600">{score}</span>
          <span className="mx-2">|</span>
          <span className="text-2xl font-bold text-red-600">
            <Clock className="inline mr-1" size={24} />
            {timeLeft}s
          </span>
        </div>

        {!isGameOver ? (
          <>
            <p className="text-xl font-semibold mb-2">Create a retronym for:</p>
            <p className="text-3xl font-bold text-center mb-4">{currentWord.word}</p>
            
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your retronym..."
              />
            </form>

            {message && <p className="text-center font-semibold mb-4">{message}</p>}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p className="mb-4">Your final score: {score}</p>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded hover:from-green-500 hover:to-blue-600 transition"
            >
              <RefreshCw className="inline mr-2" size={20} />
              Play Again
            </button>
          </div>
        )}

        <button className="mt-4 text-blue-500 hover:text-blue-700">
          <HelpCircle className="inline mr-1" size={20} />
          How to Play
        </button>
      </div>
    </div>
  );
};

export default RetronymRiddles;