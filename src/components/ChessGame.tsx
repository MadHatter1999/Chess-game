import React, { useState, useEffect } from 'react';
import Stockfish from "stockfish.wasm";
import Chessboard from 'chessboardjsx';
import PawnPromotionModal from './PawnPromotionModal';
const ChessJS = require('chess.js');

interface Move {
  from: string;
  to: string;
  promotion?: string;
}

const ChessGame: React.FC = () => {
  const [game, setGame] = useState(new ChessJS.Chess());
  const [fen, setFen] = useState("start");
  const [boardSize, setBoardSize] = useState(800);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [promotionMove, setPromotionMove] = useState<Move>({ from: '', to: '' });
  const [promotionColor, setPromotionColor] = useState<'w' | 'b'>('w');

  useEffect(() => {
    setFen(game.fen());
  }, [game]);

  useEffect(() => {
    const updateBoardSize = () => {
      const newSize = Math.min(window.innerWidth, window.innerHeight) * 0.75;
      setBoardSize(newSize);
    };

    window.addEventListener('resize', updateBoardSize);
    updateBoardSize();
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  useEffect(() => {
    // Initialize Stockfish
    const stockfish = Stockfish();
    stockfish.onmessage = (event: MessageEvent) => {
      // Handle messages from Stockfish
      console.log("Stockfish says:", event.data);
    };

    return () => {
      // Clean up Stockfish when component unmounts
      stockfish.terminate();
    };
  }, []);

  const handleMove = (move: Move) => {
    try {
      let gameCopy = new ChessJS.Chess(game.fen());

      // Handling pawn promotion
      if (gameCopy.get(move.from).type === 'p') {
        if (move.to[1] === '8' || move.to[1] === '1') {
          setPromotionColor(move.to[1] === '8' ? 'w' : 'b');
          setShowPromotionModal(true);
          setPromotionMove(move);
          return;
        }
      }

      executeMove(move);
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const executeMove = (move: Move) => {
    if (game.move(move)) {
      setGame(new ChessJS.Chess(game.fen()));
    } else {
      console.warn("Illegal move", move);
    }
  };

  const onPromote = (piece: string) => {
    setShowPromotionModal(false);
    executeMove({ ...promotionMove, promotion: piece });
  };

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
      {showPromotionModal && (
        <PawnPromotionModal onPromote={onPromote} color={promotionColor} />
      )}
    </div>
  );
};

export default ChessGame;
