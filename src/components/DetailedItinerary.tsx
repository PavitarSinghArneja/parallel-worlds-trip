import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Lightbulb, Cloud } from 'lucide-react';
import { DetailedItinerary as DetailedItineraryType } from '@/types';

interface DetailedItineraryProps {
  itinerary: DetailedItineraryType;
  tripName?: string;
}

export const DetailedItinerary: React.FC<DetailedItineraryProps> = ({ itinerary, tripName }) => {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="neon-text text-4xl font-bold">
            {tripName || `${itinerary.cityName} Adventure`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground mb-4">{itinerary.overview}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{itinerary.tripDuration}</Badge>
            <Badge variant="secondary">Personalized</Badge>
            <Badge variant="secondary">AI-Generated</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Day by Day Itinerary */}
      <div>
        <h2 className="text-3xl font-bold mb-4 neon-text">Day-by-Day Itinerary</h2>
        <div className="space-y-6">
          {itinerary.dayByDayItinerary.map((day) => (
            <Card key={day.day} className="glass-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">Day {day.day}: {day.theme}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Morning */}
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-primary">Morning • {day.morning.time}</h3>
                  <h4 className="font-bold text-lg">{day.morning.activity}</h4>
                  <p className="text-muted-foreground"><MapPin className="inline-block w-4 h-4 mr-2" />{day.morning.location}</p>
                  <p>{day.morning.description}</p>
                  {day.morning.transportTip && <p className="text-sm text-accent"><Lightbulb className="inline-block w-4 h-4 mr-2" />{day.morning.transportTip}</p>}
                </div>
                {/* Afternoon */}
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-primary">Afternoon • {day.afternoon.time}</h3>
                  <h4 className="font-bold text-lg">{day.afternoon.activity}</h4>
                  <p className="text-muted-foreground"><MapPin className="inline-block w-4 h-4 mr-2" />{day.afternoon.location}</p>
                  <p>{day.afternoon.description}</p>
                  {day.afternoon.lunchRecommendation && 
                    <div className="border-l-4 border-accent pl-4 mt-2">
                      <p className="font-semibold">Lunch: {day.afternoon.lunchRecommendation.restaurant}</p>
                      <p className="text-sm">Try their {day.afternoon.lunchRecommendation.dish} at {day.afternoon.lunchRecommendation.location}</p>
                    </div>
                  }
                </div>
                {/* Evening */}
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-primary">Evening • {day.evening.time}</h3>
                  <h4 className="font-bold text-lg">{day.evening.activity}</h4>
                  <p className="text-muted-foreground"><MapPin className="inline-block w-4 h-4 mr-2" />{day.evening.location}</p>
                  <p>{day.evening.description}</p>
                  {day.evening.dinnerRecommendation && 
                    <div className="border-l-4 border-accent pl-4 mt-2">
                      <p className="font-semibold">Dinner: {day.evening.dinnerRecommendation.restaurant}</p>
                      <p className="text-sm">Known for {day.evening.dinnerRecommendation.speciality} at {day.evening.dinnerRecommendation.location}</p>
                    </div>
                  }
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Must-Do Attractions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="neon-text text-3xl font-bold">Must-Do Attractions</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {itinerary.mustDoAttractions.map((attraction, index) => (
            <Card key={index} className="bg-muted/50">
              <CardHeader>
                <CardTitle>{attraction.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground"><MapPin className="inline-block w-4 h-4 mr-2" />{attraction.location}</p>
                <p>{attraction.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{attraction.estimatedTime}</Badge>
                  <Badge variant="outline">{attraction.bestTimeToVisit}</Badge>
                </div>
                <p className="text-sm text-accent mt-2"><Lightbulb className="inline-block w-4 h-4 mr-2" />{attraction.insiderTip}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Food & Drinks */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="neon-text text-3xl font-bold">Food & Drinks</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {itinerary.foodAndDrinks.map((restaurant, index) => (
            <Card key={index} className="bg-muted/50">
              <CardHeader>
                <CardTitle>{restaurant.restaurantName}</CardTitle>
                <Badge variant="outline">{restaurant.priceRange}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{restaurant.location}</p>
                <p>{restaurant.specialtyNote}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {restaurant.mustTryDishes.map((dish, dishIndex) => (
                    <Badge key={dishIndex} variant="secondary">{dish}</Badge>
                  ))}
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>{restaurant.cuisine}</span>
                  <span>{restaurant.bestTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};