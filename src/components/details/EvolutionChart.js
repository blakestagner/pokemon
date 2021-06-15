import {useState, useEffect} from 'react';
import './details.scss';
import {pokemonEvolution} from '../Helper';
import PokemonEvolution from './PokemonEvolution';

export default function EvolutionChart({evolution, P}) {
    const [loading, setLoading] = useState(true);
    const [chain, setChain] = useState(null);
    const [pokemon, setPokemon] = useState(null);

    const alph = 'abcdefghijklmnopqrzwxyz';

    useEffect(()=> {
        pokemonEvolution(evolution)
        .then(res => {
            setChain(res.chain)
        })
        .catch(err => console.log(err))
    }, [evolution])

    useEffect(()=> {
        const evolutionChain = []
        if(chain) {
            evolutionChain.push(
                {
                    id: '1',
                    name: chain.species.name,
                    details: chain.evolution_details,
                    url: chain.species.url
                }
            )
            if(chain.evolves_to.length > 0) {
                if(chain.evolves_to.length > 1) {
                    chain.evolves_to.forEach((obj, i) => {
                        if(obj.evolves_to.length > 0) {
                            evolutionChain.push(
                                {
                                    id: `2${alph.charAt(i)}`,
                                    name: obj.species.name, 
                                    details:  obj.evolution_details[0],
                                    url: obj.species.url
                                }
                            )
                            obj.evolves_to.forEach(path => {
                                evolutionChain.push(
                                    {
                                        id: `3${alph.charAt(i)}`,
                                        name: path.species.name, 
                                        details:  path.evolution_details[0],
                                        url: path.species.url
                                    }
                                )
                            })
                        } else {
                            evolutionChain.push(
                                {
                                    id: `2${alph.charAt(i)}`,
                                    name: obj.species.name, 
                                    details:  obj.evolution_details[0],
                                    url: obj.species.url
                                }
                            )
                        }
                    });
                } else {
                    evolutionChain.push(
                        {
                            id: '2',
                            name: chain.evolves_to[0].species.name,
                            details: chain.evolves_to[0].evolution_details[0],
                            url: chain.evolves_to[0].species.url
                        }
                    )
                    if(chain.evolves_to[0].evolves_to.length > 1) {
                        chain.evolves_to[0].evolves_to.forEach((obj, i) => {
                            evolutionChain.push(
                                {
                                    id: `3${alph.charAt(i)}`,
                                    name: obj.species.name,
                                    details: obj.evolution_details[0],
                                    url: obj.species.url
                                }
                            )
                        })
                    } else if ((chain.evolves_to[0].evolves_to.length === 1)) {
                        evolutionChain.push(
                            {
                                id: `3`,
                                name: chain.evolves_to[0].evolves_to[0].species.name,
                                details: chain.evolves_to[0].evolves_to[0].evolution_details[0],
                                url: chain.evolves_to[0].evolves_to[0].species.url
                            }
                        )
                    }
                }

            }
            setPokemon(evolutionChain)
        }
    }, [chain])

    useEffect(() => {
        
        if(pokemon) {
            setLoading(false)
        }
    }, [pokemon])

    if(loading) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className="detail-box">
            <p>Evolution</p>
            <ul className="evolution">
                {pokemon.map((obj, i) => (
                    <li key={obj.name}
                        onClick={() => console.log(obj.url, (obj.id - 1))}
                        className={`evolution-${obj.id}`}>
                        <PokemonEvolution
                            evolutionDetails={obj}
                            P={P}
                            pokemonUrl={obj.url}
                            />
                    </li>
                ))}
        
            </ul>
        </div>
    )
}