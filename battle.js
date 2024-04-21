const total_pokemons = 200;
let pk1, pk2;
document.addEventListener("DOMContentLoaded", () => {
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id) {
    console.log(`Battling with Pokémon ID: ${id}`);
    fetchPokemonData(id).then(({ pokemon }) => {
      pk1 = new Pokemon(pokemon);
      displayPokemonofplayer(pokemon, 1);
      displaymoves(pokemon, "poke1");
    });
  } else {
    console.error("No Pokémon ID provided.");
  }

  const randomId = randomInteger(1, total_pokemons);
  fetchRandomPokemon(randomId).then(({ pokemon }) => {
    pk2 = new Pokemon(pokemon);
    displayPokemonofplayer(pokemon, 2);
    displaymoves(pokemon, "poke2");
  });
});

let currentPlayer = 1;

function getDefendingPokemon() {
  if (currentPlayer === 1) {
    switchPlayer();
    return pk2;
  } else if (currentPlayer === 2) {
    switchPlayer();
    return pk1;
  } else {
    console.error("Invalid current player number.");
    return null;
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  console.log(`Current player is now: ${currentPlayer}`);
}

function displaymoves(pokemon, pkn) {
  const moveButtons = document.getElementById(pkn).querySelectorAll("button");
  const shuffledMoves = pokemon.moves.sort(() => 0.5 - Math.random());
  const randomMoves = shuffledMoves.slice(0, 4);
  randomMoves.forEach((move, index) => {
    moveButtons[index].textContent = move.move.name;

    moveButtons[index].addEventListener(
      "click",
      (function (moveData, attackingPokemonData) {
        return function () {
          const defendingPokemonData = getDefendingPokemon();
          console.log(defendingPokemonData);
          attack(moveData, attackingPokemonData, defendingPokemonData);
        };
      })(move, pokemon)
    );
  });
}

function attack(move, attackingPokemon, defendingPokemon) {
  console.log(
    `Attacking with move: ${move.move.name} from Pokémon: ${attackingPokemon.name} against Pokémon: ${defendingPokemon.name}`
  );
}

async function fetchPokemonData(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return { pokemon, pokemonSpecies };
  } catch (error) {
    console.error("An error occurred while fetching Pokémon data:", error);
    return null;
  }
}

async function fetchRandomPokemon(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return { pokemon: data };
  } catch (error) {
    console.error("An error occurred while fetching a random Pokémon:", error);
    return null;
  }
}
async function fetchMoveDetails(moveName) {
  let url = `https://pokeapi.co/api/v2/move/${moveName}`;
  try {
    const moveData = await fetch(url).then((res) => res.json());
    console.log(moveData);
    return moveData;
  } catch {
    console.error("An error occurred while fetching pokemon move details");
  }
}
class Pokemon {
  constructor(data) {
    this.data = data;
    this.id = data.id;
    this.name = data.name;
    this.moves = null;
    this.moves_pp = {};
    this.level = Math.floor(Math.random() * (100 - 95 + 1)) + 95;
    this.calculateStats();
  }

  calculateStats() {
    const { stats, types } = this.data;
    let hp = this.data.stats[0];
    this.attack = this.calculateStat(stats[1]);
    this.defense = this.calculateStat(stats[2]);
    this.total_hp = Math.floor(
      0.01 * (2 * hp.base_stat + Math.floor(0.25 * hp.effort)) + this.level + 10
    );
    this.special_attack = this.calculateStat(stats[3]);
    this.special_defense = this.calculateStat(stats[4]);
    this.speed = this.calculateStat(stats[5]);
    this.type = types.map((type) => capitalizeFirstLetter(type.type.name));
    this.hp = this.total_hp;
  }

  calculateStat(stat) {
    return Math.floor(
      0.01 *
        (2 * stat.base_stat + Math.floor(0.25 * stat.effort)) *
        this.level +
        5
    );
  }
}

function displayPokemonofplayer(pokemon, playerNumber) {
  const { name, id, moves, stats } = pokemon;
  const capitalizePokemonName = capitalizeFirstLetter(name);

  const playerNameElement = document.querySelector(
    `.player:nth-child(${playerNumber}) h2`
  );
  playerNameElement.textContent = capitalizePokemonName;

  const imageElement = document.querySelector(
    `.player:nth-child(${playerNumber}) .pokemon img`
  );
  imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  imageElement.alt = name;
}
// async function attack(movep, attacker, defender, hpElementId, attackerName) {
//   const move = await movep;
//   console.log(move.move.name); // Assuming move.move.name is the correct path to the move name
//  console.log(attackerName);

//   const damage = calculateDamage(move, attacker, defender);
//   defender.hp -= damage;
//   updateHealthBar(defender, damage);

//   if (defender.hp <= 0) {
//     console.log(`${defender.name} has fainted!`);
//   }
// }
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function createAndAppendElement(parent, tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    element[key] = options[key];
  });
  parent.appendChild(element);
  return element;
}

