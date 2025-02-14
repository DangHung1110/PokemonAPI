(async function () {
    const app = document.querySelector('.content_img'); 
    const button = document.querySelector('.loading_page'); 
    const input = document.querySelector('.search'); 
    let counter = 0; 
    let limit = 36; 
    let filteredpokemon = []; 
    let pokemons = []; 

    function getBackgroundColorForType(type) {
        const typeColors = {
            normal: "#A8A77A",
            fire: "#FF0000",
            water: "#6390F0",
            electric: "#F7D02C",
            grass: "#7AC74C",
            ice: "#96D9D6",
            fighting: "#C22E28",
            poison: "#A33EA1",
            ground: "#E2BF65",
            flying: "#A98FF3",
            psychic: "#F95587",
            bug: "#A6B91A",
            rock: "#B6A136",
            ghost: "#735797",
            dragon: "#6F35FC",
            dark: "#705746",
            steel: "#B7B7CE",
            fairy: "#D685AD",
        };
        return typeColors[type]; 
    }

    function createPokemonTypes(types) {
        return types.map(function (type) {
            const bgColor = getBackgroundColorForType(type.type.name);
            return `<div class="${type.type.name}" style="background-color: ${bgColor}; color: white; padding: 5px; border-radius: 5px; text-align: center;">
                        ${type.type.name}
                    </div>`;
        }).join('');
    }

    function createPokemonElement(pokemon) {
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add("pokemon");

        pokemonElement.innerHTML = `
            <div class="id">#${pokemon.id}</div>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
            <div class="name">${pokemon.name}</div>
            <div class="type">
                ${createPokemonTypes(pokemon.types)}
            </div>
        `;
        return pokemonElement;
    }

    async function cfetch(URL) {
        try {
            const response = await fetch(URL);
            return await response.json();
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    }

    function createPromiseList() {
        const pokePromises = [];
        for (let i = 0; i < limit && counter < filteredpokemon.length; i++, counter++) {
            const pokemon = filteredpokemon[counter];
            pokePromises.push(cfetch(pokemon.url));
        }
        return pokePromises;
    }

    const { results } = await cfetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=898");
    pokemons = results; 
    filteredpokemon = pokemons; 

    async function render() {
        const pokeData = await Promise.all(createPromiseList());
        pokeData.forEach(function (pokemon) {
            if (pokemon) {
                const element = createPokemonElement(pokemon);
                app.appendChild(element);
            }
        });
        if (counter >= filteredpokemon.length) {
            button.style.display = 'none'; 
        }
    }

    app.innerHTML = ``;
    render();

    button.addEventListener("click", function () {
        render();
    });

    input.addEventListener("input", function () {
        const query = input.value.toLowerCase(); 
        filteredpokemon = pokemons.filter(function (pokemon) {
            return pokemon.name.toLowerCase().includes(query);
        });

        app.innerHTML = ``;
        counter = 0;
        limit = 36;
        button.style.display = filteredpokemon.length > 0 ? 'block' : 'none'; 
        render();
    });
})();