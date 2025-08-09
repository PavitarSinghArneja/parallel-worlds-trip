import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const mockTrips = [
    {
      id: 'demo-trip',
      title: 'Digital Nomad Adventure',
      universeTag: 'Adventurous Nomad',
      completed: true,
      pointsEarned: 750
    }
  ];

  const mockBadges = [
    { id: 'first-scan', name: 'First Scan', description: 'Discovered your first parallel self' },
    { id: 'trip-starter', name: 'Trip Starter', description: 'Started your first parallel adventure' },
    { id: 'nomad-master', name: 'Nomad Master', description: 'Completed the Digital Nomad universe' }
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            ← Back to Home
          </Button>
          
          <Card className="glass-card p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-neon rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.name?.[0] || 'E'}
              </div>
              <div>
                <h1 className="text-3xl font-montserrat font-bold neon-text">
                  {user?.name || 'Explorer'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Parallel Universe Explorer
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold neon-text mb-2">
                  {user?.points || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Universe Points
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">
                  {mockTrips.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Universes Conquered
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {mockBadges.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Badges Earned
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-montserrat font-bold mb-4">
              Your Parallel Adventures
            </h2>
            <div className="space-y-4">
              {mockTrips.map((trip) => (
                <Card key={trip.id} className="glass-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{trip.title}</h3>
                      <p className="text-sm text-muted-foreground">{trip.universeTag}</p>
                    </div>
                    {trip.completed && (
                      <Badge variant="secondary" className="bg-gradient-neon text-white">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">+{trip.pointsEarned} points earned</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/trip/${trip.id}`)}
                    >
                      View Trip
                    </Button>
                  </div>
                </Card>
              ))}
              
              <Card className="glass-card p-6 border-dashed border-2 border-primary/30">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Ready for your next parallel adventure?
                  </p>
                  <Button 
                    className="glass-button"
                    onClick={() => navigate('/quiz')}
                  >
                    Scan New Universe
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-montserrat font-bold mb-4">
              Achievements
            </h2>
            <div className="space-y-4">
              {mockBadges.map((badge) => (
                <Card key={badge.id} className="glass-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center">
                      🏆
                    </div>
                    <div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;