import React from 'react';
import { Link } from 'react-router';
import StarRatingComponent from './StarRatingComponent.jsx';
import firebase from 'firebase';

class AllFratRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratings: [],
      average: 0
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref(
      'rushees/' + this.props.rusheeKey + '/ratings'
    );
    this.firebaseRef.on('value', function(dataSnapshot) {
      var total_rating = 0;
      var all_ratings = [];
      var num_ratings = 0;
      dataSnapshot.forEach(function(childSnapshot) {
        var val = childSnapshot.val();
        total_rating += val.rating;
        num_ratings ++;
        if (childSnapshot.key == firebase.auth().currentUser.uid) {
          all_ratings.unshift({
            userName: 'You',
            rating: val.rating
          });
        } else {
          all_ratings.push({
            userName: val.userName,
            rating: val.rating
          });
        }
      }.bind(this));
      var avg_rating = num_ratings == 0
        ? null
        : total_rating / num_ratings;
      this.setState({
        ratings: all_ratings,
        average: avg_rating
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    var num_ratings = this.state.ratings.length;
    return (
      <div className="row">
          <StarRatingComponent
            caption={'Frat Rating (' + num_ratings + ' votes):'}
            name={"allFratRating"} /* name of the radio input, it is required */
            value={Math.round(this.state.average)} /* number of selected icon (`0` - none, `1` - first) */
            starCount={5} /* number of icons in rating, default `5` */
            editing={false} /* is component available for editing, default `true` */
          />
      </div>
    );
  }

}

export default AllFratRating;
