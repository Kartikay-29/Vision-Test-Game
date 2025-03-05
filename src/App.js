import React, { useState, useEffect } from "react";
import "./App.css"; // Update for custom styles

const VisionTestGame = () => {
  const [colorToMatch, setColorToMatch] = useState("");
  const [options, setOptions] = useState([]);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [reactionTimes, setReactionTimes] = useState([]); // To store individual reaction times

  // The function to generate a random color
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // The function to shuffle an array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setReactionTimes([]); // Reset the reaction times for a new game
    generateNewRound();
  };

  const stopGame = () => {
    setGameStarted(false);
    setGameOver(true);
  };

  const generateNewRound = () => {
    const correctColor = generateRandomColor(); // Random correct color
    const oddColor = generateRandomColor(); // Random odd color
    const choices = [correctColor, correctColor, correctColor, oddColor]; // 3 correct, 1 odd

    // Shuffle the options to randomize the odd one out
    setColorToMatch(oddColor); // The odd color is the one to match
    setOptions(shuffleArray(choices)); // Randomize the order of colors
    setStartTime(Date.now());
  };

  const handleChoice = (choice) => {
    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

    setReactionTime(timeTaken);
    setReactionTimes((prevTimes) => [...prevTimes, parseFloat(timeTaken)]); // Store reaction time

    if (choice === colorToMatch) {
      setScore((prev) => prev + 1);
      generateNewRound(); // Continue to next round without alert
    } else {
      setGameOver(true); // Stop the game
    }
  };

  const calculateAverageReactionTime = () => {
    const totalTime = reactionTimes.reduce((acc, time) => acc + time, 0);
    return (totalTime / reactionTimes.length).toFixed(2);
  };

  const compareWithHealthyPerson = (avgTime) => {
    const healthyPersonAvgTime = 0.25; // Average reaction time for a healthy person in seconds (250ms)
    if (avgTime < healthyPersonAvgTime) {
      return "Faster than a healthy person's average reaction time!";
    } else if (avgTime === healthyPersonAvgTime) {
      return "Your reaction time is exactly like a healthy person's average!";
    } else {
      return "Slower than a healthy person's average reaction time.";
    }
  };

  if (!gameStarted) {
    return (
      <div className="start-screen">
        <h1 className="title">Vision Test Game</h1>
        <p>Click "Start" to begin the game</p>
        <button className="start-btn" onClick={startGame}>Start</button>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <button className="stop-btn" onClick={stopGame}>Stop Game</button>
      <h1 className="game-title">Select the Odd One Out</h1>
      <div className="color-container">
        {options.map((color, index) => (
          <button
            key={index}
            className="color-block"
            style={{ backgroundColor: color }}
            onClick={() => handleChoice(color)}
          ></button>
        ))}
      </div>
      <div className="stats">
        <p>Reaction Time: {reactionTime || "N/A"} seconds</p>
        <p>Score: {score}</p>
      </div>
      {gameOver && (
        <div className="game-over">
          <h2>You Loose! 😞</h2> {/* Sad emoji added */}
          <p>Your final score is: {score}</p>
          <p>
            Average Reaction Time:{" "}
            {reactionTimes.length > 0 ? calculateAverageReactionTime() : "N/A"}{" "}
            seconds
          </p>
          <p>
            {reactionTimes.length > 0
              ? compareWithHealthyPerson(calculateAverageReactionTime())
              : ""}
          </p>
          <button className="start-btn" onClick={startGame}>Restart Game</button>
        </div>
      )}
    </div>
  );
};

export default VisionTestGame;
