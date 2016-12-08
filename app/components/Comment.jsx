import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import CommentVoter from './CommentVoter.jsx';
import ReplyList from './ReplyList.jsx';

var ALLMONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
              'August', 'September', 'October', 'November', 'December'];

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
        comment_text: comment_obj.text,
        comment_time: comment_obj.date
      });
    }.bind(this));
  }

  toggleReplies() {
    this.setState({showReplies: !this.state.showReplies});
  }

  getDateString() {
    var diff = Math.floor((new Date().getTime() - this.state.comment_time)/(1000*60))
    if (diff <= 24*60) {
      if (diff < 60) {
        if (diff <= 1) {
          return 'less than a minute ago';
        }
        return '' + (diff) + ' minutes ago';
      }
      return '' + (diff/60) + ' hours ago';
    }
    var curr_date = new Date(this.state.comment_time);
    var month = ALLMONTHS[curr_date.getMonth()];
    var year = curr_date.getFullYear();
    var day = curr_date.getDate();
    var min = curr_date.getMinutes();
    var hour = curr_date.getHours();
    var ampm = hour > 12 ? 'pm' : 'am';
    return month + ' ' + day + ', ' + year + ' at '
      + (hour%12) + ':' + min + ampm;
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
            <p className="date-text">{this.getDateString()}</p>
            <p className="list-group-item-text">{this.state.comment_text}</p>
        </div>
        <div className="row">
            <div className="col-xs-12">
              <CommentVoter commentRef={this.props.commentRef} rusheeKey={this.props.rusheeKey}/>
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
            rusheeKey={this.props.rusheeKey}
            collapse={!this.state.showReplies}
            onToggle={this.toggleReplies.bind(this)}
          />
        </div>
      </li>
    );
  }

}

export default Comment;
