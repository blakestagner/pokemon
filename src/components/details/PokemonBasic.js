import {useState, useEffect } from 'react';
import './details.scss';
import Type from './Type';
import {upperCase, pokemonData, pokemonData2, pokemonImage} from '../Helper';
import {usePokemonUpdate} from '../../service/PokemonContext';

export default function PokemonBasic({P, pokemonUrl}) {
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
            return () => {
                abortController.abort(); // cancel pending fetch request on component unmount
            };
        })
        const pokemonFetchTwo = new Promise(resolve => {
            pokemonData(pokemonUrl)
            .then(res => {
                resolve(res)
            })
            .catch(err => console.log(err));
            return () => {
                abortController.abort(); // cancel pending fetch request on component unmount
            };
        })

        Promise.all([pokemonFetch, pokemonFetchTwo])
        .then(([first, second]) => {
            setPokemon({...first, ...second})
        }).catch(err => console.log(err))
    }, [P, pokemonUrl])


    useEffect(()=> {
        if(pokemon) {
            setLoading(false)
        }
    }, [pokemon])



    const handleClick = () => {
        getPokemon('details', pokemon)
    }

    if(loading) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <>
        <div
            onClick={handleClick} 
            className="pokemon-basic glass">
            <p className="pk-number">{pokemon.id}</p> 
            <img
                alt={pokemon.species.name}
                className="basic-img" 
                src={pokemonImage(pokemon)} />
                <p>{upperCase(pokemon.species.name)}</p>
            <Type types={pokemon.types}/>
        </div>
        </>
    )
}



