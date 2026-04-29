import React, { useState } from 'react';
import { MdStar, MdStarBorder, MdClose } from 'react-icons/md';

export const RatingPrompt: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mt-4 bg-gradient-to-br from-[#FFF0F0] to-[#FFE6ED] dark:from-slate-800 dark:to-slate-700/80 rounded-[20px] p-4 border border-[#FF2D8D]/20 shadow-sm relative">
      <button 
        onClick={() => setDismissed(true)} 
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <MdClose className="w-4 h-4" />
      </button>
      
      {!submitted ? (
        <div className="flex flex-col items-center">
          <h4 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">Love FileMint?</h4>
          <p className="text-[12px] text-gray-600 dark:text-gray-400 mb-3 text-center">Rate us on the Play Store to help us grow!</p>
          
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                onMouseEnter={() => setRating(star)}
                onClick={() => setSubmitted(true)}
                className="text-brand-pink text-2xl hover:scale-110 active:scale-95 transition-transform"
              >
                {rating >= star ? <MdStar /> : <MdStarBorder />}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center p-2 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-10 h-10 bg-brand-pink text-white rounded-full flex items-center justify-center mb-2 shadow-md">
            <MdStar className="w-6 h-6" />
          </div>
          <h4 className="text-[14px] font-bold text-[#FF2D8D]">Thank you!</h4>
          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">Redirecting to Play Store...</p>
        </div>
      )}
    </div>
  );
};
