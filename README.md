# 🌌 ForceFoundry - Star Wars Character & Name Generator

## ⚠️ Note on AI Portrait Generation

**AI Portrait Generation Feature - REMOVED:**
- The AI portrait generation feature was attempted in earlier versions but has been permanently removed.
- This feature proved too difficult and expensive to maintain (both in terms of API costs and development complexity).
- The feature has been removed entirely from the codebase to simplify the application and focus on core name and character generation features.
- All character and name generation features work normally without this feature.

---

![Next.js](https://img.shields.io/badge/Built_with-Next.js-000?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styled_with-TailwindCSS-38bdf8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222?logo=github&logoColor=white)
![Version](https://img.shields.io/badge/version-v3.1.0-brightgreen)

A comprehensive **Star Wars character and name generation tool** built with **Next.js** and **React**. Create authentic Star Wars characters with species-specific names, stats, and backgrounds.

## 🚀 Live Demo

**[Visit ForceFoundry on GitHub Pages](https://rocketmobster.github.io/forcefoundry/)**

## ✨ Features

### 🎭 Character Generator
- **SWTOR Class System**: Full Star Wars: The Old Republic class structure with 8 base classes, 16 advanced classes, and 48 skill trees
- **Faction-Based Generation**: Choose between Galactic Republic and Sith Empire with appropriate classes
- **Hierarchical Class Selection**: Base Class → Advanced Class → Skill Tree with proper restrictions
- **Species-Specific Generation**: Choose from multiple Star Wars species or let it randomize
- **Comprehensive Details**: Names, alignment, homeworld, role, and SWTOR-specific stats (Strength, Endurance, Aim, Cunning, Willpower)
- **Character Export Features**: 
  - JSON export for data storage and sharing
  - AI Prompt export for image generators (Stable Diffusion, Midjourney, etc.)
  - Character Description export for RPG sessions with formatted character sheets
- **Favorites Collection System**: Star favorite names, manage collection with localStorage persistence, export favorites as TXT/JSON

### 📝 Name Generator  
- **Species-Specific Names**: Authentic names based on Star Wars species
- **Multiple Generation Modes**: Standard, Species-Specific, and Cross-Species Crazy
- **Advanced Features**: 2-part and 3-part cross-species combinations
- **Canon & Famous Names**: Special highlighting for canonical Star Wars characters
- **Multiple Generation Modes**:
  - Random Mix: Random species combinations
  - Specific Species: Choose exact species for generation
  - Crazy Mix: Cross-species name combinations
- **Name Variations**: Middle names, hyphenated names (when species data is complete)
- **Bulk Generation**: Generate multiple names at once

### 🛡️ Robust Features
**SWTOR Class System**: Complete implementation of Star Wars: The Old Republic's class hierarchy
**Smart Class Validation**: Ensures proper faction-class relationships and restrictions
**Force User Detection**: Automatic lightsaber color assignment based on faction and alignment
**Smart Fallback System**: Graceful handling of incomplete species data
**Error Prevention**: No cross-species contamination in names
**Responsive Design**: Works on desktop and mobile
**Offline Capable**: No external API dependencies
**Streamlined Navigation**: Clean header-based navigation with active state highlighting
**Advanced Generator UI**: Action buttons, class descriptions, and improved mobile spacing

A major update (v3.0.0) includes:
- **Complete SWTOR Class System**: 8 base classes, 16 advanced classes, 48 skill trees
- **Faction-Based Generation**: Galactic Republic vs Sith Empire with proper restrictions
- **Hierarchical Class Selection**: Cascading dropdowns for Base Class → Advanced Class → Skill Tree
- **SWTOR Stat System**: Strength, Endurance, Aim, Cunning, Willpower with HP calculation
- **Enhanced Character Display**: Shows full class hierarchy, role, and descriptions
- **Force User Logic**: Automatic detection and lightsaber color assignment
- **Improved Navigation**: Removed accordion menu, integrated buttons into header
- **Better Mobile Support**: Fixed button layouts and responsive design
- **Class-Specific Equipment**: Equipment lists tailored to each advanced class

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/RocketMobster/forcefoundry.git
   cd forcefoundry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run export` - Export static files for deployment

## 🔄 Deployment & Workflow

### Branch Structure
- **`main`** - Production branch (auto-deploys to GitHub Pages)
- **`develop`** - Development branch for new features

### Automatic Deployment
- **GitHub Actions** automatically deploys to GitHub Pages on push to `main`
- **Static Export** optimized for GitHub Pages hosting
- **Build Process** includes dependency installation, building, and static export

### Contributing Workflow
1. Create feature branch from `develop`
2. Make changes and test locally
3. Create pull request to `develop`
4. After review, merge to `develop`
5. When ready for release, merge `develop` to `main`
6. GitHub Actions will automatically deploy to GitHub Pages

## 📊 Species Data

The application uses species-specific JSON files for authentic name generation:

- **Male/Female First Names**: Gender-specific first names by species
- **Male/Female Last Names**: Gender-specific surnames by species  
- **Neutral Names**: Used for middle names and name variations
- **Smart Validation**: Only generates variations when species exists in all files

## 🎨 Tech Stack

- **Framework**: Next.js 15.4.1
- **Frontend**: React with Hooks
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages with GitHub Actions
- **Data**: JSON files for species-specific names

## 📈 Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history and updates.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational and entertainment purposes. Star Wars is a trademark of Lucasfilm Ltd.

## 🌟 Acknowledgments

- Inspired by the rich Star Wars universe
- Built with modern web development best practices
- Designed for authentic Star Wars character creation

---

**May the Force be with you!** ⭐



---



\## ✨ Features



\- 🎲 Random character generation (name, class, stats, gender, etc.)

\- 🌌 Star Wars species and homeworld via SWAPI

\- 📥 Download character as `.json` file

\- 🧪 Class-based stat logic and icons

\- ⚡ "Randomize All" button for total chaos



---



\## 🛠 Configuration



\- `data/firstNames.json` and `data/lastNames.json`: Easily editable name pools.

\- `pages/index.js`: Main logic and UI.



---



\## 📁 Directory Structure



forcefoundry/

├── public/

│ └── (optional assets)

├── pages/

│ └── index.js # Main UI and logic

├── data/

│ ├── firstNames.json # Editable first names per gender

│ └── lastNames.json # Editable last names

├── styles/

│ └── globals.css # Tailwind base styles

├── tailwind.config.js # Tailwind configuration

├── postcss.config.js # PostCSS config

├── package.json # Project dependencies and scripts

└── README.md # Project overview





---



\## 🧠 To Do (Ideas)



\- Export as image or printable card

\- More detailed alignment/skill trees

\- User avatar upload or preset background options

\- Local image caching

\- Support for Star Wars languages in name generation

\- Class-based ability lists with icons

\- Light/Dark mode toggle

\- Theme music or sound FX toggle (with mute)



---



\## 📄 License



MIT © 2025 \[RocketMobster Software](https://github.com/your-username)

