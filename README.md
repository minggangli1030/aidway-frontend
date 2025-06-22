# 🌉 Bridge AI - AI-Powered Social Welfare Locator

> Connecting communities to essential services through intelligent location discovery and AI-powered assistance.

Built for the **UC Berkeley AI Hackathon 2025** 🎓

[![GitHub](https://img.shields.io/badge/GitHub-View%20Code-blue?logo=github)](https://github.com/minggangli1030/bridge-hackathon-2025)
[![Devpost](https://img.shields.io/badge/Devpost-Project%20Page-orange?logo=devpost)](https://devpost.com/software/bridge-h3pina)

## 🚀 Overview

Bridge AI is a comprehensive web application that helps individuals locate essential community services in their area. Using advanced AI technology and real-time data, it provides personalized recommendations for food banks, shelters, healthcare facilities, and other vital resources.

### ✨ Key Features

- **🔍 Intelligent Service Discovery**: Find food banks, shelters, healthcare, Wi-Fi hotspots, and more
- **🗺️ Interactive Mapping**: Visual location display with Google Maps integration
- **🤖 AI-Powered Chat Assistant**: Context-aware recommendations using Claude AI
- **📍 Real-Time Directions**: One-click navigation to any service location
- **🌡️ Weather-Aware Suggestions**: Recommendations adapt to current conditions
- **⏰ Time-Sensitive Filtering**: Shows currently open locations and operating hours

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern component-based UI
- **Tailwind CSS** - Utility-first styling
- **Google Maps API** - Interactive mapping and geocoding
- **@react-google-maps/api** - React Google Maps integration

### Backend
- **Node.js & Express** - RESTful API server
- **Google Places API** - Location data and business information
- **Anthropic Claude API** - AI-powered conversational assistance
- **OpenWeatherMap API** - Weather-based recommendations

### Key Libraries
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **node-fetch** - HTTP request handling

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- API keys for Google Maps, Google Places, Anthropic Claude, and OpenWeatherMap

### 1. Clone the Repository
```bash
git clone https://github.com/minggangli1030/bridge-hackathon-2025.git
cd bridge-hackathon-2025
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the `server/` directory:

```env
REACT_APP_GOOGLE_API_KEY=your_google_maps_api_key
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
```

### 4. API Key Setup

#### Google Maps & Places API
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials and copy your API key

#### Anthropic Claude API
1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Generate an API key
3. Add it to your environment variables

#### OpenWeatherMap API
1. Register at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add it to your environment variables

### 5. Start the Application
```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the React frontend
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:58080

## 🎯 How to Use

### 1. **Enter Location**
Input a 5-digit ZIP code for your search area

### 2. **Select Service Category**
Choose from available options:
- 🍽️ Food (food banks, soup kitchens, pantries)
- 💧 Water (drinking fountains, water stations)
- 📶 Free Wi-Fi (libraries, community centers, hotspots)
- 🏠 Shelters (emergency housing, temporary shelter)
- 🏥 Healthcare (community clinics, free medical care)
- 🚿 Showers (public facilities, community centers)
- 💼 Jobs (employment services, job centers)

### 3. **Search & Explore**
- View results in an organized list with ratings and distances
- See locations on an interactive map
- Click any location for details and directions

### 4. **Get AI Assistance**
- Ask the AI chatbot specific questions about services
- Receive personalized recommendations based on:
  - Current time and day of the week
  - Local weather conditions
  - Operating hours and availability
  - Your specific needs and circumstances

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/
│   ├── CategoryButtons.js    # Service category selection
│   ├── ZipInput.js          # Location input form
│   ├── ResourceList.js      # Service results display
│   ├── MapView.js           # Interactive Google Maps
│   └── Chatbot.js           # AI assistant interface
├── services/
│   ├── googlePlaces.js      # Places API integration
│   ├── anthropicService.js  # Claude AI communication
│   ├── contextService.js    # Context-aware recommendations
│   └── weatherService.js    # Weather data integration
└── App.js                   # Main application component
```

### Backend Structure
```
server/
├── index.js                 # Express server with API routes
├── package.json            # Backend dependencies
└── .env                    # Environment variables
```

### API Endpoints
- `GET /api/places?zip={ZIP}&category={CATEGORY}` - Fetch nearby services
- `POST /api/chat` - AI conversation proxy to Anthropic Claude

## 🔧 Key Features Deep Dive

### Smart Context Awareness
The AI assistant considers multiple factors when providing recommendations:
- **Time Context**: Adjusts suggestions based on current time and day
- **Weather Integration**: Prioritizes indoor locations during extreme weather
- **Operating Hours**: Highlights currently open services
- **Distance Calculation**: Uses Haversine formula for accurate distances
- **Urgency Assessment**: Escalates recommendations during critical conditions

### Advanced Location Filtering
Service categories are mapped to specific search queries:
```javascript
const queryMap = {
  food: 'food bank|soup kitchen|food pantry|free meals',
  water: 'drinking water|free water fountain|public water station',
  'free wi-fi': 'free wifi|public wi-fi|community wifi hotspot|library',
  // ... more categories
};
```

### Real-Time Data Integration
- Live weather data affects recommendations
- Operating hours determine availability
- Distance calculations help users find nearby options
- One-click directions to Google Maps for navigation

## 🎨 UI/UX Design

- **Clean, Accessible Interface**: Designed for users in potentially stressful situations
- **Mobile-Responsive**: Works on all device sizes
- **High Contrast**: Easy to read in various lighting conditions
- **Intuitive Navigation**: Minimal clicks to find essential information
- **Real-Time Feedback**: Loading states and error handling

## 🤖 AI Integration

Bridge AI leverages **Anthropic's Claude** to provide:
- Context-aware service recommendations
- Natural language understanding of user needs
- Weather and time-sensitive suggestions
- Personalized assistance based on location data
- Emergency situation awareness and appropriate responses

## 📊 Impact & Use Cases

### Primary Users
- **Individuals experiencing homelessness** seeking immediate resources
- **Social workers** helping clients find services
- **Community organizers** mapping available resources
- **Emergency responders** connecting people to assistance
- **Newcomers to an area** unfamiliar with local services

### Real-World Applications
- **Crisis Response**: Quick access to shelters during extreme weather
- **Daily Needs**: Finding food banks and community kitchens
- **Job Seeking**: Locating employment services and career centers
- **Healthcare Access**: Discovering free and low-cost medical clinics
- **Basic Amenities**: Finding public restrooms, Wi-Fi, and water sources

## 🚀 Future Enhancements

- **Multi-language Support**: Serve diverse communities
- **User Accounts**: Save favorite locations and preferences
- **Community Reviews**: User-generated content about services
- **Real-Time Availability**: Live updates on capacity and wait times
- **Transportation Integration**: Public transit directions
- **Mobile App**: Native iOS and Android applications
- **Offline Mode**: Cached data for areas with poor connectivity

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness
- Test with various API scenarios

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- **Fengbo Wang** - My incredible teammate who made this project possible and helped provide the initial idea 
- **UC Berkeley AI Hackathon** for the opportunity and platform
- **Anthropic** for Claude AI API access
- **Google** for Maps and Places API services
- **OpenWeatherMap** for weather data integration
- **Open source community** for the amazing tools and libraries

---

**Bridge AI** - Connecting communities to essential services through the power of artificial intelligence. 🌉✨
