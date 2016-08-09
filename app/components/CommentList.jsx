import React from 'react';
import { Link } from 'react-router';
import Comment from './Comment.jsx';
import firebase from 'firebase';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      text: '',
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref(
      'comments/' + this.props.rusheeKey
    );
    this.firebaseRef.orderByChild("date").on('value', function(dataSnapshot) {
      var comments = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var comment = childSnapshot;
        comments[childSnapshot.key] = comment;
      }.bind(this));

      this.setState({
        comments: comments
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
      this.firebaseRef.push({
        text: this.state.text,
        date: new Date().getTime(),
        author: firebase.auth().currentUser.uid
      });
      this.setState({
        text: ''
      });
    }
  }

  render() {
    var comment_comps = [];
    for (var key in this.state.comments) {
      comment_comps.push(
        <Comment key={key} commentRef={this.state.comments[key]} />
      );
    }
    return (
      <div className="row">
        <ul className="list-group">
          { comment_comps }
          <li className="list-group-item">
            <form onSubmit={ this.handleSubmit.bind(this) }>
              <input onChange={ this.handleChange.bind(this) } value={ this.state.text } />
              <button className="btn btn-primary">{'Add Comment'}</button>
            </form>
          </li>
        </ul>
      </div>
    );
  }

}

export default CommentList;
