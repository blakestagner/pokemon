import {useState, useEffect} from 'react';
import './details.scss';
import {
    useFormDetails, 
} from '../../service/PokemonContext';

export default function Type({types}) {
    const [loading, setLoading] = useState(true)
    const pokemonForm = useFormDetails();

    useEffect(() => {
        if(pokemonForm || types) {
            setLoading(false)
        }
    }, [pokemonForm, types])

    const pokemonType = types ?? pokemonForm.details.types;

    if(loading) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className="type">
            {pokemonType.map((type, i) => (
                <p 
                    key={type.type.name}
                    className={type.type.name}>
                    {type.type.name}
                </p>
            ))}
        </div>
    )
}