import React from 'react';
import { Link } from 'react-router';
import StarRatingComponent from './StarRatingComponent.jsx';
import firebase from 'firebase';

class UserRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_rating: null,
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref(
      'rushees/' + this.props.rusheeKey + '/ratings'
    );
    this.firebaseRef.on('value', function(dataSnapshot) {
      dataSnapshot.forEach(function(childSnapshot) {
        if (childSnapshot.key == firebase.auth().currentUser.uid) {
          this.setState({user_rating: childSnapshot.val().rating});
        }
      }.bind(this));
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  handleRating(nextValue, prevValue, name) {
    var rating = nextValue;
    var user_id = firebase.auth().currentUser.uid;
    var user_ref = firebase.database().ref('users/' + user_id);
    user_ref.once('value', function(snap) {
      var user_name = snap.val().displayName;
      this.firebaseRef.child(user_id).set({
        userName: user_name,
        rating: rating
      });
      this.setState({user_rating: rating});
    }.bind(this));
  }

  render() {
    return (
      <div className="row">
          <StarRatingComponent
            name={"userRusheeRating"}
            caption={'Your Rating:'}
            value={this.state.user_rating}
            starCount={5}
            onStarClick={this.handleRating.bind(this)}
            editing={true}
          />
      </div>
    );
  }

}

export default UserRating;
