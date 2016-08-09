import React from 'react';
import { Link } from 'react-router';
import CommentList from './CommentList.jsx';
import firebase from 'firebase';

class RusheeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rushee: null,
    };
  }

  componentWillMount() {
    var ref = firebase.database().ref('rushees/' + this.props.params.rusheeKey);
    ref.once('value', function(snap) {
      this.setState({rushee: snap.val()});
    }.bind(this));
  }

  render() {
    var rushee_obj = this.state.rushee;
    if (rushee_obj == null) {
      return (<div>loading</div>);
    }
    var rating = rushee_obj.rating == -1
      ? 'Rushee has not been rated'
      : rushee_obj.rating;
    var url = rushee_obj.pictureURL == null
      ? "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
      : rushee_obj.pictureURL;
    return (
      <div className="container-fluid">
        <div className="row">
          <h3>{rushee_obj.firstName + ' ' + rushee_obj.lastName}</h3>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="detail-img-container">
              <img className="detail-img" src={url} alt="Rushee photo"/>
            </div>
          </div>
          <div className="col-md-4">
            <p><strong>Email: </strong>{rushee_obj.email}</p>
            <p><strong>Year: </strong>{rushee_obj.year}</p>
            <p><strong>Phone Number: </strong>{rushee_obj.phoneNumber}</p>
          </div>
        </div>
        <div className="row">
          <p><strong>Rating: </strong>{rating}</p>
        </div>
        <div className="row">
          <CommentList rusheeKey={this.props.params.rusheeKey} />
        </div>
      </div>
    );
  }

}

export default RusheeCard;
