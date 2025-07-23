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


  // Character generation logic
  const generateCharacter = () => {
    setLoading(true);
    // Pick species
    let species = selectedSpecies === "Random" ? getRandom(availableSpecies) : selectedSpecies;
    // Pick class
    let charClass = getRandom(classes);
    // Pick alignment
    let alignment = getRandom(alignments);
    // Pick gender
    let gender = getRandom(genders);
    // Pick homeworld
    let homeworldType = getRandom(homeworldTypes);
    let homeworld = { name: homeworldType };
    // Pick stats and equipment
    let stats = statSystems[statSystem][charClass].stats;
    let forceUser = statSystems[statSystem][charClass].forceUser;
    let equipment = statSystems[statSystem][charClass].equipment;
    // Pick lightsaber color if force user
    let lightsaberColor = forceUser ? getRandom(lightsaberColors[charClass] || []) : null;
    // Pick name
    let name = getNameFromSpecies(maleFirstNames, species) + " " + getNameFromSpecies(maleLastNames, species);
    // Compose character object
    const characterObj = {
      name,
      species,
      charClass,
      alignment,
      gender,
      homeworld,
      stats,
      forceUser,
      equipment,
      lightsaberColor,
      _created: Date.now()
    };
    setCharacter(characterObj);
    setLoading(false);
  };

  // Full random character logic
  const generateFullRandomCharacter = () => {
    setLoading(true);
    // Pick everything randomly
    let species = getRandom(availableSpecies);
    let charClass = getRandom(classes);
    let alignment = getRandom(alignments);
    let gender = getRandom(genders);
    let homeworldType = getRandom(homeworldTypes);
    let homeworld = { name: homeworldType };
    let statSystemKey = getRandom(Object.keys(statSystems));
    let stats = statSystems[statSystemKey][charClass].stats;
    let forceUser = statSystems[statSystemKey][charClass].forceUser;
    let equipment = statSystems[statSystemKey][charClass].equipment;
    let lightsaberColor = forceUser ? getRandom(lightsaberColors[charClass] || []) : null;
    let name = getNameFromSpecies(maleFirstNames, species) + " " + getNameFromSpecies(maleLastNames, species);
    const characterObj = {
      name,
      species,
      charClass,
      alignment,
      gender,
      homeworld,
      stats,
      forceUser,
      equipment,
      lightsaberColor,
      _created: Date.now()
    };
    setCharacter(characterObj);
    setLoading(false);
  };

  // Only one return statement below, containing all JSX
  return (
    <main className="max-w-4xl mx-auto px-6 pb-16">
      {mode === 'character' ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Character Generator</h2>
            <p className="text-gray-400">Create detailed Star Wars characters with stats and backgrounds</p>
          </div>
          <div className="max-w-md mx-auto mb-6">
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
          <div className="max-w-md mx-auto mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Stat System:</label>
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
                : 'SWTOR-specific stats with hitpoints calculated from endurance (x10)'}
            </p>
          </div>
          <div className="max-w-md mx-auto mb-6 flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">AI Portrait Generation:</label>
            <span className="text-yellow-400 font-bold">[TEMPORARILY DISABLED]</span>
            <input type="checkbox" checked={aiPortraitEnabled} disabled className="ml-2" />
          </div>
          {/* Show original buttons only if no character is generated */}
          {!character && (
            <>
              <div className="max-w-md mx-auto mb-6 flex flex-col gap-4 md:flex-row md:gap-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium text-white md:mr-2"
                  disabled={loading}
                  onClick={generateCharacter}
                >
                  Generate Character
                </button>
                <button
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-medium text-white"
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
              <div className="max-w-lg mx-auto mt-8 mb-2 grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-3 justify-center items-center">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full px-4 py-3 rounded-xl font-semibold flex flex-row items-center justify-center text-base shadow-md transition-all duration-200"
                  title="Same Type"
                  onClick={() => {
                    setLoading(true);
                    let species = getRandom(availableSpecies);
                    let charClass = character.charClass;
                    let alignment = character.alignment;
                    let gender = character.gender;
                    let homeworldType = getRandom(homeworldTypes);
                    let homeworld = { name: homeworldType };
                    let stats = statSystems[statSystem][charClass].stats;
                    let forceUser = statSystems[statSystem][charClass].forceUser;
                    let equipment = statSystems[statSystem][charClass].equipment;
                    let lightsaberColor = forceUser ? getRandom(lightsaberColors[charClass] || []) : null;
                    let name = getNameFromSpecies(maleFirstNames, species) + " " + getNameFromSpecies(maleLastNames, species);
                    setCharacter({
                      name,
                      species,
                      charClass,
                      alignment,
                      gender,
                      homeworld,
                      stats,
                      forceUser,
                      equipment,
                      lightsaberColor,
                      _created: Date.now()
                    });
                    setLoading(false);
                  }}
                >
                  <span>🔄</span>
                  <span>Same Type</span>
                </button>
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full px-4 py-3 rounded-xl font-semibold flex flex-row items-center justify-center text-base shadow-md transition-all duration-200"
                  title="New Character (Full Random)"
                  onClick={generateFullRandomCharacter}
                >
                  <span>🎲</span>
                  <span>New Character<br/>(Full Random)</span>
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white w-full px-4 py-3 rounded-xl font-semibold flex flex-row items-center justify-center text-base shadow-md transition-all duration-200"
                  title="Reroll Stats"
                  onClick={() => {
                    setLoading(true);
                    // Reroll only stats for current class and stat system
                    let stats = {...statSystems[statSystem][character.charClass].stats};
                    // Actually randomize stats for each stat key
                    Object.keys(stats).forEach(key => {
                      stats[key] = Math.floor(Math.random() * 6) + 10; // Example: random value between 10-15
                    });
                    setCharacter({
                      ...character,
                      stats,
                      _created: Date.now()
                    });
                    setLoading(false);
                  }}
                >
                  <span>🎲</span>
                  <span>Reroll Stats</span>
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white w-full px-4 py-3 rounded-xl font-semibold flex flex-row items-center justify-center text-base shadow-md transition-all duration-200"
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
                  <span>🎲</span>
                  <span>Reroll Name</span>
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white w-full px-4 py-3 rounded-xl font-semibold flex flex-row items-center justify-center text-base shadow-md transition-all duration-200"
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
                  <span>💾</span>
                  <span>Download JSON</span>
                </button>
              </div>
              {/* Explanation text below buttons */}
              <div className="max-w-lg mx-auto mb-4 mt-2 text-sm text-blue-200">
                <div className="flex flex-col gap-1">
                  <span>🔄 <b>Same Type:</b> Generate another {character.gender} {character.charClass}</span>
                  <span>🎲 <b>New Character:</b> Randomize everything (gender, class, etc.)</span>
                  <span>🎲 <b>Reroll Name:</b> Generate a new name for this character</span>
                </div>
              </div>
              {/* Character Card Display */}
              <div className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                {/* Portrait area with default class icon */}
                <div className="flex justify-center items-center mb-4">
                  {(() => {
                    switch (character.charClass) {
                      case 'Jedi':
                        return <span className="text-blue-400 text-5xl" title="Jedi">🧑‍🚀</span>;
                      case 'Sith':
                        return <span className="text-red-500 text-5xl" title="Sith">🦹‍♂️</span>;
                      case 'Bounty Hunter':
                        return <span className="text-green-400 text-5xl" title="Bounty Hunter">🤠</span>;
                      case 'Smuggler':
                        return <span className="text-yellow-400 text-5xl" title="Smuggler">🕵️‍♂️</span>;
                      default:
                        return <span className="text-gray-400 text-5xl" title="Character">🧑‍🎤</span>;
                    }
                  })()}
                </div>
                {/* Gender display */}
                <h3 className="text-xl font-bold mb-2 text-yellow-300">{character.name}</h3>
                {/* ...existing code... */}
                <div className="mb-2 text-gray-300">{character.species} &mdash; {character.charClass}</div>
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
                  {/* Show HP for SWTOR stats */}
                  {statSystem === 'swtor' && character.stats.endurance && (
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
    </main>
  );
}
