import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle } from 'lucide-react';

interface ItineraryItemData {
  id: string;
  title: string;
  description: string;
  location: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ItineraryItemProps {
  item: ItineraryItemData;
  isCompleted: boolean;
  onComplete: () => void;
}

const difficultyColors = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/20 text-red-400 border-red-500/30'
};

export const ItineraryItem: React.FC<ItineraryItemProps> = ({ 
  item, 
  isCompleted, 
  onComplete 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    // Simulate completion process
    setTimeout(() => {
      onComplete();
      setIsCompleting(false);
    }, 1000);
  };

  return (
    <Card className={`glass-card p-6 transition-all ${
      isCompleted ? 'border-primary/50 bg-primary/5' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-lg font-semibold ${
              isCompleted ? 'line-through text-muted-foreground' : ''
            }`}>
              {item.title}
            </h3>
            {isCompleted && <CheckCircle className="w-5 h-5 text-primary" />}
          </div>
          
          <p className="text-muted-foreground mb-3">
            {item.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {item.location}
            </div>
            
            <div className="flex items-center gap-1 text-accent">
              <Star className="w-4 h-4" />
              {item.points} points
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge className={difficultyColors[item.difficulty]}>
            {item.difficulty}
          </Badge>
          
          {!isCompleted && (
            <Button 
              onClick={handleComplete}
              disabled={isCompleting}
              className="glass-button"
              size="sm"
            >
              {isCompleting ? 'Completing...' : 'Complete'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};