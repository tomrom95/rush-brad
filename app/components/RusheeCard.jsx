import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

class RusheeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rushee: null,
    };
  }

  componentWillMount() {
    var ref = firebase.database().ref('rushees/' + this.props.rusheeKey);
    ref.once('value', function(snap) {
      this.setState({rushee: snap.val()});
    }.bind(this));
  }

  render() {
    var rushee_obj = this.state.rushee;
    if (rushee_obj == null) {
      return (<div>error</div>);
    }
    var rating = rushee_obj.rating == -1
      ? 'Rushee has not been rated'
      : rushee_obj.rating;
    return (
      <div className="col-xs-4" key={this.state.rushee.key}>
        <div className="card text-center">
          <div className="card-block text-center">
            <h4 className="card-title">
              {rushee_obj.firstName + ' ' + rushee_obj.lastName}
            </h4>
          </div>
          <div className="img-crop">
            <img
              className="card-img-top"
              src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
              alt="Rushee photo"
            />
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Rating: </strong>{rating}
            </li>
          </ul>
        </div>
      </div>
    );
  }

}

export default RusheeCard;
