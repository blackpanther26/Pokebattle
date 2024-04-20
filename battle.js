const total_pokemons = 151;
document.addEventListener("DOMContentLoaded", () => {
  const pokemonID = new URLSearchParams(window.location.search).get("id");
  const id = parseInt(pokemonID, 10);

  if (id) {
    console.log(`Battling with Pokémon ID: ${id}`);
    fetchPokemonData(id).then(({ pokemon }) => {
      displayPokemonofplayer(pokemon, 1);
    });
  } else {
    console.error("No Pokémon ID provided.");
  }

  const randomId = randomInteger(1, total_pokemons);
  fetchRandomPokemon(randomId).then(({ pokemon }) => {
    displayPokemonofplayer(pokemon, 2);
  });
});

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
async function fetchMovesData(pokemonId) {
  const url = `https://pokeapi.co/api/v2/move/${pokemonId}/`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data.moves; 
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

async function displayPokemonofplayer(pokemon, playerNumber) {
  const { name, id, stats } = pokemon;
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
 
  const movesWrapper = document.querySelector(
     `.player:nth-child(${playerNumber}) .moves`
  );

  const movesData = await fetchMovesData(id);

  const firstFourMoves = movesData.slice(0, 4);
  firstFourMoves.forEach(move => {
     createAndAppendElement(movesWrapper, "button", {
       className: "moves",
       textContent: move.name,
     });
  });
 }
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

// document.getElementById("attack-btn").addEventListener("click", function () {
//   const player1Health = 100;
//   const player2Health = 100;

//   const damage = 10;
//   player1Health -= damage;
//   player2Health -= damage;

//   document.getElementById("player1-health").style.width = `${player1Health}%`;
//   document.getElementById("player2-health").style.width = `${player2Health}%`;

//   if (player1Health <= 0) {
//     alert("Player 2 wins!");
//   } else if (player2Health <= 0) {
//     alert("Player 1 wins!");
//   }
// });
