import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

class ListDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.updateWithKey(nextProps.key);
  }

  componentWillMount() {
    this.updateWithKey(this.props.key);
  }

  updateWithKey(key) {
    this.firebaseRef = firebase.database().ref(key);
    this.firebaseRef.on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        items.push(item);
      }.bind(this));
      this.setState({
        items: items
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    var itemString = "";
    for (var i = 0; i < this.state.items.length; i++) {
      itemString+= this.state.items[i];
      if (i != this.state.items.length - 1) {
        itemString+= ", ";
      }
    }
    return (
      <p><strong>{this.props.label + ": "}</strong>{itemString}</p>
    );
  }

}

export default ListDisplay;
