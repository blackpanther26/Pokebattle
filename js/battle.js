const total_pokemons = 200;
let pk1, pk2;
let owner = "Player 1 ";
let flg1=true;
let flg2=false;
document.addEventListener("DOMContentLoaded", () => {
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id) {
    console.log(`Battling with Pokémon ID: ${id}`);
    fetchPokemonData(id).then(({ pokemon }) => {
      pk1 = new Pokemon(pokemon);
      pk1.fetchMoves();
      displayPokemonofplayer(pokemon, 1);
      displaymoves(pokemon, "poke1",1,2);
    });
  } else {
    console.error("No Pokémon ID provided.");
  }

  const randomId = randomInteger(1, total_pokemons);
  fetchRandomPokemon(randomId).then(({pokemon }) => {
    pk2 = new Pokemon(pokemon);
    pk1.fetchMoves();
    displayPokemonofplayer(pokemon, 2);
    displaymoves(pokemon, "poke2",2,1);
    document.getElementById('loadingScreen').style.display = 'none';
  });
});

let currentPlayer = 1;
function displayPokemonofplayer(pokemon, playerNumber) {
  const { name, id } = pokemon;
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
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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
}

async function displaymoves(pokemon, pkn,flag,othflag) {
  const moveButtons = document.getElementById(pkn).querySelectorAll("button");
  const shuffledMoves = pokemon.moves.sort(() => 0.5 - Math.random());
  const randomMoves = shuffledMoves.slice(0, 4);

  const moveDetails = await Promise.all(
    randomMoves.map(async (move) => {
      const response = await fetch(move.move.url);
      const moveData = await response.json();
      return moveData;
    })
  );

  moveDetails.forEach((moveData, index) => {
    moveButtons[index].textContent = moveData.name;
    moveButtons[index].addEventListener("click", () => {
      if (flag===1){
        if (flg1) {
          const defendingPokemonData = getDefendingPokemon();
          const attackingPokemonData = currentPlayer === 2 ? pk1 : pk2;
          const owner = currentPlayer === 2 ? "Player 1 " : "Player 2 ";
          attack(moveData, attackingPokemonData, defendingPokemonData, owner);
          flg1=false;
          flg2=true;
        }
      }
      else {
        if (flg2) {
          const defendingPokemonData = getDefendingPokemon();
          const attackingPokemonData = currentPlayer === 2 ? pk1 : pk2;
          const owner = currentPlayer === 2 ? "Player 1 " : "Player 2 ";
          attack(moveData, attackingPokemonData, defendingPokemonData, owner);
          flg2=false;
          flg1=true;
      }
    }
      
    });
  });
}

function calculateDamage(move, attacker, defender) {
  console.log("caldmg");
  console.log(move);
  console.log(attacker);
  console.log(defender.type);
  let effectiveness = netEffectiveness(
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

function attack(move, attackingPokemon, defendingPokemon, owner) {
  document.getElementById("whoseturn").innerHTML =
    "<p>" + defendingPokemon.name +"'s turn to play! "+ "</p>";
  document.getElementById("comment").innerHTML =
    "<p>" + owner + attackingPokemon.name + " used " + move.name + "!</p>";
  let move_damage;
  move_damage = calculateDamage(move, attackingPokemon, defendingPokemon);
    move_damage = Math.min(defendingPokemon.hp, move_damage);
  if (Math.floor(Math.random() * 100) + 1 < move.accuracy) {
    
    let i = netEffectiveness(
      capitalizeFirstLetter(move.type.name),
      defendingPokemon.type
    );
    switch (i) {
      case 0:
        document.getElementById("comment").innerHTML =
          "<p>It had no effect!</p>";
        break;
      case 0.5:
        document.getElementById("comment").innerHTML =
          "<p>It was not very effective!</p>";
        break;
      case 2:
        document.getElementById("comment").innerHTML =
          "<p>It was very effective!</p>";
        break;
      case 4:
        document.getElementById("comment").innerHTML =
          "<p>It was super effective!</p>";
        break;
    }
  }else{
    document.getElementById("comment").innerHTML = "<p>Attack Missed!</p>";
  }
  console.log(attackingPokemon.name);
  console.log(defendingPokemon.name);
  console.log(attackingPokemon.hp);
  console.log(defendingPokemon.hp);
  defendingPokemon.hp -= Math.floor(move_damage);
  console.log(move_damage);
  console.log(defendingPokemon.hp);
  document.getElementById("comment").innerHTML = `<p> ${
    defendingPokemon.data.name
  } lost  ${Math.floor(move_damage)}  HP</p>`;

  updateHealthBar(
    defendingPokemon,
    attackingPokemon,
    defendingPokemon.hp,
    defendingPokemon.name,
    attackingPokemon.hp,
    attackingPokemon.name
  );
}

function updateHealthBar(defendingPokemon,attackingPokemon,defendingHP, dfnm, attackingHP, atnm) {
  document.getElementById(`player${currentPlayer}-health`).style.width = `${
    ( defendingHP/ defendingPokemon.total_hp) * 100
  }%`;

  if (defendingHP <= 0) {
    document.getElementById(`player${currentPlayer}-health`).style.width = 0;
    setTimeout(() => {
      alert("GAME OVER: " + dfnm + " fainted!");
    window.location.href = "index.html";
    }, 1000);
  } else if (attackingHP <= 0) {
    document.getElementById(`player${currentPlayer}-health`).style.width = 0;
    setTimeout(() => {
      alert("GAME OVER: " + atnm + " fainted!");
    window.location.href = "index.html";
    }, 1000);
  }
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
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
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
  async fetchMoves() {
    const moveUrls = this.data.moves.map((move) => move.move.url);
    const moves = await Promise.all(
      moveUrls.slice(0, 4).map(async (url) => {
        const moveData = await fetchData(url);
        return moveData;
      })
    );
    this.moves = moves;
    this.moves.forEach((move) => {
      this.moves_pp[move.name] = move.pp;
    });
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
