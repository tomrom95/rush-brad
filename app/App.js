import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './config/routes';
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyB-P_XzKBAS4eV73yEsPrYgpQ-GbBVJtUE",
  authDomain: "rush-brad.firebaseapp.com",
  databaseURL: "https://rush-brad.firebaseio.com",
  storageBucket: "rush-brad.appspot.com",
};
firebase.initializeApp(config);

ReactDOM.render(
  <Router history={browserHistory}>{routes}</Router>,
  document.getElementById('app')
)
