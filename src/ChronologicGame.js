import React, { useState, useEffect } from 'react';
import { WrenchIcon, QuestionMarkCircleIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import './ChronologicGame.css';
import dailyPuzzle from './dailyPuzzle';
import { useAuth } from './AuthContext';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from './firebaseConfig';

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
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative max-h-[80vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
  <h2 className="text-3xl font-extrabold text-center mb-6 text-orange-500">How to Play Chronologic</h2>
  
  <ul className="space-y-4 text-lg leading-relaxed text-black mb-6">
    <li>
      <span className="font-semibold text-orange-500">1. Select 3 numbers: </span> 
      Choose 3 numbers to form a date (MM/DD/YY).
    </li>
    <li>
      <span className="font-semibold text-orange-500">2. Submit your guess: </span> 
      Click <span className="font-semibold text-orange-500">'Submit'</span> to check if your date matches one of the four historical dates.
    </li>
    <li>
      <span className="font-semibold text-orange-500">3. Limited guesses: </span> 
      You have <span className="font-semibold text-orange-500">6</span> incorrect guesses before the game ends.
    </li>
    <li>
      <span className="font-semibold text-orange-500">4. Progress: </span> 
      Correctly guessed dates will be removed from play.
    </li>
    <li>
      <span className="font-semibold text-orange-500">5. Victory: </span> 
      Win by finding all 4 historical dates before running out of guesses!
    </li>
  </ul>
  
  <p className="text-center text-black italic">
    The theme provides a hint about the types of dates you're looking for. <span className="font-bold text-orange-500">Good luck!</span>
  </p>
</div>

      </div>
    </div>
  );
};

const WinOverlay = ({ isOpen, onClose, correctGuesses, onShare }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative max-h-[80vh] overflow-y-auto">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative max-h-[80vh] overflow-y-auto">
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
  const { user } = useAuth();
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
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [showLoseOverlay, setShowLoseOverlay] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const shuffledNumbers = shuffleArray([...dailyPuzzle.numbers]);
    setNumbers(shuffledNumbers.map((num, index) => ({ id: index, value: num, used: false })));
    setGameNumber(dailyPuzzle.gameNumber);
  }, []);

  const handleSignIn = (provider) => {
    const authProvider = provider === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
    signInWithPopup(auth, authProvider)
      .then((result) => {
        console.log("User signed in:", result.user);
        setShowLoginPrompt(false);
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
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
        setShowWinOverlay(true);
      }
    } else {
      setSubmissionStatus('incorrect');
      setTimeout(() => setSubmissionStatus(null), 1000);
      setIncorrectGuessesLeft(incorrectGuessesLeft - 1);
      setSelectedIds([]);
      if (incorrectGuessesLeft === 1) {
        setShowLoseOverlay(true);
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
    
    return `Chronologic ${dailyPuzzle.gameNumber}\n${emojiGrid}\nPlay at https://chronologic-game.vercel.app`;
  };

  const handleShare = () => {
    if (user) {
      const shareText = generateShareText(correctGuesses.length);
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    } else {
      setShowLoginPrompt(true);
    }
  };

  const LoginPrompt = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Login to Save Results</h2>
        <p className="mb-4">Login to save your game results and share them.</p>
        <button onClick={() => handleSignIn('google')} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Sign in with Google
        </button>
        <button onClick={() => handleSignIn('facebook')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Sign in with Facebook
        </button>
        <button onClick={() => setShowLoginPrompt(false)} className="mt-4 text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-2 max-w-md relative">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setIsMenuOpen(true)} className="fixed bottom-4 left-4 bg-red-500 text-white rounded-full p-2">
          <WrenchIcon className="h-6 w-6" />
        </button>
        <h1 className="text-4xl font-bold text-center chronologic-font">Chronologic</h1>
        <button onClick={() => setIsHelpOpen(true)} className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-2">
          <QuestionMarkCircleIcon className="h-6 w-6" />
        </button>
      </div>
      <p className="text-center game-number-display mb-2">Game #{gameNumber}</p>
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

      <p className="text-sm mt-4 text-center">New puzzles daily at 8:00 AM EST</p>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <HelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      <WinOverlay 
        isOpen={showWinOverlay} 
        onClose={() => setShowWinOverlay(false)} 
        correctGuesses={correctGuesses}
        onShare={handleShare}
      />

      <LoseOverlay 
        isOpen={showLoseOverlay} 
        onClose={() => setShowLoseOverlay(false)} 
        correctDates={dailyPuzzle.correctDates}
        onShare={handleShare}
      />

      {showLoginPrompt && <LoginPrompt />}
    </div>
  );
};

export default ChronologicGame;