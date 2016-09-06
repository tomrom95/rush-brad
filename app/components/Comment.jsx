import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import CommentVoter from './CommentVoter.jsx';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: null,
      comment_text: null
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

  render() {
    if (this.state.user_name == null || this.state.comment_text == null) {
      return (<div>loading</div>);
    }
    return (
      <li className="list-group-item">
        <div className="row">
          <div className="col-xs-10">
            <h5 className="list-group-item-heading">{this.state.user_name}</h5>
            <p className="list-group-item-text">{this.state.comment_text}</p>
          </div>
          <div className="col-xs-2 voter">
            <CommentVoter commentRef={this.props.commentRef} />
          </div>
        </div>
      </li>
    );
  }

}

export default Comment;
