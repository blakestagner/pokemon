import './App.scss';
import { BrowserRouter as  Router, Switch, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Region from './components/regions/Region';
import {PokemonProvider} from './service/PokemonContext'

export default function App() {

  return (
    <div className="App">
      <PokemonProvider>
        <Router >
          <Switch >
            <Route exact path="/" component={Landing}/>
            <Route path="/region" component={Region}/> 
          </Switch>
        </Router>
        </PokemonProvider>
    </div>
  );
}
