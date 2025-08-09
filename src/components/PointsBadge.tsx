import { Badge } from '@/components/ui/badge';
import { Star, Zap } from 'lucide-react';

interface PointsBadgeProps {
  points: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PointsBadge: React.FC<PointsBadgeProps> = ({ 
  points, 
  showIcon = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-lg px-4 py-2'
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  return (
    <Badge 
      className={`
        bg-gradient-neon text-white border-0 font-semibold
        ${sizeClasses[size]}
        shadow-neon animate-pulse
      `}
    >
      {showIcon && <Zap className={`${iconSize[size]} mr-1`} />}
      {points.toLocaleString()}
      <span className="ml-1 opacity-80">UP</span>
    </Badge>
  );
};