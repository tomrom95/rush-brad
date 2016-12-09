import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

class FeedRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedEvent: null,
      actorName: "",
      userName: "",
      rusheeName: "",
    };
  }

  componentWillMount() {
    this.setState({
      feedEvent: this.props.feedEvent
    });
    firebase.database().ref('users/' + this.props.feedEvent.actor)
      .once('value', function(snap) {
        this.setState({
          actorName: snap.val().displayName
        });
      }.bind(this));
    if (this.props.feedEvent.user != null) {
      firebase.database().ref('users/' + this.props.feedEvent.user)
        .once('value', function(snap) {
          this.setState({
            userName: snap.val().displayName
          });
        }.bind(this));
    }
    firebase.database().ref('rushees/' + this.props.feedEvent.rushee)
      .once('value', function(snap) {
        var val = snap.val();
        this.setState({
          rusheeName: val.firstName + " " + val.lastName
        });
      }.bind(this));
  }

  render() {
    var text = null;
    switch (this.state.feedEvent.type) {
      case "comment":
        text = (
          <p><b>{this.state.actorName}</b>{" commented on "}<b>{this.state.rusheeName}</b></p>
        );
        break;
      case "comment_vote":
        var vote = this.state.feedEvent.vote == 1 ? "upvoted" : "downvoted";
        text = (
          <p><b>{this.state.actorName}</b>{" " + vote + " "}<b>{this.state.userName}</b>{"'s comment on "}<b>{this.state.rusheeName}</b></p>
        );
        break;
      case "reply":
        text = (
          <p><b>{this.state.actorName}</b>{" replied to "}<b>{this.state.userName}</b>{"'s comment on "}<b>{this.state.rusheeName}</b></p>
        );
        break;
      case "rushee_added":
        text = (
          <p><b>{this.state.actorName}</b>{" added "}<b>{this.state.rusheeName}</b>{" as a new rushee"}</p>
        );
        break;
    }
    return (

        <tr>
          <td>
            <Link to={"/detail/" + this.state.feedEvent.rushee}>
              <div className="table-cell">
                {text}
              </div>
            </Link>
          </td>
        </tr>
    );
  }

}
/*
<Link to={"/detail/" + this.props.keyIndex}>
  <tr>
    {text}
  </tr>
</Link>
*/

export default FeedRow;
