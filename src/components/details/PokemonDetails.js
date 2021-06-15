import {useState, useEffect} from 'react';
import './details.scss';
import PokemonImage from './PokemonImage';
import Type from '../details/Type';
import Stats from '../details/Stats';
import Abilities from '../details/Abilities';
import EvolutionChart from '../details/EvolutionChart';
import Training from './Training';
import {upperCase, genera, pokemonData} from '../Helper';
import {
        usePokemon, 
        usePokemonUpdate, 
        useFormsUpdate,
        useSwitchForms,
        useFormDetails,
        useForms
        } from '../../service/PokemonContext';

export default function PokemonDetails({P}) {
    const [loading, setLoading] = useState(true);
    const [normalForm, setNormalForm] = useState(null);
    const [allForms, setForms] = useState(null);
    const pokemon = usePokemon();
    const updatePokemon = usePokemonUpdate();
    const formsUpdate = useFormsUpdate();
    const switchForm = useSwitchForms();
    const formDetails = useFormDetails()
    const pokemonForms = useForms();
    const weightHeight = (num) => {
        return Math.round((num * 0.1) * 10 ) / 10;
    }


    useEffect(() => {
        pokemonData(pokemon.species.url)
        .then(res => {
            console.log(res)
            setNormalForm(res)
        })
        .catch(err => console.log('There was an ERROR: ', err));
        
    }, [pokemon])


    useEffect(()=> {
        if (normalForm) {
            var pokemonName = pokemon.species.name;
            var path = `${process.env.PUBLIC_URL}/pkmon/poke_capture_`;

            const pokemonDetails = async (url) => {
                return await pokemonData(url)
                .then(res => {
                    var result = {...res, ...normalForm}
                    return result;
                })
                .catch(err => console.log(err));
            }
            
            if(pokemon) {

                const pokemonId = () => {
                    var id = pokemon.id;
                    var digitLen = id.toString().length;
                    var newId = {
                        1: `000${id}`,
                        2: `00${id}`,
                        3: `0${id}`
                    }
                    return newId[digitLen]
                }


                const pokemonImage = (pokemon) => {
                    const gender = () => {
                        var genderDif = pokemon.has_gender_differences;
                        var genderRate = pokemon.gender_rate;
                        var varieties = pokemon.varieties.filter(obj => {
                            return obj.pokemon.name.includes('-male')
                        });
                
                        if( genderDif && varieties.length === 0) {
                            return 'md_n_00000000_f_n.png'
                        } else if((!genderDif && genderRate === 0) || (genderDif && genderRate === 4)) {
                            return 'mo_n_00000000_f_n.png'
                        } else if(!genderDif && genderRate === 8 ) {
                            return 'fo_n_00000000_f_n.png'
                        } else if(!genderDif && genderRate >= 1) {
                            return 'mf_n_00000000_f_n.png'
                        } else return 'uk_n_00000000_f_n.png'
                    }
                    return `${path}${pokemonId()}_000_${gender()}`
                }

                const prettyText = (name) => {
                    let capName = name.charAt(0).toUpperCase() + name.slice(1)
                    let lowerd = name.replace(`${pokemonName}`, '').replaceAll("-", ' ').split(' ');
                    let cap = lowerd.map(obj => (
                        obj.charAt(0).toUpperCase() + obj.slice(1)
                    )).join(" ")
                    return cap.length !== 0 ? cap : capName
                }

                const pokemonForms = () => {
                    console.log(pokemon)
                    var genderDif = pokemon.has_gender_differences;
            
                    var otherVariates = pokemon.varieties.filter(obj => {
                        let form = !obj.pokemon.name.includes('-mega') 
                        && !obj.pokemon.name.includes('mega-') 
                        && !obj.pokemon.name.includes('gmax') 
                        && !obj.pokemon.name.includes('fmale')
                        && !obj.pokemon.name.includes('male')
                        && !obj.pokemon.name.includes('alola')
                        && !obj.pokemon.name.includes('galar');
                        return form;
                    })
            
                    var regionalVariates = pokemon.varieties.filter(obj => {
                        let form = obj.pokemon.name.includes('alola') 
                        || obj.pokemon.name.includes('galar')
                        return form;
                    })
            
                    var genderFormDif = pokemon.varieties.filter(obj => {
                        return obj.pokemon.name.includes('male')
                    });
                    var mega = pokemon.varieties.filter(obj => {
                        let form = obj.pokemon.name.includes('-mega') 
                        || obj.pokemon.name.includes('mega-') 
                        || obj.pokemon.name.includes('primal');
                        return form; 
                    })
                    var gmax = pokemon.varieties.filter(obj => {
                        return obj.pokemon.name.includes('gmax')
                    })
            
                    let forms = [];
                    let region = {'region': []};
                    let normal = {'normal': []};
                    let megas = {'mega': []};
                    let gmaxs = {'gmax': []};

//Get any other veriaties

//get regional forms
                    const isRegionalVariates = new Promise ((resolve, reject) => {
                        if(regionalVariates.length > 0 && pokemon.name !== 'pikachu') {
                            var url = pokemon.gender_rate === -1 
                            ? 'uk_n_00000000_f_n.png' : 'mf_n_00000000_f_n.png';
                            regionalVariates.forEach(async (obj, i) => {
                                return await pokemonDetails(obj.pokemon.url)
                                .then(res => {
                                    region.region.push(
                                        {
                                            'type': `${obj.pokemon.name.replace(`${pokemonName}-`, '')}`, 
                                            'url': `${path}${pokemonId()}_00${i+1}_${url}`,
                                            'details': res
                                        }
                                    )
                                })
                                .then(() => {
                                    return regionalVariates.length === i+1 ? resolve(region) : ''
                                })
                                .catch(err => console.log(err))
                            })
                        } else reject()
                    })
//Get gender differnece
                    const primaryForms = new Promise ((resolve, reject) => {
                        var url = pokemon.gender_rate === -1 
                            ? 'uk_n_00000000_f_n.png' 
                                : pokemon.gender_rate === 8
                                    ? 'fo_n_00000000_f_n.png' 
                                        : pokemon.gender_rate === 0 ? 
                                        'mo_n_00000000_f_n.png' : 'mf_n_00000000_f_n.png';

                        if(genderDif && genderFormDif) {
                            if(genderFormDif.length > 0) {
                                genderFormDif.forEach((obj, i) => {
                                    let maleFemale = obj.pokemon.name.includes('-male') 
                                        ? 'Male' : 'Female';
                                    let urlGen = maleFemale === 'Male'
                                        ? 'mo_n_00000000_f_n.png' : 'fo_n_00000000_f_n.png';
                                    normal.normal.push(
                                        {
                                            'type': `${maleFemale}`, 
                                            'url': `${path}${pokemonId()}_00${(i-1)+1}_${urlGen}`,
                                            'details': pokemon
                                        }
                                    )
                                    return genderFormDif.length === i+1 ? resolve(normal) : '';
                                })
                            } else if(genderDif) {
                                console.log('genderrr')
                                normal.normal.push(
                                    {
                                        'type': `Male`, 
                                        'url': `${path}${pokemonId()}_000_md_n_00000000_f_n.png`,
                                        'details': pokemon
                                    },
                                    {
                                        'type': `Female`, 
                                        'url': `${path}${pokemonId()}_000_fd_n_00000000_f_n.png`,
                                        'details': pokemon
                                    }
                                )
                                return resolve(normal);
                            } 
                        } else if((otherVariates.length > 0) && (pokemonName !== 'pichu')) {

                            const formId = (id) => {
                                var digitLen = id.toString().length;
                                var newId = {
                                    1: `00${id}`,
                                    2: `0${id}`,
                                }
                                return newId[digitLen]
                            }


                            async function getOtherVariates() {
                                for (const obj of otherVariates) {
                                    const res = await pokemonDetails(obj.pokemon.url);
                                    normal.normal.push(
                                        {
                                            'type': `${prettyText(obj.pokemon.name)}`, 
                                            'url': `${path}${pokemonId()}_${formId(normal.normal.length)}_${url}`,
                                            'details': res
                                        }
                                    )
                                }
                                resolve(normal)
                              }
                              getOtherVariates()

                        } else reject()
                    })
//Get mega evolution Info
                    const isMega = new Promise ((resolve, reject) => {
                        if(mega.length > 0 ) {
                            let url = pokemon.gender_rate === -1 
                            ? 'uk_n_00000000_f_n.png' : 'mf_n_00000000_f_n.png';
        
                            if(mega.length === 1 ) {
                                pokemonDetails(mega[0].pokemon.url)
                                .then(res => {
                                    megas.mega.push(
                                        {
                                            'type': 'Mega', 
                                            'url': `${path}${pokemonId()}_001_${url}`,
                                            'details': res
                                        }
                                    )
                                })
                                .then(() => {
                                    resolve(megas)
                                })
                                .catch(err => console.log(err))
                            } else {
                                mega.forEach(async (obj, i) => {
                                    return await pokemonDetails(obj.pokemon.url)
                                    .then(res => {
                                        megas.mega.push(
                                            {
                                                'type': `${prettyText(obj.pokemon.name)}`, 
                                                'url': `${path}${pokemonId()}_00${i+1}_${url}`,
                                                'details': res
                                            }
                                        )
                                    })
                                    .then(() => {
                                        return mega.length === i+1 ? resolve(megas) : ''
                                    })
                                    .catch(err => console.log(err))
                                })
                            }
                        } else reject()
                    })
//Get GMAX Info
                    const isGmax = new Promise ((resolve, reject) => {
                        if(gmax.length > 0 ) {
                            let url = pokemon.gender_rate === -1 
                            ? 'uk_g_00000000_f_n.png' : 'mf_g_00000000_f_n.png';
                            gmax.forEach(async (obj, i) => {
                                return await pokemonDetails(obj.pokemon.url)
                                    .then(res => {
                                        gmaxs.gmax.push(
                                            {
                                                'type': `${prettyText(obj.pokemon.name)}`,
                                                'url': `${path}${pokemonId()}_00${(i-1)+1}_${url}`,
                                                'details': res
                                            }
                                        )
                                    })
                                    .then(() => {
                                        return gmax.length === i+1 ? resolve(gmaxs) : '';
                                    })
                                    .catch(() => reject())
                            })
                        } else reject()
                    })

                    const promises = [
                        primaryForms,
                        isRegionalVariates,
                        isMega,
                        isGmax,
                        
                    ]
                    Promise.allSettled(promises)
                    .then(results => {
                        results.forEach((result) => {
                            return result ? forms.push(result.value) : '';
                        })
                    })
                    .then(() => {
                        var filtered = forms.filter((obj) => obj !== undefined)
                        setForms(filtered);
                    })
                }
                pokemonForms()
            }
        }
    }, [normalForm, pokemon])


    useEffect(()=> {
        if(allForms) {
            formsUpdate(allForms)
        }
    }, [allForms])

    useEffect(() => {
        console.log(pokemonForms)
        pokemonForms && switchForm(0, 'normal', 0)
    }, [pokemonForms])

    useEffect(() => {
        console.log(formDetails)
        formDetails && setLoading(false)
    }, [formDetails])

    if(loading) {
        return (
            <p>Loadings</p>
        )
    }

    return (
        <div
            className="pokemon-details">
            <button onClick={() => updatePokemon('reset')}>Back</button>
            <p className="">{pokemon.id}</p>
            <p className="name">{upperCase(pokemon.species.name)}</p> 
            <PokemonImage />
            <div className="basic-info">
                <p id=""></p>
                <p id="species"><span>Species: </span>{genera(pokemon.genera)}</p>
                <p id="weight"><span>Weight: </span>{weightHeight(pokemon.weight)} kg</p>
                <p id="height"><span>Height: </span>{weightHeight(pokemon.height)} m</p>
                <Type types={pokemon.types}/>
            </div>
            <div className="flex-container">
                <Stats />
                <Abilities />
                <Training/>
            </div>
            <EvolutionChart
                P={P}
                evolution={pokemon.evolution_chain.url}
                />
        </div>
    )
}



