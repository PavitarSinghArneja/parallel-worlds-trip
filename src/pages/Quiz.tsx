import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuizForm } from '@/components/QuizForm';
import { SelfieUploader } from '@/components/SelfieUploader';
import { QuizAnswers } from '@/types';
import { extractCityAndGenerateInterests } from '@/lib/gemini';

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'quiz' | 'selfie'>('quiz');
  const [quizData, setQuizData] = useState<QuizAnswers | null>(null);

  const handleQuizComplete = async (data: QuizAnswers) => {
    console.log('🎯 Quiz completed with data:', data);
    console.log('📝 Lifestyle text:', data.lifestyle);
    
    try {
      console.log('🚀 Starting persona extraction...');
      // Extract city, persona, and generate interests based on preferences
      const { cityName, tripName, persona, interests } = await extractCityAndGenerateInterests(data);
      
      console.log('✅ Extraction successful!');
      console.log('🏙️ Extracted city:', cityName);
      console.log('👤 Extracted persona:', persona);
      console.log('🎭 Trip name:', tripName);
      console.log('🎯 Generated interests:', interests);
      
      const dataWithExtracted = { 
        ...data, 
        cityName, 
        tripName,
        // Store persona for itinerary generation
        persona,
        // Map interests to the quiz format
        activities: interests.activities.join(', '),
        foodDrinks: interests.foodDrinks.join(', '),
        entertainment: interests.entertainment.join(', '),
        sightseeing: interests.sightseeing.join(', '),
        relaxation: interests.relaxation.join(', ')
      };
      
      console.log('💾 Final quiz data:', dataWithExtracted);
      
      // Store persona separately for itinerary generation
      localStorage.setItem('traveler-persona', persona);
      console.log('💾 Stored persona in localStorage:', persona);
      
      setQuizData(dataWithExtracted);
      setStep('selfie');
    } catch (error) {
      console.error('❌ Error extracting city and generating interests:', error);
      console.log('🔄 Using fallback data...');
      
      // Fallback to user-provided data with defaults
      const fallbackData = { 
        ...data, 
        cityName: 'Tokyo', 
        tripName: 'Adventure Awaits',
        activities: 'Shopping, Photography',
        foodDrinks: 'Street Food, Local Specialties',
        entertainment: 'Nightlife, Live Music',
        sightseeing: 'Museums, Historical Sites',
        relaxation: 'Spa & Wellness'
      };
      localStorage.setItem('traveler-persona', 'traveler');
      console.log('💾 Stored fallback persona: traveler');
      
      setQuizData(fallbackData);
      setStep('selfie');
    }
  };

  const handleSelfieComplete = (selfieUrl: string) => {
    // Store data and navigate to reveal
    localStorage.setItem('parallel-quiz', JSON.stringify({ ...quizData, selfieUrl }));
    navigate('/reveal');
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-montserrat font-bold mb-4 neon-text">
            Scan Your Other Self
          </h1>
          <p className="text-lg text-muted-foreground">
            Answer these questions to discover your parallel universe
          </p>
        </div>
        
        <Card className="glass-card p-8">
          {step === 'quiz' ? (
            <QuizForm onComplete={handleQuizComplete} />
          ) : (
            <SelfieUploader onComplete={handleSelfieComplete} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Quiz;