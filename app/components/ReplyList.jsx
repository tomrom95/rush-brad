import React from 'react';
import { Link } from 'react-router';
import Reply from './Reply.jsx';
import firebase from 'firebase';

class ReplyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replies: {},
      text: '',
      numReplies: 0
    };
  }

  componentWillMount() {
    this.firebaseRef = this.props.commentRef.ref.child('replies');
    this.feedRef = firebase.database().ref('feed');
    this.firebaseRef.orderByChild("date").on('value', function(dataSnapshot) {
      var replies = {};
      var numReplies = 0;
      dataSnapshot.forEach(function(childSnapshot) {
        var reply = childSnapshot;
        numReplies++;
        replies[childSnapshot.key] = reply;
      }.bind(this));

      this.setState({
        replies: replies,
        numReplies: numReplies
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      var replyRef = this.firebaseRef.push({
        text: this.state.text,
        date: new Date().getTime(),
        author: firebase.auth().currentUser.uid
      });
      this.feedRef.push({
        actor: firebase.auth().currentUser.uid,
        type: "reply",
        rushee: this.props.rusheeKey,
        user: this.props.commentRef.val().author,
        date: new Date().getTime(),
        commentKey: this.props.commentRef.ref.key,
        replyKey: replyRef.key
      });
      this.setState({
        text: ''
      });
    }
  }

  render() {
    if (this.props.collapse) {
      if (this.state.numReplies == 0) {return null;}
      return (
        <div className="row">
          <span className="glyphicon glyphicon-chevron-right"/>
          <span
            className="fake-link"
            onClick={this.props.onToggle}
          >
            Show Replies ({this.state.numReplies})
          </span>
        </div>
      );
    }
    var reply_comps = [];
    for (var key in this.state.replies) {
      reply_comps.push(
        <Reply key={key} replyRef={this.state.replies[key]} />
      );
    }
    return (
      <div className="row">
        <ul className="list-group">
          { reply_comps }
          <li className="list-group-item">
            <form onSubmit={ this.handleSubmit.bind(this) }>
              <div className="row">
                <input
                  className="comment-input"
                  onChange={ this.handleChange.bind(this) }
                  value={ this.state.text }
                />
              </div>
              <div className="row button-padding">
                <button className="btn btn-primary">{'Reply'}</button>
              </div>
            </form>
          </li>
        </ul>
      </div>
    );
  }

}

export default ReplyList;
