import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, HelpCircle, Settings, X, Trophy } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Chainling = () => {
  const [chain, setChain] = useState([]);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
  }, [timeLeft, isGameOver]);

  useEffect(() => {
    // Focus on the input when the component mounts
    inputRef.current.focus();
  }, []);

  const validateWord = async (word) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error('Not a valid word');
      }
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.length > 0) {
      const isValid = await validateWord(input);
      if (isValid && (chain.length === 0 || input[0].toLowerCase() === chain[chain.length - 1].slice(-1).toLowerCase())) {
        setChain([...chain, input]);
        setScore(score + calculateScore(input));
        setInput('');
        // Focus on the input after successful submission
        inputRef.current.focus();
      } else {
        e.target.classList.add('shake');
        setTimeout(() => {
          e.target.classList.remove('shake');
          // Focus on the input even after an invalid submission
          inputRef.current.focus();
        }, 500);
      }
    }
  };

  const calculateScore = (word) => {
    let baseScore = word.length;
    if (difficulty === 'hard') {
      baseScore *= 2;
    }
    return baseScore;
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to fetch leaderboard. Please try again.');
    }
  };

  const submitScore = async () => {
    if (!playerName) {
      setError('Please enter your name to submit your score.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score }),
      });
      if (!response.ok) throw new Error('Failed to submit score');
      await fetchLeaderboard();
      setShowLeaderboard(true);
    } catch (error) {
      setError('Failed to submit score. Please try again.');
    }
  };

  const restartGame = () => {
    setChain([]);
    setInput('');
    setScore(0);
    setTimeLeft(difficulty === 'hard' ? 45 : 60);
    setIsGameOver(false);
    setError('');
    setPlayerName('');
    setShowLeaderboard(false);
    inputRef.current.focus();
  };

  const HelpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md relative">
        <button 
          onClick={() => setShowHelp(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">How to Play Chainling</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>Enter words that start with the last letter of the previous word.</li>
          <li>Each word must be a valid English word.</li>
          <li>Score points based on the length of each valid word.</li>
          <li>Play against the clock - you have 60 seconds in normal mode, 45 in hard mode.</li>
          <li>Hard mode doubles your points but gives you less time!</li>
        </ul>
      </div>
    </div>
  );

  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg relative">
        <button 
          onClick={() => setShowSettings(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="mb-4">
          <label className="block mb-2">Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </div>
  );

  const LeaderboardModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md relative">
        <button 
          onClick={() => setShowLeaderboard(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <ul className="mb-4">
          {leaderboard.map((entry, index) => (
            <li key={index} className="mb-2">
              <span className="font-bold">{index + 1}. {entry.name}: </span>
              <span>{entry.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Chainling
          </h1>
          <div className="flex space-x-2">
            <button onClick={() => setShowHelp(true)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">
              <HelpCircle size={24} />
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">
              <Settings size={24} />
            </button>
          </div>
        </div>
        
        <div className="mb-4 text-center">
          <span className="text-2xl font-bold text-green-600">{score}</span>
          <span className="mx-2">|</span>
          <span className="text-2xl font-bold text-red-600">{timeLeft}s</span>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4 min-h-[100px] flex flex-wrap content-start">
          {chain.map((word, index) => (
            <span key={index} className="bg-gradient-to-r from-blue-200 to-purple-200 text-blue-800 px-2 py-1 rounded m-1 animate-pop-in">
              {word}
            </span>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a word..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGameOver || isLoading}
          />
        </form>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {isLoading && <p className="text-gray-500 mb-4">Checking word...</p>}
        
        {isGameOver && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p className="mb-4">Your final score: {score}</p>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <button
              onClick={submitScore}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mb-2 w-full"
            >
              Submit Score
            </button>
            <button
              onClick={() => {
                fetchLeaderboard();
                setShowLeaderboard(true);
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mb-2 w-full"
            >
              <Trophy className="inline mr-2" size={20} />
              View Leaderboard
            </button>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded hover:from-blue-600 hover:to-purple-700 transition w-full"
            >
              <RefreshCw className="inline mr-2" size={20} />
              Play Again
            </button>
          </div>
        )}

        {showHelp && <HelpModal />}
        {showSettings && <SettingsModal />}
        {showLeaderboard && <LeaderboardModal />}
      </div>
    </div>
  );
};

export default Chainling;