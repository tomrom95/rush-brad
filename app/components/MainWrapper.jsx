import React from 'react';
import { RouteHandler, Link } from 'react-router';
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
      this.firebaseRef.ref('users/' + user.uid).set({
        'displayName': user.displayName,
      });
    }.bind(this)).catch(function(error) {
      console.log(error.message);
    });
  }

  render() {
    if (this.state.user) {
      console.log("here");
      return (
        <div>
          <nav className="navbar navbar-light bg-faded navbar-fixed-top">
            <button className="navbar-toggler hidden-lg-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button>
            <div className="collapse navbar-toggleable-md" id="navbarResponsive">
              <a className="navbar-brand" href="#">Rush Brad</a>
              <ul className="nav navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/add-rushee" className="nav-link">Add Rushee</Link>
                </li>
              </ul>
            </div>
          </nav>
          <div className="main-container">
            {this.props.children}
          </div>
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
