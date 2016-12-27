import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import EventTrackerRow from './EventTrackerRow.jsx';

class EventTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.updateWithKey(nextProps.rusheeKey);
  }

  componentWillMount() {
    this.updateWithKey(this.props.rusheeKey);
  }

  updateWithKey(key) {
    this.firebaseRef = firebase.database().ref(
      'events'
    );
    this.firebaseRef.orderByKey().on('value', function(dataSnapshot) {
      var events = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var currEvent = childSnapshot.val();
        events.push({
          key: childSnapshot.key,
          name: currEvent.name,
        });
      }.bind(this));

      this.setState({
        events: events
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    var event_comps = [];
    for (var i = 0; i < this.state.events.length; i++) {
      var currEvent = this.state.events[i];
      event_comps.push(
        <EventTrackerRow key={currEvent.key} eventInfo={currEvent} rusheeKey={this.props.rusheeKey}/>
      );
    }
    return (
      <div className="row">
        {event_comps}
      </div>
    );
  }

}

export default EventTracker;
