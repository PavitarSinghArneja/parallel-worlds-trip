import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; emoji: string }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'lifestyle',
    question: 'What if you could live anywhere in the world?',
    options: [
      { value: 'nomad', label: 'Working remotely from Bali beaches', emoji: '🏖️' },
      { value: 'city', label: 'Conquering the corporate world in Tokyo', emoji: '🏙️' },
      { value: 'mountain', label: 'Running a mountain lodge in Switzerland', emoji: '🏔️' },
      { value: 'adventure', label: 'Leading expeditions in Patagonia', emoji: '🗻' },
    ]
  },
  {
    id: 'personality',
    question: 'What if you had unlimited confidence?',
    options: [
      { value: 'entrepreneur', label: 'Starting the next billion-dollar company', emoji: '🚀' },
      { value: 'artist', label: 'Creating masterpieces that inspire millions', emoji: '🎨' },
      { value: 'explorer', label: 'Discovering hidden corners of the world', emoji: '🗺️' },
      { value: 'leader', label: 'Leading movements that change society', emoji: '👑' },
    ]
  },
  {
    id: 'adventure',
    question: 'What if money was no object?',
    options: [
      { value: 'luxury', label: 'Private jets and Michelin-starred dinners', emoji: '✈️' },
      { value: 'experiences', label: 'Unique adventures money can\'t usually buy', emoji: '🎪' },
      { value: 'impact', label: 'Funding projects that save the planet', emoji: '🌍' },
      { value: 'freedom', label: 'Complete freedom to follow every whim', emoji: '🦋' },
    ]
  }
];

interface QuizFormProps {
  onComplete: (data: any) => void;
}

export const QuizForm: React.FC<QuizFormProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (value: string) => {
    const newAnswers = {
      ...answers,
      [quizQuestions[currentQuestion].id]: value
    };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-2">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </div>
        <h2 className="text-2xl font-montserrat font-semibold mb-8">
          {currentQ.question}
        </h2>
      </div>

      <RadioGroup
        value={answers[currentQ.id] || ''}
        onValueChange={handleAnswer}
        className="space-y-4"
      >
        {currentQ.options.map((option) => (
          <Card 
            key={option.value} 
            className="glass-card p-6 cursor-pointer transition-all hover:border-primary/50 hover:shadow-neon"
          >
            <Label 
              htmlFor={option.value}
              className="flex items-center gap-4 cursor-pointer w-full"
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <span className="text-2xl">{option.emoji}</span>
              <span className="flex-1 text-left">{option.label}</span>
            </Label>
          </Card>
        ))}
      </RadioGroup>

      {currentQuestion > 0 && (
        <Button 
          variant="outline" 
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          className="w-full"
        >
          Previous Question
        </Button>
      )}
    </div>
  );
};