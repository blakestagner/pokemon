import {useState, useEffect} from 'react';
import './details.scss';
import {upperCase, pokemonData, pokemonData2} from '../Helper';
import east from './img/east.svg';
import southEast from './img/south_east.svg';
import northEast from './img/north_east.svg';
import {usePokemonUpdate} from '../../service/PokemonContext';

export default function PokemonEvolution({P, pokemonUrl, evolutionDetails}) {
    const [loading, setLoading] = useState(true);
    const [pokemon, setPokemon] = useState(null);
    const getPokemon = usePokemonUpdate();

    useEffect(()=> {
        var splitUrl = 'https://pokeapi.co/api/v2/pokemon-species/';
        const abortController = new AbortController();
        const pokemonFetch = new Promise(resolve => { 
            pokemonData2(P, parseInt(pokemonUrl.split(splitUrl)[1]))
            .then(res => {
                resolve(res);
            })
            .catch(err => console.log('There was an ERROR: ', err));
        })
        const pokemonFetchTwo = new Promise(resolve => {
            pokemonData(pokemonUrl)
            .then(res => {
                resolve(res)
            })
            .catch(err => console.log(err));
        })

        Promise.all([pokemonFetch, pokemonFetchTwo])
        .then(([first, second]) => {
            setPokemon({...first, ...second})
        })
        .catch(err => console.log(err))
        return () => {
            abortController.abort(); // cancel pending fetch request on component unmount
        };

    }, [P, pokemonUrl])


    useEffect(()=> {
        if(pokemon) {
            setLoading(false)
        }
    }, [pokemon])


    if(loading) {
        return (
            <p>Loading</p>
        )
    }

    const arrow = evolutionDetails.id.charAt(1) === 'a'
                    ? northEast
                        : evolutionDetails.id.charAt(1) === 'b'
                            ? southEast 
                                : east;

    return (
        <div 
            className="evolution"
            onClick={() => getPokemon('details', pokemon)}>
            { evolutionDetails.id !== '1'
                ? <img className="arrow" src={arrow}  alt="evolution chain"/> : ''      
            }
            <figure>
            <figcaption>{upperCase(pokemon.species.name)}</figcaption>
            <img
                alt={pokemon.species.name}
                src={pokemon.sprites.front_default} />
            </figure>
        </div>
    )
}



