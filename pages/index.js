// Helper for internal links to handle basePath
function getInternalLink(path) {
  const basePath = process.env.NODE_ENV === 'production' ? '/forcefoundry' : '';
  if (!path.startsWith('/')) path = '/' + path;
  return `${basePath}${path}`;
}
import { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { getResourceUrl } from '../utils/paths';
import NameGenerator from '../components/NameGenerator';
import maleFirstNames from '../data/male_first_names.json';
import maleLastNames from '../data/male_last_names.json';
import femaleFirstNames from '../data/female_first_names.json';
import femaleLastNames from '../data/female_last_names.json';
import otherNamesNeutral from '../data/other_names_neutral.json';
import jsPDF from 'jspdf';
import canonNamesData from '../data/canon_names.json';
import swtorClasses from '../data/swtor_classes.json';
import { getDeviceType, isTouchDevice, getDeviceClasses } from '../utils/deviceUtils';

// Character generation data
const alignments = ["Light Side", "Gray", "Dark Side", "Neutral"];
const genders = ["male", "female", "other"];
const factions = ["Galactic Republic", "Sith Empire"];
const homeworldTypes = ["Core World", "Mid Rim", "Outer Rim", "Unknown Regions", "Wild Space", "Hutt Space"];
const lightsaberColors = {
  "republic_force": ["blue", "green", "yellow", "purple"],
  "empire_force": ["red", "orange", "purple"],
  "gray": ["orange", "yellow", "white", "silver", "viridian"]
};

// Helper functions for SWTOR classes
function getAllAdvancedClasses() {
  return Object.keys(swtorClasses.advancedClasses);
}

function getAdvancedClassesByFaction(faction) {
  const factionKey = faction === "Galactic Republic" ? "republic" : "empire";
  return Object.entries(swtorClasses.advancedClasses)
    .filter(([name, data]) => data.faction === factionKey)
    .map(([name, data]) => name);
}

function getBaseClassesByFaction(faction) {
  const factionKey = faction === "Galactic Republic" ? "republic" : "empire";
  return Object.keys(swtorClasses.baseClasses[factionKey]);
}

function getAdvancedClassesForBaseClass(baseClass, faction) {
  const factionKey = faction === "Galactic Republic" ? "republic" : "empire";
  const baseClassData = swtorClasses.baseClasses[factionKey][baseClass];
  return baseClassData ? baseClassData.advancedClasses : [];
}

function getSkillTreesForAdvancedClass(advancedClass) {
  const classData = swtorClasses.advancedClasses[advancedClass];
  return classData ? Object.keys(classData.skillTrees) : [];
}

function isForceUser(advancedClass) {
  const classData = swtorClasses.advancedClasses[advancedClass];
  if (!classData) return false;
  
  const factionKey = classData.faction === "republic" ? "republic" : "empire";
  const baseClassData = swtorClasses.baseClasses[factionKey][classData.baseClass];
  return baseClassData ? baseClassData.type === "force" : false;
}

// Utility function to get a random element from an array
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Check if a name is in the canon list
function isCanonName(name, species = null) {
  // Check for exact match or wildcard match (e.g., * Skywalker)
  // First, check the specific species if provided
  if (species && canonNamesData[species]) {
    for (const canon of canonNamesData[species]) {
      if (canon.startsWith('* ')) {
        const suffix = canon.slice(2).trim();
        if (name.endsWith(suffix)) return true;
      } else if (canon === name) {
        return true;
      }
    }
  }
  
  // Then check Special and Human/Common as fallbacks
  const fallbackSpecies = ['Special', 'Human/Common'];
  for (const fallback of fallbackSpecies) {
    if (canonNamesData[fallback]) {
      for (const canon of canonNamesData[fallback]) {
        if (canon.startsWith('* ')) {
          const suffix = canon.slice(2).trim();
          if (name.endsWith(suffix)) return true;
        } else if (canon === name) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Track if canon names are loaded
let canonNamesLoaded = canonNamesData && Object.keys(canonNamesData).length > 0;
const canonCount = Object.values(canonNamesData).flat().length;
console.log(`Canon names loaded: ${canonNamesLoaded ? 'Yes' : 'No'}, count: ${canonCount}`);

export default function Home() {
  const [availableSpecies, setAvailableSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState("Random");
  const [selectedFaction, setSelectedFaction] = useState("Random");
  const [selectedBaseClass, setSelectedBaseClass] = useState("Random");
  const [selectedAdvancedClass, setSelectedAdvancedClass] = useState("Random");
  const [selectedSkillTree, setSelectedSkillTree] = useState("Random");
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('character');
  
  // Device optimization state - start with null to prevent hydration mismatch
  const [deviceType, setDeviceType] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  const [deviceClasses, setDeviceClasses] = useState(null);

  useEffect(() => {
    fetch(getResourceUrl('/data/species.json'))
      .then(res => res.json())
      .then(data => setAvailableSpecies(data))
      .catch(() => setAvailableSpecies([]));
  }, []);

  // Device detection and resize handling
  useEffect(() => {
    const updateDeviceInfo = () => {
      const newDeviceType = getDeviceType();
      const newIsTouch = isTouchDevice();
      const newDeviceClasses = getDeviceClasses(newDeviceType, newIsTouch);
      
      setDeviceType(newDeviceType);
      setIsTouch(newIsTouch);
      setDeviceClasses(newDeviceClasses);
    };

    // Initial detection - only run on client side
    if (typeof window !== 'undefined') {
      updateDeviceInfo();

      // Listen for resize events
      const handleResize = () => {
        updateDeviceInfo();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Utility function to get a name from a specific species (or fallback to another)
  const getNameFromSpecies = (nameData, species, fallbackSpecies = 'Human/Common') => {
    if (nameData[species] && nameData[species].length > 0) {
      return getRandom(nameData[species]);
    }
    if (nameData[fallbackSpecies] && nameData[fallbackSpecies].length > 0) {
      return getRandom(nameData[fallbackSpecies]);
    }
    const availableSpecies = Object.keys(nameData).find(key => nameData[key] && nameData[key].length > 0);
    return availableSpecies ? getRandom(nameData[availableSpecies]) : '';
  };

  // All character/stat generation logic should be in functions/hooks above this line


  // Character generation logic with user selections
  const generateCharacter = () => {
    setLoading(true);
    
    // Pick faction based on user selection or random
    let faction = selectedFaction === "Random" ? getRandom(factions) : selectedFaction;
    
    // Pick base class based on faction and user selection
    let baseClasses = getBaseClassesByFaction(faction);
    let baseClass = selectedBaseClass === "Random" ? getRandom(baseClasses) : 
                    (baseClasses.includes(selectedBaseClass) ? selectedBaseClass : getRandom(baseClasses));
    
    // Pick advanced class based on base class and user selection
    let advancedClasses = getAdvancedClassesForBaseClass(baseClass, faction);
    let advancedClass = selectedAdvancedClass === "Random" ? getRandom(advancedClasses) : 
                       (advancedClasses.includes(selectedAdvancedClass) ? selectedAdvancedClass : getRandom(advancedClasses));
    
    // Pick skill tree based on advanced class and user selection
    let skillTrees = getSkillTreesForAdvancedClass(advancedClass);
    let skillTree = selectedSkillTree === "Random" ? getRandom(skillTrees) : 
                   (skillTrees.includes(selectedSkillTree) ? selectedSkillTree : getRandom(skillTrees));
    
    // Get class data
    let classData = swtorClasses.advancedClasses[advancedClass];
    let skillTreeData = classData.skillTrees[skillTree];
    
    // Generate other character attributes
    let species = selectedSpecies === "Random" ? getRandom(availableSpecies) : selectedSpecies;
    let alignment = getRandom(alignments);
    let gender = getRandom(genders);
    let homeworldType = getRandom(homeworldTypes);
    let homeworld = { name: homeworldType };
    
    // Generate stats (add some randomness to base stats)
    let baseStats = { ...classData.stats.base };
    Object.keys(baseStats).forEach(stat => {
      baseStats[stat] += Math.floor(Math.random() * 3) - 1; // -1 to +1 variation
      baseStats[stat] = Math.max(8, Math.min(18, baseStats[stat])); // Keep within 8-18 range
    });
    
    // Determine if force user and lightsaber color
    let forceUser = isForceUser(advancedClass);
    let lightsaberColor = null;
    if (forceUser) {
      let colorKey = faction === "Galactic Republic" ? "republic_force" : "empire_force";
      if (alignment === "Gray") colorKey = "gray";
      lightsaberColor = getRandom(lightsaberColors[colorKey] || []);
    }
    
    // Generate name
    let name = getNameFromSpecies(maleFirstNames, species) + " " + getNameFromSpecies(maleLastNames, species);
    
    const characterObj = {
      name,
      species,
      faction,
      baseClass,
      advancedClass,
      skillTree,
      role: skillTreeData.role,
      alignment,
      gender,
      homeworld,
      stats: baseStats,
      forceUser,
      equipment: classData.equipment,
      lightsaberColor,
      description: classData.description,
      skillTreeDescription: skillTreeData.description,
      _created: Date.now()
    };
    
    setCharacter(characterObj);
    setLoading(false);
  };

  // Full random character logic with SWTOR system
  const generateFullRandomCharacter = () => {
    setLoading(true);
    
    // Pick faction first
    let faction = selectedFaction === "Random" ? getRandom(factions) : selectedFaction;
    
    // Pick base class based on faction
    let baseClasses = getBaseClassesByFaction(faction);
    let baseClass = selectedBaseClass === "Random" ? getRandom(baseClasses) : selectedBaseClass;
    
    // Pick advanced class based on base class
    let advancedClasses = getAdvancedClassesForBaseClass(baseClass, faction);
    let advancedClass = selectedAdvancedClass === "Random" ? getRandom(advancedClasses) : selectedAdvancedClass;
    
    // Pick skill tree based on advanced class
    let skillTrees = getSkillTreesForAdvancedClass(advancedClass);
    let skillTree = selectedSkillTree === "Random" ? getRandom(skillTrees) : selectedSkillTree;
    
    // Get class data
    let classData = swtorClasses.advancedClasses[advancedClass];
    let skillTreeData = classData.skillTrees[skillTree];
    
    // Generate other character attributes
    let species = selectedSpecies === "Random" ? getRandom(availableSpecies) : selectedSpecies;
    let alignment = getRandom(alignments);
    let gender = getRandom(genders);
    let homeworldType = getRandom(homeworldTypes);
    let homeworld = { name: homeworldType };
    
    // Generate stats (add some randomness to base stats)
    let baseStats = { ...classData.stats.base };
    Object.keys(baseStats).forEach(stat => {
      baseStats[stat] += Math.floor(Math.random() * 3) - 1; // -1 to +1 variation
      baseStats[stat] = Math.max(8, Math.min(18, baseStats[stat])); // Keep within 8-18 range
    });
    
    // Determine if force user and lightsaber color
    let forceUser = isForceUser(advancedClass);
    let lightsaberColor = null;
    if (forceUser) {
      let colorKey = faction === "Galactic Republic" ? "republic_force" : "empire_force";
      if (alignment === "Gray") colorKey = "gray";
      lightsaberColor = getRandom(lightsaberColors[colorKey] || []);
    }
    
    // Generate name
    let name = getNameFromSpecies(maleFirstNames, species) + " " + getNameFromSpecies(maleLastNames, species);
    
    const characterObj = {
      name,
      species,
      faction,
      baseClass,
      advancedClass,
      skillTree,
      role: skillTreeData.role,
      alignment,
      gender,
      homeworld,
      stats: baseStats,
      forceUser,
      equipment: classData.equipment,
      lightsaberColor,
      description: classData.description,
      skillTreeDescription: skillTreeData.description,
      _created: Date.now()
    };
    
    setCharacter(characterObj);
    setLoading(false);
  };

  // PDF Export Function
  const generateCharacterPDF = () => {
    const pdf = new jsPDF();
    
    // Set up fonts and colors
    pdf.setFontSize(20);
    pdf.text('Star Wars Character Sheet', 20, 25);
    
    // Character name and basic info
    pdf.setFontSize(16);
    pdf.text(character.name, 20, 40);
    
    pdf.setFontSize(12);
    let yPos = 55;
    
    // Basic Information Section
    pdf.text('=== Basic Information ===', 20, yPos);
    yPos += 10;
    pdf.text(`Species: ${character.species}`, 25, yPos);
    yPos += 7;
    pdf.text(`Gender: ${character.gender || 'Unknown'}`, 25, yPos);
    yPos += 7;
    pdf.text(`Faction: ${character.faction}`, 25, yPos);
    yPos += 7;
    pdf.text(`Alignment: ${character.alignment}`, 25, yPos);
    yPos += 15;
    
    // Class Information Section
    pdf.text('=== Class Information ===', 20, yPos);
    yPos += 10;
    pdf.text(`Base Class: ${character.baseClass}`, 25, yPos);
    yPos += 7;
    pdf.text(`Advanced Class: ${character.advancedClass}`, 25, yPos);
    yPos += 7;
    pdf.text(`Skill Tree: ${character.skillTree}`, 25, yPos);
    yPos += 7;
    pdf.text(`Role: ${character.role}`, 25, yPos);
    yPos += 15;
    
    // Force Information Section (if applicable)
    if (character.forceUser) {
      pdf.text('=== Force Abilities ===', 20, yPos);
      yPos += 10;
      pdf.text('Force User: Yes', 25, yPos);
      yPos += 7;
      if (character.lightsaberColor) {
        pdf.text(`Lightsaber Color: ${character.lightsaberColor}`, 25, yPos);
        yPos += 7;
      }
      yPos += 8;
    }
    
    // Stats Section
    pdf.text('=== Character Stats ===', 20, yPos);
    yPos += 10;
    Object.entries(character.stats).forEach(([stat, value]) => {
      pdf.text(`${stat}: ${value}`, 25, yPos);
      yPos += 7;
    });
    yPos += 8;
    
    // Homeworld Section
    if (character.homeworld && character.homeworld.name) {
      pdf.text('=== Origin ===', 20, yPos);
      yPos += 10;
      pdf.text(`Homeworld: ${character.homeworld.name}`, 25, yPos);
      yPos += 15;
    }
    
    // Descriptions Section
    if (character.description || character.skillTreeDescription) {
      // Check if we need a new page
      if (yPos > 250) {
        pdf.addPage();
        yPos = 25;
      }
      
      pdf.text('=== Background & Abilities ===', 20, yPos);
      yPos += 10;
      
      if (character.description) {
        pdf.text('Class Description:', 25, yPos);
        yPos += 7;
        const descLines = pdf.splitTextToSize(character.description, 160);
        pdf.text(descLines, 25, yPos);
        yPos += (descLines.length * 7) + 8;
      }
      
      if (character.skillTreeDescription) {
        pdf.text('Specialization:', 25, yPos);
        yPos += 7;
        const specLines = pdf.splitTextToSize(character.skillTreeDescription, 160);
        pdf.text(specLines, 25, yPos);
        yPos += (specLines.length * 7) + 8;
      }
    }
    
    // Footer
    pdf.setFontSize(10);
    pdf.text(`Generated by ForceFoundry (https://github.com/RocketMobster/forcefoundry) on ${new Date(character._created).toLocaleDateString()}`, 20, 280);
    
    // Save the PDF
    pdf.save(`${character.name.replace(/[^a-zA-Z0-9]/g, '_')}_Character_Sheet.pdf`);
  };

  // Only one return statement below, containing all JSX
  return (
    <div className="w-full">
      {mode === 'character' ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Character Generator</h2>
            <p className="text-gray-400">Create detailed Star Wars characters with stats and backgrounds</p>
          </div>
          <div className={`max-w-md mx-auto mb-6 ${deviceClasses?.containerPadding || 'px-4'}`}>
            <label className="block text-sm font-medium text-gray-300 mb-2">Species Selection:</label>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Random">Random Species</option>
              {availableSpecies.sort().map(species => (
                <option key={species} value={species}>{species}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Select a specific species or choose "Random" for variety</p>
          </div>
          {/* SWTOR Class Selection */}
          <div className="max-w-md mx-auto mb-6 space-y-4">
            {/* Faction Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Faction:</label>
              <select
                value={selectedFaction}
                onChange={(e) => {
                  setSelectedFaction(e.target.value);
                  setSelectedBaseClass("Random");
                  setSelectedAdvancedClass("Random");
                  setSelectedSkillTree("Random");
                }}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Random">Random Faction</option>
                {factions.map(faction => (
                  <option key={faction} value={faction}>{faction}</option>
                ))}
              </select>
            </div>

            {/* Base Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Base Class:</label>
              <select
                value={selectedBaseClass}
                onChange={(e) => {
                  setSelectedBaseClass(e.target.value);
                  setSelectedAdvancedClass("Random");
                  setSelectedSkillTree("Random");
                }}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Random">Random Base Class</option>
                {selectedFaction !== "Random" && getBaseClassesByFaction(selectedFaction).map(baseClass => (
                  <option key={baseClass} value={baseClass}>{baseClass}</option>
                ))}
              </select>
            </div>

            {/* Advanced Class Selection - Only show if Base Class is not Random */}
            {selectedFaction !== "Random" && selectedBaseClass !== "Random" ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Advanced Class:</label>
                <select
                  value={selectedAdvancedClass}
                  onChange={(e) => {
                    setSelectedAdvancedClass(e.target.value);
                    setSelectedSkillTree("Random");
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Random">Random Advanced Class</option>
                  {getAdvancedClassesForBaseClass(selectedBaseClass, selectedFaction).map(advClass => (
                    <option key={advClass} value={advClass}>{advClass}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Advanced Class:</label>
                <div className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-500 text-sm">
                  Select a specific Faction and Base Class first
                </div>
              </div>
            )}

            {/* Skill Tree Selection - Only show if Advanced Class is not Random */}
            {selectedFaction !== "Random" && selectedBaseClass !== "Random" && selectedAdvancedClass !== "Random" ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Tree:</label>
                <select
                  value={selectedSkillTree}
                  onChange={(e) => setSelectedSkillTree(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Random">Random Skill Tree</option>
                  {getSkillTreesForAdvancedClass(selectedAdvancedClass).map(skillTree => (
                    <option key={skillTree} value={skillTree}>{skillTree}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Skill Tree:</label>
                <div className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-500 text-sm">
                  Select a specific Advanced Class first
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <p>The SWTOR system uses cascading selection: Faction → Base Class → Advanced Class → Skill Tree</p>
              <p className="text-gray-400">
                💡 <strong>Tip:</strong> Select a specific Faction and Base Class to unlock Advanced Class options. 
                Select a specific Advanced Class to unlock Skill Tree options.
              </p>
            </div>
          </div>
          {/* Show original buttons only if no character is generated */}
          {!character && (
            <>
              <div className="max-w-md mx-auto mb-6 flex flex-col gap-4 md:flex-row md:gap-4">
                <button
                  className={`bg-blue-600 hover:bg-blue-700 ${deviceClasses?.primaryButtonSize || 'px-6 py-4 text-sm'} rounded-lg font-medium text-white ${deviceClasses?.touchTarget || ''} md:mr-2 flex-1`}
                  disabled={loading}
                  onClick={generateCharacter}
                >
                  Generate Character
                </button>
                <button
                  className={`bg-purple-600 hover:bg-purple-700 ${deviceClasses?.primaryButtonSize || 'px-6 py-4 text-sm'} rounded-lg font-medium text-white ${deviceClasses?.touchTarget || ''} flex-1`}
                  disabled={loading}
                  onClick={generateFullRandomCharacter}
                >
                  New Character (Full Random)
                </button>
              </div>
              <div className="max-w-md mx-auto mb-6 text-center text-sm text-blue-300">
                Click <span className="font-bold text-blue-200">Generate Character</span> to create your first Star Wars character!
              </div>
            </>
          )}
          {/* Show advanced action buttons only if a character is generated */}
          {character && (
            <>
              {/* Action buttons above character card */}
              <div className={`max-w-6xl mx-auto mt-8 mb-2 grid ${deviceClasses?.actionGrid || 'grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 lg:gap-2'} justify-center items-stretch`}>
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white w-full ${deviceClasses?.buttonSize || 'px-2 py-3 text-xs'} rounded-xl font-semibold flex flex-col items-center justify-center shadow-md transition-all duration-200 ${deviceClasses?.touchTarget || ''}`}
                  title="Same Type"
                  onClick={() => {
                    setLoading(true);
                    
                    // Keep same class structure, randomize other attributes
                    let species = getRandom(availableSpecies);
                    let alignment = getRandom(alignments);
                    let gender = getRandom(genders);
                    let homeworldType = getRandom(homeworldTypes);
                    let homeworld = { name: homeworldType };
                    
                    // Keep existing class data
                    let classData = swtorClasses.advancedClasses[character.advancedClass];
                    let skillTreeData = classData.skillTrees[character.skillTree];
                    
                    // Regenerate stats with some variation
                    let baseStats = { ...classData.stats.base };
                    Object.keys(baseStats).forEach(stat => {
                      baseStats[stat] += Math.floor(Math.random() * 3) - 1;
                      baseStats[stat] = Math.max(8, Math.min(18, baseStats[stat]));
                    });
                    
                    // Handle lightsaber color
                    let lightsaberColor = null;
                    if (character.forceUser) {
                      let colorKey = character.faction === "Galactic Republic" ? "republic_force" : "empire_force";
                      if (alignment === "Gray") colorKey = "gray";
                      lightsaberColor = getRandom(lightsaberColors[colorKey] || []);
                    }
                    
                    let name = getNameFromSpecies(maleFirstNames, species) + " " + getNameFromSpecies(maleLastNames, species);
                    
                    setCharacter({
                      name,
                      species,
                      faction: character.faction,
                      baseClass: character.baseClass,
                      advancedClass: character.advancedClass,
                      skillTree: character.skillTree,
                      role: skillTreeData.role,
                      alignment,
                      gender,
                      homeworld,
                      stats: baseStats,
                      forceUser: character.forceUser,
                      equipment: classData.equipment,
                      lightsaberColor,
                      description: classData.description,
                      skillTreeDescription: skillTreeData.description,
                      _created: Date.now()
                    });
                    setLoading(false);
                  }}
                >
                  <span className="text-lg mb-1">🔄</span>
                  <span className="text-center leading-tight">Same Type</span>
                </button>
                <button
                  className={`bg-purple-600 hover:bg-purple-700 text-white w-full ${deviceClasses.buttonSize} rounded-xl font-semibold flex flex-col items-center justify-center shadow-md transition-all duration-200 ${deviceClasses.touchTarget}`}
                  title="New Character (Full Random)"
                  onClick={generateFullRandomCharacter}
                >
                  <span className="text-lg mb-1">🎲</span>
                  <span className="text-center leading-tight">Full Random</span>
                </button>
                <button
                  className={`bg-yellow-500 hover:bg-yellow-600 text-white w-full ${deviceClasses.buttonSize} rounded-xl font-semibold flex flex-col items-center justify-center shadow-md transition-all duration-200 ${deviceClasses.touchTarget}`}
                  title="Reroll Stats"
                  onClick={() => {
                    setLoading(true);
                    // Reroll stats based on current advanced class
                    let classData = swtorClasses.advancedClasses[character.advancedClass];
                    let baseStats = { ...classData.stats.base };
                    
                    // Add random variation to each stat
                    Object.keys(baseStats).forEach(stat => {
                      baseStats[stat] += Math.floor(Math.random() * 3) - 1; // -1 to +1 variation
                      baseStats[stat] = Math.max(8, Math.min(18, baseStats[stat])); // Keep within 8-18 range
                    });
                    
                    setCharacter({
                      ...character,
                      stats: baseStats,
                      _created: Date.now()
                    });
                    setLoading(false);
                  }}
                >
                  <span className="text-lg mb-1">🎲</span>
                  <span className="text-center leading-tight">Reroll Stats</span>
                </button>
                <button
                  className={`bg-red-500 hover:bg-red-600 text-white w-full ${deviceClasses.buttonSize} rounded-xl font-semibold flex flex-col items-center justify-center shadow-md transition-all duration-200 ${deviceClasses.touchTarget}`}
                  title="Reroll Name"
                  onClick={() => {
                    let name = getNameFromSpecies(maleFirstNames, character.species) + " " + getNameFromSpecies(maleLastNames, character.species);
                    setCharacter({
                      ...character,
                      name,
                      _created: Date.now()
                    });
                  }}
                >
                  <span className="text-lg mb-1">🎲</span>
                  <span className="text-center leading-tight">Reroll Name</span>
                </button>
                <button
                  className={`bg-green-600 hover:bg-green-700 text-white w-full ${deviceClasses.buttonSize} rounded-xl font-semibold flex flex-col items-center justify-center shadow-md transition-all duration-200 ${deviceClasses.touchTarget}`}
                  title="Download JSON"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", `${character.name.replace(/\s+/g, '_')}_character.json`);
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                  }}
                >
                  <span className="text-lg mb-1">💾</span>
                  <span className="text-center leading-tight">JSON Export</span>
                </button>
                <button
                  className={`bg-cyan-600 hover:bg-cyan-700 text-white w-full ${deviceClasses.buttonSize} rounded-xl font-semibold flex flex-col items-center justify-center shadow-md transition-all duration-200 ${deviceClasses.touchTarget}`}
                  title="Copy Character Description"
                  onClick={() => {
                    const generateCharacterDescription = () => {
                      let description = `=== ${character.name} ===\n\n`;
                      
                      // Basic Information
                      description += `Species: ${character.species}\n`;
                      description += `Gender: ${character.gender || 'Unknown'}\n`;
                      description += `Faction: ${character.faction}\n`;
                      description += `Alignment: ${character.alignment}\n\n`;
                      
                      // Class Information
                      description += `=== Class Information ===\n`;
                      description += `Base Class: ${character.baseClass}\n`;
                      description += `Advanced Class: ${character.advancedClass}\n`;
                      description += `Skill Tree: ${character.skillTree}\n`;
                      description += `Role: ${character.role}\n\n`;
                      
                      // Force Information
                      if (character.forceUser) {
                        description += `=== Force Abilities ===\n`;
                        description += `Force User: Yes\n`;
                        if (character.lightsaberColor) {
                          description += `Lightsaber Color: ${character.lightsaberColor}\n`;
                        }
                        description += `\n`;
                      }
                      
                      // Stats
                      description += `=== Attributes ===\n`;
                      Object.entries(character.stats).forEach(([stat, value]) => {
                        description += `${stat}: ${value}\n`;
                      });
                      description += `\n`;
                      
                      // Equipment
                      if (character.equipment && character.equipment.length > 0) {
                        description += `=== Equipment ===\n`;
                        character.equipment.forEach(item => {
                          description += `• ${item}\n`;
                        });
                        description += `\n`;
                      }
                      
                      // Background
                      description += `=== Background ===\n`;
                      if (character.homeworld && character.homeworld.name) {
                        description += `Homeworld: ${character.homeworld.name}\n`;
                      }
                      
                      // Class Description
                      if (character.description) {
                        description += `\nClass Description: ${character.description}\n`;
                      }
                      
                      // Skill Tree Description
                      if (character.skillTreeDescription) {
                        description += `\nSpecialization: ${character.skillTreeDescription}\n`;
                      }
                      
                      description += `\n=== Generated by ForceFoundry ===\n`;
                      description += `https://github.com/RocketMobster/forcefoundry\n`;
                      description += `Created: ${new Date(character._created).toLocaleDateString()}\n`;
                      
                      return description;
                    };

                    const characterDesc = generateCharacterDescription();
                    
                    if (navigator.clipboard && window.isSecureContext) {
                      navigator.clipboard.writeText(characterDesc).then(() => {
                        showToast('Character description copied! 📋');
                      }).catch(() => {
                        fallbackCopy(characterDesc);
                      });
                    } else {
                      fallbackCopy(characterDesc);
                    }
                    
                    function fallbackCopy(text) {
                      const textarea = document.createElement('textarea');
                      textarea.value = text;
                      textarea.style.position = 'fixed';
                      textarea.style.left = '-9999px';
                      document.body.appendChild(textarea);
                      textarea.focus();
                      textarea.select();
                      try {
                        document.execCommand('copy');
                        showToast('Character description copied! 📋');
                      } catch (err) {
                        alert('Copy failed. Please try again.');
                      }
                      document.body.removeChild(textarea);
                    }
                    
                    function showToast(message) {
                      const toast = document.createElement('div');
                      toast.textContent = message;
                      toast.style.position = 'fixed';
                      toast.style.bottom = '32px';
                      toast.style.left = '50%';
                      toast.style.transform = 'translateX(-50%)';
                      toast.style.background = '#222';
                      toast.style.color = '#fff';
                      toast.style.padding = '12px 24px';
                      toast.style.borderRadius = '8px';
                      toast.style.zIndex = '9999';
                      toast.style.fontSize = '14px';
                      document.body.appendChild(toast);
                      setTimeout(() => { toast.remove(); }, 2500);
                    }
                  }}
                >
                  <span className="text-lg mb-1">📋</span>
                  <span className="text-center leading-tight">Description</span>
                </button>
                <button
                  className={`bg-pink-600 hover:bg-pink-700 text-white w-full ${deviceClasses.buttonSize} rounded-xl font-semibold flex flex-col items-center justify-center shadow-md transition-all duration-200 ${deviceClasses.touchTarget}`}
                  title="Copy AI Prompt"
                  onClick={() => {
                    const generateAIPrompt = () => {
                      let prompt = `A ${character.alignment.toLowerCase()} ${character.species.toLowerCase()}`;
                      
                      // Add gender if specified
                      if (character.gender && character.gender !== 'Unknown') {
                        prompt += ` ${character.gender.toLowerCase()}`;
                      }
                      
                      // Add class information
                      prompt += ` ${character.advancedClass} from Star Wars: The Old Republic`;
                      
                      // Add name
                      prompt += `. Character name: ${character.name}`;
                      
                      // Add faction
                      prompt += `. They serve the ${character.faction}`;
                      
                      // Add role and skill tree
                      prompt += ` and specialize in ${character.skillTree} as a ${character.role}`;
                      
                      // Add physical characteristics if Force user
                      if (character.forceUser && character.lightsaberColor) {
                        prompt += `. As a Force user, they wield a ${character.lightsaberColor} lightsaber`;
                      }
                      
                      // Add key stats
                      const topStats = Object.entries(character.stats)
                        .filter(([stat, value]) => stat !== 'HP')
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 2)
                        .map(([stat, value]) => `${stat.toLowerCase()}: ${value}`);
                      
                      if (topStats.length > 0) {
                        prompt += `. Notable attributes: ${topStats.join(', ')}`;
                      }
                      
                      // Add homeworld
                      if (character.homeworld && character.homeworld.name) {
                        prompt += `. From the ${character.homeworld.name}`;
                      }
                      
                      // Add style guidance for AI
                      prompt += `. Professional fantasy art style, detailed character portrait, Star Wars universe aesthetic`;
                      
                      return prompt;
                    };

                    const aiPrompt = generateAIPrompt();
                    
                    if (navigator.clipboard && window.isSecureContext) {
                      navigator.clipboard.writeText(aiPrompt).then(() => {
                        showToast('AI prompt copied to clipboard! 🎨');
                      }).catch(() => {
                        fallbackCopy(aiPrompt);
                      });
                    } else {
                      fallbackCopy(aiPrompt);
                    }
                    
                    function fallbackCopy(text) {
                      const textarea = document.createElement('textarea');
                      textarea.value = text;
                      textarea.style.position = 'fixed';
                      textarea.style.left = '-9999px';
                      document.body.appendChild(textarea);
                      textarea.focus();
                      textarea.select();
                      try {
                        document.execCommand('copy');
                        showToast('AI prompt copied to clipboard! 🎨');
                      } catch (err) {
                        alert('Copy failed. Please try again.');
                      }
                      document.body.removeChild(textarea);
                    }
                    
                    function showToast(message) {
                      const toast = document.createElement('div');
                      toast.textContent = message;
                      toast.style.position = 'fixed';
                      toast.style.bottom = '32px';
                      toast.style.left = '50%';
                      toast.style.transform = 'translateX(-50%)';
                      toast.style.background = '#222';
                      toast.style.color = '#fff';
                      toast.style.padding = '12px 24px';
                      toast.style.borderRadius = '8px';
                      toast.style.zIndex = '9999';
                      toast.style.fontSize = '14px';
                      document.body.appendChild(toast);
                      setTimeout(() => { toast.remove(); }, 2500);
                    }
                  }}
                >
                  <span className="text-lg mb-1">🎨</span>
                  <span className="text-center leading-tight">Copy AI Prompt</span>
                </button>
                <button
                  className={`bg-purple-600 hover:bg-purple-700 text-white w-full ${deviceClasses.buttonSize} rounded-xl font-semibold flex flex-col items-center justify-center shadow-md transition-all duration-200 ${deviceClasses.touchTarget}`}
                  title="Export to PDF"
                  onClick={generateCharacterPDF}
                >
                  <span className="text-lg mb-1">📄</span>
                  <span className="text-center leading-tight">Export PDF</span>
                </button>
              </div>
              {/* Explanation text below buttons */}
              <div className="max-w-lg mx-auto mb-4 mt-2 text-sm text-blue-200">
                <div className="flex flex-col gap-1">
                  <span>🔄 <b>Same Type:</b> Generate another {character.advancedClass} ({character.skillTree})</span>
                  <span>🎲 <b>New Character:</b> Randomize everything (faction, class, skill tree, etc.)</span>
                  <span>🎲 <b>Reroll Stats/Name:</b> Regenerate specific character attributes</span>
                  <span>📋 <b>Description:</b> Copy formatted character sheet for RPG sessions</span>
                  <span>🎨 <b>AI Prompt:</b> Copy optimized prompt for AI image generators</span>
                  <span>📄 <b>Export PDF:</b> Download professional character sheet as PDF document</span>
                </div>
              </div>
              {/* Character Card Display */}
              <div className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                {/* Portrait area with class-based icon */}
                <div className="flex justify-center items-center mb-4">
                  {(() => {
                    // Base class specific icons
                    switch(character.baseClass) {
                      case "Jedi Knight":
                        return <span className="text-blue-400 text-5xl" title="Jedi Knight">⚔️</span>;
                      case "Jedi Consular":
                        return <span className="text-cyan-400 text-5xl" title="Jedi Consular">🔮</span>;
                      case "Trooper":
                        return <span className="text-green-400 text-5xl" title="Trooper">🎖️</span>;
                      case "Smuggler":
                        return <span className="text-yellow-400 text-5xl" title="Smuggler">🎲</span>;
                      case "Sith Warrior":
                        return <span className="text-red-500 text-5xl" title="Sith Warrior">⚡</span>;
                      case "Sith Inquisitor":
                        return <span className="text-purple-500 text-5xl" title="Sith Inquisitor">🌀</span>;
                      case "Bounty Hunter":
                        return <span className="text-orange-400 text-5xl" title="Bounty Hunter">💀</span>;
                      case "Imperial Agent":
                        return <span className="text-gray-400 text-5xl" title="Imperial Agent">🎯</span>;
                      default:
                        return <span className="text-gray-400 text-5xl" title="Character">👤</span>;
                    }
                  })()}
                </div>
                {/* Character Name and Basic Info */}
                <h3 className="text-xl font-bold mb-2 text-yellow-300">{character.name}</h3>
                <div className="mb-2 text-gray-300">{character.species} &mdash; {character.faction}</div>
                
                {/* Class Information */}
                <div className="mb-3 p-3 bg-gray-700 rounded-lg">
                  <div className="mb-1 text-gray-400">Base Class: <span className="font-semibold text-blue-400">{character.baseClass}</span></div>
                  <div className="mb-1 text-gray-400">Advanced Class: <span className="font-semibold text-purple-400">{character.advancedClass}</span></div>
                  <div className="mb-1 text-gray-400">Skill Tree: <span className="font-semibold text-green-400">{character.skillTree}</span> <span className="text-xs text-gray-500">({character.role})</span></div>
                  {character.description && (
                    <div className="text-xs text-gray-400 italic mt-2">{character.description}</div>
                  )}
                  {character.skillTreeDescription && (
                    <div className="text-xs text-gray-300 mt-1">{character.skillTreeDescription}</div>
                  )}
                </div>
                
                {/* Character Attributes */}
                <div className="mb-2 text-gray-400">Gender: <span className={
                  character.gender === 'male' ? 'font-semibold text-blue-400' :
                  character.gender === 'female' ? 'font-semibold text-pink-400' :
                  'font-semibold text-gray-400'
                }>{character.gender ? (character.gender.charAt(0).toUpperCase() + character.gender.slice(1)) : 'Unknown'}</span></div>
                <div className="mb-2 text-gray-400">Alignment: <span className="font-semibold text-blue-400">{character.alignment}</span></div>
                <div className="mb-2 text-gray-400">Homeworld: <span className="font-semibold text-green-400">{character.homeworld?.name}</span></div>
                <div className="mb-2 text-gray-400">Force User: <span className="font-semibold text-purple-400">{character.forceUser ? 'Yes' : 'No'}</span></div>
                {character.lightsaberColor && (
                  <div className="mb-2 text-gray-400">Lightsaber Color: <span className="font-semibold" style={{ color: character.lightsaberColor }}>{character.lightsaberColor}</span></div>
                )}
                <div className="mb-2 text-gray-400">Equipment: <span className="font-semibold text-gray-200">{character.equipment?.join(', ')}</span></div>
                <div className="mb-2 text-gray-400">Stats:</div>
                <ul className="grid grid-cols-2 gap-2 text-xs text-gray-200 mb-2">
                  {character.stats && Object.entries(character.stats).map(([stat, value]) => (
                    <li key={stat} className="flex justify-between"><span className="font-semibold text-gray-400">{stat}</span> <span>{value}</span></li>
                  ))}
                  {/* Show HP calculated from endurance */}
                  {character.stats.endurance && (
                    <li className="flex justify-between"><span className="font-semibold text-gray-400">HP</span> <span>{character.stats.endurance * 10}</span></li>
                  )}
                </ul>
                <div className="mt-2 text-xs text-gray-500">Generated: {new Date(character._created).toLocaleString()}</div>
              </div>
            </>
          )}
        </>
      ) : (
        <NameGenerator />
      )}
    </div>
  );
}
