export interface DataOfPokemon {
    id?: string;
    name?: string;
    height: string;
    weight: string;
    types?: string[]
    abillities?: string;
    imgURL?: string;
    higherQualityImgURL?: string;
    family?: string[];
    evolutionNames?: string[]
    stats?: Array<{ base_stat: string, effort: string, stat: { name: string, url: string } }>

    pokemon_species?: {
        name: string;
        url: string;
    };
    entry_number?: string;
}

export class PokemonComponent {
    data: DataOfPokemon;
    parent: HTMLDivElement
    constructor(data: DataOfPokemon, parent: HTMLDivElement) {
        this.data = data
        this.parent = parent
    }
    clear() {
        this.parent.innerHTML = '';
    }
    renderFullInfo() {
        if(document.cookie.includes("%"+this.data.id+"&"))
        {
            let favDiv = document.createElement('div') as HTMLDivElement;
            favDiv.innerText = 'fav';
            favDiv.classList.add("favButton");
            favDiv.classList.add("favButton-on");
            this.parent.appendChild(favDiv)
        }

        let IdDiv = document.createElement('div') as HTMLDivElement;
        IdDiv.innerText = 'Pokemon ID. :' + this.data.id;
        this.parent.appendChild(IdDiv)

        let heightDiv = document.createElement('div') as HTMLDivElement;
        heightDiv.innerText = 'Pokemon Height. :' + this.data.height;
        this.parent.appendChild(heightDiv)

        let weightDiv = document.createElement('div') as HTMLDivElement;
        weightDiv.innerText = 'Pokemon Weight. :' + this.data.weight;
        this.parent.appendChild(weightDiv);

        //types
        let typesContainer = document.createElement('div') as HTMLDivElement;
        typesContainer.className = 'typesContainer';
        this.data.types?.forEach((type) => {
            let typesDiv = document.createElement('div') as HTMLDivElement;
            let capitalizedType = type[0].toUpperCase() + type.substring(1);
            typesDiv.innerHTML = `
            <div class="typeDiv ${type}"><span>${capitalizedType}</span></div>`
            typesContainer.appendChild(typesDiv);
        })
        this.parent.appendChild(typesContainer);

        //image of pokemon
        let pokemonImage = document.createElement('img') as HTMLImageElement;
        pokemonImage.className = 'pokemonImageDiv';
        pokemonImage.src = this.data.higherQualityImgURL!;
        this.parent.appendChild(pokemonImage);

        //stats
        let statsContainer = document.createElement('div') as HTMLDivElement;
        statsContainer.className = 'pokemonStatDiv';
        this.data.stats?.forEach((stat) => {
            let statDiv = document.createElement('div') as HTMLDivElement;
            statDiv.className = `${stat.stat.name}`;
            statDiv.style.backgroundColor = 'red';
            statDiv.style.backgroundColor =
                "rgb(" + Math.min( (20 + Math.min(parseInt(stat.base_stat) * 250 / 150, 225)),255 ) + ","
                + (20 + Math.min(255 - parseInt(stat.base_stat) * 250 / 256, 235))
                + ",30)";
            statDiv.style.height = Math.max(parseInt(stat.base_stat), 20) * 2 + 'px';
            statDiv.innerHTML = `<span>${stat.stat.name}<br>${stat.base_stat}</span>`;
            statsContainer.appendChild(statDiv);
        })
        this.parent.appendChild(statsContainer);
    }
    renderEvolutions() {
        let evoDiv = document.createElement('div') as HTMLDivElement;
        evoDiv.classList.add('pokemonBox')
        let imgElement = document.createElement('img') as HTMLImageElement
        imgElement.classList.add('pokemonImageDiv');
        imgElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.data.id}.png`
        evoDiv.appendChild(imgElement)

        let entryDiv = document.createElement('h3') as HTMLHeadingElement
        //add zeros to the number
        let numberString = '#' + '0'.repeat(3 - this.data.id!.toString().length) + this.data.id
        entryDiv.innerText = numberString;
        evoDiv.appendChild(entryDiv)

        let nameDiv = document.createElement('h2') as HTMLHeadingElement
        nameDiv.innerText = this.data.name!.charAt(0).toUpperCase() + this.data.name!.slice(1)
        evoDiv.appendChild(nameDiv)

        evoDiv.addEventListener('click', () => {
            window.location.href = `http://localhost:4000/?pokemon=${this.data.id}`;
        })
        this.parent.appendChild(evoDiv)
    }
    renderMiniInfo() {

        this.parent.classList.add('pokemonContainer')

        let pokeDiv = document.createElement('div') as HTMLDivElement;
        pokeDiv.classList.add('pokemonBox');
        pokeDiv.addEventListener('click', () => {
            window.location.href = `http://localhost:4000/?pokemon=${this.data.entry_number}`;
        })
        //create pokemon image DOM element
        let imgElement = document.createElement('img') as HTMLImageElement
        imgElement.classList.add('pokemonImageDiv');
        imgElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.data.entry_number}.png`
        pokeDiv.appendChild(imgElement)

        let textDiv = document.createElement('div') as HTMLDivElement;

        //create pokemon entry_number DOM element
        let entryDiv = document.createElement('div') as HTMLDivElement
        let entryNumberH = document.createElement('h3') as HTMLHeadingElement
        entryDiv.classList.add('entryDiv');
        //add zeros to the number
        let numberString = '#' + '0'.repeat(3 - this.data.entry_number!.toString().length) + this.data.entry_number
        entryNumberH.innerText = numberString;
        entryDiv.style.display = 'flex';
        entryDiv.style.flexDirection = 'row';
        entryDiv.style.justifyItems = 'space-between';

        entryDiv.appendChild(entryNumberH)

        let favDiv = document.createElement('span') as HTMLHeadingElement
        favDiv.innerText = `fav`
        favDiv.classList.add('favButton');
        if (document.cookie.includes('%' + this.data.entry_number + '&')) {
            favDiv.classList.remove('favButton-off');
            favDiv.classList.add('favButton-on');
        }
        else {
            favDiv.classList.remove('favButton-on');
            favDiv.classList.add('favButton-off');
        }
        favDiv.addEventListener('click', (event) => {
            event.stopPropagation();
            let cookieOriginal = document.cookie;

            console.log(cookieOriginal, 'cookieOriginal', (cookieOriginal.includes('%' + this.data.entry_number + '&')))
            console.log(cookieOriginal, (cookieOriginal.includes('%' + this.data.entry_number + '&')))

            if (cookieOriginal.includes('%' + this.data.entry_number + '&')) {
                //if it was on - turn it off

                let stringToRemove = '%' + this.data.entry_number + '&'

                console.log(cookieOriginal, ' co abefore', '    looking for ' + ('%' + this.data.entry_number + '&'));
                console.log(cookieOriginal.indexOf(stringToRemove));
                document.cookie = cookieOriginal.replace(stringToRemove, "");
                console.log(document.cookie, ' co after');
                favDiv.classList.remove('favButton-on');

                favDiv.classList.add('favButton-off');
            }
            else {
                //if it was off - turn it on
                console.log(document.cookie, 'before');
                cookieOriginal += '%' + this.data.entry_number + '&', "";
                document.cookie = cookieOriginal;
                console.log(document.cookie, 'after');
                favDiv.classList.remove('favButton-off');
                favDiv.classList.add('favButton-on');
            }
        })
        entryDiv.appendChild(favDiv)
        //create pokemon name DOM element
        let nameDiv = document.createElement('h2') as HTMLHeadingElement
        nameDiv.innerText = this.data.pokemon_species!.name.charAt(0).toUpperCase() + this.data.pokemon_species!.name.slice(1)

        textDiv.appendChild(entryDiv)
        textDiv.appendChild(nameDiv)


        pokeDiv.appendChild(textDiv)
        //create pokemon name DOM element

        //types
        let typesContainer = document.createElement('div') as HTMLDivElement;
        typesContainer.className = 'typesContainer';
        this.data.types?.forEach((type) => {
            let typesDiv = document.createElement('div') as HTMLDivElement;
            let capitalizedType = type[0].toUpperCase() + type.substring(1);
            typesDiv.innerHTML = `
            <div class="typeDiv ${type}"><span>${capitalizedType}</span></div>`
            typesContainer.appendChild(typesDiv);
        })
        pokeDiv.appendChild(typesContainer);

        this.parent.appendChild(pokeDiv)
    }
}