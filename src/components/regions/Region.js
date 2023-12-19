import './region.scss';
import {useEffect, useState } from 'react';
import Regions from './Regions';
import { usePokemonUpdate } from '../../service/PokemonContext';


var Pokedex = require('pokedex-promise-v2');
var options = {
    protocol: 'https',
    hostName: 'pokeapi.co',
    versionPath: '/api/v2/',
    cacheLimit: 100 * 100000, // 100s
    timeout: 10 * 1000 // 5s
  }
var P = new Pokedex(options);

export default function Region() {
    const [region, setRegion] = useState(null);
    const [currentRegion, setCurrentRegion] = useState(null)
    const [loading, setLoading] = useState(true);
    const updatePokemon = usePokemonUpdate();

    useEffect(() => {
        const abortController = new AbortController();
        P.getRegionsList()
        .then(res => {
            setRegion(res.results);
            setCurrentRegion(res.results[0].name)
        })
        .catch(function(error) {
            console.log('There was an ERROR: ', error);
        });
        return () => {
            abortController.abort(); // cancel pending fetch request on component unmount
        };
    }, [])

    const regionList = () => { 
        const handleClick = (name) => {
            console.log('reset')
            updatePokemon('reset')
            setCurrentRegion(name)
        }
        return (
            region.map((obj, i) => (
                <li
                    key={`${obj.name}-${i}`}>
                    <button 
                        onClick={() => handleClick(obj.name)}>
                        {obj.name.charAt(0).toUpperCase() + obj.name.slice(1)}
                    </button>
                </li>
            ))
        )
    }

    useEffect(()=> {
        if(region !== null) {
            setLoading(false)
        }

    }, [region])

    if (loading) {
        return (
            <div className="kanto">
                <p>loading</p>
            </div>
        )
    }

    return (
        <div className="landing">
            <ul className="region-list">
                {regionList()}
            </ul>
            {region.filter(obj => obj.name === currentRegion).map((obj, i) => (
                <Regions
                    key={obj.name}
                    regionName={obj.name}
                    url={`https://pokeapi.co/api/v2/region/${obj.name}`}
                    P={P} 
                    />
            ))}
        </div>
    )
}