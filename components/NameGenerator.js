import { useState, useEffect } from 'react';
import canonNamesData from '../data/canon_names.json';
import { getResourceUrl } from '../utils/paths';

export default function NameGenerator() {
  // State variables
  const [quantity, setQuantity] = useState(10);
  const [gender, setGender] = useState('male'); // Add gender state
  const [nameMode, setNameMode] = useState("Human/Common");
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [names, setNames] = useState([]);
  const [nameGenMode, setNameGenMode] = useState("species");
  const [infoBoxVisible, setInfoBoxVisible] = useState(false);
  const [randomInfoBoxVisible, setRandomInfoBoxVisible] = useState(false);
  const [usedCanonNames, setUsedCanonNames] = useState([]);
  const [canonGenderMap, setCanonGenderMap] = useState({});
  
  // Load canon gender mapping
  useEffect(() => {
    const loadCanonGenders = async () => {
      try {
        const res = await fetch(getResourceUrl('/data/canon_genders.json'));
        if (!res.ok) {
          console.error(`Failed to load canon genders: ${res.status} ${res.statusText}`);
          return;
        }
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error(`Expected JSON but got ${contentType} for canon genders`);
          return;
        }
        
        try {
          const text = await res.text();
          const data = JSON.parse(text);
          console.log("Loaded canon gender mapping:", data);
          setCanonGenderMap(data);
        } catch (err) {
          console.error("Error parsing canon genders JSON:", err);
        }
      } catch (err) {
        console.error("Error loading canon genders data:", err);
      }
    };
    
    loadCanonGenders();
  }, []);

  // Load species options on component mount
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        // Use the utility function for correct path handling
        const res = await fetch(getResourceUrl('/data/species.json'));
        
        if (!res.ok) {
          console.error(`Failed to load species data: ${res.status} ${res.statusText}`);
          setSpeciesOptions([]);
          return;
        }
        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error(`Expected JSON but got ${contentType} for species data`);
          setSpeciesOptions([]);
          return;
        }
        
        try {
          const text = await res.text();
          const data = JSON.parse(text);
          
          if (!Array.isArray(data)) {
            console.error("Species data is not an array", data);
            setSpeciesOptions([]);
            return;
          }
          
          // Sort species alphabetically
          const sortedSpecies = [...data].sort((a, b) => a.localeCompare(b));
          setSpeciesOptions(sortedSpecies);
          
          // Default to Human/Common if available
          if (sortedSpecies.includes("Human/Common")) {
            setNameMode("Human/Common");
          } else if (sortedSpecies.length > 0) {
            setNameMode(sortedSpecies[0]);
          }
        } catch (err) {
          console.error("Error parsing species JSON:", err);
          setSpeciesOptions([]);
        }
      } catch (err) {
        console.error("Error loading species data:", err);
        setSpeciesOptions([]);
      }
    };
    
    loadSpecies();
  }, []);

  const getSpeciesSpecificName = (nameData, species, gender) => {
    console.log(`Getting ${gender} name for species: ${species}`);
    
    // Check if we have data for this species as an exact match
    if (nameData[species] && nameData[species].length > 0) {
      const name = nameData[species][Math.floor(Math.random() * nameData[species].length)];
      console.log(`Found ${gender} name for ${species}: ${name}`);
      return name;
    }
    
    // If not exact match, try to find a key that starts with the species name (like "Chiss/Core-world")
    const speciesKeys = Object.keys(nameData);
    const matchingKey = speciesKeys.find(key => key.startsWith(`${species}/`) || key.includes(`/${species}`));
    
    if (matchingKey && nameData[matchingKey].length > 0) {
      const name = nameData[matchingKey][Math.floor(Math.random() * nameData[matchingKey].length)];
      console.log(`Found ${gender} name for ${species} using key ${matchingKey}: ${name}`);
      return name;
    }
    
    // In species mode, we should NOT fall back to Human/Common names
    if (nameGenMode === "species") {
      // If we don't have names for this species, use a placeholder
      console.log(`No ${gender} names found for ${species}, using placeholder`);
      return gender === 'male' ? "Unknown" : "Unknown";
    }
    
    // Fall back to Human/Common if the species doesn't have names (only for random and crazy modes)
    if (nameData['Human/Common'] && nameData['Human/Common'].length > 0) {
      const name = nameData['Human/Common'][Math.floor(Math.random() * nameData['Human/Common'].length)];
      console.log(`Fallback to Human/Common ${gender} name: ${name}`);
      return name;
    }
    
    // Last resort: get first available species
    const availableSpecies = Object.keys(nameData).find(s => nameData[s] && nameData[s].length > 0);
    if (availableSpecies) {
      const name = nameData[availableSpecies][Math.floor(Math.random() * nameData[availableSpecies].length)];
      console.log(`Last resort ${gender} name from ${availableSpecies}: ${name}`);
      return name;
    }
    
    // Ultimate fallback
    const fallbackName = gender === 'male' ? "John" : "Jane";
    console.error(`No names found for ${gender}, using fallback: ${fallbackName}`);
    return fallbackName;
  };

  const generateNames = async () => {
    try {
      // Reset the used canon names when generating a new batch only if requested quantity is more than 50% of names
      // This prevents canon names from being too rare in repeated small batch generations
      if (quantity > 50) {
        setUsedCanonNames([]);
      }
      
      // Helper function to safely fetch and parse JSON
      const safeJsonFetch = async (url) => {
        try {
          console.log(`Fetching data from ${url}...`);
          // URL already includes the correct base path from getResourceUrl
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
            return {};
          }
          
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.error(`Expected JSON but got ${contentType} for ${url}`);
            return {};
          }
          
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            console.log(`Successfully loaded data from ${url}:`, data);
            return data;
          } catch (err) {
            console.error(`Invalid JSON from ${url}: ${err.message}`, text.substring(0, 100));
            return {};
          }
        } catch (err) {
          console.error(`Error fetching ${url}: ${err.message}`);
          return {};
        }
      };
      
      // Load all name data files with better error handling
      // Note: Ensure these paths match your file system structure - using the combined last_names file instead of gender-specific ones
      const [maleFirst, femaleFirst, lastNames, neutral] = await Promise.all([
        safeJsonFetch(getResourceUrl('/data/male_first_names.json')),
        safeJsonFetch(getResourceUrl('/data/female_first_names.json')),
        safeJsonFetch(getResourceUrl('/data/last_names.json')),
        safeJsonFetch(getResourceUrl('/data/other_names_neutral.json'))
      ]);
      
      const newNames = [];
      
      // Create a local copy of usedCanonNames to ensure we don't reuse names within this batch
      let localUsedCanonNames = [...usedCanonNames];
      
      for (let i = 0; i < quantity; i++) {
        let firstName, lastName, species, fullName, middleName;
        // Use selected gender instead of random
        const currentGender = gender;
        // Track which species are used in the name (for cross-species detection)
        const usedSpecies = new Set();
        // Initialize canon and famous family flags
        let isCanon = false;
        let isFamousFamily = false;
        
        // Check if there are species-specific canon names available
        const currentSpecies = nameMode; // Get the currently selected species
        let availableCanonNames = [];
        
        // In crazy mode, we don't use canon characters at all
        if (nameGenMode !== "crazy") {
          // Get canon names for the current species or valid alternatives
          if (canonNamesData[currentSpecies]) {
            // Exact species match
            availableCanonNames = [...canonNamesData[currentSpecies]];
          } else if (currentSpecies && typeof currentSpecies === 'string' && currentSpecies.includes('/')) {
            // For composite species like "Human/Common", check each part
            const speciesParts = currentSpecies.split('/');
            speciesParts.forEach(part => {
              if (canonNamesData[part]) {
                availableCanonNames = [...availableCanonNames, ...canonNamesData[part]];
              }
            });
          }
          // Remove the Human/Common fallback to ensure species-specific canon characters only
        }
        
        // Filter out already used canon names to prevent duplicates (use both global and local tracking)
        availableCanonNames = availableCanonNames.filter(name => !localUsedCanonNames.includes(name));
        
        // Filter for gender-appropriate canon names
        if (Object.keys(canonGenderMap).length > 0) {
          availableCanonNames = availableCanonNames.filter(name => {
            const nameGender = canonGenderMap[name];
            // Keep names that match the current gender or have no gender specified (neutral)
            return !nameGender || nameGender === 'neutral' || nameGender === currentGender;
          });
        }
        
        // Reduce canon name chance for large quantity generations to avoid overrepresentation
        // Scale canon chance inversely with quantity: 5% for small batches, down to 1% for large batches
        const canonChanceScaling = Math.max(0.01, Math.min(0.05, 0.05 * (20 / Math.max(20, quantity))));
        
        // Small chance to directly use a canon name if we have available canon names
        // Never in crazy mode
        const useCanonName = Math.random() < canonChanceScaling && availableCanonNames.length > 0 && nameGenMode !== "crazy";
        
        // Occasionally directly use a canon name
        if (useCanonName) {
          const randomCanonName = availableCanonNames[Math.floor(Math.random() * availableCanonNames.length)];
          fullName = randomCanonName;
          
          // Track this canon name as used BOTH locally and in state
          localUsedCanonNames.push(randomCanonName);
          setUsedCanonNames(prev => [...prev, randomCanonName]);
          
          // Set species to the current species
          species = currentSpecies;
          usedSpecies.add(species);
        }
        // Different generation modes
        else if (nameGenMode === "species") {
          // Specific species mode - use the selected species
          species = nameMode;
          // Add the species to the tracking set
          usedSpecies.add(species);
          
          if (currentGender === 'male') {
            firstName = getSpeciesSpecificName(maleFirst, species, 'male');
            lastName = getSpeciesSpecificName(lastNames, species, 'neutral');
          } else {
            firstName = getSpeciesSpecificName(femaleFirst, species, 'female');
            lastName = getSpeciesSpecificName(lastNames, species, 'neutral');
          }
          
          fullName = `${firstName} ${lastName}`;
          
          // Enhanced name variation system with all combinations
          // Check if we have other/neutral names for this species
          const hasSpeciesSpecificNeutral = neutral[species]?.length > 0;
          const hasSpeciesSpecificLastNames = lastNames[species]?.length > 0;
          const hasSpeciesSpecificFirstNames = (currentGender === 'male' ? maleFirst : femaleFirst)[species]?.length > 0;
          
          // Only offer complex name structures if we have enough species-specific name components
          if (hasSpeciesSpecificNeutral && hasSpeciesSpecificLastNames && hasSpeciesSpecificFirstNames) {
            const nameChance = Math.random();
            const lastNameData = lastNames;
            const firstNameData = currentGender === 'male' ? maleFirst : femaleFirst;
            
            // Ensure we're using species-specific names for all components
            const otherName = neutral[species][Math.floor(Math.random() * neutral[species].length)];
            const middleName = neutral[species][Math.floor(Math.random() * neutral[species].length)];
            const secondLastName = lastNameData[species][Math.floor(Math.random() * lastNameData[species].length)];
            const secondFirstName = firstNameData[species][Math.floor(Math.random() * firstNameData[species].length)];
            
            // Adjusted probabilities - increased chance of standard names (First Last)
            if (nameChance < 0.12) { // First Middle Last (12%)
              fullName = `${firstName} ${middleName} ${lastName}`;
            } 
            else if (nameChance < 0.20) { // First Middle Last-Other (8%)
              fullName = `${firstName} ${middleName} ${lastName}-${otherName}`;
            } 
            else if (nameChance < 0.28) { // First Middle Other-Last (8%)
              fullName = `${firstName} ${middleName} ${otherName}-${lastName}`;
            } 
            else if (nameChance < 0.36) { // First Last-Other (8%)
              fullName = `${firstName} ${lastName}-${otherName}`;
            } 
            else if (nameChance < 0.44) { // First Other-Last (8%)
              fullName = `${firstName} ${otherName}-${lastName}`;
            } 
            else if (nameChance < 0.52 && secondLastName) { // First Last-LastName2 (8%)
              fullName = `${firstName} ${lastName}-${secondLastName}`;
            }
            else if (nameChance < 0.60 && secondLastName) { // First Middle Last-LastName2 (8%)
              fullName = `${firstName} ${middleName} ${lastName}-${secondLastName}`;
            }
            else if (nameChance < 0.68) { // First Other Last (8%)
              fullName = `${firstName} ${otherName} ${lastName}`;
            }
            else if (nameChance < 0.73 && secondFirstName) { // First-First2 Last (5%)
              fullName = `${firstName}-${secondFirstName} ${lastName}`;
            }
            else if (nameChance < 0.78 && otherName) { // First-Other Last (5%)
              fullName = `${firstName}-${otherName} ${lastName}`;
            }
            // else keep standard First Last (22%)
          }
        }
        else if (nameGenMode === "random") {
          // Random mode - pick a random species for each name (but be consistent within the name)
          const randomSpeciesIndex = Math.floor(Math.random() * speciesOptions.length);
          species = speciesOptions[randomSpeciesIndex];
          // Add the species to the tracking set
          usedSpecies.add(species);
          
          // In random mode, we can use canon characters but not in crazy mode
          let randomSpeciesCanonNames = [];
          
          // Skip in crazy mode
          if (nameGenMode !== "crazy") {
            if (canonNamesData[species]) {
              randomSpeciesCanonNames = [...canonNamesData[species]];
            } else if (species && typeof species === 'string' && species.includes('/')) {
              // For composite species like "Human/Common", check each part
              const speciesParts = species.split('/');
              speciesParts.forEach(part => {
                if (canonNamesData[part] && part !== 'FamousFamily') {
                  randomSpeciesCanonNames = [...randomSpeciesCanonNames, ...canonNamesData[part]];
                }
              });
            }
            
            // Filter out already used canon names
            randomSpeciesCanonNames = randomSpeciesCanonNames.filter(name => !usedCanonNames.includes(name));
            
            // Filter for gender-appropriate canon names
            if (Object.keys(canonGenderMap).length > 0) {
              randomSpeciesCanonNames = randomSpeciesCanonNames.filter(name => {
                const nameGender = canonGenderMap[name];
                // Keep names that match the current gender or have no gender specified (neutral)
                return !nameGender || nameGender === 'neutral' || nameGender === currentGender;
              });
            }
          }
          
          // 5% chance to use a canon name if available, never in crazy mode
          const useRandomCanonName = Math.random() < 0.05 && randomSpeciesCanonNames.length > 0 && nameGenMode !== "crazy";
          if (useRandomCanonName) {
            const randomCanonName = randomSpeciesCanonNames[Math.floor(Math.random() * randomSpeciesCanonNames.length)];
            fullName = randomCanonName;
            // Track this canon name as used
            setUsedCanonNames(prev => [...prev, randomCanonName]);
            // Continue to the next iteration of the loop since we already have the full name
            newNames.push({
              id: `name-${Date.now()}-${i}`,
              name: fullName,
              species: species,
              isCanon: true,
              gender: currentGender,
              nameStructure: null,
              isCrossSpeciesChaos: false,
              crossSpeciesParts: 0
            });
            continue;
          }
          
          if (currentGender === 'male') {
            firstName = getSpeciesSpecificName(maleFirst, species, 'male');
            lastName = getSpeciesSpecificName(lastNames, species, 'neutral');
          } else {
            firstName = getSpeciesSpecificName(femaleFirst, species, 'female');
            lastName = getSpeciesSpecificName(lastNames, species, 'neutral');
          }
          
          fullName = `${firstName} ${lastName}`;
          
          // Add enhanced variations for random mode too
          // Check if we have sufficient species-specific name components
          const hasSpeciesSpecificNeutral = neutral[species]?.length > 0;
          const hasSpeciesSpecificLastNames = lastNames[species]?.length > 0;
          const hasSpeciesSpecificFirstNames = (currentGender === 'male' ? maleFirst : femaleFirst)[species]?.length > 0;
          
          // Only offer complex name structures if we have enough species-specific name components
          if (hasSpeciesSpecificNeutral && hasSpeciesSpecificLastNames && hasSpeciesSpecificFirstNames) {
            const nameChance = Math.random();
            const lastNameData = lastNames;
            const firstNameData = currentGender === 'male' ? maleFirst : femaleFirst;
            
            // Ensure we're using species-specific names for all components
            const otherName = neutral[species][Math.floor(Math.random() * neutral[species].length)];
            const middleName = neutral[species][Math.floor(Math.random() * neutral[species].length)];
            const secondLastName = lastNameData[species][Math.floor(Math.random() * lastNameData[species].length)];
            const secondFirstName = firstNameData[species][Math.floor(Math.random() * firstNameData[species].length)];
            
            // Updated probabilities to match species mode
            if (nameChance < 0.12) { // First Middle Last (12%)
              fullName = `${firstName} ${middleName} ${lastName}`;
            } 
            else if (nameChance < 0.20) { // First Middle Last-Other (8%)
              fullName = `${firstName} ${middleName} ${lastName}-${otherName}`;
            } 
            else if (nameChance < 0.28) { // First Middle Other-Last (8%)
              fullName = `${firstName} ${middleName} ${otherName}-${lastName}`;
            } 
            else if (nameChance < 0.36) { // First Last-Other (8%)
              fullName = `${firstName} ${lastName}-${otherName}`;
            } 
            else if (nameChance < 0.44) { // First Other-Last (8%)
              fullName = `${firstName} ${otherName}-${lastName}`;
            } 
            else if (nameChance < 0.52 && secondLastName) { // First Last-LastName2 (8%)
              fullName = `${firstName} ${lastName}-${secondLastName}`;
            }
            else if (nameChance < 0.60 && secondLastName) { // First Middle Last-LastName2 (8%)
              fullName = `${firstName} ${middleName} ${lastName}-${secondLastName}`;
            }
            else if (nameChance < 0.85) { // First Other Last (10%)
              fullName = `${firstName} ${otherName} ${lastName}`;
            }
            else if (nameChance < 0.90 && secondFirstName) { // First-First2 Last (5%)
              fullName = `${firstName}-${secondFirstName} ${lastName}`;
            }
            else if (nameChance < 0.95 && otherName) { // First-Other Last (5%)
              fullName = `${firstName}-${otherName} ${lastName}`;
            }
          }
        }
        else if (nameGenMode === "crazy") {
          // Crazy mix - mix species for first, middle, and last name (up to 3 different species)
          // No canon characters in crazy mode
          // isCanon and isFamousFamily are already set to false by default
          
          const firstNameSpeciesIndex = Math.floor(Math.random() * speciesOptions.length);
          const lastNameSpeciesIndex = Math.floor(Math.random() * speciesOptions.length);
          const middleNameSpeciesIndex = Math.floor(Math.random() * speciesOptions.length);
          
          const firstNameSpecies = speciesOptions[firstNameSpeciesIndex];
          const lastNameSpecies = speciesOptions[lastNameSpeciesIndex];
          const middleNameSpecies = speciesOptions[middleNameSpeciesIndex];
          
          // Update the tracked species
          usedSpecies.clear(); // Clear any previous entries
          usedSpecies.add(firstNameSpecies);
          usedSpecies.add(lastNameSpecies);
          
          if (currentGender === 'male') {
            firstName = getSpeciesSpecificName(maleFirst, firstNameSpecies, 'male');
            lastName = getSpeciesSpecificName(lastNames, lastNameSpecies, 'neutral');
          } else {
            firstName = getSpeciesSpecificName(femaleFirst, firstNameSpecies, 'female');
            lastName = getSpeciesSpecificName(lastNames, lastNameSpecies, 'neutral');
          }
          
          fullName = `${firstName} ${lastName}`;
          
          // Start with composite of first and last name species
          const speciesComposite = [firstNameSpecies, lastNameSpecies];
          
          // Enhanced variations for crazy mode with possibility of 3-part species names
          const nameChance = Math.random();
          
          // Get names from third species
          let thirdSpeciesName = "";
          let thirdSpeciesMiddleName = "";
          
          if (neutral[middleNameSpecies]?.length > 0) {
            thirdSpeciesName = neutral[middleNameSpecies][Math.floor(Math.random() * neutral[middleNameSpecies].length)];
          }
          
          // Get middle/other names from our various species
          let firstSpeciesOther = "";
          let lastSpeciesOther = "";
          let middleName = "";
          
          if (neutral[firstNameSpecies]?.length > 0) {
            firstSpeciesOther = neutral[firstNameSpecies][Math.floor(Math.random() * neutral[firstNameSpecies].length)];
          }
          
          if (neutral[lastNameSpecies]?.length > 0) {
            lastSpeciesOther = neutral[lastNameSpecies][Math.floor(Math.random() * neutral[lastNameSpecies].length)];
          }
          
          // Get second first/last names
          let secondLastName = "";
          let secondFirstName = "";
          const lastNameData = lastNames;
          const firstNameData = currentGender === 'male' ? maleFirst : femaleFirst;
          
          if (lastNames[lastNameSpecies]?.length > 0) {
            secondLastName = lastNames[lastNameSpecies][Math.floor(Math.random() * lastNames[lastNameSpecies].length)];
          }
          
          if (firstNameData[firstNameSpecies]?.length > 0) {
            secondFirstName = firstNameData[firstNameSpecies][Math.floor(Math.random() * firstNameData[firstNameSpecies].length)];
          }
          
          // For 3-species names - add a third component from middleNameSpecies
          if (nameChance < 0.15 && thirdSpeciesName) {
            // Use middle name from third species (adds a third species)
            middleName = thirdSpeciesName;
            fullName = `${firstName} ${middleName} ${lastName}`;
            speciesComposite.push(middleNameSpecies); // Add the third species
            usedSpecies.add(middleNameSpecies);
          } 
          else if (nameChance < 0.30 && thirdSpeciesName) {
            // Use hyphenated component from third species (adds a third species)
            if (Math.random() > 0.5) {
              // Third species in hyphenated last name
              fullName = `${firstName} ${lastName}-${thirdSpeciesName}`;
              speciesComposite.push(middleNameSpecies);
              usedSpecies.add(middleNameSpecies);
            } else {
              // Third species in hyphenated first name
              fullName = `${firstName}-${thirdSpeciesName} ${lastName}`;
              speciesComposite.push(middleNameSpecies);
              usedSpecies.add(middleNameSpecies);
            }
          }
          else if (nameChance < 0.40 && firstSpeciesOther) {
            // Use a standard two-species name with middle name from first species
            fullName = `${firstName} ${firstSpeciesOther} ${lastName}`;
          }
          else if (nameChance < 0.50 && lastSpeciesOther) {
            // Use a standard two-species name with middle name from last species
            fullName = `${firstName} ${lastSpeciesOther} ${lastName}`;
          }
          else if (nameChance < 0.60 && lastSpeciesOther) {
            // Last name with suffix from same species
            fullName = `${firstName} ${lastName}-${lastSpeciesOther}`;
          }
          else if (nameChance < 0.70 && firstSpeciesOther) {
            // Last name with prefix from first name species
            fullName = `${firstName} ${firstSpeciesOther}-${lastName}`;
          }
          else if (nameChance < 0.80 && secondLastName) {
            // Double last name from same species
            fullName = `${firstName} ${lastName}-${secondLastName}`;
          }
          else if (nameChance < 0.90 && secondFirstName) {
            // Hyphenated first name from same species
            fullName = `${firstName}-${secondFirstName} ${lastName}`;
          }
          // else stick with basic First Last (10%)
        }
        
        // Check if name is a canon Star Wars name (case-insensitive)
        // Variables already declared at the top of the loop
        isCanon = false;
        isFamousFamily = false;
        
        // Skip canon checks for crazy mode
        if (nameGenMode !== "crazy") {
          // First check regular canon characters in appropriate species
          for (const [speciesName, namesArray] of Object.entries(canonNamesData)) {
            // Skip FamousFamily for now, we'll handle it separately
            if (speciesName === 'FamousFamily') continue;
            
            // Check if the current name's species matches or is compatible with this species list
            const isMatchingSpecies = 
              species === speciesName || 
              (species && typeof species === 'string' && species.includes('/') && 
              species.split('/').some(s => s === speciesName));
              
            if (isMatchingSpecies) {
              isCanon = namesArray.some(canon => {
                // Canon names won't have wildcards
                return canon.toLowerCase() === fullName.toLowerCase();
              });
              
              if (isCanon) break;
            }
          }
          
          // If not a canon character, check if it belongs to a famous family
          // Only check famous family for Human/Common or species that have canon entries
          if (!isCanon && canonNamesData['FamousFamily'] && 
              (species === "Human/Common" || 
               species.includes("Human") || 
               canonNamesData[species] !== undefined)) {
            
            isFamousFamily = canonNamesData['FamousFamily'].some(familyPattern => {
              if (familyPattern.startsWith('* ')) {
                const suffix = familyPattern.slice(2).trim().toLowerCase();
                return fullName.toLowerCase().endsWith(suffix);
              }
              return false;
            });
          }
        }
        
        // Determine name structure for labeling
        let nameStructure = {
          hasMiddleName: false,
          hasHyphenatedFirst: false,
          hasHyphenatedLast: false,
          hyphenPosition: null,
          types: []
        };
        
        // Check for middle name
        if (fullName.split(' ').length > 2) {
          nameStructure.hasMiddleName = true;
          nameStructure.types.push('middle');
        }
        
        // Check for hyphenation
        if (fullName.includes('-')) {
          const nameParts = fullName.split(' ');
          // Find which part contains the hyphen
          const hyphenatedPart = nameParts.find(part => part.includes('-'));
          if (hyphenatedPart) {
            // Check if it's the last name or first name that's hyphenated
            const isLastNameHyphenated = nameParts.indexOf(hyphenatedPart) === nameParts.length - 1;
            if (isLastNameHyphenated) {
              // Check if prefix or suffix hyphenated
              const hyphenParts = hyphenatedPart.split('-');
              // Safe check to ensure lastName is a string with includes method
              const hyphenPosition = (typeof lastName === 'string' && lastName !== 'Unknown') ? 
                (lastName.includes(hyphenParts[0]) ? 'suffix' : 'prefix') : 
                'unknown'; // Default to 'unknown' if lastName is not valid
              nameStructure.hasHyphenatedLast = true;
              nameStructure.hyphenPosition = hyphenPosition;
              nameStructure.types.push('hyphenated-last');
            } else {
              // It's a hyphenated first name
              nameStructure.hasHyphenatedFirst = true;
              nameStructure.types.push('hyphenated-first');
            }
          }
        }
        
        // Handle cross-species chaos for crazy mode with 2-part and 3-part detection
        let isCrossSpeciesChaos = false;
        let crossSpeciesParts = 0;
        
        if (nameGenMode === "crazy") {
          // Get the unique species used in the name
          if (species && typeof species === 'string' && species.includes('/')) {
            const speciesParts = species.split('/');
            const uniqueSpecies = new Set(speciesParts);
            
            // Only count as cross-species if actually using different species
            if (uniqueSpecies.size >= 2) {
              isCrossSpeciesChaos = true;
              crossSpeciesParts = uniqueSpecies.size;
            }
          } else if (usedSpecies && usedSpecies.size >= 2) {
            // Use the tracked species set
            isCrossSpeciesChaos = true;
            crossSpeciesParts = usedSpecies.size;
          }
        }
        
        // For crazy mode, compile the final species string from the tracked species
        if (nameGenMode === "crazy") {
          try {
            if (typeof speciesComposite !== 'undefined' && speciesComposite.length) {
              // Filter out duplicates while preserving order
              const uniqueSpecies = [...new Set(speciesComposite)];
              species = uniqueSpecies.join('/');
            } else if (usedSpecies && usedSpecies.size > 0) {
              // Fallback - use the usedSpecies set directly
              species = [...usedSpecies].join('/');
            } else {
              // Safety fallback if everything else fails
              species = "Unknown";
            }
          } catch (error) {
            console.error("Error setting species in crazy mode:", error);
            species = "Unknown";
          }
        }
        
        // Ensure all properties are properly defined to prevent runtime errors
        const nameEntry = {
          id: `name-${Date.now()}-${i}`,
          name: fullName || "Unknown Name",
          species: species || "Unknown",
          isCanon: Boolean(isCanon),
          isFamousFamily: Boolean(isFamousFamily),
          gender: currentGender || "unknown",
          nameStructure: nameStructure || null,
          isCrossSpeciesChaos: Boolean(isCrossSpeciesChaos),
          crossSpeciesParts: crossSpeciesParts || 0
        };
        
        newNames.push(nameEntry);
      }
      
      // Update the global used canon names state with our local copy
      setUsedCanonNames(localUsedCanonNames);
      setNames(newNames);
    } catch (error) {
      console.error("Error generating names:", error);
      
      // More detailed error logging
      if (error.message && error.message.includes('not valid JSON')) {
        console.error("JSON parsing error. Response might be HTML instead of JSON.");
        // Try to log the beginning of the response if available
        if (error.response && typeof error.response.text === 'function') {
          try {
            const text = await error.response.text();
            console.error("Response preview:", text.substring(0, 200));
          } catch (e) {
            console.error("Couldn't get response text:", e);
          }
        }
      }
      
      // Set fallback names if generation fails
      setNames(Array(quantity).fill(0).map((_, i) => ({
        id: `name-${Date.now()}-${i}`,
        name: "Error loading name data",
        species: "Unknown",
        isCanon: false
      })));
    }
  };

  const handleNameGenModeChange = (mode) => {
    setNameGenMode(mode);
    setInfoBoxVisible(mode === "crazy");
    setRandomInfoBoxVisible(mode === "random");
  };

  return (
    <div className="max-w-screen-sm mx-auto w-full px-2 py-2">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Name Generator</h2>
        <p className="text-gray-400">Create Star Wars character names for your adventures</p>
      </div>
      <div className="mb-8 flex flex-col md:flex-row gap-4 flex-wrap justify-center w-full">
        <div className="flex-1 max-w-xs">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Name Generation Mode:
          </label>
          <div className="space-y-2">
            <button
              className={`w-full px-3 py-2 rounded text-left ${nameGenMode === "species" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              onClick={() => handleNameGenModeChange("species")}
            >
              Species-Specific
            </button>
            <button
              className={`w-full px-3 py-2 rounded text-left ${nameGenMode === "random" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              onClick={() => handleNameGenModeChange("random")}
            >
              Random Mix
            </button>
            <button
              className={`w-full px-3 py-2 rounded text-left ${nameGenMode === "crazy" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              onClick={() => handleNameGenModeChange("crazy")}
            >
              Crazy Mix
            </button>
          </div>
        </div>
        
        <div className="flex-1 max-w-xs">
          {nameGenMode === "species" && (
            <>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Species:
              </label>
              <select
                value={nameMode}
                onChange={(e) => setNameMode(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                {speciesOptions.map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
            </>
          )}
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender:
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none mb-4"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantity:
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value || "10"))))}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
      
      {infoBoxVisible && (
        <div className="mb-6 p-4 bg-orange-900 bg-opacity-30 border border-orange-500 rounded-lg text-sm">
          <h3 className="font-bold text-orange-400 mb-1">Crazy Mix Mode</h3>
          <p className="text-orange-200">
            This mode combines first and last names from different species, creating unusual cross-species combinations.
            Names may not be linguistically compatible but can produce interesting results for alien hybrids or unusual characters.
          </p>
        </div>
      )}
      
      {randomInfoBoxVisible && (
        <div className="mb-6 p-4 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg text-sm">
          <h3 className="font-bold text-blue-400 mb-1">Random Mix Mode</h3>
          <p className="text-blue-200">
            This mode selects a consistent species for each name, maintaining species integrity.
            Each generated name will use a randomly selected species from the available options.
            The species will be displayed with each name for reference.
          </p>
        </div>
      )}
      
      <div className="flex mb-8 justify-center">
        <button
          onClick={generateNames}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all text-sm"
        >
          <span>⚡</span>
          Generate Names
        </button>
      </div>
      
      {/* Added for debugging during development */}
      <div className="hidden">
        <p>Debug: Using gender: {gender}, Species: {nameMode}, Quantity: {quantity}</p>
      </div>
      
      {names.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 w-full">
          {names.map((name, index) => (
            <div 
              key={name.id} 
              className={`bg-gray-800 p-4 rounded-lg shadow-md ${
                name.isCanon ? 'border-2 border-yellow-400' : 
                name.isFamousFamily ? 'border-2 border-gray-400' : 
                'border border-gray-700'
              } hover:shadow-lg transition-shadow relative min-h-[120px]`}
            >
              <div className="text-gray-500 text-xs absolute top-2 left-3">
                #{index + 1}
              </div>
              <div className={`flex flex-col justify-center ${
                name.isCanon ? "rounded-lg p-2 bg-yellow-900 bg-opacity-10" : 
                name.isFamousFamily ? "rounded-lg p-2 bg-gray-700 bg-opacity-10" : 
                ""
              }`}>
                <h3 className={`text-lg font-bold mb-1 line-height-1 mt-4 ${
                  name.isFamousFamily ? "text-gray-300" : ""
                }`}>
                  {name.isCanon && <span className="text-yellow-300 mr-1">★</span>}
                  {name.isFamousFamily && <span className="text-gray-400 mr-1">✧</span>}
                  {name.name}
                </h3>
                <div className="mt-1">
                  <span className="bg-purple-800 text-white text-xs px-2 py-1 rounded-full">
                    {name.species}
                  </span>
                </div>
                
                {/* Grey pills for name structure */}
                {name.nameStructure && name.nameStructure.types && name.nameStructure.types.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {/* Middle name pill */}
                    {name.nameStructure.hasMiddleName && (
                      <span className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full inline-flex items-center">
                        <span>✦ Contains middle name</span>
                      </span>
                    )}
                    
                    {/* Hyphenated last name pill */}
                    {name.nameStructure.hasHyphenatedLast && (
                      <span className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full inline-flex items-center">
                        <span>📎 Hyphenated last {name.nameStructure.hyphenPosition ? `(${name.nameStructure.hyphenPosition})` : ''}</span>
                      </span>
                    )}
                    
                    {/* Hyphenated first name pill */}
                    {name.nameStructure.hasHyphenatedFirst && (
                      <span className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full inline-flex items-center">
                        <span>📎 Hyphenated first name</span>
                      </span>
                    )}
                  </div>
                )}
                
                {/* Colorful pill for cross-species chaos with part count */}
                {name.isCrossSpeciesChaos && (
                  <div className="mt-2">
                    <span className={`relative overflow-hidden ${
                      name.crossSpeciesParts === 3 
                        ? 'text-white' 
                        : 'text-white'
                      } text-xs font-medium px-3 py-1 rounded-full flex items-center shadow-md border border-opacity-20 ${
                      name.crossSpeciesParts === 3 
                        ? 'border-pink-300' 
                        : 'border-blue-300'
                      }`}>
                      <span className={`absolute inset-0 ${
                        name.crossSpeciesParts === 3
                          ? 'bg-gradient-to-r from-purple-700 from-5% via-pink-600 via-50% to-orange-500 to-95%'
                          : 'bg-gradient-to-r from-blue-600 from-5% to-cyan-400 to-95%'
                      }`}></span>
                      <span className="relative z-10 mr-1">🌪️</span>
                      <span className="relative z-10">{name.crossSpeciesParts === 3 ? '3-part' : '2-part'} Cross-species chaos</span>
                    </span>
                  </div>
                )}
                
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(name.name)} 
                    className="text-gray-400 hover:text-white" 
                    title="Copy name"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(`${name.name} (${name.gender === 'male' ? 'Male' : 'Female'}, ${name.species})`)} 
                    className="text-gray-400 hover:text-white" 
                    title="Copy full details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
                {name.isCanon && <p className="text-xs text-yellow-400 mt-1 font-semibold">Canon Star Wars character name</p>}
                {name.isFamousFamily && <p className="text-xs text-gray-400 mt-1 font-semibold">Famous Star Wars Family</p>}
                {name.isCanon && <div className="absolute top-2 right-2">
                  <span className="text-yellow-300 text-lg">★</span>
                </div>}
                {name.isFamousFamily && <div className="absolute top-2 right-2">
                  <span className="text-gray-400 text-lg">✧</span>
                </div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
