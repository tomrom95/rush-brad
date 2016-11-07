import React from 'react';
import MainWrapper from '../components/MainWrapper.jsx';
import Home from '../components/Home.jsx';
import AddRushee from '../components/AddRushee.jsx';
import RusheeDetail from '../components/RusheeDetail.jsx';
import { Route, IndexRoute } from 'react-router';

export default (
  <Route>
    <Route path="/" component={MainWrapper}>
      <IndexRoute component={Home} />
      <Route path="/add-rushee" component={AddRushee}></Route>
      <Route path="detail/:rusheeIndex" component={RusheeDetail} />
    </Route>
  </Route>
);
