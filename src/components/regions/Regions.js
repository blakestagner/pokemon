import './region.scss';
import { useEffect, useState} from 'react';
import PokemonBasic from '../details/PokemonBasic';
import PokemonDetails from '../details/PokemonDetails';
import { usePokemon } from '../../service/PokemonContext';

export default function Regions({P, url}) {
    const [region, setRegion] = useState(null);
    const [pokemonList, setPokemonList] = useState(null)
    const [loading, setLoading] = useState(true);
    const isPokemon = usePokemon();
    
    useEffect(() => {
        const abortController = new AbortController();
        fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            setRegion(jsonData)
        })
        .catch((error) => {
            console.error(error)
        })
        return () => {
            abortController.abort(); // cancel pending fetch request on component unmount
        };
    }, [url])

    useEffect(() => {
        const abortController = new AbortController();
        if(region) {
            let dexUrl;
            if(region.main_generation) {
                dexUrl = region.main_generation.url
            } else {
                dexUrl = region.pokedexes[0].url
            }
            fetch(dexUrl)
            .then(response => response.json())
            .then((jsonData) => {
                let speciesList;
                if(region.main_generation) {
                    speciesList = jsonData.pokemon_species
                } else {
                    speciesList = jsonData.pokemon_entries
                }
                setPokemonList(speciesList)
            })
            .catch((error) => {
                console.error(error)
            })
        }
        return () => {
            abortController.abort(); // cancel pending fetch request on component unmount
        };
    }, [region])

    useEffect(()=> {
        if(pokemonList !== null) {
            var splitUrl = 'https://pokeapi.co/api/v2/pokemon-species/';
            if (pokemonList[0].name) {
                pokemonList.sort(
                    (a, b) => 
                    parseInt(a.url.split(splitUrl)[1]) 
                    > 
                    parseInt(b.url.split(splitUrl)[1])
                    ? +1 : -1)
            } else {
                pokemonList.sort(
                    (a, b) => 
                    parseInt(a.pokemon_species.url.split(splitUrl)[1]) 
                    > 
                    parseInt(b.pokemon_species.url.split(splitUrl)[1])
                    ? +1 : -1)
            }
           
            setLoading(false)
        }
    }, [pokemonList])

    if (loading) {
        return (
            <div className="kanto">
                <p>loading</p>
            </div>
        )
    }

    return (
        <div className="dex-section">
            <h2>{region.name.charAt(0).toUpperCase() + region.name.slice(1)}</h2>
                <div className={!isPokemon ? 'dex-list' : 'details'}>
                {!isPokemon && pokemonList.map((obj, i) => {
                    let objCopy = obj;
                    if (obj.name) {
                        objCopy = obj;
                    } else {
                        objCopy = obj.pokemon_species;
                    }
                    return (
                        <PokemonBasic
                            P={P}
                            pokemonId={objCopy.id}
                            pokemonUrl={objCopy.url}
                            key={objCopy.name}
                        />
                    )
                    
                })}
                {isPokemon &&
                    <PokemonDetails
                        P={P}
                        />
                }
                </div>
        </div>
    )
}