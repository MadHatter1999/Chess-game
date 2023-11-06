import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
const ChessJS = require('chess.js');

const ChessGame: React.FC = () => {
  const [game, setGame] = useState(new ChessJS.Chess());
  const [fen, setFen] = useState("start");

  useEffect(() => {
    // Update the fen (Forsyth-Edwards Notation) whenever a move is made
    setFen(game.fen());
  }, [game]);

const handleMove = (move: { from: string, to: string, promotion?: string }) => {
    try {
      let gameCopy = new ChessJS.Chess(game.fen());
      const legalMove = gameCopy.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || "q"
      });

      if (legalMove) {
        setGame(gameCopy);
      } else {
        console.warn("Illegal move", move);
        // The piece will automatically go back to its original position because we're not updating the state
      }
    } catch (error) {

      console.error("An error occurred", error);
    }
  };


return (
    <div>
      <Chessboard
        width={800}
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
