import { useState } from 'react';
import Header from '../components/Header';
import maleFirstNames from '../data/male_first_names.json';
import maleLastNames from '../data/male_last_names.json';
import femaleFirstNames from '../data/female_first_names.json';
import femaleLastNames from '../data/female_last_names.json';
import otherNamesNeutral from '../data/other_names_neutral.json';

const classes = {
  Jedi: { stats: { strength: 6, agility: 8, intellect: 7 }, icon: '🧘' },
  Sith: { stats: { strength: 8, agility: 7, intellect: 6 }, icon: '⚡' },
  BountyHunter: { stats: { strength: 7, agility: 9, intellect: 5 }, icon: '🎯' },
  Smuggler: { stats: { strength: 5, agility: 7, intellect: 8 }, icon: '🚀' }
};

const alignments = ['Light Side', 'Dark Side', 'Neutral'];

// Get all available species from the data files
const availableSpecies = Object.keys(maleFirstNames);

// Local Star Wars data to avoid API dependency issues
const starWarsSpecies = availableSpecies;

const starWarsPlanets = [
  'Tatooine', 'Coruscant', 'Naboo', 'Alderaan', 'Hoth', 'Endor', 'Kamino', 
  'Mustafar', 'Dagobah', 'Yavin 4', 'Bespin', 'Jakku', 'Scarif', 'Ryloth',
  'Kashyyyk', 'Geonosis', 'Utapau', 'Mygeeto'
];

export default function Home() {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState('Random');

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
    setLoading(true);
    const gender = randomizeAll ? getRandom(['male', 'female', 'other']) : character?.gender || 'male';
    const charClass = randomizeAll ? getRandom(Object.keys(classes)) : character?.charClass || 'Jedi';

    // Determine species
    let characterSpecies;
    if (randomizeAll || selectedSpecies === 'Random') {
      characterSpecies = getRandom(starWarsSpecies);
    } else {
      characterSpecies = selectedSpecies;
    }

    // Check if the species exists in all required JSON files for name variations
    const speciesExistsInAllFiles = (
      (maleFirstNames[characterSpecies] && maleFirstNames[characterSpecies].length > 0) &&
      (femaleFirstNames[characterSpecies] && femaleFirstNames[characterSpecies].length > 0) &&
      (maleLastNames[characterSpecies] && maleLastNames[characterSpecies].length > 0) &&
      (femaleLastNames[characterSpecies] && femaleLastNames[characterSpecies].length > 0) &&
      (otherNamesNeutral[characterSpecies] && otherNamesNeutral[characterSpecies].length > 0)
    );

    // Generate names using species-specific data
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

    // Only add variations if species exists in all files (same logic as name generator)
    if (speciesExistsInAllFiles) {
      const neutralNames = otherNamesNeutral[characterSpecies] || [];
      const variationChance = Math.random();
      
      if (variationChance < 0.05 && neutralNames.length > 0) {
        // 5% chance: Middle name for character generator
        const middleName = getRandom(neutralNames);
        finalName = `${firstName} ${middleName} ${lastName}`;
      }
    }

    const alignment = getRandom(alignments);
    const homeworld = getStarWarsData('planets');

    // For now, we'll use placeholder images until AI service is available
    let imageUrl = null; // No image URL, will show character icon instead
    
    // Future: Re-enable when AI service is working
    /*
    try {
      const imageRes = await fetch('https://api.subnp.com/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${gender} ${charClass} star wars portrait` })
      });
      
      if (imageRes.ok) {
        const imageData = await imageRes.json();
        imageUrl = imageData.image_url || imageUrl;
      }
    } catch (error) {
      console.error('Failed to generate AI image:', error);
      // Will use placeholder image
    }
    */

    const stats = Object.fromEntries(
      Object.entries(classes[charClass].stats).map(([k, base]) => [k, base + Math.floor(Math.random() * 3)])
    );

    setCharacter({
      name: finalName,
      gender,
      charClass,
      alignment,
      species: characterSpecies,
      homeworld,
      image: imageUrl,
      stats,
      icon: classes[charClass].icon
    });
    setLoading(false);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.replace(/ /g, '_')}.json`;
    a.click();
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

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => generateCharacter(false)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
          title={character ? `Generate another ${character.gender} ${character.charClass}` : "Generate a Male Jedi"}
        >
          <span>🔄</span>
          {character ? "Same Type" : "Generate Character"}
        </button>
        <button
          onClick={() => generateCharacter(true)}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex items-center gap-2"
          title="Randomize everything: gender, class, and all attributes"
        >
          <span>🎲</span>
          New Character
        </button>
        {character && (
          <button
            onClick={downloadJSON}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center gap-2"
          >
            <span>💾</span>
            Download JSON
          </button>
        )}
      </div>

      {/* Button explanations */}
      <div className="text-center text-sm text-gray-400 mb-6">
        {character ? (
          <div className="space-y-1">
            <p><span className="text-blue-400">🔄 Same Type:</span> Generate another {character.gender} {character.charClass}</p>
            <p><span className="text-purple-400">🎲 New Character:</span> Randomize everything (gender, class, etc.)</p>
          </div>
        ) : (
          <p>Click <span className="text-blue-400">Generate Character</span> to create your first Star Wars character!</p>
        )}
      </div>

      {loading && <p className="text-center">Generating image... please wait.</p>}

      {character && !loading && (
        <div className="max-w-xl mx-auto bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="w-full h-64 bg-gray-700 rounded mb-4 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">{character.icon}</div>
                <div className="text-lg font-semibold text-white">{character.charClass}</div>
                <div className="text-sm text-gray-300">Character Portrait</div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold">{character.name} <span>{character.icon}</span></h2>
          <p><strong>Gender:</strong> {character.gender}</p>
          <p><strong>Class:</strong> {character.charClass}</p>
          <p><strong>Alignment:</strong> {character.alignment}</p>
          <p><strong>Species:</strong> {character.species}</p>
          <p><strong>Homeworld:</strong> {character.homeworld}</p>
          <div className="mt-4">
            <h3 className="font-semibold">Stats:</h3>
            <ul className="list-disc list-inside">
              {Object.entries(character.stats).map(([key, val]) => (
                <li key={key}>{key}: {val}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}