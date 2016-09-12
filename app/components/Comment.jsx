import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import CommentVoter from './CommentVoter.jsx';
import ReplyList from './ReplyList.jsx';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: null,
      comment_text: null,
      showReplies: false
    };
  }

  componentWillMount() {
    var comment_obj = this.props.commentRef.val();
    var user_id = comment_obj.author;
    var user_ref = firebase.database().ref('users/' + user_id);
    user_ref.once('value', function(snap) {
      this.setState({
        user_name: snap.val().displayName,
        comment_text: comment_obj.text
      });
    }.bind(this));
  }

  toggleReplies() {
    this.setState({showReplies: !this.state.showReplies});
  }

  render() {
    if (this.state.user_name == null || this.state.comment_text == null) {
      return (<div>loading</div>);
    }
    var buttonText = this.state.showReplies
      ? "Hide replies" : "Reply";
    return (
      <li className="list-group-item">
        <div className="row">
            <h5 className="list-group-item-heading">{this.state.user_name}</h5>
            <p className="list-group-item-text">{this.state.comment_text}</p>
        </div>
        <div className="row">
            <div className="col-xs-12">
              <CommentVoter commentRef={this.props.commentRef} />
              <span
                className="fake-link"
                onClick={this.toggleReplies.bind(this)}
              >
                {buttonText}
              </span>
            </div>
        </div>
        <div className="row">
          <ReplyList
            commentRef={this.props.commentRef}
            collapse={!this.state.showReplies}
            onToggle={this.toggleReplies.bind(this)}
          />
        </div>
      </li>
    );
  }

}

export default Comment;
