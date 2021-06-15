export function genera(pokemon) {
    const filtered = pokemon.filter((obj) => 
        obj.language.name === "en" ? obj.genus : ''
    )
    return filtered[0].genus;
}
export function upperCase (name) {
    const newName = name.charAt(0).toUpperCase() + name.slice(1) 
    return newName
}
export function pokemonData(pokemon) {
    return fetch(pokemon)
    .then(response => response.json())
    .then(jsonData => jsonData)
    .catch((error) => {
        console.error(error)
    })
}

export function pokemonData2(P, pokemon) {
    return P.getPokemonByName(pokemon)
    .then(res => res)
    .catch(err => {
        console.log('There was an ERROR: ', err);
    });
}

export function pokemonEvolution(pokemon) {
    return fetch(pokemon)
    .then(response => response.json())
    .then(jsonData => jsonData)
    .catch((error) => {
        console.error(error)
    })
}

export function pokemonImage(pokemon) {
    var path = `${process.env.PUBLIC_URL}/pkmon/poke_capture_`;
    const pokemonId = () => {
        var id = pokemon.id;
        var digitLen = id.toString().length;
        var newId = {
            1: `000${id}`,
            2: `00${id}`,
            3: `0${id}`
        }
        return newId[digitLen]
    }

    const gender = () => {
        var genderDif = pokemon.has_gender_differences;
        var genderRate = pokemon.gender_rate;
        var varieties = pokemon.varieties.filter(obj => {
            return obj.pokemon.name.includes('male')
        });

        if( genderDif && varieties.length === 0) {
            return 'md_n_00000000_f_n.png'
        } else if((!genderDif && genderRate === 0)|| (genderDif && genderRate === 4)) {
            return 'mo_n_00000000_f_n.png'
        } else if(!genderDif && genderRate === 8 ) {
            return 'fo_n_00000000_f_n.png'
        } else if(!genderDif && genderRate >= 1) {
            return 'mf_n_00000000_f_n.png'
        } else return 'uk_n_00000000_f_n.png'
    }
    //console.log(`${path}${pokemonId(id)}_000_${gender()}`)
    return `${path}${pokemonId()}_000_${gender()}`
    
}
