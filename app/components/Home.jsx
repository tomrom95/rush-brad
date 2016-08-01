import React from 'react';
import RusheeCard from './RusheeCard.jsx';
import { Link } from 'react-router';
import FbApp from './FirebaseInit.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rushees: [],
    };
  }

  componentWillMount() {
    this.firebaseRef = new Firebase(
      'https://rush-brad.firebaseio.com/rushees'
    );
    this.firebaseRef.on('value', function(dataSnapshot) {
      var rushees = [];
      dataSnapshot.forEach(function(childSnapshot) {
        console.log('Rushee!');
        console.log(childSnapshot.key())
        var rushee = childSnapshot.val();
        rushee['.key'] = childSnapshot.key();
        rushees.push(rushee);
      }.bind(this));

      this.setState({
        rushees: rushees
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    var self = this;
    var createRushee = function(rushee, index) {
      console.log('key: = ' + rushee['.key']);
      return (
        <RusheeCard key={rushee['.key']} rusheeKey={rushee['.key']} />
      );
    };
    return (
      <div className="container-fluid">
        <div className="row">
          { this.state.rushees.map(createRushee) }
        </div>
      </div>
    );
  }

}

export default Home;
