import React, { useState, useEffect, useCallback } from 'react';
import Chessboard from 'chessboardjsx';
import styles from '../css/ChessGame.module.css';
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
  const [botColor, setBotColor] = useState<'w' | 'b' | null>(null);

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

  const handleBotMove = useCallback(() => {
    if (botColor && game.turn() === botColor) {
      const moves = game.moves({ verbose: true });
      if (moves.length > 0) {
        const randomIndex = Math.floor(Math.random() * moves.length);
        const move = moves[randomIndex];
        executeMove({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
      }
    }
  }, [game, botColor]);

  useEffect(() => {
    const timer = setTimeout(handleBotMove, 500); // Bot moves after a 500ms delay
    return () => clearTimeout(timer);
  }, [game.fen(), handleBotMove]);

  const handleMove = (move: Move) => {
    try {
      let gameCopy = new ChessJS.Chess(game.fen());

      // Check if the move is a pawn move
      if (gameCopy.get(move.from).type === 'p') {
        const isWhitePawn = gameCopy.turn() === 'w';
        const isPromotionMove = ((isWhitePawn && move.to[1] === '8') || (!isWhitePawn && move.to[1] === '1')) ;
        if (isPromotionMove) {
          setPromotionColor(gameCopy.turn());
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

  const toggleBot = (color: 'w' | 'b' | null) => {
    setBotColor(color);
  };

  return (
    <div>
      <div>
        <button className={styles.button} onClick={() => toggleBot('w')}>Play as Black</button>
        <button className={styles.button} onClick={() => toggleBot('b')}>Play as White</button>
        <button className={styles.button} onClick={() => toggleBot(null)}>Disable Bot</button>
      </div>
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
