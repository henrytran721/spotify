import React from 'react';
import './App.css';
import Spotify from './views/Spotify';
import TopTracks from './views/TopTracks';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
      <Switch>
      <Route path='/toptracks/'>
        <TopTracks />
      </Route>
        <Route path='/'>
          <Spotify />
        </Route>
      </Switch>
    </Router>
    </div>
  );
}

export default App;
