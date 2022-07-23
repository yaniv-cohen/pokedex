// let JSON = 



main()
async function main()
{
let recieved = await (await fetch('https://pokeapi.co/api/v2/pokedex/1')).json();
// createFile(JSON.stringify(recieved.pokemon_entries), 'pokemons.json);
await readPokemonsJSON();
}
function createFile(str, fileName)
{
    var fs = require('fs');
    fs.writeFileSync(fileName, str.toString());
}

async function readPokemonsJSON()
{
    console.log('read');

    var fs = require('fs');
    let pokemon_entries;
    fs.readFile('pokemons.json', 'utf8', async function (err, data) {

      if (err) throw err;
       pokemon_entries = JSON.parse(data);
       for (let index = 0; index <pokemon_entries.length; index++) {
        let entry = pokemon_entries[index];
        let newEntry = {};
        newEntry.name = entry.pokemon_species.name;
        newEntry.id = entry.entry_number;
        let url = 'https://pokeapi.co/api/v2/pokemon/'+newEntry.id+'/'
        let recieved = await (await fetch(url)).json();
        let statsObject ={};

        for(stat in recieved.stats) {
        statsObject[recieved.stats[stat].stat.name] = recieved.stats[stat].base_stat   ;
        }
        let typesArr =[recieved.types[0].type.name];
        if(recieved.types.length>1)
        {
            typesArr.push(recieved.types[1].type.name)
        }
        newEntry.stats = statsObject;
        newEntry.types = typesArr;
        newEntry.height= recieved.height
        newEntry.weight= recieved.weight
        newEntry.default_image= 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png'
        console.log(newEntry);
        pokemon_entries[index] = newEntry;
        // check.push(newEntry)
       }
        createFile(JSON.stringify(pokemon_entries), 'entryInfo.json')
    });
}

