import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizAnswers, ParallelSelf, TravelItinerary } from '@/types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const imageModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const cleanJsonString = (str: string): string => {
  // Remove comments
  let cleaned = str.replace(/\/\/.*$/gm, '');
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove trailing commas
  cleaned = cleaned.replace(/,(\s*[\}\]])/g, '$1');
  return cleaned;
};



export const generateParallelSelf = async (quizAnswers: QuizAnswers): Promise<ParallelSelf> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Based on these quiz answers, create a parallel universe version of this person:
  
  Lifestyle choice: ${quizAnswers.lifestyle}
  Personality trait: ${quizAnswers.personality} 
  Money preference: ${quizAnswers.adventure}
  
  Please generate a JSON response with:
  {
    "universeTag": "A short catchy title (2-4 words)",
    "description": "A compelling 1-2 sentence description of who they are in this universe",
    "traits": ["trait1", "trait2", "trait3", "trait4"] (4 personality traits),
    "location": "Primary location where they live/travel",
    "profession": "What they do for work/passion",
    "backstory": "A brief backstory explaining how they got to this point"
  }
  
  Make it aspirational, exciting, and aligned with their quiz choices. Be creative but realistic.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const cleanedJson = cleanJsonString(jsonMatch[0]);
      return JSON.parse(cleanedJson);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error generating parallel self:', error);
    throw error;
  }
};

export const extractCityAndGenerateInterests = async (quizData: QuizAnswers): Promise<{cityName: string, tripName: string, persona: string, interests: any}> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Based on the user's lifestyle description and preferences, extract the city, persona, and generate interest categories:

**USER'S LIFESTYLE DESCRIPTION:**
"${quizData.lifestyle}"

**PERSONALITY & PREFERENCES:**
• Personality with Confidence: ${quizData.personality}
• Money No Object Choice: ${quizData.adventure}
• Travel Interests: ${quizData.interests}
• Budget Style: ${quizData.budget}

**TASKS:**
1. Extract the CITY mentioned or implied in their lifestyle description
2. Identify the PERSONA/ROLE they want to embody (student, billionaire, corporate executive, artist, chef, racer, etc.)
3. Generate a creative trip name based on their vibe and persona
4. Map their preferences to specific interest categories that align with their persona

Return ONLY in this JSON format:
{
  "cityName": "Extracted City Name",
  "persona": "Extracted Persona/Role (e.g., student, billionaire, corporate executive, artist, chef, racer, digital nomad, etc.)",
  "tripName": "Creative Trip Name",
  "interests": {
    "activities": ["Activities tailored to persona"],
    "foodDrinks": ["Food experiences suitable for persona"],
    "entertainment": ["Entertainment matching persona lifestyle"],
    "sightseeing": ["Cultural sites relevant to persona"],
    "relaxation": ["Relaxation options fitting persona budget/style"]
  }
}

