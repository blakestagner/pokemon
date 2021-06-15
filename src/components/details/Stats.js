import {useState, useEffect} from 'react';
import './details.scss';
import {
        useFormDetails, 
    } from '../../service/PokemonContext';

export default function Stats() {
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
    
    const totalStat = () => {
        let total = 0;
        pokemonForm.details.stats.forEach((stat) => {
            total += stat.base_stat
        })
        return total;
    }

    const statPercentage = (stat) => {
        return (stat / 200) * 100;
    }

    const cleanText = (name) => {
        let lowerd = name.replaceAll("-", ' ').split(' ');
        let cap = lowerd.map(obj => (
            obj.charAt(0).toUpperCase() + obj.slice(1)
        )).join(" ")
        return cap
    }

    return (
        <div className="detail-box stat">
            <p>Stats</p>
            <ul> 
                {pokemonForm.details.stats.map((stat, i) => (
                    <li key={`${stat.stat.name}`}>
                        <div className="stat-bar">
                            <label htmlFor={stat.stat.name}>
                                <p><span>{cleanText(stat.stat.name)}:</span> {stat.base_stat}</p>
                            </label>
                            <p><span>EV:</span> {stat.effort}</p>
                            <progress id={stat.stat.name} value={statPercentage(stat.base_stat)} max="100"></progress>
                        </div>
                    </li>
                ))}
            </ul>
            <h3><span>Total:</span> {totalStat()}</h3>
        </div>
    )
}