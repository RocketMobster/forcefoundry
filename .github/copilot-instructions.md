<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ForceFoundry - Star Wars Character Generator

This is a Next.js React application that generates randomized Star Wars characters with:
- Character stats, classes, species, planets, and alignment
- AI-generated portraits using the SubnP API
- Star Wars universe data integration via SWAPI

## Key Technologies
- Next.js (React framework)
- Tailwind CSS for styling
- SubnP API for AI image generation
- SWAPI for Star Wars universe data

## Project Structure
- `/pages/index.js` - Main character generator component
- `/data/` - JSON files with character names
- `/styles/` - Tailwind CSS configuration
- `/public/` - Static assets

## Development Guidelines
- Follow React hooks patterns (useState for state management)
- Use Tailwind CSS classes for styling
- Handle async operations properly for API calls
- Maintain responsive design principles
- Keep character generation logic modular and extensible
