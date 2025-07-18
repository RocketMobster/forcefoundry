# Changelog

All notable changes to ForceFoundry will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### For Users
- **Character Generator**: Now includes species selection dropdown
- **New Feature**: Access the Name Generator via the header navigation
- **Improved**: More accurate species-specific name generation
- **Better**: Faster loading without external API dependencies

### For Developers
- **Breaking**: `firstNames.json` and `lastNames.json` can now be safely removed
- **New**: Species data structure in 5 separate JSON files
- **Enhanced**: Error handling patterns for production readiness
- **Ready**: Framework for easy species expansion

---

## Acknowledgments

- Enhanced species-specific data structure for authentic Star Wars naming
- Improved error handling for production-ready deployment
- Comprehensive fallback systems for reliable user experience
- Modular architecture for future feature expansion
