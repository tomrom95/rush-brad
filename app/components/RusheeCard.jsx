import React from 'react';
import { Link } from 'react-router';
import FbApp from './FirebaseInit.jsx';

class RusheeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rushee: null,
    };
  }

  componentWillMount() {
    var self = this;
    var ref = new Firebase(
      'https://rush-brad.firebaseio.com/rushees'
    ).child(this.props.rusheeKey);
    ref.on('value', (snap) => {self.state.rushee = snap});
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  render() {
    var rushee_obj = this.state.rushee.val();
    var rating = rushee_obj.rating == -1
      ? 'Rushee has not been rated'
      : rushee_obj.rating;
    return (
      <div className="col-xs-4" key={this.state.rushee.key()}>
        <div className="card text-center">
          <div className="card-block text-center">
            <h4 className="card-title">
              {rushee_obj.firstName + ' ' + rushee_obj.lastName}
            </h4>
          </div>
          <div className="img-crop">
            <img
              className="card-img-top"
              src="https://scontent.fsnc1-1.fna.fbcdn.net/v/t1.0-9/12096477_10203484028861755_7392343876069609310_n.jpg?_nc_eui=3QSkl5wcUHzyqovKNuUaBt0Y6xU&oh=4ae90a59772033c4cadd749f1568dfcd&oe=58278C3C"
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
