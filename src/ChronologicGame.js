import React, { useState, useEffect } from 'react';
import { WrenchIcon, QuestionMarkCircleIcon, ShareIcon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon, LightBulbIcon, FireIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { ClipLoader } from 'react-spinners';
import Confetti from 'react-confetti';
import { format, parseISO, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import './ChronologicGame.css';
import { loadPuzzle } from './puzzleLoader';

const MenuOverlay = ({ isOpen, onClose, gameMode, setGameMode }) => {
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

        <div className="mt-4 flex items-center">
          <span className="mr-2 text-gray-700">Game Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={gameMode === 'hard'}
              onChange={() => setGameMode(prev => prev === 'normal' ? 'hard' : 'normal')}
            />
            <span className="slider round"></span>
          </label>
          <span className="ml-2 text-gray-700">{gameMode === 'hard' ? 'Hard' : 'Normal'}</span>
        </div>
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
            <li>In Normal mode, you'll get feedback on correct number positions.</li>
            <li>In Hard mode, you won't receive any feedback on number positions.</li>
            <li><b>You only get 2 hints per game. Play wisely!</b></li>
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
        </div>
      </div>
    </div>
  );
};

const HintOverlay = ({ isOpen, onClose, hint }) => {
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
        <h2 className="text-2xl font-bold mb-4">Hint</h2>
        <p className="text-lg">{hint}</p>
      </div>
    </div>
  );
};

const StatisticsOverlay = ({ isOpen, onClose, stats }) => {
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
        <h2 className="text-2xl font-bold mb-4">Statistics</h2>
        <div className="space-y-4">
          <p>Games Played: {stats.gamesPlayed}</p>
          <p>Games Won: {stats.gamesWon}</p>
          <p>Win Percentage: {stats.winPercentage}%</p>
          <p>Current Streak: {stats.currentStreak}</p>
          <p>Max Streak: {stats.maxStreak}</p>
          <p>Average Guesses: {stats.averageGuesses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

const GameCompletionScreen = ({ won, correctGuesses, correctDates, onShare, gameNumber, theme }) => {
  const generateShareText = (correctGuessesCount) => {
    let emojiGrid = '';
    for (let i = 0; i < 4; i++) {
      if (i < correctGuessesCount) {
        emojiGrid += '🟩🟩🟩\n';
      } else {
        emojiGrid += '🟥🟥🟥\n';
      }
    }
    return `Chronologic Game #${gameNumber} - ${theme}\n${emojiGrid}\nPlay at https://chronologic-game.vercel.app`;
  };

  const shareText = generateShareText(correctGuesses.length);

  return (
    <div>
      <p />
      <h2 className="text-2xl font-bold mb-4">{won ? "Congratulations!" : "Better luck next time!"}</h2>
      <p className="mb-4">{won ? "You've solved today's Chronologic puzzle!" : "Try again tomorrow for a new puzzle."}</p>
      
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
        </div>
      ))}
    </div>
  );
};

const Footer = () => (
  <footer className="mt-8 text-center text-xs text-gray-600">
    <p>&copy; {new Date().getFullYear()} Scafs Enterprises. All rights reserved.</p>
    <div className="mt-2">
      <a href="/terms" className="hover:underline mr-4">Terms of Service</a>
      <a href="/privacy" className="hover:underline">Privacy Policy</a>
    </div>
  </footer>
);

