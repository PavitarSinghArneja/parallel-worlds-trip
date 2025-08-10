// Types for the parallel universe app

export interface QuizAnswers {
  lifestyle: string;
  personality: string;
  adventure: string;
  interests: string;
  budget: string;
  cityName: string;
  startDate: string;
  endDate: string;
  tripName: string;
  persona?: string;
  activities: string;
  foodDrinks: string;
  entertainment: string;
  sightseeing: string;
  relaxation: string;
  customInputs: {
    activities?: string;
    foodDrinks?: string;
    entertainment?: string;
    sightseeing?: string;
    relaxation?: string;
  };
  selfieUrl?: string;
}

export interface ParallelSelf {
  universeTag: string;
  description: string;
  traits: string[];
  location: string;
  profession: string;
  backstory: string;
  imageUrl?: string;
}

export interface Activity {
  time: string;
  activity: string;
  location: string;
  points: number;
  type: 'adventure' | 'culture' | 'food' | 'relaxation' | 'work';
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
}

export interface MustDoAttraction {
  name: string;
  location: string;
  description: string;
  estimatedTime: string;
  bestTimeToVisit: string;
  insiderTip: string;
}

export interface FoodDrink {
  restaurantName: string;
  location: string;
  cuisine: string;
  mustTryDishes: string[];
  priceRange: string;
  specialtyNote: string;
  bestTime: string;
}

export interface RestaurantRecommendation {
  restaurant: string;
  location: string;
  dish?: string;
  speciality?: string;
}

export interface DayActivity {
  time: string;
  activity: string;
  location: string;
  description: string;
  transportTip?: string;
  lunchRecommendation?: RestaurantRecommendation;
  dinnerRecommendation?: RestaurantRecommendation;
}

export interface DetailedDay {
  day: number;
  theme: string;
  morning: DayActivity;
  afternoon: DayActivity;
  evening: DayActivity;
}

export interface HotelRecommendation {
  name: string;
  location: string;
  priceRange: string;
  whyRecommended: string;
  nearbyAttractions: string[];
}

export interface TransportationTips {
  gettingToCity: string;
  gettingAround: string;
  costSavingTips: string;
  downloadApps: string[];
}

export interface WeatherConsiderations {
  seasonalTips: string;
  backupIndoorActivities: string[];
  whatToPack: string[];
}

export interface BudgetEstimate {
  dailyFoodBudget: string;
  attractionsCost: string;
  transportationCost: string;
  totalEstimate: string;
}

export interface DetailedItinerary {
  cityName: string;
  tripDuration: string;
  overview: string;
  mustDoAttractions: MustDoAttraction[];
  foodAndDrinks: FoodDrink[];
  dayByDayItinerary: DetailedDay[];
  hotelRecommendations: HotelRecommendation[];
  transportationTips: TransportationTips;
  localInsiderTips: string[];
  weatherConsiderations: WeatherConsiderations;
  budgetEstimate: BudgetEstimate;
}

export interface TravelItinerary {
  title: string;
  location: string;
  duration: string;
  itinerary: ItineraryDay[];
  totalPoints: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  detailed?: DetailedItinerary;
}

export interface TripItem {
  id: string;
  title: string;
  description: string;
  location: string;
  time?: string;
  points: number;
  difficulty: string;
  type?: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  difficulty: string;
  tags: string[];
  totalPoints: number;
  itinerary: TripItem[];
}