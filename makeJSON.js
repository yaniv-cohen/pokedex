const { get } = require('browser-sync');

async function getSinglePokemons() {
    let response = await fetch('https://pokeapi.co/api/v2/pokedex/1');
    let data = await (await response.json()).pokemon_entries;
    let startIndex = 0;//to do throat
    for (let index = startIndex; index < 151; index++) {
        const element = data[index];
        const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}/`)
        const moreData = await result.json()
       await getExtraData();
       async function  getExtraData() {
            element.id = index + 1;
            element.types = [];
            element.name = moreData.forms[0].name;
            element.weight = moreData.weight;
            element.height = moreData.height;
            element.stats = moreData.stats;
            element.imgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
            element.higherQualityImgURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`;
            // element.evolutionNames = moreData.evolutionNames
            // console.log('moreData');
            // const result = getEvolutions().then();
            // element.evolutionNames = await (await getEvolutions())
            element.evolutionNames = [];
            moreData.types.forEach(type => {

                element.types.push(type.type.name)
            });
        }
        getEvolutions();

        async function getEvolutions() {
            const result = await fetch(moreData.species.url)
            const species = await result.json()
            let evoNames = [];
            const result2 = await fetch(species.evolution_chain.url)
            const evo = await result2.json()
            // console.log(evo.chain.evolves_to);
            let evolevesTo = evo.chain.evolves_to;
            while (evolevesTo.length) {
                evoNames.push(evolevesTo[0].species.name)
                evolevesTo = evolevesTo[0].evolves_to;
            }
            console.log('returning ' ,evoNames);
            element.evolutionNames=  evoNames;
        }

    }


    console.log(data[0]);
    writeFile(data);
}
function writeFile(data) {
    // console.log(data[0]);
    const fs = require('fs');

    const content = JSON.stringify(data);

    fs.writeFile('./mewdatabase.json', content, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
    return data
}

getSinglePokemons()
