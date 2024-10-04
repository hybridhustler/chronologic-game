import React, { useState, useEffect } from 'react';
import { WrenchIcon, QuestionMarkCircleIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ClipLoader } from 'react-spinners';
import Confetti from 'react-confetti';
import './ChronologicGame.css';
import { useAuth } from './AuthContext';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from './firebaseConfig';
import dailyPuzzle from './dailyPuzzle';

const MenuOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const email = 'hybridhustlerarmy@gmail.com';
  const links = [
    { name: 'Contact', subject: 'Contact from Chronologic Game' },
    { name: 'Feedback', subject: 'Feedback for Chronologic Game' },
    { name: 'Report a Bug', subject: 'Bug Report for Chronologic Game' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <a 
                href={`mailto:${email}?subject=${encodeURIComponent(link.subject)}`}
                className="text-blue-500 hover:underline"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const HelpOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-xl w-full p-6 relative max-h-[100vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="bg-gray-50 p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-left text-black mb-4">
            How to Play
            <br />
            <span className="text-lg font-medium text-gray-700 block mt-2">
              Guess 4 historical dates in 6 tries
            </span>
          </h2>

          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li>Choose 3 numbers in the correct format (MM/DD/YY).</li>
            <li>Check out the theme of the day for a clue.</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mb-4">Examples</h2>

          <div className="space-y-6">
            <div className="text-left">
            <img src="example.png" alt="Incorrect Example" className="w-full h-auto max-w-xs rounded-lg shadow-lg mx-auto" />
            </div>

            <div className="text-left">
            <img src="example2.png" alt="Correct Example" className="w-full h-auto max-w-xs rounded-lg shadow-lg mx-auto" />
            </div>
          </div>

          <p className="text-left text-gray-700 italic mt-6">
            New puzzles daily
          </p>
        </div>

      </div>
    </div>
  );
};

const GameCompletionScreen = ({ won, correctGuesses, correctDates, onShare, gameNumber }) => {
  const generateShareText = (correctGuessesCount) => {
    let emojiGrid = '';
    for (let i = 0; i < 4; i++) {
      if (i < correctGuessesCount) {
        emojiGrid += '🟩🟩🟩\n';
      } else {
        emojiGrid += '🟥🟥🟥\n';
      }
    }
    return `Chronologic Game #: ${gameNumber}\n${emojiGrid}\nPlay at https://chronologic-game.vercel.app`;
  };

  const shareText = generateShareText(correctGuesses.length);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{won ? "Congratulations!" : "Better luck next time!"}</h2>
      <p className="mb-4">{won ? "You've solved today's Chronologic puzzle!" : "Here are the correct answers:"}</p>
      
      <pre className="bg-gray-100 p-4 rounded-lg mb-4 whitespace-pre-wrap">
        {shareText}
      </pre>

      <button 
        onClick={() => onShare(shareText)}
        className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center w-full"
      >
        <ShareIcon className="h-5 w-5 mr-2" />
        Share Results
      </button>
      
      <h3 className="text-xl font-semibold mb-2">Correct Answers:</h3>
      {(won ? correctGuesses : correctDates).map((date, index) => (
        <div key={index} className="mb-4">
          <p className="font-bold">{date.date}</p>
          <p>{date.event}</p>
          <a href={date.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Learn more</a>
          <img src={date.photo} alt={date.event} className="mt-2 w-full rounded" />
        </div>
      ))}
      
      <p className="text-sm mt-4 text-center">New puzzles daily</p>
    </div>
  );
};

const IntroScreen = ({ onPlay, onHowToPlay }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <img 
      src="logo.png" 
      alt="Game Logo" 
      className="w-80 h-auto mb-4" 
    />
      <h1 className="text-4xl font-bold mb-4 chronologic-font">Chronologic</h1>
      <p className="text-xl mb-6 text-center font-serif" style={{ fontFamily: 'Bangers' }}>
        Get 6 chances to guess 4 historical dates.
      </p>


      <div className="space-y-4">
      <button
  onClick={() => { onPlay(); onHowToPlay(); }} 
  className="border border-black bg-white hover:bg-green-100 text-black font-bold py-2 px-4 rounded"
>
  Play
</button>

      </div>
      <p className="mt-8 text-sm text-gray-600">{currentDate}</p>
      <p className="text-sm text-gray-600">No. {dailyPuzzle.gameNumber}</p>
      <p className="text-sm text-gray-600">Edited by <b>John Scafide</b></p>
    </div>
  );
};

