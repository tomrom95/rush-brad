import React from 'react';
import RusheeCard from './RusheeCard.jsx';
import { Link } from 'react-router';
import firebase from 'firebase';

var orderings = {
  'First Name A-Z': {
    key: 'firstName',
    order: 1,
  },
  'First Name Z-A': {
    key: 'firstName',
    order: -1,
  },
  'Last Name A-Z': {
    key: 'lastName',
    order: 1,
  },
  'Last Name Z-A': {
    key: 'lastName',
    order: -1,
  },
  'Rating Low-High': {
    key: 'averageRating',
    secondary: 'Number of Ratings Low-High',
    order: 1,
  },
  'Rating High-Low': {
    key: 'averageRating',
    secondary: 'Number of Ratings High-Low',
    order: -1,
  },
  'Number of Ratings Low-High': {
    key: 'numRatings',
    secondary: 'First Name A-Z',
    order: 1,
  },
  'Number of Ratings High-Low': {
    key: 'numRatings',
    secondary: 'First Name A-Z',
    order: -1,
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rushees: [],
      sortOrder: 'First Name A-Z',
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref('rushees');
    this.firebaseRef.on('value', function(dataSnapshot) {
      var rushees = [];
      dataSnapshot.forEach(function(childSnapshot) {
        var rushee = childSnapshot.val();
        rushee['.key'] = childSnapshot.key;
        rushees.push(rushee);
      }.bind(this));

      this.setState({
        rushees: rushees
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  getSortOrderFunction(sortOrder) {
    var key = orderings[sortOrder].key;
    var order = orderings[sortOrder].order;
    var secondary = orderings[sortOrder].secondary;
    return function(a,b) {
      if (a[key] == "") {
        return 1;
      } else if (b[key] == "") {
        return -1;
      }
      if (a[key] < b[key]) {
        return -1 * order;
      } else if (a[key] > b[key]) {
        return 1 * order;
      } else if (secondary != null) {
        var secondSort = this.getSortOrderFunction(secondary).bind(this);
        return secondSort(a,b);
      }
      return 0;
    }
  }

  setSortOrder(event) {
    this.setState({sortOrder: event.target.value});
  }

  render() {
    var self = this;
    var createRushee = function(rushee, index) {
      var clearFix = index % 3 == 0
        ? <div className="clearfix visible-md"></div>
        : null;
      return (
        <div key={rushee['.key']}>
          { clearFix }
          <RusheeCard rusheeKey={rushee['.key']} />
        </div>
      );
    };
    var createSortSelection = function(name, index) {
      return (
        <option value={name} key={name}>{name}</option>
      );
    }
    var rusheeList = this.state.rushees.sort(
      this.getSortOrderFunction(this.state.sortOrder).bind(this)
    );
    return (
      <div className="container-fluid">
        <div className="row header">
          <div className="col-xs-6"><h3>Rushees</h3></div>
          <div className="col-xs-6"><span className="link-button">
            <Link to="/add-rushee">
              <button
                className="btn btn-primary"
              >
                Add Rushee
              </button>
            </Link>
          </span></div>
        </div>
        <div className="row header">
          <div className="col-md-4">
            <label>Sort by:&nbsp;</label>
            <select
              className="form-control filter"
              ref="year"
              defaultValue={this.state.sortOrder}
              onChange={this.setSortOrder.bind(this)}
            >
              { Object.keys(orderings).map(createSortSelection) }
            </select>
          </div>
        </div>
        <div className="card-deck-wrapper">
          <div className="card-deck">
            { rusheeList.map(createRushee) }
          </div>
        </div>
      </div>
    );
  }

}

export default Home;