Examples:
- "student in Mumbai" → Mumbai + "student" + budget-friendly activities, street food, student hangouts
- "billionaire exploring Dubai" → Dubai + "billionaire" + luxury experiences, high-end dining, exclusive venues  
- "corporate executive in Tokyo" → Tokyo + "corporate executive" + business districts, upscale restaurants, networking venues
- "artist living in Paris" → Paris + "artist" + galleries, creative workshops, bohemian cafes
- "chef discovering Bangkok" → Bangkok + "chef" + cooking classes, food markets, authentic restaurants
- "racer in Monaco" → Monaco + "racer" + racing circuits, luxury cars, adrenaline activities`;

  try {
    console.log('🤖 Sending persona extraction request...');
    console.log('📝 User lifestyle input:', quizData.lifestyle);
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('🤖 Persona extraction response length:', text.length);
    console.log('🤖 Persona extraction response:', text);
    
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const cleanedJson = cleanJsonString(jsonMatch[0]);
      const parsed = JSON.parse(cleanedJson);
      console.log('✅ Parsed persona data:', parsed);
      return parsed;
    }
    
    console.error('❌ No JSON found in response:', text);
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('❌ Error extracting city and generating interests:', error);
    // Return a default based on lifestyle preference
    let defaultCity = 'Tokyo';
    let defaultPersona = 'traveler';
    
    const lifestyle = quizData.lifestyle.toLowerCase();
    if (lifestyle.includes('mumbai')) defaultCity = 'Mumbai';
    else if (lifestyle.includes('bali')) defaultCity = 'Bali';
    else if (lifestyle.includes('paris')) defaultCity = 'Paris';
    else if (lifestyle.includes('london')) defaultCity = 'London';
    
    // Try to extract persona from lifestyle text
    if (lifestyle.includes('student')) defaultPersona = 'student';
    else if (lifestyle.includes('billionaire') || lifestyle.includes('rich')) defaultPersona = 'billionaire';
    else if (lifestyle.includes('corporate') || lifestyle.includes('executive')) defaultPersona = 'corporate executive';
    else if (lifestyle.includes('artist')) defaultPersona = 'artist';
    else if (lifestyle.includes('chef')) defaultPersona = 'chef';
    else if (lifestyle.includes('racer')) defaultPersona = 'racer';
    
    return {
      cityName: defaultCity,
      persona: defaultPersona,
      tripName: 'Adventure Awaits',
      interests: {
        activities: ['Shopping', 'Photography', 'Walking Tours'],
        foodDrinks: ['Local Specialties', 'Street Food'],
        entertainment: ['Nightlife', 'Live Music'],
        sightseeing: ['Museums', 'Historical Sites'],
        relaxation: ['Spa & Wellness']
      }
    };
  }
};

export const generateTravelItinerary = async (
  parallelSelf: ParallelSelf, 
  quizData: QuizAnswers,
  extractedInterests: any,
  persona: string
): Promise<TravelItinerary> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  // Calculate trip duration
  const startDate = new Date(quizData.startDate);
  const endDate = new Date(quizData.endDate);
  const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  
  const prompt = `You are an expert travel planner creating a personalized itinerary. Generate a detailed, day-by-day travel plan based on the following information:

**TRIP DETAILS:**
- Destination City: ${quizData.cityName}
- Travel Dates: ${quizData.startDate} to ${quizData.endDate} 
- Trip Duration: ${tripDuration} days
- Trip Name: ${quizData.tripName}

**TRAVELER PERSONA:**
- Role/Identity: ${persona}
- Perspective: Create this itinerary from the perspective of a ${persona}
- Consider their typical budget range, interests, social circles, and lifestyle preferences

**USER INTERESTS:**
- Activities & Adventures: ${extractedInterests.activities.join(', ')} (e.g., Beach, Sports, Adventure Sports, Hiking, Photography, Shopping)
- Food & Drinks: ${extractedInterests.foodDrinks.join(', ')} (e.g., Coffee Culture, Street Food, Local Specialties, Fine Dining, Wine Tasting)
- Urban Entertainment & Nightlife: ${extractedInterests.entertainment.join(', ')} (e.g., Nightlife, Live Music, Rooftop Bars, Theater)
- Sightseeing & Culture: ${extractedInterests.sightseeing.join(', ')} (e.g., Museums, Art Galleries, Historical Sites, Architecture, Nature Parks)
- Relaxation & Wellness: ${extractedInterests.relaxation.join(', ')} (e.g., Spa & Wellness, Massage, Yoga, Beach Relaxation)

**PERSONA-SPECIFIC EXAMPLES (MUST follow these patterns):**

**Student in Mumbai:**
- Stay: Hostels (₹500-1000/night), budget hotels
- Food: Street food (₹50-200/meal), local dhabas, college cafeterias
- Transport: Local trains (₹10), buses, auto-rickshaws
- Activities: Free museums, college festivals, beach hangouts, budget shopping

