import React from 'react';
import AddRushee from '../components/AddRushee.jsx';
import TodoApp from '../components/TestTodo.jsx';
import Home from '../components/Home.jsx';
import { Route } from 'react-router';

export default (
  <Route>
    <Route path="/" component={Home}></Route>
    <Route path="/add-rushee" component={AddRushee}></Route>
    <Route path="/todoapp" component={TodoApp}></Route>
  </Route>
);
