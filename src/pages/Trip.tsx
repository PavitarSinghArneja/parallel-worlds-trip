import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ItineraryItem } from '@/components/ItineraryItem';
import { PointsBadge } from '@/components/PointsBadge';
import { DetailedItinerary } from '@/components/DetailedItinerary';
import { generateTravelItinerary } from '@/lib/gemini';
import { Trip as TripType, TripItem, ParallelSelf } from '@/types';

const Trip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { addPoints } = useAuth();
  const [trip, setTrip] = useState<TripType | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setIsLoading(true);
        setError(null);

        

        // Get universe data and quiz data
        const universeData = localStorage.getItem('parallel-universe');
        const quizData = localStorage.getItem('parallel-quiz');
        
        if (!universeData || !quizData) {
          navigate('/quiz');
          return;
        }

        const parallelSelf = JSON.parse(universeData);
        const parsedQuizData = JSON.parse(quizData);
        
        console.log('🏃 Loading trip data...');
        console.log('👤 Parallel self:', parallelSelf);
        console.log('📋 Parsed quiz data:', parsedQuizData);
        
        // Get the stored persona
        const persona = localStorage.getItem('traveler-persona') || 'traveler';
        console.log('👤 Retrieved persona from localStorage:', persona);
        
        // Create interests object from the stored quiz data
        const extractedInterests = {
          activities: parsedQuizData.activities.split(', '),
          foodDrinks: parsedQuizData.foodDrinks.split(', '),
          entertainment: parsedQuizData.entertainment.split(', '),
          sightseeing: parsedQuizData.sightseeing.split(', '),
          relaxation: parsedQuizData.relaxation.split(', ')
        };
        
        console.log('🎯 Extracted interests for itinerary:', extractedInterests);
        console.log('🚀 About to generate itinerary with:', {
          persona,
          city: parsedQuizData.cityName,
          startDate: parsedQuizData.startDate,
          endDate: parsedQuizData.endDate
        });
        
        const itinerary = await generateTravelItinerary(parallelSelf, parsedQuizData, extractedInterests, persona);
        console.log('✅ Generated itinerary:', itinerary);
        
        // Convert the itinerary format to match our component expectations
        const formattedTrip: TripType = {
          id: tripId || 'default-trip',
          title: itinerary.title,
          description: `Live like your parallel self: ${parallelSelf.universeTag}`,
          location: itinerary.location,
          duration: itinerary.duration,
          difficulty: itinerary.difficulty,
          tags: itinerary.tags,
          totalPoints: itinerary.totalPoints,
          detailed: itinerary.detailed,
          itinerary: itinerary.detailed.dayByDayItinerary.flatMap((day) => {
            const activities: TripItem[] = [];
            const addActivity = (activity: any, timeOfDay: string, dayNum: number) => {
              if (activity && activity.activity) {
                activities.push({
                  id: `${dayNum}-${timeOfDay}`,
                  title: activity.activity,
                  description: `Day ${dayNum}: ${activity.description}`,
                  location: activity.location,
                  time: activity.time,
                  points: 10, // Default points
                  difficulty: 'Easy', // Default difficulty
                  type: timeOfDay,
                });
              }
            };
            addActivity(day.morning, 'morning', day.day);
            addActivity(day.afternoon, 'afternoon', day.day);
            addActivity(day.evening, 'evening', day.day);
            return activities;
          }),
        };

        setTrip(formattedTrip);
        
        
      } catch (err) {
        console.error('Error loading trip:', err);
        setError('Failed to load your trip. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrip();
  }, [tripId, navigate]);

  const handleCompleteItem = (itemId: string, points: number) => {
    setCompletedItems(prev => new Set([...prev, itemId]));
    addPoints(points);
  };

  const progress = trip ? (completedItems.size / trip.itinerary.length) * 100 : 0;
  const totalPoints = trip ? trip.itinerary.reduce((sum: number, item: TripItem) => 
    completedItems.has(item.id) ? sum + item.points : sum, 0) : 0;

  console.log('Final trip object:', trip);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/reveal')} variant="outline">
            Back to Reveal
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your parallel adventure...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Generating your personalized itinerary...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/reveal')}
            className="mb-4"
          >
            ← Back to Reveal
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
                {trip.detailed && (
                  <p className="text-accent font-semibold">
                    Duration: {trip.detailed.tripDuration}
                  </p>
                )}
              </div>
              <PointsBadge points={totalPoints} />
            </div>
            
            {trip.itinerary.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </div>

        {trip.detailed ? (
          <Tabs defaultValue="detailed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 glass-card">
              <TabsTrigger value="detailed">Detailed Itinerary</TabsTrigger>
              <TabsTrigger value="gamified">Gamified View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detailed" className="mt-6">
              <DetailedItinerary 
                itinerary={trip.detailed} 
                tripName={JSON.parse(localStorage.getItem('parallel-quiz') || '{}').tripName}
              />
            </TabsContent>
            
            <TabsContent value="gamified" className="mt-6">
              <div className="space-y-4">
                {trip.itinerary.map((item: TripItem) => (
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
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            {trip.itinerary.map((item: TripItem) => (
              <ItineraryItem
                key={item.id}
                item={item}
                isCompleted={completedItems.has(item.id)}
                onComplete={() => handleCompleteItem(item.id, item.points)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trip;