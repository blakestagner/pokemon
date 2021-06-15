import {useState, useEffect} from 'react';
import './details.scss';
import {
    useFormDetails, 
} from '../../service/PokemonContext';

export default function Abilities() {
    const [loading, setLoading] = useState(true);
    const [abilityDetails, setAbilityDetails] = useState(null)
    const pokemonForm = useFormDetails();


    useEffect(()=> {
        if(pokemonForm) {
            const pokemonName = pokemonForm.details.name;
            const abilityFetch = async (url) => {
                return await fetch(url)
                .then(response => response.json())
                .then(jsonData => {
                    if(jsonData.effect_entries.length > 0) {
                        var englishIndex = jsonData.effect_entries.findIndex(key => key.language.name === 'en');
                        var hidden = jsonData.pokemon.findIndex(key => key.pokemon.name.includes(pokemonName));
                        var fetchData;
                        fetchData = 
                            {
                                'name': jsonData.name, 
                                'text': jsonData.effect_entries[englishIndex].effect,
                                'short': jsonData.effect_entries[englishIndex].short_effect,
                                'hidden': jsonData.pokemon[hidden].is_hidden
                            }
                        return fetchData
                    } else {
                        fetchData = 
                            {
                                'name': jsonData.name, 
                                'text': jsonData.flavor_text_entries[0].flavor_text,
                                'short': jsonData.flavor_text_entries[0].flavor_text,
                                'hidden': false
                            }
                        return fetchData
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
            }


            const asyncAbility = async () => {
                var abilityArray = [];
                return new Promise(resolve => {
                    pokemonForm.details.abilities.map( async (obj, i) => {
                        var result = await abilityFetch(obj.ability.url)
                        abilityArray.push(result)
                        return i +1 === pokemonForm.details.abilities.length 
                            ? resolve(abilityArray) : ''
                    })
                })
            }

            asyncAbility()
            .then(res => {
                if(res.length > 0) {
                    setAbilityDetails(res)
                }
                else setAbilityDetails({
                    'name': 'none',
                    'text': 'none',
                    'short': 'none',
                    'hidden': 'false'
                })
            })
        } else setLoading(true)
    }, [pokemonForm]);

    useEffect(() => {
        if(abilityDetails) {
            setLoading(false)
        }
    }, [abilityDetails])


    const cleanText = (name) => {
        let lowerd = name.replaceAll("-", ' ').split(' ');
        let cap = lowerd.map(obj => (
            obj.charAt(0).toUpperCase() + obj.slice(1)
        )).join(" ")
        return cap
    }


    if(loading) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className="detail-box abilities">
            <p>Abilities</p>
            <ul>
            {abilityDetails.map((obj, i) => (
                <li key={`${obj.name}`}>
                    <p>
                        <span>Ability:</span> {cleanText(obj.name)} {obj.hidden ? '(hidden)' : ''}
                    </p>
                    <p>{obj.short}</p>
                </li>
            ))}
            </ul>
        </div>
    )
}