export class Pokemons {
    constructor() {

    }    
    async getEvoNames(speciesURL: string) {
        let species: any = await fetch(speciesURL).then(data => data.json());
        let evolutionChain: any = await fetch(species.evolution_chain.url).then(data => data.json())
        let evoNames: string[] = []
        evoNames.push(evolutionChain.chain.species.name)
        let evolvesTo = evolutionChain.chain.evolves_to;
        while (evolvesTo.length) {
            evoNames.push(evolvesTo[0].species.name)
            evolvesTo = evolvesTo[0].evolves_to;
        }
        return evoNames
    }
    async getPokemons() {
        let response = await fetch('https://pokeapi.co/api/v2/pokedex/1');
        let data = (await response.json()).pokemon_entries;
        return data
    }
    async getPokemon(pokemonName: string) {
        const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`)
        const data: any = await result.json()
        return data
    }
}