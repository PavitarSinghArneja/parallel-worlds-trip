# Parallel Worlds Trip 🌟

An AI-powered travel app that generates your parallel universe self and creates personalized travel itineraries based on who you could be in another universe.

## Features

- **AI-Powered Quiz**: Answer questions about your alternate life choices
- **Parallel Self Generation**: Uses Google Gemini AI to create your alternate universe persona
- **AI-Generated Images**: Creates visual representations using OpenAI's DALL-E 3
- **Personalized Itineraries**: Generates custom 7-day travel plans based on your parallel self
- **Universe Points System**: Gamified experience system for completing activities

## Setup Instructions

### 1. Install Dependencies
```sh
npm install
```

### 2. Set up API Keys

You'll need API keys for:
- **Google Gemini AI** (for text generation)
- **OpenAI** (for image generation)

#### Get Your API Keys:

**Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the key

**OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing information
3. Go to API Keys section
4. Create a new API key
5. Copy the key

#### Configure Environment Variables:

1. Copy the example environment file:
```sh
cp .env.example .env
```

2. Edit the `.env` file and add your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start Development Server
```sh
npm run dev
```

### 4. Build for Production
```sh
npm run build
```

## Project Structure

- `src/lib/gemini.ts` - Gemini AI integration for text generation
- `src/lib/openai.ts` - OpenAI integration for image generation
- `src/pages/Quiz.tsx` - Interactive quiz for discovering your parallel self
- `src/pages/Reveal.tsx` - AI-generated parallel universe reveal
- `src/pages/Trip.tsx` - Personalized travel itinerary based on your parallel self

## How It Works

1. **Take the Extended Quiz**: Answer questions about your dream lifestyle, personality, and preferences
2. **Plan Your Trip**: Enter your destination, dates, and trip details
3. **Choose Your Interests**: Select from curated examples or add your own preferences for:
   - Activities & Adventures
   - Food & Drinks  
   - Urban Entertainment & Nightlife
   - Sightseeing & Culture
   - Relaxation & Wellness
4. **Upload a Selfie**: (Optional) For personalized image generation
5. **Discover Your Parallel Self**: AI generates who you could be in another universe
6. **Get Your AI-Generated Image**: See a visual representation of your parallel self
7. **Get Your Detailed Itinerary**: Receive a comprehensive, personalized travel plan with:
   - Day-by-day activities (morning, afternoon, evening)
   - Specific restaurant recommendations with dishes to try
   - Must-do attractions with insider tips
   - Hotel recommendations
   - Transportation tips and cost-saving advice
   - Local insider secrets
   - Budget estimates
   - Weather considerations and packing lists
8. **Earn Universe Points**: Complete activities to unlock achievements (gamified view)

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **AI Integration**: Google Gemini AI, OpenAI DALL-E 3
- **Routing**: React Router DOM
- **State Management**: React Context

## Important Notes

- **API Costs**: Both Gemini and OpenAI APIs have usage costs. Monitor your usage in their respective dashboards.
- **Rate Limits**: Be aware of API rate limits, especially for image generation.
- **CORS**: The OpenAI integration uses `dangerouslyAllowBrowser: true` for demo purposes. In production, implement a backend proxy.

## License

This project is for educational and demo purposes.
