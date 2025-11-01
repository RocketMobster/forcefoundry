# 🌌 ForceFoundry Development Roadmap

## � Note on AI Portrait Generation

**AI Portrait Generation - REMOVED:**
The AI portrait generation feature was attempted in earlier versions but has been permanently removed from the project. This feature proved too difficult and expensive to maintain:
- External API costs were prohibitive for a free tool
- API integration complexity and reliability issues
- Development time better spent on core features
- Decided to focus on character and name generation instead

The codebase has been simplified by removing all portrait generation code, API connections, and related UI elements.

---

# 🚩 Immediate Next Steps (v3.1.0)

### 🎮 SWTOR System Enhancements
- Add companion system with class-appropriate companions from SWTOR
- Implement legacy family surnames for related characters
- Add crew skills and crafting professions
- Expand equipment lists with SWTOR-specific gear sets and armor types
- Add planetary allegiance based on faction and species

### 🖼️ Character Export Features
- [x] Add button to copy character description formatted for AI image generators (Stable Diffusion, Midjourney) *(Completed v3.1.0)*
- [x] Copy formatted character sheet for RPG sessions *(Completed v3.1.0)*
- [x] Favorites Collection System with localStorage persistence and export functionality *(Completed v3.1.0)*
- [x] Export character sheet as formatted text *(Completed v3.1.0)*
- [x] Export character sheet as PDF *(Completed v3.2.0)*
- [x] Add GitHub repository URL to all exports for discoverability *(Completed v3.2.0)*
- [x] Unique class-specific character icons for all 8 base classes *(Completed v3.2.0)*
- [ ] Share character via URL or social media

### 📱 Device Optimization
- [x] Detect device type on app load *(Completed v3.1.1)*
- [x] Adjust UI elements for desktop vs mobile devices *(Completed v3.1.1)*
- [x] Optimize navigation placement and button sizes *(Completed v3.1.1)*
- [x] Enhanced responsive design for tablets *(Completed v3.1.1)*

# 🔮 Future Considerations (v3.2.0+)

### 🎨 Visual Enhancements
- Portrait library: Random portraits from data folder based on class and species
- Character appearance customization (height, build, scars, tattoos)
- Lightsaber hilt customization for Force users
- Species-specific appearance traits

### 🗺️ SWTOR Lore Integration
- Storyline choices and class quest references
- Legacy system with family connections
- Timeline selector (Old Republic era, Legacy era, etc.)
- Faction reputation and achievements

## 📋 Short-Term Goals (v3.2.0)

### 🗃️ **Data Management & Flexibility**
- [x] **Remove Hardcoded Data**
  - [x] Move `starWarsPlanets` array to `data/planets.json`
  - [x] Move `classes` object to `data/classes.json`
  - [x] Move `alignments` array to `data/alignments.json`
  - [x] Update imports and logic to use JSON files
  - [x] Ensure dynamic loading works for both generators

### 🎨 **UI/UX Improvements**
- [x] **Name Generator Card Redesign**
  - [x] Improve card styling and layout
  - [x] Better visual hierarchy for name information
  - [x] Add hover effects and animations
  - [x] Consider dark/light theme variations
  - [x] Responsive design improvements
  - [x] **Enhanced Card Features**
    - [x] Gradient backgrounds and hover effects
    - [x] Improved typography and spacing
    - [x] Interactive copy-to-clipboard buttons
    - [x] Better species and gender badge display
    - [x] Enhanced name type indicators with icons

### ℹ️ **Information & Documentation**
- [x] **Info Page Implementation**
  - [x] Add info button to header navigation
  - [x] Create dedicated `/info` route
  - [x] Include version, developer, and license information
  - [x] Add feature overview and acknowledgments
  - [x] Fun stats section with app metrics
  - [x] MIT license text and GitHub repository link

### ⚡ **Character Generator Enhancements**
- [x] **Name Reroll Feature**
  - [x] Add "🎲 Reroll Name" button to character card
  - [x] Keep all other character data unchanged
  - [x] Maintain species-specific naming logic
  - [x] Add smooth transition animation

- [x] **SWTOR Class System** *(Completed v3.0.0)*
  - [x] 8 Base Classes with faction restrictions
  - [x] 16 Advanced Classes with specializations
  - [x] 48 Skill Trees with unique abilities
  - [x] Hierarchical class selection interface
  - [x] Faction system: Galactic Republic vs Sith Empire
  - [x] Role assignments: Tank, DPS, Healer
  - [x] Class-specific equipment lists

- [x] **SWTOR Stats System** *(Completed v3.0.0)*
  - [x] Replaced generic RPG stats with SWTOR system
  - [x] SWTOR stats: Strength, Endurance, Aim, Cunning, Willpower
  - [x] Automatic HP calculation based on Endurance
  - [x] Stat distribution based on class and role
  - [x] Enhanced character display with class hierarchy

- [x] **Force System Integration** *(Enhanced v3.0.0)*
  - [x] Automatic Force user detection for Jedi/Sith classes
  - [x] Lightsaber color generation for Force users
  - [x] Faction-based lightsaber colors (blue/green for Jedi, red for Sith)
  - [x] Force-specific class descriptions and abilities

### 🖼️ **Visual Enhancements**
- [x] **Character Portraits** - *REMOVED*
  - Feature was attempted but removed due to API costs and complexity
  - All portrait generation code has been removed from the codebase
  - Focus shifted to core character and name generation features

### ⚙️ **Settings & Configuration**
- [ ] **Settings Page Development**
  - [ ] Create `/settings` route and component
  - [ ] JSON file selection interface:
    - [ ] Upload custom name dictionaries
    - [ ] Select from preset species data
    - [ ] Preview and validate JSON files
  - [ ] Configuration persistence (localStorage)
  - [ ] Import/Export settings functionality

