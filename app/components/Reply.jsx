import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import CommentVoter from './CommentVoter.jsx';

class Reply extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: null,
      comment_text: null
    };
  }

  componentWillMount() {
    var comment_obj = this.props.replyRef.val();
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
            <h5 className="list-group-item-heading">{this.state.user_name}</h5>
            <p className="list-group-item-text">{this.state.comment_text}</p>
        </div>
        <div className="row">
            <div className="col-xs-2">
              <CommentVoter commentRef={this.props.replyRef} />
            </div>
        </div>
      </li>
    );
  }

}

export default Reply;
