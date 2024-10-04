import React from 'react';
import ChronologicGame from './ChronologicGame';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <ChronologicGame />
    </AuthProvider>
  );
}

export default App;