import React from 'react';
import Firebase from 'firebase';

class TodoList extends React.Component {
  constructor(props) {
    super(props);
  }

  removeItem(key) {
    var firebaseRef = new Firebase('https://rush-brad.firebaseio.com/todoItems');
    firebaseRef.child(key).remove();
  }

  render() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={ index }>
          { item.text }
          <span onClick={ _this.removeItem.bind(this, item['.key']) }
                style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
            X
          </span>
        </li>
      );
    };
    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
};

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      text: ''
    };
  }

  componentWillMount() {
    this.firebaseRef = new Firebase('https://rush-brad.firebaseio.com/todoItems');
    this.firebaseRef.limitToLast(25).on('value', function(dataSnapshot) {
      var items = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['.key'] = childSnapshot.key();
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

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRef.push({
        text: this.state.text
      });
      this.setState({
        text: ''
      });
    }
  }

  render() {
    return (
      <div>
        <TodoList items={ this.state.items } />
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <input onChange={ this.handleChange.bind(this) } value={ this.state.text } />
          <button>{ 'Add #' + (this.state.items.length + 1) }</button>
        </form>
      </div>
    );
  }
};

export default TodoApp;
