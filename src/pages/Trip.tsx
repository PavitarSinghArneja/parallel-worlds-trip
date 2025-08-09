import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { ItineraryItem } from '@/components/ItineraryItem';
import { PointsBadge } from '@/components/PointsBadge';

const Trip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { addPoints } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Mock trip data for demo
    setTrip({
      id: tripId,
      title: "Digital Nomad Adventure",
      description: "Live like your parallel self for 7 days",
      estimatedBudget: "$2,400",
      itinerary: [
        {
          id: "1",
          title: "Work from a Bali co-working space",
          description: "Experience the nomad lifestyle at Dojo Bali",
          location: "Canggu, Bali",
          points: 150,
          difficulty: "easy"
        },
        {
          id: "2", 
          title: "Surf at sunrise",
          description: "Catch waves at Echo Beach before the crowds",
          location: "Echo Beach, Bali",
          points: 200,
          difficulty: "medium"
        },
        {
          id: "3",
          title: "Build an app in a café",
          description: "Code for 4 hours in a traditional Balinese café",
          location: "Ubud, Bali",
          points: 300,
          difficulty: "hard"
        },
        {
          id: "4",
          title: "Network at a digital nomad meetup",
          description: "Connect with fellow nomads at weekly meetup",
          location: "Seminyak, Bali",
          points: 100,
          difficulty: "easy"
        }
      ]
    });
  }, [tripId]);

  const handleCompleteItem = (itemId: string, points: number) => {
    setCompletedItems(prev => new Set([...prev, itemId]));
    addPoints(points);
  };

  const progress = trip ? (completedItems.size / trip.itinerary.length) * 100 : 0;
  const totalPoints = trip ? trip.itinerary.reduce((sum: number, item: any) => 
    completedItems.has(item.id) ? sum + item.points : sum, 0) : 0;

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your parallel adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="mb-4"
          >
            ← Back to Profile
          </Button>
          
          <div className="glass-card p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-montserrat font-bold mb-2 neon-text">
                  {trip.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {trip.description}
                </p>
                <p className="text-accent font-semibold">
                  Budget: {trip.estimatedBudget}
                </p>
              </div>
              <PointsBadge points={totalPoints} />
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-semibold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {trip.itinerary.map((item: any) => (
            <ItineraryItem
              key={item.id}
              item={item}
              isCompleted={completedItems.has(item.id)}
              onComplete={() => handleCompleteItem(item.id, item.points)}
            />
          ))}
        </div>

        {progress === 100 && (
          <Card className="glass-card p-8 text-center mt-8 pulse-neon">
            <h2 className="text-3xl font-montserrat font-bold mb-4 neon-text">
              Universe Conquered! 🌟
            </h2>
            <p className="text-lg mb-6">
              You've successfully lived as your parallel self!
            </p>
            <Button 
              size="lg" 
              className="glass-button"
              onClick={() => navigate('/profile')}
            >
              View Your Achievements
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Trip;