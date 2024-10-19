import React, { useState, useEffect } from 'react';
import { WrenchIcon, QuestionMarkCircleIcon, ShareIcon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon, LightBulbIcon, FireIcon, ChartBarIcon, LockClosedIcon } from '@heroicons/react/24/outline';
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
    <div className="overlay">
      <div className="overlay-content">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 overlay-close-button"
          aria-label="Close"
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
          <span className="mr-2 text-gray-700">Difficulty</span>
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
    <div className="overlay">
      <div className="overlay-content max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="help-content">
          <h2 className="text-3xl font-bold text-left text-black mb-4">
            How to Play
            <br />
            <span className="text-lg font-medium text-gray-700 block mt-2">
              Guess 4 historical dates in 3 tries
            </span>
          </h2>

          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li>Choose 3 numbers in the correct format (MM/DD/YY).</li>
            <li>Check out the theme of the day for a clue.</li>
            <li>In Normal difficulty, you'll get feedback on correct number positions.</li>
            <li>In Hard difficulty, you won't receive any feedback on number positions.</li>
            <li>Use the "Locked-in" feature once per game to see correct positions for your next guess.</li>
            <li>You can use up to 2 general hints per game.</li>
            <li>Read the blog post for more context and subtle clues.</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mb-4">Features</h2>

          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li><LightBulbIcon className="h-4 w-4 inline" /> - Get a general hint (max 2 per game)</li>
            <li><LockClosedIcon className="h-4 w-4 inline" /> - Use the "Locked-in" feature (once per game)</li>
            <li><ChartBarIcon className="h-4 w-4 inline" /> - View your statistics</li>
            <li><FireIcon className="h-4 w-4 inline" /> - Your current streak</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const HintOverlay = ({ isOpen, onClose, hint }) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="overlay-content">
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
    <div className="overlay">
      <div className="overlay-content">
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
          <p>Win Percentage: {stats.winPercentage.toFixed(2)}%</p>
          <p>Current Streak: {stats.currentStreak}</p>
          <p>Max Streak: {stats.maxStreak}</p>
          <p>Average Guesses: {stats.averageGuesses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

const GameCompletionScreen = ({ won, correctGuesses, correctDates, onShare, gameNumber, theme, timeTaken }) => {
  const generateShareText = (correctGuessesCount) => {
    let emojiGrid = '';
    for (let i = 0; i < 4; i++) {
      if (i < correctGuessesCount) {
        emojiGrid += '🟩🟩🟩\n';
      } else {
        emojiGrid += '🟥🟥🟥\n';
      }
    }
    return `Chronologic Game #${gameNumber} - ${theme}\n${emojiGrid}\nTime: ${timeTaken}\nPlay at https://chronologic-game.vercel.app`;
  };

  const shareText = generateShareText(correctGuesses.length);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{won ? "Congratulations!" : "Better luck next time!"}</h2>
      <p className="mb-4">{won ? "You've solved today's Chronologic puzzle!" : "Try again tomorrow for a new puzzle."}</p>
      
      <pre className="bg-gray-100 p-4 rounded-lg mb-4 whitespace-pre-wrap">
        {shareText}
      </pre>

      <button 
        onClick={() => onShare(shareText)}
        className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-full transition duration-300"
      >
        <ShareIcon className="h-5 w-5 mr-2" />
        Share Results
      </button>
      
      <h3 className="text-xl font-semibold mb-2">Correct Answers:</h3>
      {(won ? correctGuesses : correctDates).map((date, index) => (
        <div key={index} className="mb-4 p-3 bg-green-100 rounded-lg">
          <p className="font-bold">{date.date}</p>
          <p>{date.event}</p>
          <a href={date.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Learn more</a>
        </div>
      ))}
    </div>
  );
};

const ChronologicGame = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [correctGuesses, setCorrectGuesses] = useState([]);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [gameNumber, setGameNumber] = useState('');
  const [isWiggling, setIsWiggling] = useState(false);
  const [incorrectGuessesLeft, setIncorrectGuessesLeft] = useState(6);
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
  const [generalCluesUsed, setGeneralCluesUsed] = useState(0);
  const [lockedInUsed, setLockedInUsed] = useState(false);
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
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

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
    setGeneralCluesUsed(0);
    setLockedInUsed(false);
    setGameCompleted(false);
    setGameWon(false);
    setTotalGuesses(0);
    setCorrectGuesses([]);
    setSelectedIds([]);
    setStartTime(Date.now());
    setEndTime(null);
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
            setTotalGuesses(gameState.totalGuesses || 0);
            setCorrectGuesses(gameState.correctGuesses || []);
            setNumbers(gameState.numbers || []);
            setGeneralCluesUsed(gameState.generalCluesUsed || 0);
            setLockedInUsed(gameState.lockedInUsed || false);
            setGameCompleted(gameState.gameCompleted || false);
            setStartTime(gameState.startTime || Date.now());
            setEndTime(gameState.endTime || null);
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
    if (!startTime && !gameCompleted) {
      setStartTime(Date.now());
    }
    if (gameCompleted && !endTime) {
      setEndTime(Date.now());
    }
  }, [gameCompleted, startTime, endTime]);

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
      
      if (savedLastPlayed === yesterdayDate || savedLastPlayed === currentDate) {
        setStreak(parseInt(savedStreak));
      } else {
        setStreak(0);
        localStorage.setItem('chronologicStreak', '0');
      }
      setLastPlayedDate(savedLastPlayed);
    }
  };

  const saveGameState = () => {
    const gameState = {
      gameWon,
      totalGuesses,
      correctGuesses,
      numbers,
      generalCluesUsed,
      lockedInUsed,
      gameCompleted,
      startTime,
      endTime
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

    setTotalGuesses(totalGuesses + 1);

    if (correctGuess) {
      setSubmissionStatus('correct');
      setTimeout(() => setSubmissionStatus(null), 1000);
      setCorrectGuesses([...correctGuesses, correctGuess]);
      setNumbers(numbers.map(num => 
        selectedIds.includes(num.id) ? { ...num, used: true } : num
      ));
      setSelectedIds([]);

      if (correctGuesses.length + 1 === 4 || totalGuesses + 1 === 3) {
        setGameWon(correctGuesses.length + 1 === 4);
        setGameCompleted(true);
        setShowConfetti(correctGuesses.length + 1 === 4);
        setTimeout(() => setShowConfetti(false), 5000);
        updateStats(correctGuesses.length + 1 === 4, totalGuesses + 1);
      }
    } else {
      setSubmissionStatus('incorrect');
      setTimeout(() => setSubmissionStatus(null), 1000);

      if (totalGuesses + 1 === 3) {
        setGameCompleted(true);
        updateStats(false, 3);
      }

      if (gameMode === 'normal' || lockedInUsed) {
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

  const handleLockedIn = () => {
    if (!lockedInUsed) {
      setLockedInUsed(true);
      saveGameState();
    }
  };

  const getHint = () => {
    if (generalCluesUsed >= 2 || correctGuesses.length === 4 || gameCompleted) {
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
      setGeneralCluesUsed(generalCluesUsed + 1);
      saveGameState();
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
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
      
      localStorage.setItem('chronologicStats', JSON.stringify(newStats));
      
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
    } else {
      setStreak(0);
      localStorage.setItem('chronologicStreak', '0');
      localStorage.setItem('chronologicLastPlayed', new Date().toDateString());
    }
  };

  const getNumberStyle = (id, used) => {
    if (used) return 'bg-gray-400 text-white cursor-not-allowed';
    if (correctNumbers.includes(id)) return 'bg-green-500 text-white';
    if (incorrectNumbers.includes(id)) return 'bg-red-500 text-white';
    if (selectedIds.includes(id)) return 'bg-yellow-300 text-black';
    return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
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

    if (newDate > today || newDate < earliestDate) {
      return;
    }
    
    setCurrentDate(newDate);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
    initializeNewGame(puzzle);
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

  return (
    <div className="flex flex-col justify-between min-h-screen p-4 bg-pattern">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="top-bar">
          <h1 className="text-3xl font-bold chronologic-font text-white mb-1">Chronologic</h1>
          <div className="top-controls flex justify-between items-center">
            {/* Top controls content */}
          </div>
        </div>

        <div className="game-container">
          {showConfetti && <Confetti />}
          
          {isLoading ? (
            <div className="loader-container">
              <ClipLoader color="#123abc" loading={isLoading} size={50} />
            </div>
          ) : error ? (
            <div className="error-message">
              <p>Failed to load puzzle: {error}</p>
              <p>Please try again later or contact support if the problem persists.</p>
            </div>
          ) : puzzle ? (
            gameCompleted ? (
              <GameCompletionScreen 
                won={gameWon}
                correctGuesses={correctGuesses}
                correctDates={puzzle.correctDates}
                onShare={handleShare}
                gameNumber={gameNumber}
                theme={puzzle.theme}
                timeTaken={formatTime(endTime - startTime)}
              />
            ) : (
              <>
                <div className="top-controls flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <FireIcon className="h-6 w-6 text-yellow-300" />
                    <span className="font-bold text-gray-500">{streak}</span>
                    <button onClick={() => setIsStatsOpen(true)} className="text-green-700 hover:text-green-400">
                      <ChartBarIcon className="h-6 w-6" />
                    </button>
                    <button onClick={() => setIsHelpOpen(true)} className="text-blue-700 hover:text-blue-400">
                      <QuestionMarkCircleIcon className="h-6 w-6" />
                    </button>
                    <button onClick={getHint} className="text-yellow-700 hover:text-yellow-400" disabled={generalCluesUsed >= 2 || gameCompleted}>
                      <LightBulbIcon className="h-6 w-6" />
                    </button>
                    <button onClick={handleLockedIn} className="text-purple-700 hover:text-purple-400" disabled={lockedInUsed || gameCompleted}>
                      <LockClosedIcon className="h-6 w-6" />
                    </button>
                    <button onClick={() => setIsMenuOpen(true)} className="text-gray-700 hover:text-gray-400">
                      <WrenchIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <p className="text-xs text-right game-number-display">
                    #<b>{gameNumber}</b> - Guess: <b>{totalGuesses}/3</b>
                  </p>
                </div>
                
                <p className="text-lg mb-3 text-center italic font-bold text-black border-2 border-gray-300 p-2 rounded-lg bg-gray-100">
                  {puzzle.theme}
                </p>
                
                {puzzle.blogEntry && (
                  <a href={puzzle.blogEntry} target="_blank" rel="noopener noreferrer" className="block text-center text-blue-500 hover:underline mb-3">
                    Read more about today's theme
                  </a>
                )}
                
                <div className={`number-grid ${isWiggling ? 'wiggle' : ''} ${
                  submissionStatus === 'correct' ? 'correct-answer' : 
                  submissionStatus === 'incorrect' ? 'incorrect-answer' : ''
                } ${incorrectGuessesLeft === 1 ? 'last-guess' : ''}`}>
                  {numbers.map(({ id, value, used }) => (
                    <button
                    key={id}
                    onClick={() => !used && handleNumberClick(id)}
                    className={`w-full aspect-square text-2xl font-bold rounded-lg relative flex items-center justify-center ${getNumberStyle(id, used)}`}
                    disabled={used || gameWon || correctNumbers.includes(id)}
                  >
                    {value}
                    {selectedIds.includes(id) && (
                      <span className="absolute bottom-1 right-1 text-xs bg-white text-gray-700 px-1 rounded">
                        {getDatePartLabel(selectedIds.indexOf(id))}
                      </span>
                    )}
                  </button>
                  ))}
                </div>

                <div className="text-center mb-3 space-x-2">
                  <button 
                    onClick={handleSubmit}
                    className={`btn ${selectedIds.length === 3 ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={selectedIds.length !== 3 || gameCompleted}
                  >
                    Submit
                  </button>
                  <button 
                    onClick={() => setSelectedIds([])}
                    className={`btn ${selectedIds.length > 0 ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={selectedIds.length === 0 || gameCompleted}
                  >
                    Deselect All
                  </button>
                  <button 
                    onClick={shuffleNumbers}
                    className="btn btn-primary"
                    disabled={gameCompleted}
                  >
                    Shuffle
                  </button>
                </div>

                <div className="correct-guesses">
                  {correctGuesses.map((guess, index) => (
                    <div key={index} className="correct-guess-item">
                      <p className="font-bold text-sm text-green-800">{guess.date}</p>
                      <p className="text-xs text-green-700">{guess.event}</p>
                    </div>
                  ))}
                </div>

                {renderNavigationButtons()}
                <p className="text-center mt-2">
                  Time: {formatTime(Date.now() - startTime)}
                </p>
              </>
            )
          ) : null}
        </div>
        
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