### 📄 **Export & Sharing**
- [ ] **PDF Export Feature**
  - [ ] Implement PDF generation library (jsPDF or similar)
  - [ ] Design printable character sheet template
  - [ ] Include character portrait, stats, and background
  - [ ] Add print preview functionality

### � **Name Generation Enhancements**
- [x] **Advanced Crazy Mode**
  - [x] Implement 3-part cross-species names (30% of crazy mode names)
  - [x] Add "2-part" vs "3-part" cross-species chaos indicators
  - [x] Enhanced species tracking and compilation
  - [x] Improved species display in multi-species names

- [x] **Name Structure Improvements**
  - [x] Adjust name structure frequencies for more natural results
  - [x] Increase standard first-last names from 5% to 22%
  - [x] Multiple structure detection for complex names
  - [x] Multiple structure pills with unique styling

- [x] **Canon & Famous Name System**
  - [x] Implement Famous Family classification with silver/grey styling
  - [x] Add species-aware canon name organization
  - [x] Implement canon name frequency scaling by batch size
  - [x] Add duplicate prevention with improved tracking
  - [x] Remove canon characters from Crazy Mode

### �🐛 **Bug Fixes & Enhancements**
- [x] **Name Generation Issues**
  - [x] Fix Twi'lek name display issues with Unicode apostrophes
  - [x] Fix cross-species name contamination in specific mode
  - [x] Fix variable scope issues in name generation
  - [x] Add comprehensive error handling and fallbacks
  - [x] Enhance cross-species chaos pill styling

- [x] **Data Expansion**
  - [x] Add 16 missing species to name dictionaries:
    - [x] Bothan, Trandoshan, Mon Calamari, Ewok, Gungan
    - [x] Hutt, Jawa, Ithorian, Kel Dor, Rodian
    - [x] Sullustan, Ugnaught, Weequay, Wookiee
    - [x] Zabrak, Dathomirian
  - [x] Consolidate gender-specific last name files
  - [x] Restructure canon_names.json by species

- [x] **Character Generator Fixes**
  - [x] Fix planet name display showing "Unknown"
  - [x] Fix layout issues with character display card
  - [x] Improve responsive design for various screens

---

## 🚀 Medium-Term Goals (v3.3.0)

### 🌟 **Advanced Features**
- [ ] **Character Backstory Generator**
  - [ ] Add personality traits
  - [ ] Generate character motivations
  - [ ] Create relationship webs

- [ ] **Campaign Tools**
  - [ ] Party generator
  - [ ] NPC relationship tracker
  - [ ] Quick encounter characters

### 🔧 **Technical Improvements**
- [ ] **Performance Optimization**
  - [ ] Implement lazy loading for large datasets
  - [ ] Add service worker for offline functionality
  - [ ] Optimize bundle size

- [ ] **Data Validation**
  - [ ] JSON schema validation
  - [ ] Error handling for malformed data
  - [ ] User feedback for data issues

---

## 🌈 Long-Term Vision (v4.0.0)

### 📱 **Platform Expansion**
- [ ] **Mobile App**
  - [ ] React Native version
  - [ ] Offline-first functionality
  - [ ] Push notifications for character ideas

### 🤝 **Community Features**
- [ ] **Character Sharing**
  - [ ] Public character gallery
  - [ ] Community-contributed name datasets
  - [ ] Voting and rating system

### 🎮 **Gaming Integration**
- [ ] **VTT Compatibility**
  - [ ] Export to Roll20, Foundry VTT
  - [ ] Character sheet formats
  - [ ] API integrations

---

## 🔍 Implementation Notes

### **Data Architecture Decisions**
- **Pros of JSON files**: Easy to edit, version control friendly, user-customizable
- **Cons**: Slightly more complex loading, need validation
- **Decision**: Proceed with JSON files for maximum flexibility

### **Force System Design**
```javascript
// Proposed Force system structure
const forceTypes = {
  'Non-Force User': { canHaveLightsaber: false, forceAbilities: [] },
  'Force Sensitive': { canHaveLightsaber: false, forceAbilities: ['basic'] },
  'Force User': { canHaveLightsaber: true, forceAbilities: ['advanced'] }
}

const lightsaberColors = {
  Jedi: ['Blue', 'Green', 'Purple', 'Yellow'],
  Sith: ['Red', 'Crimson'],
  Other: ['White', 'Black', 'Orange']
}
```

### **Settings Page Structure**
- **Data Management**: Upload/manage JSON files
- **Display Preferences**: Theme, layout options
- **Generation Settings**: Default quantities, probability adjustments
- **Export Options**: PDF templates, file formats

### **Technical Considerations**
- **PDF Generation**: Use `jsPDF` with custom templates
- **File Upload**: Validate JSON structure before allowing use
- **State Management**: Consider upgrading to useReducer for complex state

---

## 📅 Development Schedule

### **Phase 1 (Week 1-2)**
1. Data externalization (planets, classes, alignments)
2. Name reroll button implementation
3. Basic card redesign

### **Phase 2 (Week 3-4)**
1. Force system integration
2. Expanded stats system
3. Settings page foundation

### **Phase 3 (Week 5-6)**
1. PDF export functionality
2. Advanced UI improvements

---

## 🎯 Success Metrics
- [ ] All hardcoded arrays moved to JSON files
- [ ] Character generation time under 500ms
- [ ] PDF export working for all character types
- [ ] Settings page allows full customization
- [ ] Mobile-responsive design completed

---

**🌟 Remember**: Focus on user experience and maintainable code. Each feature should enhance the Star Wars character creation experience while keeping the codebase clean and extensible.