const ChronologicGame = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [incorrectGuessesLeft, setIncorrectGuessesLeft] = useState(6);
  const [gameWon, setGameWon] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [gameNumber, setGameNumber] = useState('');
  const [isWiggling, setIsWiggling] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const loadGameState = async () => {
      setIsLoading(true);
      const currentDate = new Date().toDateString();
      const savedState = localStorage.getItem('chronologicGameState');
      
      if (savedState) {
        const { date, gameState, gameNumber: savedGameNumber } = JSON.parse(savedState);
        
        if (date === currentDate && savedGameNumber === dailyPuzzle.gameNumber) {
          setGameWon(gameState.gameWon || false);
          setIncorrectGuessesLeft(gameState.incorrectGuessesLeft || 6);
          setCorrectGuesses(gameState.correctGuesses || []);
          setNumbers(gameState.numbers || []);
          setGameNumber(savedGameNumber);
          setShowIntro(false);
        } else {
          initializeNewGame();
        }
      } else {
        initializeNewGame();
      }
      
      setIsLoading(false);
    };

    loadGameState();
  }, []);

  const initializeNewGame = () => {
    const shuffledNumbers = shuffleArray([...dailyPuzzle.numbers]);
    setNumbers(shuffledNumbers.map((num, index) => ({ id: index, value: num, used: false })));
    setGameNumber(dailyPuzzle.gameNumber);
  };

  const saveGameState = () => {
    const gameState = {
      gameWon,
      incorrectGuessesLeft,
      correctGuesses,
      numbers
    };
    const currentDate = new Date().toDateString();
    localStorage.setItem('chronologicGameState', JSON.stringify({
      date: currentDate,
      gameState,
      gameNumber: gameNumber
    }));
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleNumberClick = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
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
      setCorrectGuesses([...correctGuesses, correctGuess]);
      setNumbers(numbers.map(num => 
        selectedIds.includes(num.id) ? { ...num, used: true } : num
      ));
      setSelectedIds([]);

      if (correctGuesses.length + 1 === 4) {
        setGameWon(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else {
      setSubmissionStatus('incorrect');
      setTimeout(() => setSubmissionStatus(null), 1000);
      setIncorrectGuessesLeft(incorrectGuessesLeft - 1);
      setSelectedIds([]);
    }

    saveGameState();
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

  const handleShare = (shareText) => {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Results copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#123abc" loading={isLoading} size={50} />
      </div>
    );
  }

  if (showIntro) {
    return (
      <IntroScreen 
        onPlay={() => setShowIntro(false)} 
        onHowToPlay={() => setIsHelpOpen(true)}
      />
    );
  }

  return (
    <div className="container mx-auto p-2 max-w-md relative">
      {showConfetti && <Confetti />}
      
      {gameWon || incorrectGuessesLeft === 0 ? (
        <GameCompletionScreen 
          won={gameWon}
          correctGuesses={correctGuesses}
          correctDates={dailyPuzzle.correctDates}
          onShare={handleShare}
          gameNumber={gameNumber}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <button onClick={() => setIsMenuOpen(true)} className="fixed bottom-4 left-4 bg-red-500 text-white rounded-full p-2">
              <WrenchIcon className="h-6 w-6" />
            </button>
            <h1 className="text-4xl font-bold text-center chronologic-font">Chronologic</h1>
            <button onClick={() => setIsHelpOpen(true)} className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-2">
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="text-2xl text-center game-number-display mb-2">Game #{gameNumber}</p>
          <p className="text-lg mb-3 text-center italic">{dailyPuzzle.theme}</p>
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

          <p className="text-sm mt-4 text-center">New puzzles daily</p>
        </>
      )}

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <HelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default ChronologicGame;