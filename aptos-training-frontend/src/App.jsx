import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TrainingPlatform from "./TrainingPlatform";

function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <TrainingPlatform />
    </div>
  );
}

export default App;
