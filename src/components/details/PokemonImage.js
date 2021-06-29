import {useState, useEffect} from 'react';
import './details.scss';
import {
        useSwitchForms,
        useForms, 
        usePokemon} from '../../service/PokemonContext';

export default function PokemonImage() {
    const [loading, setLoading] = useState(true);
    const [varieties, setVarieties] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePosition, setImagePosition] = useState(null);
    const [pokemonKey, setPokemonKey] = useState(['normal']);
    const [pokemonIndex, setPokemonIndex] = useState(0);
    const getForms = useForms();
    const pokemon = usePokemon();
    const setForm = useSwitchForms();


    useEffect(() => {
        if(getForms) {
            setVarieties(getForms)
            setImagePosition(0)
            setImage(getForms[0].normal)
            console.log()
        }
    }, [getForms])

    useEffect(() => {
        if(image) {
            setLoading(false)
        }
    }, [image])


    const formsTab = () => {
        const handleClick = (obj) => {
            setImagePosition(0);
            var objectKey = Object.keys(obj);
            setPokemonKey(objectKey);
            var objectIndex = getForms.findIndex(key => key[objectKey]);
            setPokemonIndex(objectIndex);
            setImage(varieties[objectIndex][objectKey])
            setForm(objectIndex, objectKey[0], 0)
        }
        return (
            <ul className="varients-tab glass">
                {
                varieties.map((obj, i) => (
                    <li 
                        className={
                            Object.keys(obj)[0] === pokemonKey[0] 
                                ? 'active' : ''
                        }
                        key={`${Object.keys(obj)[0]}-${i}`}>
                        <button 
                            onClick={() => handleClick(obj)}>
                            {Object.keys(obj)}
                        </button>
                    </li>
                ))}
            </ul>
        )
    }

    const subForm = () => {
        const handleClick = (obj) => {
            var imageIndex = image.indexOf(obj)
            setImagePosition(imageIndex)
            setForm(pokemonIndex, pokemonKey, imageIndex)
        }
        const prettyName = (name) => {
            return (name.charAt(0).toUpperCase() + name.slice(1)).replace('-', ' ')
        }

        return (
            <ul 
                className={image.length > 1 ? 'glass overflow-y' : ''}>
            {image.map((obj, i) => (
                image.length > 1 
                    ?
                        <li
                            className={
                                image.indexOf(obj) === imagePosition 
                                    ? 'active' : ''}
                            key={i}>
                            <button 
                                onClick={() => handleClick(obj)}>
                                    {prettyName(obj.type)}
                            </button>
                        </li>
                    : ''
                ))
            }
            </ul>
        )
    }


    if(loading) {
        return (
            <p>Loading</p>
        )
    }

    return (
        <div className="details-image-container">
            {getForms.length > 1 
                ? formsTab() : getForms[0].normal.length > 1
                    ? formsTab() : '' }
            <img
                alt={pokemon.id}
                className="detail-img" 
                src={image[imagePosition].url} />
            {subForm()}
        </div>
    )
}

