import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const TutorialOverlay = ({ isOpen, onClose }) => {
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
        
        <h2 className="text-2xl font-bold mb-4">Welcome to Chronologic!</h2>
        
        <ol className="list-decimal list-inside space-y-2">
          <li>Your goal is to guess 4 historical dates.</li>
          <li>Select three numbers to form a date (MM/DD/YY).</li>
          <li>Click 'Submit' to check if your date is correct.</li>
          <li>You have 6 incorrect guesses before the game ends.</li>
          <li>Correct dates will be removed from play.</li>
          <li>Use the theme as a hint for the types of dates you're looking for.</li>
        </ol>
        
        <p className="mt-4">Good luck and enjoy the game!</p>
      </div>
    </div>
  );
};

export default TutorialOverlay;