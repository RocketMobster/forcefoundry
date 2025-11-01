# [3.2.0] - 2025-10-31

### 📄 PDF EXPORT & ENHANCED EXPORTS

- **ADDED**: PDF Character Sheet Export
  - Complete PDF generation with jsPDF library
  - Multi-page PDF support with automatic page breaks
  - Professional character sheet layout with all stats, equipment, and class details
  - Automatic filename generation based on character name
  - Footer with GitHub repository URL for discoverability
  
- **ENHANCED**: Export Attribution
  - Added GitHub repository URL to all export formats
  - Character Description export now includes repository link
  - Name Generator details export includes repository link
  - Improved discoverability for users who receive exported content
  
- **IMPROVED**: Character Class Icons
  - Implemented unique icons for all 8 base classes
  - Fixed missing Smuggler icon (🎲 dice)
  - Fixed corrupted Sith Inquisitor icon (🌀 swirl)
  - Each class now has thematically appropriate emoji:
    - Jedi Knight: ⚔️ (crossed swords)
    - Jedi Consular: 🔮 (crystal ball)
    - Trooper: 🎖️ (military medal)
    - Smuggler: 🎲 (dice)
    - Sith Warrior: ⚡ (lightning)
    - Sith Inquisitor: 🌀 (swirl)
    - Bounty Hunter: 💀 (skull)
    - Imperial Agent: 🎯 (target)

---

# [3.1.0] - 2025-10-30

### 🖼️ CHARACTER EXPORT & FAVORITES SYSTEM

- **ADDED**: Character Export Features
  - AI Prompt export button: Copy optimized prompts for AI image generators (Stable Diffusion, Midjourney, etc.)
  - Character Description export: Copy formatted character sheets for RPG sessions
  - Comprehensive character formatting with stats, class hierarchy, equipment, and background
  - Clipboard API integration with fallback support for older browsers
  
- **ADDED**: Favorites Collection System
  - Star button interface to add/remove favorite character names
  - localStorage persistence for favorites across browser sessions
  - Favorites modal with complete name management
  - Export favorites as TXT or JSON formats
  - Remove individual favorites functionality
  - Toast notification system for user feedback
  
- **FIXED**: UI Layout and Responsive Design
  - Fixed button text overflow in 7-button action grid
  - Implemented responsive grid breakpoints (2/3/4/7 columns based on screen size)
  - Reduced button text size and shortened labels for better fit
  - Updated container width from max-w-lg to max-w-6xl for better button spacing
  - Enhanced button layout with proper text wrapping and spacing
  
- **ENHANCED**: Name Generator Improvements
  - Fixed species pill text overflow with proper CSS break-words
  - Prevented duplicate hyphenated names (e.g., "Skywalker-Skywalker")
  - Added missing famous family names (* Antilles, * Tarkin, * Fett, * Erso, * Palpatine, etc.)
  - Replaced incorrect Wookiee female names with authentic ones (Mallatobuck, Ralrracheen, etc.)
  - Added 23+ new Human/Common names across all gender categories
  
- **UPDATED**: Info Page
  - Updated features section to include new export capabilities and favorites system
  - Changed fun stats from "4 Character Classes" to "48 SWTOR Skill Trees"
  - Updated advanced class count to reflect accurate "16 Advanced Classes"

---

# [3.0.0] - 2025-01-XX

### 🎮 MAJOR SWTOR CLASS SYSTEM IMPLEMENTATION

- **ADDED**: Complete Star Wars: The Old Republic (SWTOR) class system
  - 8 Base Classes: Jedi Knight, Jedi Consular, Trooper, Smuggler (Republic) | Sith Warrior, Sith Inquisitor, Bounty Hunter, Imperial Agent (Empire)
  - 16 Advanced Classes: Each base class has 2 advanced specializations
  - 48 Skill Trees: 3 unique skill trees per advanced class
  - Faction system: Galactic Republic vs Sith Empire with proper restrictions
  
- **ENHANCED**: Character Generation System
  - Hierarchical class selection with cascading dropdowns (Faction → Base Class → Advanced Class → Skill Tree)
  - SWTOR stat system: Strength, Endurance, Aim, Cunning, Willpower
  - HP calculation based on Endurance stat
  - Role assignment: Tank, DPS, or Healer based on skill tree
  - Force user detection with automatic lightsaber color assignment
  - Class-specific equipment lists tailored to each advanced class
  
- **IMPROVED**: User Interface
  - Removed accordion-style navigation menu
  - Integrated action buttons directly into header navigation
  - Enhanced character display showing full class hierarchy
  - Added class descriptions and role information
  - Fixed button layout issues on mobile devices
  - Improved responsive design across all screen sizes
  
- **REFACTORED**: Data Architecture
  - New `data/swtor_classes.json` with comprehensive class definitions
  - Updated character object structure with faction, baseClass, advancedClass, skillTree fields
  - Implemented helper functions for class validation and lookup
  - Maintained backward compatibility with existing species/name generation

