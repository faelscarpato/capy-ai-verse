import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  initialSnap?: number;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.3, 0.6, 0.9],
  initialSnap = 1,
  className
}) => {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaY = e.touches[0].clientY - startY;
    const newY = Math.max(0, deltaY);
    setCurrentY(startY + newY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const deltaY = currentY - startY;
    const threshold = window.innerHeight * 0.1;

    if (deltaY > threshold) {
      // Swipe down - close or snap to lower position
      if (currentSnap === 0) {
        onClose();
      } else {
        setCurrentSnap(Math.max(0, currentSnap - 1));
      }
    } else if (deltaY < -threshold) {
      // Swipe up - snap to higher position
      setCurrentSnap(Math.min(snapPoints.length - 1, currentSnap + 1));
    }
    
    setCurrentY(startY);
  };

  const getSheetHeight = () => {
    if (isDragging) {
      const dragOffset = Math.max(0, currentY - startY);
      return `${(snapPoints[currentSnap] * 100) - (dragOffset / window.innerHeight * 100)}%`;
    }
    return `${snapPoints[currentSnap] * 100}%`;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-background rounded-t-xl shadow-2xl z-50',
          'transition-all duration-300 ease-out',
          className
        )}
        style={{
          height: getSheetHeight(),
          transform: isDragging ? 'none' : undefined
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;