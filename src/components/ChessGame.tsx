import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
const ChessJS = require('chess.js');

const ChessGame: React.FC = () => {
  // State for the chess game logic
  const [game, setGame] = useState(new ChessJS.Chess());
  const [fen, setFen] = useState("start");

  // State for the dynamic board size
  const [boardSize, setBoardSize] = useState(800);

  // Effect to update FEN when the game state changes
  useEffect(() => {
    setFen(game.fen());
  }, [game]);

  // Effect to handle window resize for responsive chessboard
  useEffect(() => {
    const updateBoardSize = () => {
      // Adjust this calculation to change how the board size responds to window size
      const newSize = Math.min(window.innerWidth, window.innerHeight) * 0.75;
      setBoardSize(newSize);
    };

    window.addEventListener('resize', updateBoardSize);

    // Initial resize
    updateBoardSize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  // Function to handle move logic
  const handleMove = (move: { from: string, to: string, promotion?: string }) => {
    try {
      let gameCopy = new ChessJS.Chess(game.fen());
      const legalMove = gameCopy.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || "q" // Default to queen promotion
      });

      if (legalMove) {
        setGame(gameCopy);
      } else {
        console.warn("Illegal move", move);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  // Render the chessboard with responsive width
  return (
    <div>
      <Chessboard
        width={boardSize}
        position={fen}
        onDrop={({ sourceSquare, targetSquare }) => {
          handleMove({
            from: sourceSquare,
            to: targetSquare
          });
        }}
      />
    </div>
  );
};

export default ChessGame;
