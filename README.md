# PokéTeam Builder

A web application for building and optimising Pokémon teams with detailed analysis and team scoring. Built with Next.js, TypeScript, and Tailwind CSS.

## Demo

<img src="https://github.com/user-attachments/assets/4ac33888-8020-41d2-81b3-cf0d4cdbffb8" alt="Demo Video" width="800" />

## Features

- **Pokémon Search**: Search for Pokémon by name or ID with real-time results and debounced input
- **Team Building**: Add up to 6 Pokémon to your team with duplicate prevention
- **Team Analysis**: Get detailed statistics and scoring for your team
- **Local Storage**: Your team is automatically saved and persists between sessions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type Coverage**: Visual display of type diversity in your team
- **Real-time Evaluation**: Team stats update automatically as you build
- **Optimized Search**: Debounced search input reduces API calls and improves performance

## Team Scoring System

The application evaluates your team based on several criteria:

- **+10 points** for each unique Pokémon type
- **+5 points** if average HP > 80
- **+5 points** if no duplicate types
- **-5 points** if average speed < 50

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Data Source**: [PokéAPI](https://pokeapi.co)

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pokemon-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## API Endpoints

### Search Pokémon
```
GET /api/pokemon/search?q={query}
```
- Search by name (e.g., "pikachu") or ID (e.g., "25")
- Supports partial name matching
- Returns array of Pokémon data

### Evaluate Team
```
POST /api/team/evaluate
```
- Request body: `{ team: Pokemon[] }`
- Returns team statistics and score
- Validates team size (1-6 Pokémon)

## Usage Guide

1. **Search for Pokémon**: Use the search bar to find Pokémon by name or ID
2. **Build Your Team**: Click the + button to add Pokémon to your team (max 6)
3. **View Team Stats**: Your team analysis appears on the right side
4. **Optimize**: Use the scoring system to improve your team composition
5. **Manage Team**: Remove Pokémon or clear your entire team as needed

## Key Features Implementation

### Frontend-Backend Separation
- **Frontend**: React components in `/src/components` and main page
- **Backend**: API routes in `/src/app/api` that interface with PokéAPI
- **Data Flow**: Frontend → NEXT API → PokéAPI

### Error Handling
- Network error handling with user-friendly messages
- API rate limiting consideration
- Invalid search result handling
- Empty state management

## Assumptions

1. **API Reliability**: PokéAPI is assumed to be generally reliable, but the app handles failures gracefully
2. **Browser Support**: Modern browsers with localStorage support
3. **Image Availability**: Pokémon sprites from PokéAPI are assumed to be available
4. **Search Scope**: Limited to the first 1000 Pokémon for partial name searches
5. **Team Persistence**: Teams are stored locally and not synced across devices

## License

This project is for educational/interview purposes. Pokémon data is provided by [PokéAPI](https://pokeapi.co).

---

Built with ❤️ using Next.js and the PokéAPI
