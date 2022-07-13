import { PokemonComponent, DataOfPokemon } from "./PokemonComponent";
import { Pokemons } from "./Pokemons";
class App {
    public checkPokemonPage: boolean = location.search.includes('pokemon');
    public pokemons: Pokemons = new Pokemons();
    public pokemonsData: Array<any> = [];
    public filteredPokemons: Array<any> = [];
    public index: number = 0;
    public lastPokemon: number = 10;
    mainParent: HTMLDivElement;
    
    constructor() {
        this.mainParent = document.createElement('div') as HTMLDivElement;
    }
    async mainSetUp() {

        // this.pokemonsData = await this.pokemons.getSinglePokemons();
        this.pokemonsData = await (await fetch('http://localhost:4040/pokemonsJSON')).json()
        console.log("updated from fetch");

        console.log(this.pokemonsData);
        // console.log(fs);

        //set up searchbar
        let searchBarDiv = document.createElement('div') as HTMLDivElement;
        searchBarDiv.classList.add('searchBarDiv');
        let searchBarTextDiv = document.createElement('div') as HTMLDivElement;
        searchBarTextDiv.classList.add('searchBarText');
        let searchBarH2 = document.createElement('h2')! as HTMLHeadingElement
        searchBarH2.innerText = "Enter a Pokemon name or ID:"
        searchBarTextDiv.appendChild(searchBarH2)
        let inputElement = document.createElement('input')! as HTMLInputElement
        searchBarTextDiv.appendChild(inputElement)
        searchBarDiv.appendChild(searchBarTextDiv);

        let goButtonElement = document.createElement('button')! as HTMLButtonElement;
        goButtonElement.innerHTML = "Go!"
        goButtonElement.addEventListener('click', () => {

            if(!inputElement.value)
            {
                return
            }
            this.mainParent.innerHTML = '';
            this.filteredPokemons =[];
            for (const pokemon of this.pokemonsData) {
                if (pokemon.id<152 &&(pokemon.pokemon_species.name.includes(inputElement.value) ||
                    pokemon.entry_number.toString().startsWith('' + inputElement.value))
                    ) {
                    this.filteredPokemons.push(pokemon);
                }
            }
            if (this.filteredPokemons.length == 0) {
                console.log('no pokemon with that information');
            }
            else if (this.filteredPokemons.length > 1) {
                this.mainParent.innerHTML = '';
                for (let i = 0; i < this.filteredPokemons.length; i++) {
                    let poke = new PokemonComponent(this.filteredPokemons[i], this.mainParent)
                    poke.renderMiniInfo()
                }
            } else if (this.filteredPokemons.length === 1)
                window.location.href = `http://localhost:4000/?pokemon=${this.filteredPokemons[0].entry_number}`;

        });
        searchBarDiv.appendChild(goButtonElement)

        //favorites button
        let favoritesGoButton = document.createElement('button')! as HTMLButtonElement;
        favoritesGoButton.innerHTML = "My favorites!"
        favoritesGoButton.addEventListener('click', () => {
            let favoritesArray = [];
            this.mainParent.innerHTML = '';
            let cookieString = document.cookie;
            console.log(cookieString);
            
            while(cookieString.indexOf("%")>-1 && cookieString.indexOf("&")>-1)
            {
                var favNum = cookieString.substring(cookieString.indexOf("%")+1,cookieString.indexOf("&"));
                favoritesArray.push(favNum)
                cookieString = cookieString.substring(cookieString.indexOf("&")+1)
            }
            favoritesArray.sort((a,b) => a-b);
            this.filteredPokemons =[];
            favoritesArray.forEach((id)=>{
                for (const pokemon of this.pokemonsData) {
                    if (pokemon.id<152 && pokemon.id ==id)
                        this.filteredPokemons.push(pokemon);
                    }
                })

                for (let i = 0; i < this.filteredPokemons.length; i++) {
                    let poke = new PokemonComponent(this.filteredPokemons[i], this.mainParent)
                    poke.renderMiniInfo()
                }

        });

        searchBarDiv.appendChild(favoritesGoButton)
        document.body.appendChild(searchBarDiv)

        //insert pokemon DOM Elements
        // let parentElement = document.createElement('div') as HTMLDivElement;
        document.body.appendChild(this.mainParent)

        this.loadPokemons()

        //detect end of page
        window.onscroll = function () {
            if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && !app.filteredPokemons.length) {
                app.lastPokemon += 10;
                app.loadPokemons()
            }
        }
    }
    loadPokemons() {
        while (this.index < this.lastPokemon/*miniData.length*/) {
            let pokemon = new PokemonComponent(this.pokemonsData[this.index], this.mainParent)
            pokemon.renderMiniInfo()
            this.index++
            //image url `url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png')`
        }
    }
    async pokeSetUp(pokemonID: string) {
        // const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}/`)
        // const result = this.pokemonsData
        console.log(pokemonID);

        const data = (await (await fetch('http://localhost:4040/pokemonsJSON')).json())[parseInt(pokemonID) - 1];
        console.log("updated from fetch");
        let dataOfPokemon: DataOfPokemon = {
            id: data.id,
            name: data.name,
            height: data.height,
            weight: data.weight,
            types: data.types,
            // types: data.types.map((type: { type: { name: any; }; }) => type.type.name),
            imgURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
            higherQualityImgURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
            evolutionNames: data.evolutionNames,
            stats: data.stats,
        }
        let poke = new PokemonComponent(dataOfPokemon, this.mainParent)
        poke.renderFullInfo()
        console.log(poke.data.evolutionNames);
        
        if (poke.data.evolutionNames.length>0) { 
            // poke.renderEvolutions() 
        }

        // TODO: End  it.
        // dataOfPokemon.evolutionNames.forEach(async evolution => {
        //     let evolutionPokemon = await this.pokemons.getSinglePokemon(evolution);
        //     let pokemonElement = new PokemonComponent(evolutionPokemon, this.mainParent)
        //     pokemonElement.renderEvolutions()
        // })
    }
    //for the header, nav and footer
    basePageSetUp() {
        //set up the header
        let body = document.getElementsByTagName('body')[0] as HTMLBodyElement;
        let header = document.createElement('header') as HTMLElement;

        let logo = document.createElement('img') as HTMLImageElement;
        logo.classList.add('logo');
        logo.src = 'https://assets.pokemon.com/assets/cms2/img/misc/gus/buttons/logo-pokemon-79x45.png';
        header.appendChild(logo)
        let shop = document.createElement('img') as HTMLImageElement;
        shop.classList.add('shop');
        shop.src = 'https://assets.pokemon.com/assets/cms2/img/misc/gus/buttons/logo-pokemoncenter-79x45.png'
        header.appendChild(shop)
        body.appendChild(header)
        //set up the nav
        let nav = document.createElement('nav') as HTMLElement;

        //home button
        let home = document.createElement('div') as HTMLDivElement;
        home.classList.add('home');
        home.innerText = 'Home'
        home.addEventListener('click', () => {
            window.location.href = `http://localhost:4000/`;
        })
        nav.appendChild(home)
        //pokedex button
        let pokedex = document.createElement('div') as HTMLDivElement;
        pokedex.classList.add('pokedex');
        pokedex.innerText = 'pokedex';
        pokedex.addEventListener('click', () => {
            window.location.href = `http://localhost:4000/`;
        })
        nav.appendChild(pokedex)
        //VIdeo Games & Apps button
        let video_games = document.createElement('div') as HTMLDivElement;
        video_games.classList.add('video_games');
        video_games.innerText = 'video_games'
        nav.appendChild(video_games)

        body.appendChild(nav)
        document.body.appendChild(this.mainParent)
    }
}
let app = new App()
app.basePageSetUp();
if (app.checkPokemonPage === true) {

    app.pokeSetUp((new URLSearchParams(location.search)).get('pokemon')!)
} else {
    app.mainSetUp()
}
