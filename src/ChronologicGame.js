import React, { useState, useEffect } from 'react';
import { QuestionMarkCircleIcon, XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, ShareIcon } from '@heroicons/react/24/outline';
import './ChronologicGame.css';
import dailyPuzzle from './dailyPuzzle';

const ModernHelpOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        
        <ul className="space-y-2 mb-4">
          <li className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
            <span>Select 3 numbers to form a date (MM/DD/YY) in exact order. The game provides 12 numbers to choose from.</span>
          </li>
          <li className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
            <span>Click 'Submit' to check if your date is one of the four historical dates.</span>
          </li>
          <li className="flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
            <span>You have 6 incorrect guesses before the game ends. Each correct guess removes those numbers from play.</span>
          </li>
          <li className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
            <span>Win by finding all 4 historical dates before running out of guesses!</span>
          </li>
        </ul>
        
        <p className="mb-4">The theme provides a hint about the types of dates you're looking for. Good luck!</p>
      </div>
    </div>
  );
};

const WinOverlay = ({ isOpen, onClose, correctGuesses, onShare }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
        <p className="mb-4">You've solved today's Chronologic puzzle!</p>
        
        <h3 className="text-xl font-semibold mb-2">Correct Answers:</h3>
        {correctGuesses.map((guess, index) => (
          <div key={index} className="mb-4">
            <p className="font-bold">{guess.date}</p>
            <p>{guess.event}</p>
            <a href={guess.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Learn more</a>
            <img src={guess.photo} alt={guess.event} className="mt-2 w-full rounded" />
          </div>
        ))}
        
        <button 
          onClick={onShare}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
        >
          <ShareIcon className="h-5 w-5 mr-2" />
          Share Results
        </button>
      </div>
    </div>
  );
};

const LoseOverlay = ({ isOpen, onClose, correctDates, onShare }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Sorry, better luck next time!</h2>
        <p className="mb-4">Here are the correct answers:</p>
        
        {correctDates.map((date, index) => (
          <div key={index} className="mb-4">
            <p className="font-bold">{date.date}</p>
            <p>{date.event}</p>
            <a href={date.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Learn more</a>
            <img src={date.photo} alt={date.event} className="mt-2 w-full rounded" />
          </div>
        ))}
        
        <button 
          onClick={onShare}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
        >
          <ShareIcon className="h-5 w-5 mr-2" />
          Share Results
        </button>
      </div>
    </div>
  );
};