- **TECHNICAL**: Breaking Changes
  - Replaced simple 4-class system with SWTOR hierarchy
  - Changed stat system from generic RPG to SWTOR-specific
  - Updated character generation logic for faction-based restrictions
  - Modified UI components for hierarchical class selection

---

# [2.5.0] - 2025-10-29

### 🗑️ Major Feature Removal

- **REMOVED**: AI portrait generation feature completely removed from codebase
  - Removed all SubNP API integration code
  - Removed portrait state management (aiPortraitEnabled, portraitError)
  - Removed portrait generation UI elements (toggle, buttons, disabled messages)
  - Removed portrait-related functions and API calls
  - Decision made due to prohibitive API costs and development complexity
  - Focus shifted to core character and name generation features
  - Codebase simplified by removing all portrait functionality

---

# [2.3.2] - 2025-07-22
# [2.4.0] - 2025-07-23

### 🚀 Major Structural & UI Overhaul

- **REFACTORED**: Main file and page structure for clarity and maintainability
- **FIXED**: Duplicate navigation menu rendering on info page and other pages
- **IMPROVED**: Navigation menu now always animates smoothly and retracts correctly
- **RESTORED**: Advanced character generator UI and logic, including action buttons and mobile spacing
- **ENHANCED**: Gender display and color labeling in generator and name cards
- **FIXED**: Star icon placement for canon/famous family name cards
- **IMPROVED**: Clipboard copy logic with robust fallback and toast feedback
- **CLEANED**: Removed duplicate UI elements and redundant Layout wrappers
- **UPDATED**: Info page JSX structure for correct rendering and compilation
- **IMPROVED**: Responsive design and spacing across all pages
- **UPDATED**: All pages now use shared Layout via _app.js for consistent navigation
- **FIXED**: Compilation errors due to JSX and closing tag issues
- **UPDATED**: Internal link logic for navigation

---

### 🛠 Minor UI & Routing Fixes

- **IMPROVED**: Navigation menu note restyled and repositioned; now appears inside the slider body, bottom right, with smaller font and updated wording.
- **ADDED**: Internal link helper function (`getInternalLink`) for correct routing in both development and GitHub Pages environments; info page link now uses this helper.

# Changelog

All notable changes to ForceFoundry will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2025-07-21

### 🚀 Major Enhancements

#### Name Generation System
- **NEW**: Enhanced 3-part cross-species names in Crazy Mode (30% of generated names)
- **NEW**: Improved cross-species chaos indicators showing "2-part" or "3-part" species combinations
- **IMPROVED**: Name structure frequency adjustments:
  - Standard first-last names increased from 5% to 22%
  - Each variation type slightly reduced from 10% to 8%
- **ENHANCED**: Comprehensive species tracking across all name generation modes
- **IMPROVED**: Multiple name structure detection and display:
  - Simultaneous tracking of middle names and hyphenated components
  - Multiple structure pills with unique styling and icons
  - Proper display for complex names like "Temmin Xal Dameron-Dran"

#### Canon & Famous Names
- **NEW**: Famous Family name classification with unique silver/grey styling
- **IMPROVED**: Case-insensitive canon name detection with 5% generation chance
- **ENHANCED**: Species-aware canon name organization in data structure
- **NEW**: Canon name frequency scaling based on batch size
- **FIXED**: Canon name duplication prevention with improved tracking
- **IMPROVED**: Canon characters removed entirely from Crazy Mode

### 🔧 Bug Fixes & Improvements

#### Name Generation System
- **FIXED**: Twi'lek name display issues caused by inconsistent Unicode apostrophes
- **FIXED**: Cross-species name contamination when using specific species selection
- **FIXED**: Variable scope issues in name generation logic
- **FIXED**: Runtime error in "crazy mode" due to variable initialization
- **IMPROVED**: Enhanced cross-species chaos pill styling with custom gradients
- **ENHANCED**: Comprehensive error handling and fallbacks

#### Data Expansion
- **NEW**: Added 16 missing species to all name dictionaries with culturally appropriate names:
  - Bothan
  - Trandoshan
  - Mon Calamari
  - Ewok
  - Gungan
  - Hutt
  - Jawa
  - Ithorian
  - Kel Dor
  - Rodian
  - Sullustan
  - Ugnaught
  - Weequay
  - Wookiee
  - Zabrak
  - Dathomirian
- **IMPROVED**: Consolidated gender-specific last name files for better maintenance

#### Character Generator
- **FIXED**: Planet name display showing "Unknown" instead of actual planet names
- **FIXED**: Layout issues with character display card being cut off
- **IMPROVED**: Better responsive design for various screen sizes

## [2.1.0] - 2025-07-18

## [2.0.0] - 2025-07-18

### 🚀 Major Features Added

#### Species-Specific Name Generation System
- **NEW**: Comprehensive species-specific name generation with 5 JSON data files:
  - `male_first_names.json` - Male first names by species
  - `female_first_names.json` - Female first names by species
  - `male_last_names.json` - Male last names by species
  - `female_last_names.json` - Female last names by species
  - `other_names_neutral.json` - Neutral names for middle names and variations
