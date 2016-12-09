import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import FeedRow from './FeedRow.jsx';

const LOAD_COUNT = 10;

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      initialized: false,
      moreToCome: true,
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref('feed').orderByChild('date');
    this.firebaseRef.limitToLast(LOAD_COUNT).once('value').then(function(dataSnapshot) {
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
    firebase.database().ref('feed').limitToLast(1).on('child_added', function(snapshot, prevKey) {
      if (this.state.initialized) {
        var events = this.state.events;
        var feedEvent = snapshot.val();
        feedEvent['.key'] = snapshot.key;
        events.unshift(feedEvent);
        this.setState({events: events});
      } else {
        this.setState({initialized: true})
      }
    }.bind(this));
  }

  addMore() {
    var lastEvent = this.state.events[this.state.events.length - 1];
    this.firebaseRef.endAt(lastEvent.date, lastEvent['.key'])
      .limitToLast(LOAD_COUNT).once('value').then(function(dataSnapshot) {
        var newEvents = [];
        dataSnapshot.forEach(function(childSnapshot) {
          var feedEvent = childSnapshot.val();
          feedEvent['.key'] = childSnapshot.key;
          newEvents.push(feedEvent);
        }.bind(this));
        newEvents.reverse();
        var moreToCome = newEvents.length == LOAD_COUNT;
        this.setState({
          events: this.state.events.concat(newEvents),
          moreToCome: moreToCome
        });
      }.bind(this));
  }

  render() {
    var createEventRow = function(feedEvent, index) {
      return (
        <FeedRow key={feedEvent['.key']} feedEvent={feedEvent}/>
      );
    };
    var loadButton = this.state.moreToCome ? (
      <div className="row load-row">
          <button
            className="btn btn-primary"
            onClick={this.addMore.bind(this)}
          >
          Load More
          </button>
      </div>
    ) : null;
    return (
      <div>
        <h2>Feed</h2>
        <table className="table table-hover">
          <tbody>
            {this.state.events.map(createEventRow)}
          </tbody>
        </table>
        {loadButton}
      </div>
    );
  }

}

export default Feed;
