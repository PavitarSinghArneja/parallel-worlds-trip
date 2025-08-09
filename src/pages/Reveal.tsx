import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UniversePoster } from '@/components/UniversePoster';

const Reveal = () => {
  const navigate = useNavigate();
  const [universeData, setUniverseData] = useState<any>(null);

  useEffect(() => {
    // Get quiz data from localStorage
    const quizData = localStorage.getItem('parallel-quiz');
    if (quizData) {
      const data = JSON.parse(quizData);
      // Mock universe generation for demo
      setUniverseData({
        universeTag: "Adventurous Nomad",
        description: "In this universe, you're a fearless digital nomad who's traveled to 47 countries",
        imageUrl: "/placeholder.svg", // Will be replaced with AI-generated image
        traits: ["Risk-taker", "Tech-savvy", "Minimalist", "Culture enthusiast"]
      });
    } else {
      navigate('/quiz');
    }
  }, [navigate]);

  const handleStealTrip = () => {
    // Navigate to trip page with generated itinerary
    navigate('/trip/demo-trip');
  };

  if (!universeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Scanning parallel universes...</p>
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