function calculateDamage(move, attacker, defender) {
  let effectiveness = netEffectiveness(
    console.log(move),
    capitalizeFirstLetter(move.type.name),
    defender.type
  );
  let damage =
    ((((2 * attacker.level) / 5 + 2) * move.power * attacker.attack) /
      defender.defense /
      50 +
      2) *
    effectiveness;
  return damage;
}
function netEffectiveness(moveType, pokemonTypes) {
  const typeData = [
    {
      name: "Normal",
      immunes: ["Ghost"],
      weaknesses: ["Rock", "Steel"],
      strengths: [],
    },
    {
      name: "Fire",
      immunes: [],
      weaknesses: ["Fire", "Water", "Rock", "Dragon"],
      strengths: ["Grass", "Ice", "Bug", "Steel"],
    },
    {
      name: "Water",
      immunes: [],
      weaknesses: ["Water", "Grass", "Dragon"],
      strengths: ["Fire", "Ground", "Rock"],
    },
    {
      name: "Electric",
      immunes: ["Ground"],
      weaknesses: ["Electric", "Grass", "Dragon"],
      strengths: ["Water", "Flying"],
    },
    {
      name: "Grass",
      immunes: [],
      weaknesses: [
        "Fire",
        "Grass",
        "Poison",
        "Flying",
        "Bug",
        "Dragon",
        "Steel",
      ],
      strengths: ["Water", "Ground", "Rock"],
    },
    {
      name: "Ice",
      immunes: [],
      weaknesses: ["Fire", "Water", "Ice", "Steel"],
      strengths: ["Grass", "Ground", "Flying", "Dragon"],
    },
    {
      name: "Fighting",
      immunes: ["Ghost"],
      weaknesses: ["Poison", "Flying", "Psychic", "Bug", "Fairy"],
      strengths: ["Normal", "Ice", "Rock", "Dark", "Steel"],
    },
    {
      name: "Poison",
      immunes: ["Steel"],
      weaknesses: ["Poison", "Ground", "Rock", "Ghost"],
      strengths: ["Grass", "Fairy"],
    },
    {
      name: "Ground",
      immunes: ["Flying"],
      weaknesses: ["Grass", "Bug"],
      strengths: ["Fire", "Electric", "Poison", "Rock", "Steel"],
    },
    {
      name: "Flying",
      immunes: [],
      weaknesses: ["Electric", "Rock", "Steel"],
      strengths: ["Grass", "Fighting", "Bug"],
    },
    {
      name: "Psychic",
      immunes: ["Dark"],
      weaknesses: ["Psychic", "Steel"],
      strengths: ["Fighting", "Poison"],
    },
    {
      name: "Bug",
      immunes: [],
      weaknesses: [
        "Fire",
        "Fighting",
        "Poison",
        "Flying",
        "Ghost",
        "Steel",
        "Fairy",
      ],
      strengths: ["Grass", "Psychic", "Dark"],
    },
    {
      name: "Rock",
      immunes: [],
      weaknesses: ["Fighting", "Ground", "Steel"],
      strengths: ["Fire", "Ice", "Flying", "Bug"],
    },
    {
      name: "Ghost",
      immunes: ["Normal"],
      weaknesses: ["Dark"],
      strengths: ["Psychic", "Ghost"],
    },
    {
      name: "Dragon",
      immunes: ["Fairy"],
      weaknesses: ["Steel"],
      strengths: ["Dragon"],
    },
    {
      name: "Dark",
      immunes: [],
      weaknesses: ["Fighting", "Dark", "Fairy"],
      strengths: ["Psychic", "Ghost"],
    },
    {
      name: "Steel",
      immunes: [],
      weaknesses: ["Fire", "Water", "Electric", "Steel"],
      strengths: ["Ice", "Rock", "Fairy"],
    },
    {
      name: "Fairy",
      immunes: [],
      weaknesses: ["Fire", "Poison", "Steel"],
      strengths: ["Fighting", "Dragon", "Dark"],
    },
  ];

  const typeInfo = typeData.find((type) => type.name === moveType);
  if (!typeInfo) {
    console.error("Invalid move type:", moveType);
    return 1;
  }

  let effectivenessProduct = 1;

  for (const pokemonType of pokemonTypes) {
    if (typeInfo.immunes.includes(pokemonType)) {
      effectivenessProduct *= 0;
    } else if (typeInfo.weaknesses.includes(pokemonType)) {
      effectivenessProduct *= 0.5;
    } else if (typeInfo.strengths.includes(pokemonType)) {
      effectivenessProduct *= 2;
    }
  }
  return effectivenessProduct;
}

function updateHealthBar(pokemon, healthChange) {
  const healthElement = document.getElementById(
    `player${pokemon.playerNumber}-health`
  );
  const currentHealth = parseInt(healthElement.style.width, 10);
  const newHealth = Math.max(currentHealth - healthChange, 0);
  healthElement.style.width = `${newHealth}%`;
}
