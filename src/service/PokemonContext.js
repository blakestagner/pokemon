import { useState, createContext, useContext } from 'react';
//import {pokemonData, pokemonData2} from '../components/Helper';



export const PokemonContext = createContext(null);
export const PokemonUpdate = createContext(null);
export const FormsContext = createContext(null);
export const FormsUpdate = createContext(null);
export const SwitchFormsUpdate = createContext(null);
export const FormDetails = createContext(null);

export function usePokemon() {
  return useContext(PokemonContext)
}
export function usePokemonUpdate() {
  return useContext(PokemonUpdate)
}

export function useForms() {
  return useContext(FormsContext)
}

export function useFormsUpdate() {
  return useContext(FormsUpdate)
}
export function useSwitchForms() {
  return useContext(SwitchFormsUpdate)
}
export function useFormDetails() {
  return useContext(FormDetails)
}

export const PokemonProvider = ({children}) => {
  const [allForms, setAllForms] = useState(null)
  const [pokemon, setPokemon] = useState(null)
  const [formDetails, setFormDetails] = useState(null)


  function getPokemon(type, resPokemon) {
    if(type === 'reset') {
      setPokemon(null);
      setAllForms(null);
      setFormDetails(null);
    } else {
      setPokemon(resPokemon)
    }
  }

  function getForms(form) {
    //console.log(form)
    form && setAllForms(form)
  }

  function switchForms(index, objKey, imageIndex) {
    allForms && setFormDetails(allForms[index][objKey][imageIndex])
  }

  //useEffect(() => {
  //  console.log(allForms)
  //}, [allForms])

  //useEffect(() => {
  //  console.log(formDetails)
  //}, [formDetails])

  return (
    <PokemonContext.Provider value={pokemon}>
      <PokemonUpdate.Provider value={getPokemon}>
        <FormsContext.Provider value={allForms}>
          <FormsUpdate.Provider value={getForms}>
            <SwitchFormsUpdate.Provider value={switchForms}>
              <FormDetails.Provider value={formDetails}>
                {children}
              </FormDetails.Provider>
            </SwitchFormsUpdate.Provider>
          </FormsUpdate.Provider>
        </FormsContext.Provider>
      </PokemonUpdate.Provider>
    </PokemonContext.Provider>
  )
}
