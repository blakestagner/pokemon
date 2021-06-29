import {useState, useEffect} from 'react';
import './details.scss';
import {
        useFormDetails, 
    } from '../../service/PokemonContext';
import Type from './Type';

export default function BasicInfo() {
    const [loading, setLoading] = useState(true);
    const pokemonForm = useFormDetails();

    useEffect(() => {
        if(pokemonForm) {
            setLoading(false)
        }
    }, [pokemonForm])

    const weightHeight = (num) => {
        return Math.round((num * 0.1) * 10 ) / 10;
    }

    const genera = (pokemon) => {
        console.log(pokemon)
        const filtered = pokemon.filter((obj) => 
            obj.language.name === "en" ? obj.genus : ''
        )
        return filtered[0].genus;
    }


    if(loading) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className="basic-info">
            {console.log(pokemonForm)}
            <p id=""></p>
            <p id="species"><span>Species: </span>{genera(pokemonForm.details.genera)}</p>
            <p id="weight"><span>Weight: </span>{weightHeight(pokemonForm.details.weight)} kg</p>
            <p id="height"><span>Height: </span>{weightHeight(pokemonForm.details.height)} m</p>
            <Type />
        </div>
    )
}