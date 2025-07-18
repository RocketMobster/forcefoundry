import { useState } from 'react';
import Header from '../components/Header';
import maleFirstNames from '../data/male_first_names.json';
import maleLastNames from '../data/male_last_names.json';
import femaleFirstNames from '../data/female_first_names.json';
import femaleLastNames from '../data/female_last_names.json';
import otherNamesNeutral from '../data/other_names_neutral.json';

// Note: Removed hyphenatedSurnames array to prevent cross-species contamination
// These mixed-species names like "Solo-Skywalker", "Calrissian-Bespin" don't belong to specific species

// Get all available species from the data files
const availableSpecies = Object.keys(maleFirstNames);

export default function Names() {
  const [names, setNames] = useState([]);
  const [gender, setGender] = useState('Male');
  const [species, setSpecies] = useState('Random Mix');
  const [quantity, setQuantity] = useState(18);
  const [loading, setLoading] = useState(false);

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
    
    // Last resort: use first available species
    const availableSpecies = Object.keys(nameData).find(key => nameData[key] && nameData[key].length > 0);
    if (availableSpecies) {
      return getRandom(nameData[availableSpecies]);
    }
    
    // If all else fails, return a placeholder
    return 'Unknown';
  };

  const generateNames = () => {
    setLoading(true);
    const newNames = [];
    
    // Get the appropriate data sets based on gender
    const firstNameData = gender === 'Male' ? maleFirstNames : femaleFirstNames;
    const lastNameData = gender === 'Male' ? maleLastNames : femaleLastNames;
    
    for (let i = 0; i < quantity; i++) {
      let firstName, lastName, selectedSpecies;
      
      if (species === 'Crazy Mix') {
        // Crazy Mix: Completely ignore species boundaries
        const firstNameSpecies = getRandom(availableSpecies);
        const lastNameSpecies = getRandom(availableSpecies);
        
        firstName = getNameFromSpecies(firstNameData, firstNameSpecies);
        lastName = getNameFromSpecies(lastNameData, lastNameSpecies);
        selectedSpecies = `${firstNameSpecies}/${lastNameSpecies}`;
        
      } else if (species === 'Random Mix') {
        // Random mix: pick a random species for each name (species-consistent)
        selectedSpecies = getRandom(availableSpecies);
        firstName = getNameFromSpecies(firstNameData, selectedSpecies);
        lastName = getNameFromSpecies(lastNameData, selectedSpecies);
        
      } else {
        // Specific species
        selectedSpecies = species;
        firstName = getNameFromSpecies(firstNameData, selectedSpecies);
        lastName = getNameFromSpecies(lastNameData, selectedSpecies);
      }
      
      // Check if the species exists in all required JSON files
      const speciesForCheck = species === 'Random Mix' ? selectedSpecies : species;
      const speciesExistsInAllFiles = speciesForCheck === 'Crazy Mix' || (
        (maleFirstNames[speciesForCheck] && maleFirstNames[speciesForCheck].length > 0) &&
        (femaleFirstNames[speciesForCheck] && femaleFirstNames[speciesForCheck].length > 0) &&
        (maleLastNames[speciesForCheck] && maleLastNames[speciesForCheck].length > 0) &&
        (femaleLastNames[speciesForCheck] && femaleLastNames[speciesForCheck].length > 0) &&
        (otherNamesNeutral[speciesForCheck] && otherNamesNeutral[speciesForCheck].length > 0)
      );
      
      // Get neutral names for this species (for middle names and hyphenation)
      let neutralNames = [];
      
      if (species === 'Crazy Mix') {
        // Crazy Mix: Can use neutral names from any species
        const neutralSpecies = getRandom(availableSpecies);
        neutralNames = otherNamesNeutral[neutralSpecies] || [];
      } else if (speciesExistsInAllFiles) {
        // Normal mode: Use neutral names from the selected species (only if species exists in all files)
        neutralNames = otherNamesNeutral[speciesForCheck] || [];
      }
      // If species doesn't exist in all files, neutralNames stays empty, preventing variations
      
      let finalName = '';
      let nameType = 'standard';
      
      // Determine name variation (15% chance for special variations)
      const variationChance = Math.random();
      
      if (variationChance < 0.03 && neutralNames.length > 0) {
        // 3% chance: Middle name (First Middle Last)
        const middleName = getRandom(neutralNames);
        finalName = `${firstName} ${middleName} ${lastName}`;
        nameType = 'middle';
      } else if (variationChance < 0.06 && neutralNames.length > 0) {
        // 3% chance: Hyphenated first name (Other-First Last)
        const otherFirst = getRandom(neutralNames);
        finalName = `${otherFirst}-${firstName} ${lastName}`;
        nameType = 'hyphenated-prefix-first';
      } else if (variationChance < 0.09 && neutralNames.length > 0) {
        // 3% chance: Hyphenated first name (First-Other Last)
        const otherFirst = getRandom(neutralNames);
        finalName = `${firstName}-${otherFirst} ${lastName}`;
        nameType = 'hyphenated-suffix-first';
      } else if (variationChance < 0.12 && neutralNames.length > 0) {
        // 3% chance: Hyphenated last name (First Other-Last Last)
        const otherLast = getRandom(neutralNames);
        finalName = `${firstName} ${otherLast}-${lastName}`;
        nameType = 'hyphenated-prefix-last';
      } else if (variationChance < 0.15 && neutralNames.length > 0) {
        // 3% chance: Hyphenated last name (First Last-Other)
        const otherLast = getRandom(neutralNames);
        finalName = `${firstName} ${lastName}-${otherLast}`;
        nameType = 'hyphenated-suffix-last';
      } else if (variationChance < 0.18 && species === 'Crazy Mix') {
        // 3% chance (Crazy Mix only): Cross-species hyphenated last names
        const randomSpecies1 = getRandom(availableSpecies);
        const randomSpecies2 = getRandom(availableSpecies);
        const lastName1 = getNameFromSpecies(lastNameData, randomSpecies1);
        const lastName2 = getNameFromSpecies(lastNameData, randomSpecies2);
        finalName = `${firstName} ${lastName1}-${lastName2}`;
        nameType = 'crazy-cross-species';
        selectedSpecies = `${selectedSpecies}+${randomSpecies1}/${randomSpecies2}`;
      } else {
        // Standard name (First Last)
        finalName = `${firstName} ${lastName}`;
      }

      // Note: Traditional hyphenated surnames disabled to prevent cross-species contamination
      // The hyphenatedSurnames array contains mixed-species names like "Solo-Skywalker"
      // which don't belong to any specific species
      
      newNames.push({
        id: i + 1,
        name: finalName,
        gender: gender.toLowerCase(),
        species: selectedSpecies,
        nameType: nameType
      });
    }
    
    setNames(newNames);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="max-w-6xl mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">⭐ Star Wars Name Generator</h2>
          <p className="text-gray-400">Generate authentic Star Wars character names</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap items-end gap-6 justify-center">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Species
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Random Mix">Random Mix</option>
                {availableSpecies.map(speciesName => (
                  <option key={speciesName} value={speciesName}>
                    {speciesName}
                  </option>
                ))}
                <option value="Crazy Mix">Crazy Mix (Cross-Species)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 18)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={generateNames}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Crazy Mix Explanation */}
        {species === 'Crazy Mix' && (
          <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-orange-400 text-xl">🌪️</span>
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">Crazy Mix Mode</h3>
                <p className="text-orange-200 text-sm mb-2">
                  This mode creates wild cross-species combinations by mixing first names, last names, 
                  and middle/hyphenated elements from different Star Wars species!
                </p>
                <p className="text-orange-300 text-xs italic">
                  Example: "Anakin Greedo-Chewbacca" (Human first + Rodian-Wookiee last)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Display */}
        {names.length > 0 && (
          <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Gender:</span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full font-medium">
                  {gender}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Species:</span>
                <span className="bg-purple-600 text-white px-2 py-1 rounded-full font-medium">
                  {species}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Count:</span>
                <span className="bg-green-600 text-white px-2 py-1 rounded-full font-medium">
                  {quantity} names
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Names Grid */}
        {names.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {names.map((nameObj) => (
              <div
                key={nameObj.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-blue-500"
              >
                {/* Card Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                    #{nameObj.id}
                  </div>
                  <div className="text-xs text-blue-400 font-semibold">
                    {nameObj.gender}
                  </div>
                </div>

                {/* Main Name Display */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-white mb-2 leading-tight">
                    {nameObj.name}
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto w-16"></div>
                </div>

                {/* Species Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                    {nameObj.species}
                  </span>
                </div>

                {/* Name Type Indicator */}
                {nameObj.nameType !== 'standard' && (
                  <div className="mt-4 p-3 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <div className="text-xs text-gray-300 font-medium">
                      {nameObj.nameType === 'middle' && '✨ Contains middle name'}
                      {nameObj.nameType === 'hyphenated-prefix-first' && '🔗 Hyphenated first (prefix)'}
                      {nameObj.nameType === 'hyphenated-suffix-first' && '🔗 Hyphenated first (suffix)'}
                      {nameObj.nameType === 'hyphenated-prefix-last' && '🔗 Hyphenated last (prefix)'}
                      {nameObj.nameType === 'hyphenated-suffix-last' && '🔗 Hyphenated last (suffix)'}
                      {nameObj.nameType === 'traditional-hyphenated' && '🔗 Traditional hyphenated'}
                      {nameObj.nameType === 'crazy-cross-species' && (
                        <span className="text-orange-400 font-bold">🌪️ Cross-species chaos</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(nameObj.name)}
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                    title="Copy to clipboard"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => {
                      const data = `Name: ${nameObj.name}\nGender: ${nameObj.gender}\nSpecies: ${nameObj.species}`;
                      navigator.clipboard.writeText(data);
                    }}
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                    title="Copy full details"
                  >
                    📄
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {names.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto border border-gray-700">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Ready to Generate Names</h3>
              <p className="text-gray-400 mb-6">
                Choose your preferences and click Generate to create Star Wars character names
              </p>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto w-16"></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
