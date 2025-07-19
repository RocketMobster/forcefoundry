  // Reroll stats only, keeping all other character properties the same
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
      stats
    });
  };
import Header from '../components/Header';
import maleFirstNames from '../data/male_first_names.json';
import maleLastNames from '../data/male_last_names.json';
import femaleFirstNames from '../data/female_first_names.json';
import femaleLastNames from '../data/female_last_names.json';
import otherNamesNeutral from '../data/other_names_neutral.json';
import statSystems from '../data/stat_systems.json';
import alignments from '../data/alignments.json';
import starWarsPlanets from '../data/planets.json';
import forceSystem from '../data/force_system.json';

// Get all available species from the data files
const availableSpecies = Object.keys(maleFirstNames);
// Local Star Wars data to avoid API dependency issues
const starWarsSpecies = availableSpecies;

import { useState, useEffect, useRef } from 'react';
// ...existing code...

export default function Home() {
  // ...existing code...
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState('Random');
  const [statSystem, setStatSystem] = useState('traditional');
  const [aiPortraitEnabled, setAiPortraitEnabled] = useState(false);
  const [pendingPortrait, setPendingPortrait] = useState(false); // Track if portrait should be generated after character creation
  const [portraitError, setPortraitError] = useState(null); // Persist portrait error
  const firstRender = useRef(true);

  const getRandom = (arr) => {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const getNameFromSpecies = (nameData, species, fallbackSpecies = 'Human/Common') => {
    // Try the requested species first
    if (nameData[species] && nameData[species].length > 0) {
      return getRandom(nameData[species]);
    }
    
    // Fallback to specified fallback species
    if (nameData[fallbackSpecies] && nameData[fallbackSpecies].length > 0) {
      return getRandom(nameData[fallbackSpecies]);
    }
    
    // Final fallback: try first available species
    const firstAvailableSpecies = Object.keys(nameData).find(s => nameData[s] && nameData[s].length > 0);
    if (firstAvailableSpecies) {
      return getRandom(nameData[firstAvailableSpecies]);
    }
    
    return 'Unknown';
  };

  const getStarWarsData = (type) => {
    if (type === 'species') return getRandom(starWarsSpecies);
    if (type === 'planets') return getRandom(starWarsPlanets);
    return 'Unknown';
  };

  const generateCharacter = async (randomizeAll = false) => {
    try {
      setLoading(true);
      const gender = randomizeAll ? getRandom(['male', 'female', 'other']) : character?.gender || 'male';
      const charClass = randomizeAll ? getRandom(Object.keys(statSystems[statSystem])) : character?.charClass || 'Jedi';
      const currentClasses = statSystems[statSystem];
      let characterSpecies;
      if (randomizeAll || selectedSpecies === 'Random') {
        characterSpecies = getRandom(starWarsSpecies);
      } else {
        characterSpecies = selectedSpecies;
      }
      const speciesExistsInAllFiles = (
        (maleFirstNames[characterSpecies] && maleFirstNames[characterSpecies].length > 0) &&
        (femaleFirstNames[characterSpecies] && femaleFirstNames[characterSpecies].length > 0) &&
        (maleLastNames[characterSpecies] && maleLastNames[characterSpecies].length > 0) &&
        (femaleLastNames[characterSpecies] && femaleLastNames[characterSpecies].length > 0) &&
        (otherNamesNeutral[characterSpecies] && otherNamesNeutral[characterSpecies].length > 0)
      );
      let firstName, lastName;
      if (gender === 'male') {
        firstName = getNameFromSpecies(maleFirstNames, characterSpecies);
        lastName = getNameFromSpecies(maleLastNames, characterSpecies);
      } else if (gender === 'female') {
        firstName = getNameFromSpecies(femaleFirstNames, characterSpecies);
        lastName = getNameFromSpecies(femaleLastNames, characterSpecies);
      } else {
        const nameData = Math.random() < 0.5 ? maleFirstNames : femaleFirstNames;
        const lastNameData = Math.random() < 0.5 ? maleLastNames : femaleLastNames;
        firstName = getNameFromSpecies(nameData, characterSpecies);
        lastName = getNameFromSpecies(lastNameData, characterSpecies);
      }
      let finalName = `${firstName} ${lastName}`;
      if (speciesExistsInAllFiles) {
        const neutralNames = otherNamesNeutral[characterSpecies] || [];
        const variationChance = Math.random();
        if (variationChance < 0.05 && neutralNames.length > 0) {
          const middleName = getRandom(neutralNames);
          finalName = `${firstName} ${middleName} ${lastName}`;
        }
      }
      const alignment = getRandom(alignments);
      const homeworld = getStarWarsData('planets');
      let imageUrl = null;
      let imageError = null;
      const stats = Object.fromEntries(
        Object.entries(currentClasses[charClass].stats).map(([k, base]) => [k, base + Math.floor(Math.random() * 3)])
      );
      if (statSystem === 'swtor' && stats.endurance) {
        stats.hitpoints = stats.endurance * 10;
      }
      let forceSensitivity, lightsaberColor, forceAbilities;
      if (charClass === 'Jedi') {
        forceSensitivity = 'Jedi';
      } else if (charClass === 'Sith') {
        forceSensitivity = 'Sith';
      } else {
        const forceChance = Math.random();
        if (forceChance < 0.05) {
          forceSensitivity = 'Gray Jedi';
        } else if (forceChance < 0.15) {
          forceSensitivity = 'Force Sensitive';
        } else {
          forceSensitivity = 'Non-Force User';
        }
      }
      if (forceSensitivity !== 'Non-Force User' && forceSensitivity !== 'Force Sensitive') {
        lightsaberColor = getRandom(forceSystem.lightsaberColors);
      }
      forceAbilities = forceSystem.forceAbilities[forceSensitivity] || [];
      setCharacter({
        name: finalName,
        gender,
        charClass,
        alignment,
        species: characterSpecies,
        homeworld,
        image: imageUrl,
        imageError,
        stats,
        icon: currentClasses[charClass].icon,
        forceSensitivity,
        lightsaberColor,
        forceAbilities,
        statSystem
      });
      setLoading(false);
      // If AI portrait is enabled, trigger portrait generation after character is set
      if (aiPortraitEnabled) {
        setPendingPortrait(true);
      }
    } catch (error) {
      console.error('Error generating character:', error);
      setLoading(false);
      alert('Failed to generate character. Please try again.');
    }
  };
  // Automatically generate portrait after character creation if needed
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (pendingPortrait && character && aiPortraitEnabled) {
      setPendingPortrait(false);
      generateNewPortrait();
    }
    // eslint-disable-next-line
  }, [character, pendingPortrait, aiPortraitEnabled]);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.replace(/ /g, '_')}.json`;
    a.click();
  };

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
      name: finalName
    });
  };

  const generateNewPortrait = async () => {
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
      let imageUrl = null;
      let imageError = null;
      const prompt = `${character.gender} ${character.species} ${character.charClass} from Star Wars, portrait style, detailed face, ${character.alignment} alignment, professional character art`;
      const res = await fetch('/api/replicate', {
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
      imageUrl = data.imageUrl;
      if (typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
        throw new Error(`Portrait API did not return a valid image URL.\nReturned: ${JSON.stringify(imageUrl)}\nRaw Output: ${JSON.stringify(data.rawOutput)}`);
      }
      setCharacter(prev => prev ? {
        ...prev,
        image: imageUrl,
        imageError: null
      } : prev);
      setPortraitError(null);
    };
    try {
      await Promise.race([fetchPortrait(), timeoutPromise]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="max-w-4xl mx-auto px-6">
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

        {/* AI Portrait Toggle */}
        <div className="max-w-md mx-auto mb-6">
          <label className="flex items-center justify-between text-sm font-medium text-gray-300">
            <span>AI Portrait Generation:</span>
            <button
              onClick={() => setAiPortraitEnabled(!aiPortraitEnabled)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                aiPortraitEnabled ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ${
                  aiPortraitEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {aiPortraitEnabled 
              ? 'Characters will attempt to generate AI portraits (may fail if API unavailable)'
              : 'Characters will use class icons instead of AI portraits'
            }
          </p>
        </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => generateCharacter(false)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
          title={character ? `Generate another ${character.gender} ${character.charClass} (keeps current species and settings)` : "Generate a Male Jedi"}
        >
          <span>🔄</span>
          {character ? "Same Type" : "Generate Character"}
        </button>
        <button
          onClick={() => generateCharacter(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex items-center gap-2"
          title="Randomizes everything: gender, class, species, and all attributes. Use this to start completely fresh."
        >
          <span>🎲</span>
          New Character (Full Random)
        </button>
        {character && (
          <button
            onClick={rerollStats}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded flex items-center gap-2"
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
              className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded flex items-center gap-2"
              title="Generate a new name for this character"
            >
              <span>🎲</span>
              Reroll Name
            </button>
            {aiPortraitEnabled && (
              <button
                onClick={generateNewPortrait}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded flex items-center gap-2"
                title="Generate a new AI portrait"
              >
                <span>🖼️</span>
                {loading ? 'Generating...' : 'New Portrait'}
              </button>
            )}
            <button
              onClick={downloadJSON}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center gap-2"
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
          <div className="text-2xl font-bold mb-2 text-white">Generating portrait...</div>
          <div className="text-sm text-gray-300 mb-2">This may take up to 30 seconds. Please wait.</div>
          <div className="text-xs text-gray-400">If this takes too long or fails, try again or check your API key.</div>
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
      {character && !loading && (
        <div className="max-w-xl mx-auto bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="w-full h-64 bg-gray-700 rounded mb-4 flex items-center justify-center overflow-hidden">
            {character.image ? (
              <img 
                src={character.image} 
                alt={`${character.name} portrait`}
                className="w-64 h-64 object-cover rounded mx-auto"
                style={{ aspectRatio: '1 / 1', width: '16rem', height: '16rem', maxWidth: '100%', maxHeight: '100%' }}
                onError={(e) => {
                  // Fallback to character icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full flex items-center justify-center text-gray-400" 
                 style={{ display: character.image ? 'none' : 'flex' }}>
              <div className="text-center">
                <div className="text-6xl mb-4">{character.icon}</div>
                <div className="text-lg font-semibold text-white">{character.charClass}</div>
                <div className="text-sm text-gray-300">
                  {'Character Portrait'}
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold">{character.name} <span>{character.icon}</span></h2>
          <p><strong>Gender:</strong> {character.gender}</p>
          <p><strong>Class:</strong> {character.charClass}</p>
          <p><strong>Alignment:</strong> {character.alignment}</p>
          <p><strong>Species:</strong> {character.species}</p>
          <p><strong>Homeworld:</strong> {character.homeworld}</p>
          
          {/* Force System Display */}
          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-purple-300 mb-2">Force Connection</h3>
            <p><strong>Force Sensitivity:</strong> {character.forceSensitivity}</p>
            {character.lightsaberColor && (
              <p><strong>Lightsaber Color:</strong> <span className="text-yellow-400">{character.lightsaberColor}</span></p>
            )}
            {character.forceAbilities && character.forceAbilities.length > 0 && (
              <div className="mt-2">
                <strong>Force Abilities:</strong>
                <ul className="list-disc list-inside ml-4 text-sm text-gray-300">
                  {character.forceAbilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-3">
              Character Stats 
              <span className="text-sm text-gray-400 ml-2">
                ({character.statSystem === 'traditional' ? 'Traditional RPG' : 'SWTOR'})
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(character.stats).map(([key, val]) => (
                <div key={key} className="bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-300 capitalize">
                    {key === 'hitpoints' ? 'Hit Points' : key}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {key === 'hitpoints' ? val : val}
                    {key === 'hitpoints' && <span className="text-sm text-gray-400 ml-1">HP</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}