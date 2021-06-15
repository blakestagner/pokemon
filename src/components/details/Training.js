import {useState, useEffect} from 'react';
import './details.scss';
import {
    useFormDetails, 
} from '../../service/PokemonContext';

export default function Training() {
    const [loading, setLoading] = useState(true);
    const pokemonForm = useFormDetails();
    
    useEffect(() => {
        if(pokemonForm) {
            setLoading(false)
        }
    }, [pokemonForm])

    if(loading) {
        return (
            <p>Loading</p>
        )
    }

    var happiness =  pokemonForm.details.base_happiness;
    var captureRate = pokemonForm.details.capture_rate;
    var baseExperience = pokemonForm.details.base_experience;
    var growth = pokemonForm.details.growth_rate.name.replace('-', ' ')

    return (
        <div className="detail-box training">
            <p>Training</p>
            <ul>
                <li>
                    <p id="happiness"><span>Base Happieness: </span>{happiness}</p>
                </li>
                <li>
                    <p id="capture"><span>Capture Rate: </span>{captureRate}</p>
                </li>
                <li>
                    <p id="experience"><span>Base Experience: </span>{baseExperience}</p>
                </li>
                <li>
                    <p id="growth"><span>Growth Rate: </span>{growth}</p>
                </li>
            </ul>
        </div>
    )
}