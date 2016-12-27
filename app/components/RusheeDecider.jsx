import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

const DECIDER_MAPPING = {"Yes": true, "Maybe": null, "Cut": false};

class RusheeDecider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
      rusheeStatus: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.updateWithKey(nextProps.rusheeKey);
  }

  componentWillMount() {
    this.updateWithKey(this.props.rusheeKey);
  }

  updateWithKey(key) {
    var userRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/admin');
    this.firebaseRef = firebase.database().ref('rushees/' + key + '/roundStatus');
    userRef.on('value', function(dataSnapshot) {
      var val = dataSnapshot.val();
      if (val != null) {
        this.setState({isAdmin: true});
      }
      this.firebaseRef.on('value', function(dataSnapshot) {
        this.setState({rusheeStatus: dataSnapshot.val()})
      }.bind(this));
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  setDecision(status) {
    var statusVal = DECIDER_MAPPING[status];
    this.firebaseRef.set(statusVal);
    this.setState({rusheeStatus: statusVal});
  }

  render() {
    if (!this.state.isAdmin) {
      return null;
    }
    var buttons = [];
    var statusList = ["Yes", "Maybe", "Cut"];
    for (var i = 0; i < statusList.length; i++) {
      var status = statusList[i];
      var classes = "btn btn-default";
      if (DECIDER_MAPPING[status] == this.state.rusheeStatus) {
        classes += " btn-" + status;
      }
      buttons.push(
        <button
          key={status}
          type="button"
          className={classes}
          onClick={this.setDecision.bind(this, status)}
        >
          {status}
        </button>
      );
    }
    return (
      <div className="row toggler">
        <div className="input-group">
          <div className="input-group-btn">
            {buttons}
          </div>
        </div>
      </div>
    );
  }

}

export default RusheeDecider;
