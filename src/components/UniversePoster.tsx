import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UniverseData {
  universeTag: string;
  description: string;
  imageUrl: string;
  traits: string[];
}

interface UniversePosterProps {
  data: UniverseData;
}

export const UniversePoster: React.FC<UniversePosterProps> = ({ data }) => {
  return (
    <Card className="universe-poster p-8 max-w-md mx-auto cosmic-float">
      <div className="space-y-6">
        <div className="aspect-square bg-gradient-neon rounded-lg flex items-center justify-center text-6xl">
          🌟
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-montserrat font-bold neon-text">
            {data.universeTag}
          </h2>
          
          <p className="text-lg text-muted-foreground">
            {data.description}
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            {data.traits.map((trait, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="bg-gradient-glass border border-primary/30"
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Universe Classification
          </div>
          <div className="text-accent font-semibold">
            PARALLEL-{Math.random().toString(36).substr(2, 6).toUpperCase()}
          </div>
        </div>
      </div>
    </Card>
  );
};