- **NEW**: Advanced Name Generator (`/names`) with multiple generation modes:
  - Random Mix - Random species combinations
  - Specific Species Selection - Choose exact species for generation
  - Crazy Mix - Cross-species name combinations and variations
- **NEW**: Intelligent name variations (when species exists in all files):
  - Middle names (3% chance)
  - Hyphenated first names (6% chance total)
  - Hyphenated last names (6% chance total)
  - Traditional hyphenated surnames (10% chance)
  - Cross-species combinations (Crazy Mix only)

#### Enhanced Character Generator
- **UPDATED**: Main character generator now uses species-specific naming system
- **NEW**: Species selection dropdown with all available species
- **NEW**: Smart species validation - only generates name variations when species exists in all JSON files
- **IMPROVED**: Robust fallback system: Requested Species → Human/Common → First Available → "Unknown"
- **NEW**: Prevents cross-species name contamination for incomplete species data

### 🛡️ Reliability & Error Handling

#### Robust Error Management
- **NEW**: Comprehensive error handling for missing or incomplete species data
- **NEW**: Graceful fallback mechanisms prevent application crashes
- **NEW**: Species completeness validation before allowing name variations
- **FIXED**: Cross-species name contamination (e.g., "Velco Rey-Palpatine" for Nautolan)
- **IMPROVED**: API failure handling with local fallback data

#### External API Independence
- **IMPROVED**: Local fallback data for SWAPI failures
- **IMPROVED**: Graceful handling of SubnP image API failures
- **IMPROVED**: Application fully functional without external dependencies

### 🎨 User Experience Improvements

#### Navigation & Interface
- **NEW**: Header component with navigation between Character Generator and Name Generator
- **IMPROVED**: Clean, responsive UI with Tailwind CSS
- **NEW**: Intuitive species selection with sorted dropdown
- **NEW**: Clear explanations for different generation modes
- **NEW**: Bulk name generation (adjustable quantity)

#### Generation Modes
- **NEW**: Multiple name generation modes with clear labeling
- **NEW**: Gender-specific generation options
- **NEW**: Quantity control for bulk name generation
- **IMPROVED**: Character generation with species awareness

### 🔧 Technical Improvements

#### Project Structure
- **NEW**: Modular component architecture
- **NEW**: Separation of concerns between character and name generation
- **IMPROVED**: JSON data organization by species and name type
- **NEW**: TypeScript-ready component structure

#### Development Experience
- **FIXED**: Next.js Link component syntax for compatibility
- **NEW**: Global CSS configuration via `_app.js`
- **IMPROVED**: Hot reload functionality for development
- **NEW**: Comprehensive error logging and debugging

### 🗃️ Data Management

#### Species Support
- **NEW**: Dynamic species loading from JSON files
- **NEW**: Automatic species discovery and validation
- **NEW**: Support for incomplete species datasets
- **READY**: Easy addition of new species by updating JSON files

#### Backward Compatibility
- **MAINTAINED**: Original character generation functionality
- **TRANSITION**: Preparation for deprecation of `firstNames.json` and `lastNames.json`
- **IMPROVED**: Data structure organization and accessibility

### 🐛 Bug Fixes

- **FIXED**: SWAPI API dependency causing character generation failures
- **FIXED**: SubnP image API causing loading hangs
- **FIXED**: Cross-species name contamination in incomplete datasets
- **FIXED**: Next.js Link component warnings
- **FIXED**: Tailwind CSS loading issues
- **FIXED**: Species selection not persisting between generations
- **FIXED**: Gender-specific name data access errors

### 📦 Dependencies

#### Updated Dependencies
- Next.js 15.4.1 - Latest stable version
- React hooks pattern implementation
- Tailwind CSS with proper configuration
- JSON data file imports

#### Removed Dependencies
- External API hard dependencies (now optional with fallbacks)
- Deprecated naming system files (ready for removal)

---

## Migration Notes


## Roadmap

### Immediate Next Steps
- Add a button to the character generator that copies a generated character in a format suitable for pasting into external AI image generators (e.g., Stable Diffusion, Midjourney) to create a portrait outside the app.
- Add device detection for desktop vs mobile UI optimization

### Future Considerations
- Possibly add a portrait function that pulls a random portrait JPG or PNG from a data folder for the character's class and species and displays it. This is a potential feature under consideration.

### For Users
- Character Generator: Now includes species selection dropdown
- New Feature: Access the Name Generator via the header navigation
- Improved: More accurate species-specific name generation
- Better: Faster loading without external API dependencies

### For Developers
- Breaking: `firstNames.json` and `lastNames.json` can now be safely removed
- New: Species data structure in 5 separate JSON files
- Enhanced: Error handling patterns for production readiness
- Ready: Framework for easy species expansion

---

## Acknowledgments

- Enhanced species-specific data structure for authentic Star Wars naming
- Improved error handling for production-ready deployment
- Comprehensive fallback systems for reliable user experience
- Modular architecture for future feature expansion
