import React from 'react';
import { Link } from 'react-router';
import AllFratRating from './AllFratRating.jsx';
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
    var url = rushee_obj.pictureURL == null || rushee_obj.pictureURL.length == 0
      ? "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
      : rushee_obj.pictureURL;
    return (
      <div className="col-md-4 card-container" key={this.state.rushee.key}>
        <div className="card text-center">
          <div className="card-block text-center">
            <Link to={"/detail/" + this.props.rusheeKey}>
              <h4 className="card-title">
                {rushee_obj.firstName + ' ' + rushee_obj.lastName}
              </h4>
            </Link>
          </div>
          <div className="img-crop">
            <Link to={"/detail/" + this.props.rusheeKey}>
              <img
                className="card-img-top"
                src={url}
                alt="Rushee photo"
              />
            </Link>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <AllFratRating rusheeKey={this.props.rusheeKey} />
            </li>
          </ul>
        </div>
      </div>
    );
  }

}

export default RusheeCard;
