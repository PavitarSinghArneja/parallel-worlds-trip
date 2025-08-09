import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Scan } from 'lucide-react';
import heroImage from '@/assets/parallel-hero.jpg';

export const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-universe opacity-80"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-primary rounded-full cosmic-float animation-delay-1000"></div>
      <div className="absolute top-40 right-20 w-2 h-2 bg-secondary rounded-full cosmic-float animation-delay-2000"></div>
      <div className="absolute bottom-40 left-20 w-4 h-4 bg-accent rounded-full cosmic-float animation-delay-3000"></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          {/* Logo/Brand */}
          <div className="cosmic-float">
            <h1 className="text-7xl md:text-8xl font-montserrat font-black tracking-tight">
              <span className="neon-text">Parallel</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mt-2 font-light">
              Travel in a Parallel Universe
            </p>
          </div>
          
          {/* Main Value Prop */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-montserrat font-bold leading-tight">
              See the <span className="neon-text">other you</span>.
              <br />
              Steal their <span className="text-accent">trip</span>.
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              What if you lived differently? Discover your alternate universe self, 
              steal their amazing travel itinerary, and earn Universe Points by living their adventures.
            </p>
          </div>
          
          {/* CTA Section */}
          <div className="space-y-6">
            <Button 
              size="lg"
              className="glass-button text-xl px-12 py-6 pulse-neon group"
              onClick={() => navigate('/quiz')}
            >
              <Scan className="w-6 h-6 mr-3" />
              Scan My Other Self
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Takes 2 minutes • Completely free • No account required
            </p>
          </div>
          
          {/* Social Proof / Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-semibold mb-2">AI-Generated Parallel Self</h3>
              <p className="text-sm text-muted-foreground">
                See who you could be in another universe
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-semibold mb-2">Steal Their Itinerary</h3>
              <p className="text-sm text-muted-foreground">
                Get their exact travel plans and adventures
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Earn Universe Points</h3>
              <p className="text-sm text-muted-foreground">
                Complete activities and unlock achievements
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};