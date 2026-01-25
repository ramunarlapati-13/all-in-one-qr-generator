import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Creator from './components/Creator';
import Profile from './components/Profile';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Creator />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