**Billionaire in Dubai:**
- Stay: Burj Al Arab (₹50000+/night), Royal suites
- Food: Michelin restaurants (₹10000+/meal), private dining
- Transport: Private jets, luxury cars, helicopters
- Activities: Private island visits, exclusive shopping, VIP experiences

**Artist in Paris:**
- Stay: Bohemian neighborhoods (€80-150/night), artistic quarters
- Food: Cafes (€15-30/meal), wine bars, local bistros
- Transport: Metro, walking, cycling
- Activities: Gallery openings, art workshops, street art tours, creative markets

**Chef in Bangkok:**
- Stay: Boutique hotels near markets (₹3000-6000/night)
- Food: Street vendors (₹100-300/meal), cooking schools, food tours
- Transport: Tuk-tuks, boats, walking food tours
- Activities: Market visits at 5AM, cooking classes, meeting local chefs

**CRITICAL REQUIREMENTS:**
1. **MUST generate EXACTLY ${tripDuration} days in the dayByDayItinerary array** - This is ${tripDuration} days total!
2. MUST create a truly personalized itinerary for a ${persona} in ${quizData.cityName}
3. MUST tailor ALL recommendations to match the ${persona} lifestyle and budget
4. MUST include specific venue names and addresses that exist in ${quizData.cityName}
5. MUST prioritize activities that a ${persona} would actually do
6. MUST include restaurants appropriate for ${persona}'s budget and interests
7. MUST add transportation suitable for ${persona} (luxury car, public transport, etc.)
8. MUST include estimated time and costs relevant to ${persona}
9. MUST add insider tips specific to ${persona} experience level
10. MUST consider ${persona}'s typical schedule and preferences
11. DO NOT use generic templates - make this unique to ${persona} in ${quizData.cityName}

**DURATION REQUIREMENT:** You MUST create ${tripDuration} complete day objects in the dayByDayItinerary array. Do not create fewer days!

**IMPORTANT: This should be completely different for a student vs billionaire vs artist. Tailor everything to the specific persona and city.**

**OUTPUT FORMAT (JSON):**
{
  "cityName": "${quizData.cityName}",
  "tripDuration": "${tripDuration} days",
  "overview": "Brief exciting description of what makes this city special for this traveler",
  "mustDoAttractions": [
    {
      "name": "Specific venue name",
      "location": "Full address",
      "description": "Why it's perfect for user's interests",
      "estimatedTime": "2-3 hours",
      "bestTimeToVisit": "Morning/Afternoon/Evening",
      "insiderTip": "Local secret or pro tip"
    }
  ],
  "foodAndDrinks": [
    {
      "restaurantName": "Specific restaurant name",
      "location": "Full address", 
      "cuisine": "Type of cuisine",
      "mustTryDishes": ["Dish 1", "Dish 2"],
      "priceRange": "$/$/$$/$$",
      "specialtyNote": "Why this place is special",
      "bestTime": "Breakfast/Lunch/Dinner/Snack"
    }
  ],
  "dayByDayItinerary": [
    // IMPORTANT: Create ${tripDuration} day objects (Day 1, Day 2, Day 3, etc.) - ALL ${tripDuration} DAYS REQUIRED!
    {
      "day": 1,
      "theme": "Exploring Historic ${quizData.cityName} / Cultural Immersion / etc.",
      "morning": {
        "time": "9:00 AM - 12:00 PM",
        "activity": "Specific activity name",
        "location": "Venue name and address",
        "description": "What you'll do and why it's perfect for your interests",
        "transportTip": "How to get there from hotel/previous location"
      },
      "afternoon": {
        "time": "1:00 PM - 5:00 PM", 
        "activity": "Specific activity name",
        "location": "Venue name and address",
        "description": "Detailed description",
        "lunchRecommendation": {
          "restaurant": "Restaurant name",
          "location": "Address",
          "dish": "Specific dish to try"
        }
      },
      "evening": {
        "time": "6:00 PM - 10:00 PM",
        "activity": "Specific activity name", 
        "location": "Venue name and address",
        "description": "What makes this perfect for evening",
        "dinnerRecommendation": {
          "restaurant": "Restaurant name",
          "location": "Address", 
          "speciality": "What they're known for"
        }
      }
    }
  ],
  "hotelRecommendations": [
    {
      "name": "Specific hotel name",
      "location": "Area/neighborhood", 
      "priceRange": "$/$/$$/$$",
      "whyRecommended": "Based on user interests and itinerary",
      "nearbyAttractions": ["Attraction 1", "Attraction 2"]
    }
  ],
  "transportationTips": {
    "gettingToCity": "Best way to reach the city",
    "gettingAround": "Best local transportation options",
    "costSavingTips": "Transportation cost-saving advice",
    "downloadApps": ["App 1", "App 2"]
  },
  "localInsiderTips": [
    "Tip 1: Specific actionable advice",
    "Tip 2: Hidden gem or local secret", 
    "Tip 3: Cultural etiquette or customs",
    "Tip 4: Best times to avoid crowds",
    "Tip 5: Money-saving or experience-enhancing tip"
  ],
  "weatherConsiderations": {
    "seasonalTips": "What to expect during travel dates",
    "backupIndoorActivities": ["Activity 1", "Activity 2"],
    "whatToPack": ["Essential items for the season"]
  },
  "budgetEstimate": {
    "dailyFoodBudget": "$X - $Y per person",
    "attractionsCost": "$X - $Y total", 
    "transportationCost": "$X - $Y per day",
    "totalEstimate": "$X - $Y for entire trip"
  }
}