const ModeToggle = ({ gameMode, setGameMode }) => {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm">Mode: <b>{gameMode === 'hard' ? 'Hard' : 'Normal'}</b></span>
      <label className="switch">
        <input
          type="checkbox"
          checked={gameMode === 'hard'}
          onChange={() => setGameMode(prev => prev === 'normal' ? 'hard' : 'normal')}
        />
        <span className="slider round"></span>
      </label>
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
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [gameNumber, setGameNumber] = useState('');
  const [isWiggling, setIsWiggling] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctNumbers, setCorrectNumbers] = useState([]);
  const [incorrectNumbers, setIncorrectNumbers] = useState([]);
  const [puzzle, setPuzzle] = useState(null);
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return startOfDay(toZonedTime(now, 'America/New_York'));
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const estNow = toZonedTime(now, 'America/New_York');
    return format(startOfDay(estNow), 'yyyy-MM-dd');
  });
  const [gameMode, setGameMode] = useState(() => {
    const savedMode = localStorage.getItem('gameMode');
    return savedMode || 'normal';
  });
  const [error, setError] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [streak, setStreak] = useState(0);
  const [lastPlayedDate, setLastPlayedDate] = useState(null);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    winPercentage: 0,
    currentStreak: 0,
    maxStreak: 0,
    averageGuesses: 0,
    totalGuesses: 0
  });

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const initializeNewGame = (loadedPuzzle) => {
    const shuffledNumbers = shuffleArray([...loadedPuzzle.numbers]);
    setNumbers(shuffledNumbers.map((num, index) => ({ id: index, value: num, used: false })));
    setHintsUsed(0);
  };

  useEffect(() => {
    const loadGameState = async () => {
      setIsLoading(true);
      setError(null);
      const savedState = localStorage.getItem('chronologicGameState');
      const savedStats = localStorage.getItem('chronologicStats');
      
      try {
        const loadedPuzzle = await loadPuzzle(selectedDate);
        setPuzzle(loadedPuzzle);
        setGameNumber(loadedPuzzle.gameNumber);
        
        if (savedState) {
          const { date, gameState, gameNumber: savedGameNumber } = JSON.parse(savedState);
          
          if (date === selectedDate && savedGameNumber === loadedPuzzle.gameNumber) {
            setGameWon(gameState.gameWon || false);
            setIncorrectGuessesLeft(gameState.incorrectGuessesLeft || 6);
            setCorrectGuesses(gameState.correctGuesses || []);
            setNumbers(gameState.numbers || []);
            setHintsUsed(gameState.hintsUsed || 0);
          } else {
            initializeNewGame(loadedPuzzle);
          }
        } else {
          initializeNewGame(loadedPuzzle);
        }

        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }

        loadStreak();
      } catch (error) {
        console.error('Error loading puzzle:', error);
        setError(error.message || 'An unknown error occurred while loading the puzzle');
        setPuzzle(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadGameState();
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('gameMode', gameMode);
  }, [gameMode]);

  useEffect(() => {
    localStorage.setItem('chronologicStats', JSON.stringify(stats));
  }, [stats]);

  const loadStreak = () => {
    const savedStreak = localStorage.getItem('chronologicStreak');
    const savedLastPlayed = localStorage.getItem('chronologicLastPlayed');
    
    if (savedStreak && savedLastPlayed) {
      const currentDate = new Date().toDateString();
      const yesterdayDate = new Date(Date.now() - 86400000).toDateString();
      
      if (savedLastPlayed === yesterdayDate) {
        setStreak(parseInt(savedStreak));
      } else if (savedLastPlayed !== currentDate) {
        // Reset streak if last played date is not yesterday or today
        setStreak(0);
      }
      setLastPlayedDate(savedLastPlayed);
    }
  };

  const saveGameState = () => {
    const gameState = {
      gameWon,
      incorrectGuessesLeft,
      correctGuesses,
      numbers,
      hintsUsed
    };
    localStorage.setItem('chronologicGameState', JSON.stringify({
      date: selectedDate,
      gameState,
      gameNumber: gameNumber
    }));
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
    
    const correctGuess = puzzle.correctDates.find(date => date.date === formattedDate);

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
        updateStats(true, 6 - incorrectGuessesLeft + 1);
      }
    } else {
      setSubmissionStatus('incorrect');
      setTimeout(() => setSubmissionStatus(null), 1000);
      setIncorrectGuessesLeft(incorrectGuessesLeft - 1);

      if (incorrectGuessesLeft === 1) {
        updateStats(false, 6);
      }

      if (gameMode === 'normal') {
        const newCorrectNumbers = [];
        const newIncorrectNumbers = [];
        selectedNumbers.forEach((num, index) => {
          if (puzzle.correctDates.some(date => date.date.split('/')[index] === num)) {
            newCorrectNumbers.push(selectedIds[index]);
          } else {
            newIncorrectNumbers.push(selectedIds[index]);
          }
        });
        setCorrectNumbers(newCorrectNumbers);
        setIncorrectNumbers(newIncorrectNumbers);
        setTimeout(() => {
          setIncorrectNumbers([]);
          setCorrectNumbers([]);
          setSelectedIds([]);
        }, 2000);
      } else {
        setSelectedIds([]);
      }
    }

    saveGameState();
  };

  const updateStats = (won, guesses) => {
    setStats(prevStats => {
      const newStats = {
        gamesPlayed: prevStats.gamesPlayed + 1,
        gamesWon: prevStats.gamesWon + (won ? 1 : 0),
        totalGuesses: prevStats.totalGuesses + guesses,
        currentStreak: won ? prevStats.currentStreak + 1 : 0,
        maxStreak: Math.max(prevStats.maxStreak, won ? prevStats.currentStreak + 1 : 0)
      };
      newStats.winPercentage = (newStats.gamesWon / newStats.gamesPlayed) * 100;
      newStats.averageGuesses = newStats.totalGuesses / newStats.gamesPlayed;
      return newStats;
    });

    if (won) {
      const currentDate = new Date().toDateString();
      if (lastPlayedDate !== currentDate) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('chronologicStreak', newStreak.toString());
        localStorage.setItem('chronologicLastPlayed', currentDate);
      }
    }
  };

  const getNumberStyle = (id, used) => {
    if (used) return 'bg-gray-400 cursor-not-allowed';
    if (correctNumbers.includes(id)) return 'bg-green-500 glow-green';
    if (incorrectNumbers.includes(id)) return 'bg-red-500 glow-red';
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

  const changeDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    
    const earliestDate = startOfDay(toZonedTime(new Date('2024-10-04'), 'America/New_York'));
    const today = startOfDay(toZonedTime(new Date(), 'America/New_York'));

    // Ensure we don't go beyond today's date or before October 4th, 2024
    if (newDate > today || newDate < earliestDate) {
      return;
    }
    
    setCurrentDate(newDate);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
    // Reset game state for the new date
    setGameWon(false);
    setIncorrectGuessesLeft(6);
    setCorrectGuesses([]);
    setSelectedIds([]);
    setNumbers([]); // Clear the numbers to force a reload of the puzzle
  };

  const renderNavigationButtons = () => {
    const earliestDate = startOfDay(toZonedTime(new Date('2024-10-04'), 'America/New_York'));
    const today = startOfDay(toZonedTime(new Date(), 'America/New_York'));
    const isPastDate = currentDate < today;
    const isEarliestDate = currentDate <= earliestDate;
    const isTodayOrFuture = currentDate >= today;

    return (
      <div className="flex justify-between items-center mt-4">
        {!isEarliestDate && (
          <button
            onClick={() => changeDate(-1)}
            className="text-blue-500 hover:text-blue-700"
            aria-label="Previous day"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        )}
        {isEarliestDate && <div className="w-6"></div>}
        <span className="text-sm text-gray-600">
          {format(currentDate, 'MMMM d, yyyy')}
        </span>
        {!isTodayOrFuture && (
          <button
            onClick={() => changeDate(1)}
            className="text-blue-500 hover:text-blue-700"
            aria-label="Next day"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        )}
        {isTodayOrFuture && <div className="w-6"></div>}
      </div>
    );
  };

  const getHint = () => {
    if (hintsUsed >= 2 || correctGuesses.length === 4) {
      alert("No more hints available!");
      return;
    }

    const unguessedDates = puzzle.correctDates.filter(date => 
      !correctGuesses.some(guess => guess.date === date.date)
    );

    if (unguessedDates.length > 0) {
      const randomHint = unguessedDates[Math.floor(Math.random() * unguessedDates.length)].hint;
      setCurrentHint(randomHint);
      setIsHintOpen(true);
      setHintsUsed(hintsUsed + 1);
      saveGameState();
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen p-4">
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="top-bar">
            <h1 className="text-2xl font-bold chronologic-font">Chronologic</h1>
            <div className="top-controls">
              <ModeToggle gameMode={gameMode} setGameMode={setGameMode} />
              <div className="flex items-center mr-4">
                <FireIcon className="h-6 w-6 text-orange-500 mr-1" />
                <span className="font-bold">{streak}</span>
              </div>
              <button onClick={() => setIsStatsOpen(true)} className="text-green-500 hover:text-green-700 mr-2">
                <ChartBarIcon className="h-6 w-6" />
              </button>
              <button onClick={() => setIsHelpOpen(true)} className="text-blue-500 hover:text-blue-700 mr-2">
                <QuestionMarkCircleIcon className="h-6 w-6" />
              </button>
              <button onClick={getHint} className="text-yellow-500 hover:text-yellow-700 mr-2" disabled={hintsUsed >= 2 || correctGuesses.length === 4}>
                <LightBulbIcon className="h-6 w-6" />
              </button>
              <button onClick={() => setIsMenuOpen(true)} className="text-red-500 hover:text-red-700">
                <WrenchIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-start">
          <div className="w-full max-w-md">
            {showConfetti && <Confetti />}
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <ClipLoader color="#123abc" loading={isLoading} size={50} />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                <p>Failed to load puzzle: {error}</p>
                <p>Please try again later or contact support if the problem persists.</p>
              </div>
            ) : puzzle ? (
              gameWon || incorrectGuessesLeft === 0 ? (
                <GameCompletionScreen 
                  won={gameWon}
                  correctGuesses={correctGuesses}
                  correctDates={puzzle.correctDates}
                  onShare={handleShare}
                  gameNumber={gameNumber}
                  theme={puzzle.theme}
                />
              ) : (
                <>
                  <p className="text-sm text-right game-number-display mb-2 text-gray-700">#<b>{gameNumber}</b></p>
                  <p className="text-lg mb-3 text-center italic font-bold text-black border-2 border-gray-300 p-2 rounded-lg bg-gray-100">{puzzle.theme}</p>
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
                  } ${incorrectGuessesLeft === 1 ? 'last-guess' : ''}`}>
                    {numbers.map(({ id, value, used }) => (
                      <button
                        key={id}
                        onClick={() => !used && handleNumberClick(id)}
                        className={`w-full aspect-square text-black text-2xl font-bold rounded relative ${getNumberStyle(id, used)}`}
                        disabled={used || gameWon || correctNumbers.includes(id)}
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
                        <p className="font-bold text-sm text-black">{guess.date}</p>
                        <p className="text-xs text-gray-700">{guess.event}</p>
                      </div>
                    ))}
                  </div>

                  {renderNavigationButtons()}
                </>
              )
            ) : null}
          </div>
        </div>
        
        <Footer />

        <MenuOverlay 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          gameMode={gameMode}
          setGameMode={setGameMode}
        />
        <HelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        <HintOverlay isOpen={isHintOpen} onClose={() => setIsHintOpen(false)} hint={currentHint} />
        <StatisticsOverlay isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} />
      </div>
    </div>
  );
};

export default ChronologicGame;