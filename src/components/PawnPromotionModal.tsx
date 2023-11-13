import React from 'react';
import '../css/PawnPromotionModal.css';
import Pieces from './pieces'; // Ensure this path is correct

interface PawnPromotionModalProps {
  onPromote: (piece: string) => void;
  color: 'w' | 'b';
}

const PawnPromotionModal: React.FC<PawnPromotionModalProps> = ({ onPromote, color }) => {
  // Map piece codes to JSX Elements
  const promotionElements = {
    'q': color === 'w' ? Pieces.wQ : Pieces.bQ,
    'r': color === 'w' ? Pieces.wR : Pieces.bR,
    'b': color === 'w' ? Pieces.wB : Pieces.bB,
    'n': color === 'w' ? Pieces.wN : Pieces.bN
  };

  return (
    <div className="promotion-overlay">
      <div className="promotion-modal">
        {Object.entries(promotionElements).map(([pieceCode, pieceElement]) => (
          <button key={pieceCode} className="promotion-button" onClick={() => onPromote(pieceCode)}>
            {pieceElement}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PawnPromotionModal;