const ChronologicGame = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [incorrectGuessesLeft, setIncorrectGuessesLeft] = useState(6);
  const [gameWon, setGameWon] = useState(false);
  const [theme, setTheme] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [isWiggling, setIsWiggling] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [showLoseOverlay, setShowLoseOverlay] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [storedResults, setStoredResults] = useState(null);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const puzzleDate = new Date(dailyPuzzle.date);
    setCurrentDate(puzzleDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    const storedData = localStorage.getItem('chronologicGame');
    if (storedData) {
      const { date, results } = JSON.parse(storedData);
      if (date === dailyPuzzle.date) {
        setGameCompleted(true);
        setStoredResults(results);
        return;
      }
    }

    const shuffledNumbers = shuffleArray([...dailyPuzzle.numbers]);
    setNumbers(shuffledNumbers.map((num, index) => ({ id: index, value: num, used: false })));
    setTheme(dailyPuzzle.theme);
  }, []);

  const handleNumberClick = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleGameEnd = (won) => {
    const results = {
      won,
      correctGuesses: won ? 4 : correctGuesses.length,
      incorrectGuesses: 6 - incorrectGuessesLeft
    };
    localStorage.setItem('chronologicGame', JSON.stringify({
      date: dailyPuzzle.date,
      results
    }));
    setGameCompleted(true);
    setStoredResults(results);
    if (won) {
      setShowWinOverlay(true);
    } else {
      setShowLoseOverlay(true);
    }
  };

  const handleSubmit = () => {
    if (selectedIds.length !== 3) {
      alert('Please select exactly 3 numbers for a date');
      return;
    }

    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);

    const selectedNumbers = selectedIds.map(id => numbers.find(num => num.id === id).value);
    const formattedDate = `${selectedNumbers[0]}/${selectedNumbers[1]}/${selectedNumbers[2]}`;
    
    const correctGuess = dailyPuzzle.correctDates.find(date => date.date === formattedDate);

    if (correctGuess) {
      setSubmissionStatus('correct');
      setTimeout(() => setSubmissionStatus(null), 1000);
      const newCorrectGuesses = [...correctGuesses, correctGuess];
      setCorrectGuesses(newCorrectGuesses);
      setNumbers(numbers.map(num => 
        selectedIds.includes(num.id) ? { ...num, used: true } : num
      ));
      setSelectedIds([]);

      if (newCorrectGuesses.length === 4) {
        handleGameEnd(true);
      }
    } else {
      setSubmissionStatus('incorrect');
      setTimeout(() => setSubmissionStatus(null), 1000);
      setIncorrectGuessesLeft(incorrectGuessesLeft - 1);
      setSelectedIds([]);
      if (incorrectGuessesLeft === 1) {
        handleGameEnd(false);
      }
    }
  };

  const getNumberStyle = (id, used) => {
    if (used) return 'bg-gray-400 cursor-not-allowed';
    if (selectedIds.includes(id)) return 'bg-yellow-300';
    return 'bg-yellow-50 hover:bg-yellow-100';
  };

  const shuffleNumbers = () => {
    setNumbers(numbers => {
      const activeNumbers = numbers.filter(num => !num.used);
      const usedNumbers = numbers.filter(num => num.used);
      
      const shuffledActive = shuffleArray([...activeNumbers]);
      
      return [...shuffledActive, ...usedNumbers];
    });
  };

  const getDatePartLabel = (index) => {
    if (index === 0) return 'month';
    if (index === 1) return 'day';
    if (index === 2) return 'year';
    return '';
  };

  const generateShareText = (correctGuesses) => {
    let emojiGrid = '';
    for (let i = 0; i < 4; i++) {
      if (i < correctGuesses) {
        emojiGrid += '🟩🟩🟩\n';
      } else {
        emojiGrid += '🟥🟥🟥\n';
      }
    }
    
    return `Chronologic ${dailyPuzzle.date}\n${emojiGrid}\nPlay at https://chronologic-game.vercel.app`;
  };

  const handleShare = () => {
    const shareText = generateShareText(storedResults.correctGuesses);
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Results copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  if (gameCompleted) {
    return (
      <div className="container mx-auto p-4 max-w-md flex flex-col min-h-screen">
        <h1 className="text-4xl font-bold text-center chronologic-font mb-6">Chronologic</h1>
        <div className="flex-grow">
          <p className="text-2xl font-bold mb-4 text-center">
            {storedResults.won ? "Congratulations!" : "Better luck next time!"}
          </p>
          <div className="mb-6 text-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-center">
                {[...Array(3)].map((_, j) => (
                  <div 
                    key={j} 
                    className={`w-6 h-6 m-1 ${i < storedResults.correctGuesses ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Today's Answers:</h2>
          {dailyPuzzle.correctDates.map((date, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="font-bold text-lg">{date.date}</p>
              <p className="mb-2">{date.event}</p>
              <a href={date.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Learn more</a>
              <img src={date.photo} alt={date.event} className="mt-2 w-full rounded" />
            </div>
          ))}
  
          <button 
            onClick={handleShare}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center mb-6"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            Share Results
          </button>
        </div>
        
        <p className="text-sm text-center mt-4">New puzzles daily at 8:00 AM EST</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-2 max-w-md flex flex-col min-h-screen">
      <div className="flex-grow">
        <h1 className="text-4xl font-bold text-center chronologic-font mb-2">Chronologic</h1>
        <p className="text-center date-display mb-2">{currentDate}</p>
        <p className="text-lg mb-3 text-center italic">{theme}</p>
        <div className="flex justify-center mb-3">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className={`w-3 h-3 mx-1 ${index < incorrectGuessesLeft ? 'bg-gray-300' : 'bg-transparent border border-gray-300'}`}
            ></div>
          ))}
        </div>
        
        <div className={`grid grid-cols-3 gap-2 mb-3 ${isWiggling ? 'wiggle' : ''} ${
          submissionStatus === 'correct' ? 'correct-answer' : 
          submissionStatus === 'incorrect' ? 'incorrect-answer' : ''
        }`}>
          {numbers.map(({ id, value, used }) => (
            <button
              key={id}
              onClick={() => !used && handleNumberClick(id)}
              className={`w-full aspect-square text-black text-2xl font-bold rounded relative ${getNumberStyle(id, used)}`}
              disabled={used || gameWon}
            >
              {value}
              {selectedIds.includes(id) && (
                <span className="absolute bottom-1 right-1 text-xs text-gray-500">
                  {getDatePartLabel(selectedIds.indexOf(id))}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="text-center mb-3">
          <button 
            onClick={handleSubmit}
            className={`border border-black text-black font-bold py-2 px-4 rounded mr-2 ${selectedIds.length === 3 ? 'bg-white hover:bg-gray-100' : 'bg-gray-200 cursor-not-allowed'}`}
            disabled={selectedIds.length !== 3 || gameWon}
          >
            Submit
          </button>
          <button 
            onClick={() => setSelectedIds([])}
            className={`border border-black text-black font-bold py-2 px-4 rounded mr-2 ${selectedIds.length > 0 ? 'bg-white hover:bg-gray-100' : 'bg-gray-200 cursor-not-allowed'}`}
            disabled={selectedIds.length === 0 || gameWon}
          >
            Deselect All
          </button>
          <button 
            onClick={shuffleNumbers}
            className="border border-black bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded"
            disabled={gameWon}
          >
            Shuffle
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-1">
          {correctGuesses.map((guess, index) => (
            <div key={index} className="p-2 bg-green-100 rounded-lg">
              <p className="font-bold text-sm">{guess.date}</p>
              <p className="text-xs">{guess.event}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm mt-4 text-center">New puzzles daily at 8:00 AM EST</p>

      <button onClick={() => setIsHelpOpen(true)} className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-2">
        <QuestionMarkCircleIcon className="h-6 w-6" />
      </button>
      
      <WinOverlay 
        isOpen={showWinOverlay} 
        onClose={() => setShowWinOverlay(false)} 
        correctGuesses={correctGuesses}
        onShare={() => handleShare(true)}
      />

      <LoseOverlay 
        isOpen={showLoseOverlay} 
        onClose={() => setShowLoseOverlay(false)} 
        correctDates={dailyPuzzle.correctDates}
        onShare={() => handleShare(false)}
      />

      <ModernHelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default ChronologicGame;