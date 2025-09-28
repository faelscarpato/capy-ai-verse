import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner = ({ size = 'md', className }: { size: string; className?: string }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-primary border-t-transparent', sizeClasses[size as keyof typeof sizeClasses], className)} />
  );
};

const LoadingDots = ({ size = 'md', className }: { size: string; className?: string }) => {
  const sizeClasses = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3'
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary rounded-full animate-pulse',
            sizeClasses[size as keyof typeof sizeClasses]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse bg-muted rounded', className)} />
);

const LoadingPulse = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse bg-gradient-to-r from-muted via-muted-foreground/20 to-muted rounded', className)} />
);

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  className,
  text
}) => {
  const renderLoading = () => {
    switch (variant) {
      case 'spinner':
        return <LoadingSpinner size={size} className={className} />;
      case 'dots':
        return <LoadingDots size={size} className={className} />;
      case 'skeleton':
        return <LoadingSkeleton className={className} />;
      case 'pulse':
        return <LoadingPulse className={className} />;
      default:
        return <LoadingSpinner size={size} className={className} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {renderLoading()}
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const LoadingOverlay: React.FC<{ isLoading: boolean; children: React.ReactNode; text?: string }> = ({
  isLoading,
  children,
  text = 'Carregando...'
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Loading variant="spinner" size="lg" text={text} />
        </div>
      )}
    </div>
  );
};

export default Loading;