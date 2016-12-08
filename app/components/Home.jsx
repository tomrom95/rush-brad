import React from 'react';
import RusheeCard from './RusheeCard.jsx';
import { Link } from 'react-router';
import firebase from 'firebase';
import Feed from './Feed.jsx';

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
    var order = localStorage.getItem('sortOrder') || 'First Name A-Z';
    var search = localStorage.getItem('searchText') || '';
    this.state = {
      rushees: [],
      sortOrder: order,
      searchText: search,
      showModal: false,
      selectedRushee: null,
      showFeed: false
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
      rushees = rushees.sort(
        this.getSortOrderFunction(this.state.sortOrder).bind(this)
      );
      this.setState({
        rushees: rushees
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  setSelectedRushee(rushee_key) {
    this.setState({selectedRushee: rushee_key});
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
    var order = event.target.value;
    var rushees = this.state.rushees.sort(
      this.getSortOrderFunction(order).bind(this)
    );
    localStorage.setItem('sortOrder', order);
    this.setState({
      sortOrder: order,
      rushees: rushees,
    });
  }

  handleSearch(e) {
    localStorage.setItem('searchText', e.target.value);
    this.setState({searchText: e.target.value});
  }

  getKeyList(rusheeList) {
    return rusheeList.map(function(rushee) {
      return rushee['.key'];
    })
  }

  toggleFeed() {
    this.setState({
      showFeed: !this.state.showFeed
    });
  }

  render() {
    var self = this;
    var createRushee = function(rushee, index) {
      var clearFix = index % 2 == 0
        ? <div className="clearfix visible-md"></div>
        : null;
      console.log('creating rushee card mapping');
      return (
        <div key={rushee['.key']}>
          { clearFix }
          <RusheeCard rusheeKey={rushee['.key']} keyIndex={index} />
        </div>
      );
    };
    var createSortSelection = function(name, index) {
      return (
        <option value={name} key={name}>{name}</option>
      );
    }
    var rusheeList = this.state.rushees.filter(function(rushee) {
      var name = rushee.firstName + ' ' + rushee.lastName;
      return name.toLowerCase().includes(this.state.searchText.toLowerCase());
    }.bind(this));
    localStorage.setItem(
      'globalRusheeList',
      JSON.stringify(this.getKeyList(rusheeList))
    );
    console.log('preparing for ;alsjdf;lkja');
    return (
      <div className="container-fluid">
        <div className="row feed-button">
          <button
            className="btn btn-primary"
            onClick={this.toggleFeed.bind(this)}
          >
            {this.state.showFeed ? "Show Rushees" : "Show Feed"}
          </button>
        </div>
        <div className="row">
          <div className={"col-md-3 sidebar" + (this.state.showFeed ? "" : " hidden")}>
            <Feed />
          </div>
          <div className={"col-md-9 offset-md-3 main-wrapper"+ (this.state.showFeed ? " hidden" : "")}>
            <div className="row header">
              <div className="col-md-6">
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
              <div className="col-md-6">
                <label>Search For:&nbsp;</label>
                <input
                  onChange={ this.handleSearch.bind(this) }
                  value={ this.state.searchText }
                />
              </div>
            </div>
            <div className="row">
              <div className="card-deck-wrapper">
                <div className="card-deck">
                  { rusheeList.map(createRushee) }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Home;
