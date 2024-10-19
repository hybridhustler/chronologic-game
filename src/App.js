import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import ChronologicGame from './games/chronologic/ChronologicGame';
import ChainlingGame from './games/chainling/ChainlingGame';
import RetronymRiddles from './games/retronym/RetronymRiddles';
import NumberFall from './games/numberfall/NumberFall';
import DecimalDetective from './games/decimaldetective/DecimalDetective'


function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/chronologic" element={<ChronologicGame />} />
            <Route path="/chainling" element={<ChainlingGame />} />
            <Route path="/retronym" element={<RetronymRiddles />} />
            <Route path="/numberfall" element={<NumberFall />} />
            <Route path="/decimaldetective" element={<DecimalDetective />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;