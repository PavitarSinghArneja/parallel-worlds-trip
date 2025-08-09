import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuizForm } from '@/components/QuizForm';
import { SelfieUploader } from '@/components/SelfieUploader';

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'quiz' | 'selfie'>('quiz');
  const [quizData, setQuizData] = useState<any>(null);

  const handleQuizComplete = (data: any) => {
    setQuizData(data);
    setStep('selfie');
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