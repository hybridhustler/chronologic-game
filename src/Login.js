import React from 'react';
import { auth } from './firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

function Login() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Error signing in with Google", error);
    });
  };

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Error signing in with Facebook", error);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Welcome to Chronologic</h1>
      <button 
        onClick={signInWithGoogle}
        className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm hover:bg-gray-50 mb-4 w-64"
      >
        Sign in with Google
      </button>
      <button 
        onClick={signInWithFacebook}
        className="bg-blue-600 text-white font-semibold py-2 px-4 border border-blue-700 rounded shadow-sm hover:bg-blue-700 w-64"
      >
        Sign in with Facebook
      </button>
    </div>
  );
}

export default Login;