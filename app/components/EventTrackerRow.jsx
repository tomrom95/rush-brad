import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

const LABEL_MAPPING = {"Yes": true, "?": null, "No": false};

class EventTrackerRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attended: null,
      markedBy: null
    };
  }

  componentWillMount() {
    console.log(this.props.eventInfo);
    this.firebaseRef = firebase.database().ref(
      'rushees/' + this.props.rusheeKey + '/events/' + this.props.eventInfo.key
    );
    this.firebaseRef.on('value', function(dataSnapshot) {
      var val = dataSnapshot.val();
      if (val == null) {
        return;
      }
      this.setState({
        attended: val.attended,
        markedBy: val.markedBy
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  setAttendance(status) {
    var user_id = firebase.auth().currentUser.uid;
    var user_ref = firebase.database().ref('users/' + user_id);
    user_ref.once('value', function(snap) {
      var user_name = snap.val().displayName;
      var newInfo = {
        attended: LABEL_MAPPING[status],
        markedBy: user_name
      };
      this.firebaseRef.set(newInfo);
      this.setState(newInfo);
    }.bind(this));
  }

  render() {
    var buttons = [];
    var statusList = ["Yes", "?", "No"];
    for (var i = 0; i < statusList.length; i++) {
      var status = statusList[i];
      var classes = "btn btn-secondary";
      if (LABEL_MAPPING[status] == this.state.attended) {
        classes += " attended";
      }
      buttons.push(
        <button
          key={status}
          type="button"
          className={classes}
          onClick={this.setAttendance.bind(this, status)}
        >
          {status}
        </button>
      );
    }
    return (
      <div className="row">
        <div className="col-xs-6 event-label">
          <p><strong>{this.props.eventInfo.name}</strong></p>
        </div>
        <div className="col-xs-6 tooltip">
          <div className="input-group forcez">
            <div className="input-group-btn">
              {buttons}
            </div>
          </div>
          {
            this.state.markedBy == null ?
              null :
              <span className="tooltiptext">
                <p><strong>Marked by: </strong>{this.state.markedBy}</p>
              </span>
          }
        </div>
      </div>
    );
  }

}

export default EventTrackerRow;
