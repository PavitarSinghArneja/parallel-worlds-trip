import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UniversePoster } from '@/components/UniversePoster';
import { generateParallelSelf } from '@/lib/gemini';
import { generateParallelSelfImage } from '@/lib/openai';
import { ParallelSelf } from '@/types';

const Reveal = () => {
  const navigate = useNavigate();
  const [universeData, setUniverseData] = useState<ParallelSelf | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateUniverse = async () => {
      try {
        const quizData = localStorage.getItem('parallel-quiz');
        if (!quizData) {
          navigate('/quiz');
          return;
        }

        const data = JSON.parse(quizData);
        setIsLoading(true);
        setError(null);

        // Generate parallel self using Gemini AI
        const parallelSelf = await generateParallelSelf(data);
        
        // Generate image using OpenAI
        const imageUrl = await generateParallelSelfImage(parallelSelf, data.selfieUrl);
        
        const completeUniverseData = {
          ...parallelSelf,
          imageUrl
        };

        setUniverseData(completeUniverseData);
        // Store the complete data for the trip page
        localStorage.setItem('parallel-universe', JSON.stringify(completeUniverseData));
        
      } catch (err) {
        console.error('Error generating universe:', err);
        setError('Failed to generate your parallel universe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateUniverse();
  }, [navigate]);

  const handleStealTrip = () => {
    // Navigate to trip page with generated itinerary
    const tripId = `trip-${Date.now()}`;
    navigate(`/trip/${tripId}`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => navigate('/quiz')} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !universeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Scanning parallel universes...</p>
          <p className="text-sm text-muted-foreground mt-2">
            This may take a minute while we generate your alternate self
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-montserrat font-bold mb-4 cosmic-float">
          Meet Your <span className="neon-text">Parallel</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          This is who you could be in another universe...
        </p>
        
        <UniversePoster data={universeData} />
        
        <div className="mt-12 space-y-4">
          <Button 
            size="lg" 
            className="glass-button text-lg px-12 py-6 pulse-neon"
            onClick={handleStealTrip}
          >
            Steal This Trip
          </Button>
          <p className="text-sm text-muted-foreground">
            Experience their adventures and earn Universe Points
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reveal;