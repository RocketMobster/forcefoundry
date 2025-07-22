import { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { getResourceUrl } from '../utils/paths';
import NameGenerator from '../components/NameGenerator';
import maleFirstNames from '../data/male_first_names.json';
import maleLastNames from '../data/male_last_names.json';
import femaleFirstNames from '../data/female_first_names.json';
import femaleLastNames from '../data/female_last_names.json';
import otherNamesNeutral from '../data/other_names_neutral.json';
import canonNamesData from '../data/canon_names.json';

// Character generation data
const alignments = ["Light Side", "Gray", "Dark Side", "Neutral"];
const genders = ["male", "female", "other"];
const classes = ["Jedi", "Sith", "Bounty Hunter", "Smuggler"];
const homeworldTypes = ["Core World", "Mid Rim", "Outer Rim", "Unknown Regions", "Wild Space", "Hutt Space"];
const lightsaberColors = {
  "Jedi": ["blue", "green", "yellow", "purple"],
  "Sith": ["red"],
  "Gray": ["orange", "yellow", "white", "silver", "viridian"]
};

// Stats for different character systems
const statSystems = {
  traditional: {
    Jedi: {
      stats: { strength: 12, agility: 14, intelligence: 13, wisdom: 15, charisma: 12, constitution: 11 },
      forceUser: true,
      equipment: ["Lightsaber", "Jedi Robes", "Comlink", "Meditation Crystal"]
    },
    Sith: {
      stats: { strength: 14, agility: 13, intelligence: 14, wisdom: 12, charisma: 10, constitution: 14 },
      forceUser: true,
      equipment: ["Lightsaber", "Sith Robes", "Amulet", "Holocron"]
    },
    "Bounty Hunter": {
      stats: { strength: 14, agility: 15, intelligence: 12, wisdom: 11, charisma: 10, constitution: 15 },
      forceUser: false,
      equipment: ["Blaster Rifle", "Armor", "Jetpack", "Tracking Fob", "Binders"]
    },
    Smuggler: {
      stats: { strength: 12, agility: 14, intelligence: 13, wisdom: 10, charisma: 15, constitution: 12 },
      forceUser: false,
      equipment: ["Blaster Pistol", "Datapad", "Comlink", "Ship Keys", "Sabacc Cards"]
    }
  },
  swtor: {
    Jedi: {
      stats: { strength: 10, endurance: 12, aim: 11, cunning: 14, willpower: 15 },
      forceUser: true,
      equipment: ["Lightsaber", "Jedi Robes", "Focus", "Shield Generator"]
    },
    Sith: {
      stats: { strength: 13, endurance: 14, aim: 10, cunning: 12, willpower: 15 },
      forceUser: true,
      equipment: ["Lightsaber", "Sith Armor", "Force Amplifier", "Trophy Belt"]
    },
    "Bounty Hunter": {
      stats: { strength: 12, endurance: 15, aim: 14, cunning: 12, willpower: 10 },
      forceUser: false,
      equipment: ["Heavy Cannon", "Armor Plating", "Missile System", "Targeting Computer"]
    },
    Smuggler: {
      stats: { strength: 11, endurance: 12, aim: 15, cunning: 14, willpower: 11 },
      forceUser: false,
      equipment: ["Blaster", "Stealth Field", "Scattergun", "Med Kit"]
    }
  }
};

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
  const [navOpen, setNavOpen] = useState(true);
  const [availableSpecies, setAvailableSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState("Random");
  const [statSystem, setStatSystem] = useState("traditional");
  // AI Portrait generation is temporarily disabled
  const [aiPortraitEnabled, setAiPortraitEnabled] = useState(false); // Always initialize to false
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [portraitError, setPortraitError] = useState(null);
  const [mode, setMode] = useState('character');

  useEffect(() => {
    fetch(getResourceUrl('/data/species.json'))
      .then(res => res.json())
      .then(data => setAvailableSpecies(data))
      .catch(() => setAvailableSpecies([]));
  }, []);
  
  // Utility function to get a name from a specific species (or fallback to another)
  const getNameFromSpecies = (nameData, species, fallbackSpecies = 'Human/Common') => {
    // Try the requested species first
    if (nameData[species] && nameData[species].length > 0) {
      return getRandom(nameData[species]);
    }
    
    // Fallback to specified fallback species
    if (nameData[fallbackSpecies] && nameData[fallbackSpecies].length > 0) {
      return getRandom(nameData[fallbackSpecies]);
    }
    
    // Last resort: use first available species
    const availableSpecies = Object.keys(nameData).find(key => nameData[key] && nameData[key].length > 0);
    if (availableSpecies) {
      return getRandom(nameData[availableSpecies]);
    }
    
    // If all else fails, return a placeholder
    return 'Unknown';
  };

  // Function to generate a character
  const generateCharacter = (fullRandom = false) => {
    // Randomly generate character details
    const gender = fullRandom ? getRandom(genders) : (character?.gender || getRandom(genders));
    const charClass = fullRandom ? getRandom(classes) : (character?.charClass || 'Jedi');
    const alignment = fullRandom ? getRandom(alignments) : (character?.alignment || getRandom(alignments));
    const currentStatSystem = fullRandom ? statSystem : (character?.statSystem || statSystem);
    
    // Get species (random or specific)
    let species;
    if (selectedSpecies === "Random" || fullRandom) {
      species = getRandom(availableSpecies);
    } else {
      species = selectedSpecies;
    }

    // Get appropriate name data sets
    let firstNameData, lastNameData;
    if (gender === 'male') {
      firstNameData = maleFirstNames;
      lastNameData = maleLastNames;
    } else if (gender === 'female') {
      firstNameData = femaleFirstNames;
      lastNameData = femaleLastNames;
    } else {
      // For 'other' gender, randomly pick from either male or female first names
      firstNameData = Math.random() < 0.5 ? maleFirstNames : femaleFirstNames;
      lastNameData = Math.random() < 0.5 ? maleLastNames : femaleLastNames;
    }
    
    // Generate first and last name
    let firstName = getNameFromSpecies(firstNameData, species);
    let lastName = getNameFromSpecies(lastNameData, species);
    
    // Simple name generation (first + last) is default
    let finalName = `${firstName} ${lastName}`;
    
    // Check if this species exists in all name files for potential variations
    const speciesExistsInAllFiles = (
      (maleFirstNames[species] && maleFirstNames[species].length > 0) &&
      (femaleFirstNames[species] && femaleFirstNames[species].length > 0) &&
      (maleLastNames[species] && maleLastNames[species].length > 0) &&
      (femaleLastNames[species] && femaleLastNames[species].length > 0) &&
      (otherNamesNeutral[species] && otherNamesNeutral[species].length > 0)
    );
    
    // Add name variations (only if we have complete species data)
    if (speciesExistsInAllFiles) {
      const neutralNames = otherNamesNeutral[species] || [];
      const nameChance = Math.random();
      
      if (nameChance < 0.05 && neutralNames.length > 0) {
        // 5% chance: Middle name
        const middleName = getRandom(neutralNames);
        finalName = `${firstName} ${middleName} ${lastName}`;
      } else if (nameChance < 0.1) {
        // 5% chance: Hyphenated last name
        const secondLastName = getNameFromSpecies(lastNameData, species);
        finalName = `${firstName} ${lastName}-${secondLastName}`;
      }
    }
    
    // Generate stats based on class and system
    const baseStats = statSystems[currentStatSystem][charClass].stats;
    const stats = Object.fromEntries(
      Object.entries(baseStats).map(([k, base]) => [k, base + Math.floor(Math.random() * 3)])
    );
    
    // Add hitpoints for SWTOR system
    if (currentStatSystem === 'swtor' && stats.endurance) {
      stats.hitpoints = stats.endurance * 10;
    }
    
    // Get homeworld type and name
    const homeworldType = getRandom(homeworldTypes);
    
    // Fetch random planet from our planets list
    const planets = require('../public/data/planets.json');
    let homeworldName = planets[Math.floor(Math.random() * planets.length)];
    
    // Get equipment from class template
    const equipment = [...statSystems[currentStatSystem][charClass].equipment];
    
    // Add lightsaber color for force users
    const forceUser = statSystems[currentStatSystem][charClass].forceUser;
    let lightsaberColor = null;
    if (forceUser) {
      if (charClass === "Jedi") {
        lightsaberColor = getRandom(lightsaberColors.Jedi);
      } else if (charClass === "Sith") {
        lightsaberColor = getRandom(lightsaberColors.Sith);
      } else if (alignment === "Gray") {
        lightsaberColor = getRandom(lightsaberColors.Gray);
      }
    }
    
    // Create the character object with canon name detection
    const newCharacter = {
      name: finalName,
      isCanon: isCanonName(finalName), // Add canon detection here
      gender,
      species,
      charClass,
      alignment,
      homeworld: {
        type: homeworldType,
        name: homeworldName
      },
      stats,
      equipment,
      forceUser,
      lightsaberColor,
      statSystem: currentStatSystem,
      _created: Date.now()
    };
    
    // Set the character in state
    setCharacter(newCharacter);
    
    // Generate portrait if enabled
    if (aiPortraitEnabled) {
      generateNewPortrait();
    }
  };

  const rerollStats = () => {
    if (!character) return;
    const { charClass, statSystem } = character;
    const currentClasses = statSystems[statSystem];
    const stats = Object.fromEntries(
      Object.entries(currentClasses[charClass].stats).map(([k, base]) => [k, base + Math.floor(Math.random() * 3)])
    );
    // Add hitpoints for SWTOR system (endurance * 10)
    if (statSystem === 'swtor' && stats.endurance) {
      stats.hitpoints = stats.endurance * 10;
    }
    setCharacter({
      ...character,
      stats,
    });
  };

  // Download character as JSON
  const downloadJSON = () => {
    if (!character) return;
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.replace(/ /g, '_')}.json`;
    a.click();
  };

  // Reroll character name
  const rerollName = () => {
    if (!character) return;
    
    // Use the existing character's gender and species for consistent name generation
    const { gender, species: characterSpecies } = character;
    
    // Check if the species exists in all required JSON files for name variations
    const speciesExistsInAllFiles = (
      (maleFirstNames[characterSpecies] && maleFirstNames[characterSpecies].length > 0) &&
      (femaleFirstNames[characterSpecies] && femaleFirstNames[characterSpecies].length > 0) &&
      (maleLastNames[characterSpecies] && maleLastNames[characterSpecies].length > 0) &&
      (femaleLastNames[characterSpecies] && femaleLastNames[characterSpecies].length > 0) &&
      (otherNamesNeutral[characterSpecies] && otherNamesNeutral[characterSpecies].length > 0)
    );

    // Generate new names using the same logic as generateCharacter
    let firstName, lastName;
    if (gender === 'male') {
      firstName = getNameFromSpecies(maleFirstNames, characterSpecies);
      lastName = getNameFromSpecies(maleLastNames, characterSpecies);
    } else if (gender === 'female') {
      firstName = getNameFromSpecies(femaleFirstNames, characterSpecies);
      lastName = getNameFromSpecies(femaleLastNames, characterSpecies);
    } else {
      // For 'other' gender, randomly pick from either male or female first names
      const nameData = Math.random() < 0.5 ? maleFirstNames : femaleFirstNames;
      const lastNameData = Math.random() < 0.5 ? maleLastNames : femaleLastNames;
      firstName = getNameFromSpecies(nameData, characterSpecies);
      lastName = getNameFromSpecies(lastNameData, characterSpecies);
    }

    // Simple name generation (no middle names or hyphenation unless species exists in all files)
    let finalName = `${firstName} ${lastName}`;

    // Only add variations if species exists in all files (same logic as generateCharacter)
    if (speciesExistsInAllFiles) {
      const neutralNames = otherNamesNeutral[characterSpecies] || [];
      const variationChance = Math.random();
      
      if (variationChance < 0.05 && neutralNames.length > 0) {
        // 5% chance: Middle name for character generator
        const middleName = getRandom(neutralNames);
        finalName = `${firstName} ${middleName} ${lastName}`;
      }
    }

    // Update only the character's name, keeping everything else the same
    setCharacter({
      ...character,
      name: finalName,
      isCanon: isCanonName(finalName),
      _reroll: Date.now()
    });
  };

  // Generate a new portrait for an existing character
  // TEMPORARILY DISABLED - Will be fixed in a future update
  const generateNewPortrait = async () => {
    // Early return - AI portrait generation is disabled
    setPortraitError("AI portrait generation is temporarily disabled.");
    return;
    
    // The code below is preserved for future use
    if (!character) return;
    setPortraitError(null); // Clear error at start
    setLoading(true);
    let didTimeout = false;
    
    // Timeout after 40 seconds
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        didTimeout = true;
        reject(new Error('Portrait generation timed out. The Replicate API may be slow or unavailable.'));
      }, 40000)
    );
    
    const fetchPortrait = async () => {
      try {
        const prompt = `${character.gender} ${character.species} ${character.charClass} from Star Wars, portrait style, detailed face, ${character.alignment} alignment, professional character art`;
        const res = await fetch(getResourceUrl('/api/replicate'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        
        if (!res.ok) {
          let errorText;
          let rawOutput = null;
          try {
            const data = await res.json();
            errorText = data.error || JSON.stringify(data);
            rawOutput = data.rawOutput;
          } catch (e) {
            errorText = await res.text();
          }
          throw new Error(`API Error: ${res.status} - ${res.statusText}: ${errorText}${rawOutput ? `\nRaw Output: ${JSON.stringify(rawOutput)}` : ''}`);
        }
        
        const data = await res.json();
        const imageUrl = data.imageUrl;
        
        if (typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
          throw new Error(`Portrait API did not return a valid image URL.\nReturned: ${JSON.stringify(imageUrl)}\nRaw Output: ${JSON.stringify(data.rawOutput)}`);
        }
        
        setCharacter(prev => prev ? {
          ...prev,
          image: imageUrl,
          imageError: null
        } : prev);
        
        setPortraitError(null);
      } catch (error) {
        console.error('Portrait generation error:', error.message || error);
        setCharacter(prev => {
          if (!prev) return null;
          return {
            ...prev,
            image: null,
            imageError: error.message || 'Unknown error'
          };
        });
        setPortraitError(error.message || 'Unknown error');
      }
    };
    
    try {
      await Promise.race([fetchPortrait(), timeoutPromise]);
    } catch (error) {
      console.error('Portrait generation error:', error.message || error);
      setCharacter(prev => {
        if (!prev) return null;
        return {
          ...prev,
          image: null,
          imageError: error.message || 'Unknown error'
        };
      });
      setPortraitError(error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="max-w-screen-sm mx-auto w-full px-2 py-2">
        {/* Header matching screenshot */}
        <header className="w-full bg-gray-800 shadow-md py-3 mb-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-2xl">⚡</span>
              <span className="text-2xl font-extrabold tracking-wider text-white">ForceFoundry</span>
            </div>
            {/* Navigation moved to floating container below header for mobile UX */}
          </div>
        </header>
        
        {/* Main content */}
      {/* Retractable floating navigation container for mobile and desktop */}
      {/* Handle to open/close nav - always visible at left edge, outside nav */}
      <button
        className="fixed" style={{ top: '140px', left: 0, zIndex: 40, backgroundColor: '#f59e42', color: 'white', borderRadius: '0 0.75rem 0.75rem 0', padding: '0.5rem 0.5rem', minWidth: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center' }}
        onClick={() => setNavOpen(v => !v)}
        aria-label={navOpen ? 'Hide navigation' : 'Show navigation'}
      >
        {navOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      <div
        className="fixed top-20 left-0 z-30 w-[180px] flex flex-col md:flex-row items-center gap-2 p-2 bg-gray-800 bg-opacity-95 rounded-xl shadow-lg border border-gray-700 mb-4 transition-transform duration-300"
        style={{ minHeight: '56px', transform: navOpen ? 'translateX(0)' : 'translateX(-148px)' }}
      >
        {/* Nav content */}
        <div className={`flex flex-col md:flex-row items-center gap-2 w-[180px] md:w-auto transition-all duration-300 ${navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ alignItems: 'flex-start' }}>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition-colors duration-150 w-full md:w-auto ${mode === 'character' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-700'}`}
            onClick={() => setMode('character')}
          >
            <span role="img" aria-label="character">🧑‍🎤</span> Character Generator
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition-colors duration-150 w-full md:w-auto ${mode === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-700'}`}
            onClick={() => setMode('name')}
          >
            <span role="img" aria-label="name">📝</span> Name Generator
          </button>
          <a
            href="/info"
            className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 text-white transition-colors duration-150"
            title="Information"
          >
            <span role="img" aria-label="info">ℹ️</span>
          </a>
        </div>
        {/* Note pointing to handle */}
        {navOpen && (
          <div className="fixed" style={{ top: '146px', left: '40px', zIndex: 50, background: '#111827', color: '#3b82f6', borderRadius: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.85rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '2px solid #3b82f6' }}>
            ← Click the flag to open navigation
          </div>
        )}
      </div>
      <main className="max-w-4xl mx-auto px-6 pb-16">
          {mode === 'character' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Character Generator</h2>
                <p className="text-gray-400">Create detailed Star Wars characters with stats and backgrounds</p>
              </div>
              
              {/* Species Selection */}
              <div className="max-w-md mx-auto mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Species Selection:
                </label>
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
                <p className="text-xs text-gray-500 mt-1">
                  Select a specific species or choose "Random" for variety
                </p>
              </div>

              {/* Stat System Toggle */}
              <div className="max-w-md mx-auto mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stat System:
                </label>
                <select
                  value={statSystem}
                  onChange={(e) => setStatSystem(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="traditional">Traditional RPG (Str, Agi, Int, Wis, Cha, Con)</option>
                  <option value="swtor">Star Wars: The Old Republic (Str, End, Aim, Cun, Will, HP)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {statSystem === 'traditional' 
                    ? 'Classic D&D-style attributes for general RPG systems'
                    : 'SWTOR-specific stats with hitpoints calculated from endurance (x10)'
                  }
                </p>
              </div>

              {/* AI Portrait Toggle - TEMPORARILY DISABLED */}
              <div className="max-w-md mx-auto mb-6">
                <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                  <span>AI Portrait Generation:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 text-xs font-medium">[TEMPORARILY DISABLED]</span>
                    <button
                      disabled={true}
                      className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 bg-gray-700 cursor-not-allowed opacity-60"
                    >
                      <span
                        className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 translate-x-1"
                      />
                    </button>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  AI portrait generation is currently disabled due to API limitations.
                  <span className="text-yellow-400 ml-1">Feature will be fixed in a future update.</span>
                </p>
              </div>

              <div className="flex flex-col w-full gap-2 md:flex-row md:w-auto md:gap-4 mb-6 justify-center items-stretch">
                <button
                  onClick={() => generateCharacter(false)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 w-full md:w-auto"
                  title={character ? `Generate another ${character.gender} ${character.charClass} (keeps current species and settings)` : "Generate a Male Jedi"}
                >
                  <span>🔄</span>
                  {character ? "Same Type" : "Generate Character"}
                </button>
                <button
                  onClick={() => generateCharacter(true)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex items-center gap-2 w-full md:w-auto"
                  title="Randomizes everything: gender, class, species, and all attributes. Use this to start completely fresh."
                >
                  <span>🎲</span>
                  New Character (Full Random)
                </button>
                {character && (
                  <button
                    onClick={rerollStats}
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded flex items-center gap-2 w-full md:w-auto"
                    title="Reroll stats only (keep name, species, class, portrait, etc.)"
                  >
                    <span>🧮</span>
                    Reroll Stats
                  </button>
                )}
                {character && (
                  <>
                    <button
                      onClick={rerollName}
                      className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded flex items-center gap-2 w-full md:w-auto"
                      title="Generate a new name for this character"
                    >
                      <span>🎲</span>
                      Reroll Name
                    </button>
                    {/* New Portrait button removed - AI portrait generation temporarily disabled */}
                    <button
                      onClick={downloadJSON}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center gap-2 w-full md:w-auto"
                    >
                      <span>💾</span>
                      Download JSON
                    </button>
                  </>
                )}
              </div>

              {/* Button explanations */}
              <div className="text-center text-sm text-gray-400 mb-6">
                {character ? (
                  <div className="space-y-1">
                    <p><span className="text-blue-400">🔄 Same Type:</span> Generate another {character.gender} {character.charClass}</p>
                    <p><span className="text-purple-400">🎲 New Character:</span> Randomize everything (gender, class, etc.)</p>
                    <p><span className="text-orange-400">🎲 Reroll Name:</span> Generate a new name for this character</p>
                    {aiPortraitEnabled && (
                      <p><span className="text-purple-400">🖼️ New Portrait:</span> Generate a new AI portrait</p>
                    )}
                  </div>
                ) : (
                  <p>Click <span className="text-blue-400">Generate Character</span> to create your first Star Wars character!</p>
                )}
              </div>

              {loading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 border-opacity-50 mb-6"></div>
                  <div className="text-2xl font-bold mb-2 text-white">Generating character...</div>
                  <div className="text-sm text-gray-300 mb-2">Please wait.</div>
                </div>
              )}

              {/* Always show portrait error at the top if present */}
              {portraitError && !loading && (
                <div className="max-w-xl mx-auto bg-gray-900 rounded-xl p-4 shadow-md border border-red-500 mb-6">
                  <div className="text-center">
                    <div className="text-red-400 text-xs mb-1 font-bold">Portrait generation failed:</div>
                    <div className="text-red-300 text-xs whitespace-pre-wrap break-all" style={{ maxWidth: '32rem', margin: '0 auto' }}>{portraitError}</div>
                    <button
                      className="mt-2 px-2 py-1 bg-gray-700 text-xs text-gray-200 rounded hover:bg-gray-600 border border-gray-500"
                      onClick={() => {
                        navigator.clipboard.writeText(portraitError);
                      }}
                    >Copy Error</button>
                    {aiPortraitEnabled && (
                      <div className="text-yellow-400 text-xs mt-1">
                        Try the "🖼️ New Portrait" button or disable AI portraits
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Character display will go here */}
              {character && !loading && (
                <div className="mt-8">
                  {/* Character card display */}
                  <div className={`max-w-2xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-lg ${character.isCanon ? 'border-2 border-yellow-400' : 'border border-gray-700'}`}>
                    <div className="md:flex">
                      <div className="md:flex-shrink-0 relative">
                        {character.image ? (
                          <img
                            className="h-48 w-full object-cover md:h-full md:w-48"
                            src={character.image}
                            alt={character.name}
                          />
                        ) : (
                          <div className="h-48 w-full md:h-full md:w-48 bg-gray-700 flex items-center justify-center">
                            <div className="text-center p-4">
                              <div className="text-4xl mb-2">
                                {character.charClass === 'Jedi' ? '🧙‍♂️' :
                                 character.charClass === 'Sith' ? '🦹‍♂️' :
                                 character.charClass === 'Bounty Hunter' ? '🏹' :
                                 character.charClass === 'Smuggler' ? '🚀' : '👤'}
                              </div>
                              <div className="text-sm text-gray-300">{character.charClass}</div>
                            </div>
                          </div>
                        )}
                        {character.isCanon && (
                          <div className="absolute top-2 left-2">
                            <span className="text-yellow-300 text-xl">★</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="mb-2">
                          <h2 className="text-2xl font-bold">{character.name}</h2>
                          {character.isCanon && (
                            <p className="text-sm text-yellow-400">Canon Star Wars character name</p>
                          )}
                          <div className="text-gray-400 text-sm mb-4">
                            {character.species} {character.gender} {character.charClass} • {character.alignment}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-lg font-medium mb-2 text-blue-400">Stats</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                            {Object.entries(character.stats).map(([stat, value]) => (
                              <div key={stat} className="bg-gray-700 rounded p-2">
                                <span className="text-gray-400 capitalize">{stat}: </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-lg font-medium mb-2 text-blue-400">Equipment</h3>
                          <ul className="list-disc list-inside text-sm">
                            {character.equipment.map((item, index) => (
                              <li key={index} className="text-gray-300">{item}</li>
                            ))}
                            {character.forceUser && character.lightsaberColor && (
                              <li className="text-gray-300">
                                <span className={`text-${character.lightsaberColor === 'red' ? 'red' : 
                                                        character.lightsaberColor === 'blue' ? 'blue' : 
                                                        character.lightsaberColor === 'green' ? 'green' : 
                                                        character.lightsaberColor === 'purple' ? 'purple' : 'yellow'}-400`}>
                                  {character.lightsaberColor.charAt(0).toUpperCase() + character.lightsaberColor.slice(1)}
                                </span> lightsaber crystal
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2 text-blue-400">Homeworld</h3>
                          <p className="text-sm text-gray-300">
                            {character.homeworld.name || 'Unknown'} ({character.homeworld.type})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <NameGenerator />
          )}
        </main>
      </main>
    </div>
  );
}
