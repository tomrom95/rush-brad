import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

var votedStyle = {color:'blue', cursor: 'auto'};
var notVotedStyle = {color:'black', cursor: 'pointer'};

class CommentVoter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      ratings: [],
      userVote: 0,
    };
  }

  componentWillMount() {
    this.firebaseRef = this.props.commentRef.ref.child('ratings');
    this.feedRef = firebase.database().ref('feed');

    this.firebaseRef.on('value', function(dataSnapshot) {
      var ratings = [];
      var netRating = 0;
      var userVote = 0;
      dataSnapshot.forEach(function(childSnapshot) {
        var val = childSnapshot.val();
        if (childSnapshot.key == firebase.auth().currentUser.uid) {
          userVote = childSnapshot.val().score;
        }
        ratings.push(val);
        netRating += val.score;
      }.bind(this));
      this.setState({
        ratings: ratings,
        score: netRating,
        userVote: userVote
      });
    }.bind(this));
  }

  onVote(vote) {
    if (vote == this.state.userVote) {
      return;
    }
    var user_id = firebase.auth().currentUser.uid;
    var user_ref = firebase.database().ref('users/' + user_id);
    var voteRef = this.firebaseRef.child(user_id);
    user_ref.once('value', function(snap) {
      var user_name = snap.val().displayName;
      voteRef.set({
        userName: user_name,
        score: vote
      });
    }.bind(this));
    this.feedRef.push({
      actor: firebase.auth().currentUser.uid,
      type: "comment_vote",
      vote: vote,
      rushee: this.props.rusheeKey,
      user: this.props.commentRef.val().author,
      commentKey: this.props.commentRef.ref.key,
      date: new Date().getTime()
    });
  }

  render() {
    var downStyle = notVotedStyle;
    var upStyle = notVotedStyle;
    if (this.state.userVote == -1) {
      downStyle = votedStyle;
    } else if (this.state.userVote == 1) {
      upStyle = votedStyle;
    }
    return (
      <span className="voter">
        <span
          className="glyphicon glyphicon-thumbs-down"
          style={downStyle}
          aria-hidden="true"
          onClick={this.onVote.bind(this, -1)}
        ></span>
        <strong>{this.state.score}</strong>
        <span
          className="glyphicon glyphicon-thumbs-up"
          style={upStyle}
          aria-hidden="true"
          onClick={this.onVote.bind(this, 1)}
        ></span>
      </span>
    );
  }

}

export default CommentVoter;