CRITICAL: This itinerary MUST be completely different based on the persona:
- A STUDENT itinerary should have budget options, hostels, street food, free activities
- A BILLIONAIRE itinerary should have luxury hotels, private experiences, Michelin restaurants
- An ARTIST itinerary should focus on galleries, creative spaces, bohemian areas
- A CHEF itinerary should emphasize food markets, cooking classes, authentic restaurants

DO NOT use generic templates. Make this authentic and specific to ${persona} in ${quizData.cityName}.

🚨 FINAL REMINDER: The user requested ${tripDuration} days. You MUST include ALL ${tripDuration} days in your dayByDayItinerary array. Generate Day 1, Day 2, Day 3... up to Day ${tripDuration}. Do not stop at Day 2 or any number less than ${tripDuration}!`;

  try {
    console.log('🚀 Generating itinerary for:', persona, 'in', quizData.cityName);
    console.log('📅 Trip duration calculated:', tripDuration, 'days');
    console.log('📅 Start date:', quizData.startDate);
    console.log('📅 End date:', quizData.endDate);
    console.log('📝 Interests:', extractedInterests);
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('🤖 AI Response length:', text.length);
    console.log('🤖 AI Response preview:', text.substring(0, 200) + '...');
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      // Clean the JSON string before parsing
      const cleanedJson = cleanJsonString(jsonMatch[0]);
      try {
        const detailedItinerary = JSON.parse(cleanedJson);
        
        console.log('✅ Parsed itinerary for:', detailedItinerary.cityName);
        console.log('📅 Duration:', detailedItinerary.tripDuration);
        console.log('🏨 Hotels count:', detailedItinerary.hotelRecommendations?.length || 0);
        console.log('🍽️ Restaurants count:', detailedItinerary.foodAndDrinks?.length || 0);
        console.log('🏞️ Attractions count:', detailedItinerary.mustDoAttractions?.length || 0);
        console.log('🗓️ Daily itinerary count:', detailedItinerary.dayByDayItinerary?.length || 0);
        
        // Convert to our legacy format for compatibility
        return {
          title: detailedItinerary.cityName + ' Adventure',
          location: detailedItinerary.cityName,
          duration: detailedItinerary.tripDuration,
          itinerary: [], // Legacy format - will be populated if needed
          totalPoints: 500, // Default points
          difficulty: 'Medium' as const,
          tags: ['AI-Generated', 'Personalized', 'Adventure'],
          detailed: detailedItinerary
        };
      } catch (error) {
        console.error('❌ Error parsing cleaned JSON:', error);
        console.error('❌ Cleaned JSON string:', cleanedJson);
        throw new Error('Failed to parse cleaned JSON response.');
      }
    }
    
    throw new Error('Invalid response format - no JSON found');
  } catch (error) {
    console.error('❌ Error generating itinerary:', error);
    console.error('❌ Prompt used:', prompt.substring(0, 500) + '...');
    throw error;
  }
};

export const generateImagePrompt = async (
  cityName: string, 
  persona: string, 
  activityName: string
): Promise<string> => {
  try {
    const prompt = `Generate a detailed, artistic image prompt for creating a travel photo that represents this scenario:
    
