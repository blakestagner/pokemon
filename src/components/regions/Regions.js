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
            fetch(region.main_generation.url)
            .then(response => response.json())
            .then((jsonData) => {
                setPokemonList(jsonData.pokemon_species)
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
            pokemonList.sort(
                (a, b) => 
                parseInt(a.url.split(splitUrl)[1]) 
                > 
                parseInt(b.url.split(splitUrl)[1])
                ? +1 : -1)
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
                {!isPokemon && pokemonList.map((obj, i) => (
                    <PokemonBasic
                        P={P}
                        pokemonId={obj.id}
                        pokemonUrl={obj.url}
                        key={obj.name}
                        />
                ))}
                {isPokemon &&
                    <PokemonDetails
                        P={P}
                        />
                }
                </div>
        </div>
    )
}