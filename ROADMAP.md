# 🌌 ForceFoundry Development Roadmap

## 📋 Short-Term Goals (v2.1.0)

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

- [x] **Expanded Stats System**
  - [x] Add more character attributes (Wisdom, Charisma, Constitution)
  - [x] Implement stat ranges and modifiers
  - [x] Consider skill specializations per class
  - [x] **SWTOR Stat System Integration**
    - [x] Toggle between Traditional RPG and SWTOR stat systems
    - [x] SWTOR stats: Strength, Endurance, Aim, Cunning, Willpower, Hitpoints
    - [x] Automatic hitpoints calculation (Endurance × 10)
    - [x] Dynamic stat system labeling and display

- [x] **Force System Integration**
  - [x] Add Force sensitivity levels:
    - [x] Non-Force User
    - [x] Force Sensitive
    - [x] Force User (Jedi/Sith)
    - [x] Gray Jedi
  - [x] Lightsaber color generation for Force users
  - [x] Force-specific abilities and traits

### 🖼️ **Visual Enhancements**
- [x] **Character Portraits**
  - [x] Reconnect SubNP API for AI-generated portraits
  - [x] Add fallback image system
  - [x] Implement image caching for performance
  - [x] Add "🖼️ Generate New Portrait" button
  - [x] **Enhanced Portrait Features**
    - [x] Detailed AI prompts with species, class, and alignment
    - [x] Error handling and user feedback
    - [x] Graceful fallback to character icons
    - [x] Separate portrait regeneration function
    - [x] Loading states and disabled button handling

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

---

## 🚀 Medium-Term Goals (v2.2.0)

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

## 🌈 Long-Term Vision (v3.0.0)

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
- **API Integration**: Implement retry logic and fallbacks for SubNP
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
2. SubNP API reconnection
3. Advanced UI improvements

---

## 🎯 Success Metrics
- [ ] All hardcoded arrays moved to JSON files
- [ ] Character generation time under 500ms
- [ ] PDF export working for all character types
- [ ] Settings page allows full customization
- [ ] Mobile-responsive design completed
- [ ] SubNP API integration stable with fallbacks

---

**🌟 Remember**: Focus on user experience and maintainable code. Each feature should enhance the Star Wars character creation experience while keeping the codebase clean and extensible.