**SCENARIO:**
- City: ${cityName}
- Traveler Type: ${persona}
- Activity: ${activityName}

**REQUIREMENTS:**
Create a single, detailed image prompt that captures:
1. The essence of ${cityName} with its iconic architecture, culture, or landscape
2. The perspective of a ${persona} experiencing this city
3. The specific activity: ${activityName}
4. Authentic cultural elements and local atmosphere
5. Appropriate lighting and mood for the activity

**STYLE GUIDELINES:**
- Photorealistic, high-quality travel photography style
- Vibrant colors that represent the local culture
- Include authentic local elements (architecture, people, food, etc.)
- Capture the unique experience a ${persona} would have
- Professional travel magazine quality

Return only the image prompt text, no additional formatting or explanation.

Examples:
- Student in Mumbai: "Vibrant street scene in Mumbai with a young student exploring the bustling Crawford Market, colorful spices and textiles in the background, authentic Indian street life, warm golden hour lighting, documentary photography style"
- Billionaire in Dubai: "Luxurious aerial view of Dubai Marina with a wealthy individual on a private yacht, stunning modern skyscrapers, crystal clear turquoise water, golden sunset lighting, high-end lifestyle photography"

Generate the prompt for: ${persona} in ${cityName} doing ${activityName}`;

    const result = await imageModel.generateContent(prompt);
    const response = result.response.text().trim();
    
    console.log('🎨 Generated image prompt for:', activityName, 'in', cityName);
    return response;
    
  } catch (error) {
    console.error('❌ Error generating image prompt:', error);
    return `Beautiful ${activityName} scene in ${cityName}, professional travel photography, vibrant colors, authentic local atmosphere`;
  }
};

export const generateDestinationImagePrompt = async (
  cityName: string, 
  persona: string
): Promise<string> => {
  try {
    const prompt = `Generate a detailed image prompt for the perfect hero/destination photo that represents ${cityName} from the perspective of a ${persona}.

**REQUIREMENTS:**
- Capture the most iconic and breathtaking view of ${cityName}
- Show what makes this city special for a ${persona}
- Include signature landmarks, architecture, or natural features
- Convey the unique atmosphere and vibe of the city
- Professional travel photography quality
- High resolution, vibrant colors
- Perfect lighting (golden hour preferred)

**PERSONA-SPECIFIC FOCUS:**
- Student: Budget-friendly, authentic local areas, street life, cultural spots
- Billionaire: Luxury views, exclusive areas, high-end architecture, premium locations
- Artist: Creative districts, unique architecture, cultural sites, inspiring views
- Chef: Food markets, restaurant districts, culinary culture, local food scenes

Return only the image prompt text, no additional formatting.

Generate for: ${persona} visiting ${cityName}`;

    const result = await imageModel.generateContent(prompt);
    const response = result.response.text().trim();
    
    console.log('🏙️ Generated destination image prompt for:', cityName, 'for', persona);
    return response;
    
  } catch (error) {
    console.error('❌ Error generating destination image prompt:', error);
    return `Stunning panoramic view of ${cityName} skyline, professional travel photography, golden hour lighting, vibrant colors, iconic landmarks`;
  }
};