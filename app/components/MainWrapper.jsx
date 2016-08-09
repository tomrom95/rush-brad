import React from 'react';
import { RouteHandler } from 'react-router';
import firebase from 'firebase';

class MainWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database();
    firebase.auth().onAuthStateChanged(function(user_obj) {
      if (user_obj) {
        this.setState({user: user_obj});
      }
    }.bind(this));
  }

  login() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var user = result.user;
      console.log(user);
      this.firebaseRef.ref('users/' + user.uid).set({
        'displayName': user.displayName,
      });
    }.bind(this)).catch(function(error) {
      console.log(error.message);
    });
  }

  render() {
    if (this.state.user) {
      return (
        <div className="main-container">
          {this.props.children}
        </div>
      );
    } else {
      return (
        <div>
          <h4>Please log into Rush Brad</h4>
          <button className="btn btn-primary" onClick={this.login.bind(this)}>
            Login
          </button>
        </div>
      );
    }
  }

}

export default MainWrapper;
