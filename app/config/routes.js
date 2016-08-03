import React from 'react';
import MainWrapper from '../components/MainWrapper.jsx';
import Home from '../components/Home.jsx';
import AddAllUsers from '../components/AddAllUsers.jsx';
import { Route, IndexRoute } from 'react-router';

export default (
  <Route>
    <Route path="/" component={MainWrapper}>
      <IndexRoute component={Home} />
    </Route>
    <Route path="/add-all" component={AddAllUsers}></Route>
  </Route>
);
