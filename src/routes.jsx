import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import AndroidPage from './android';
import NimbledroidGraphPage from './nimbledroid/NimbledroidGraphPage';
import Quantum from './quantum/Quantum';
import TP6 from './quantum/TP6';
import TP6M from './android/TP6m';
import Power from './power';
import Playback from './playback/playback';
import PlaybackDetails from './playback/details';
import Subtests from './quantum/subtests';

const NoMatch = () => <div>404</div>;
const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/quantum/tp6" component={TP6} />
      <Route path="/quantum/tp6m" component={TP6M} />
      <Route path="/android/tp6m" component={TP6M} />
      <Route path="/android/graph" component={NimbledroidGraphPage} />

      <Route path="/android" component={AndroidPage} />
      <Route path="/power" component={Power} />
      <Route path="/playback/details" component={PlaybackDetails} />
      <Route path="/playback" component={Playback} />
      <Route path="/quantum/subtests" component={Subtests} />
      <Route path="/quantum/:bits" component={Quantum} />
      <Route path="/" component={Home} />
      <Route component={NoMatch} />
    </Switch>
  </BrowserRouter>
);

Routes.propTypes = {
  location: PropTypes.object,
};

export default Routes;
