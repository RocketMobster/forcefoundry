# ⚠️ Known Issues

**AI Portrait Generation - TEMPORARILY DISABLED:**
- The AI portrait generation feature has been temporarily disabled.
- This is due to ongoing API limitations and associated costs.
- The feature will be reconsidered in a future update.
- All other character and name generation features work normally.

# 🌌 ForceFoundry - Star Wars Character & Name Generator

![Next.js](https://img.shields.io/badge/Built_with-Next.js-000?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Styled_with-TailwindCSS-38bdf8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222?logo=github&logoColor=white)
![Version](https://img.shields.io/badge/version-v2.2.0-brightgreen)

A comprehensive **Star Wars character and name generation tool** built with **Next.js** and **React**. Create authentic Star Wars characters with species-specific names, stats, and backgrounds.

## 🚀 Live Demo

**[Visit ForceFoundry on GitHub Pages](https://rocketmobster.github.io/forcefoundry/)**

## ✨ Features

### 🎭 Character Generator
- **Species-Specific Generation**: Choose from multiple Star Wars species or let it randomize
- **Character Classes**: Jedi, Sith, Bounty Hunter, Smuggler with unique stats
- **Comprehensive Details**: Names, alignment, homeworld, and character stats
- **Download Characters**: Export generated characters as JSON files

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
- **Smart Fallback System**: Graceful handling of incomplete species data
- **Error Prevention**: No cross-species contamination in names
- **Responsive Design**: Works on desktop and mobile
- **Offline Capable**: No external API dependencies

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

\- 🧬 SubnP AI image generation integration

\- 📥 Download character as `.json` file

\- 🧪 Class-based stat logic and icons

\- ⚡ "Randomize All" button for total chaos



---



\## 🛠 Configuration



\- `data/firstNames.json` and `data/lastNames.json`: Easily editable name pools.

\- `pages/index.js`: Main logic and UI.

\- SubnP API is called directly — no auth required for free tier.



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

