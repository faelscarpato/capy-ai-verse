import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: { icon: React.ReactNode; color: string; label: string };
  rightAction?: { icon: React.ReactNode; color: string; label: string };
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = { icon: <Heart className="h-5 w-5" />, color: 'bg-red-500', label: 'Favoritar' },
  rightAction = { icon: <Trash2 className="h-5 w-5" />, color: 'bg-gray-500', label: 'Remover' },
  className
}) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    setDragX(Math.max(-150, Math.min(150, diff)));
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragX) > threshold) {
      if (dragX > 0 && onSwipeRight) {
        onSwipeRight();
        if ('vibrate' in navigator) navigator.vibrate(50);
      } else if (dragX < 0 && onSwipeLeft) {
        onSwipeLeft();
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
    }
    
    setDragX(0);
    setIsDragging(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Background actions */}
      <div className="absolute inset-0 flex">
        {/* Right swipe action */}
        <div 
          className={cn(
            "flex items-center justify-center text-white transition-all",
            rightAction.color
          )}
          style={{ 
            width: `${Math.max(0, dragX)}px`,
            opacity: dragX > 0 ? Math.min(1, dragX / threshold) : 0
          }}
        >
          <div className="flex flex-col items-center gap-1">
            {rightAction.icon}
            <span className="text-xs font-medium">{rightAction.label}</span>
          </div>
        </div>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Left swipe action */}
        <div 
          className={cn(
            "flex items-center justify-center text-white transition-all",
            leftAction.color
          )}
          style={{ 
            width: `${Math.max(0, -dragX)}px`,
            opacity: dragX < 0 ? Math.min(1, -dragX / threshold) : 0
          }}
        >
          <div className="flex flex-col items-center gap-1">
            {leftAction.icon}
            <span className="text-xs font-medium">{leftAction.label}</span>
          </div>
        </div>
      </div>

      {/* Card content */}
      <Card
        className={cn("relative z-10 transition-transform", className)}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </Card>
    </div>
  );
};