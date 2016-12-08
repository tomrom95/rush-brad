import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import FeedRow from './FeedRow.jsx';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref('feed')
      .orderByChild('date')
      .limitToLast(20);
    this.firebaseRef.on('value', function(dataSnapshot) {
      var events = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var feedEvent = childSnapshot.val();
        feedEvent['.key'] = childSnapshot.key;
        events.push(feedEvent);
      }.bind(this));
      events.reverse();
      this.setState({
        events: events
      });
    }.bind(this));
  }

  render() {
    var createEventRow = function(feedEvent, index) {
      return (
        <FeedRow key={feedEvent['.key']} feedEvent={feedEvent}/>
      );
    };
    return (
      <div>
        <h2>Feed</h2>
        <table className="table table-hover">
          <tbody>
            {this.state.events.map(createEventRow)}
          </tbody>
        </table>
      </div>
    );
  }

}

export default Feed;
