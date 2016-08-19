import React from 'react';
import { Link } from 'react-router';
import CommentList from './CommentList.jsx';
import UserRating from './UserRating.jsx';
import AllFratRating from './AllFratRating.jsx';
import firebase from 'firebase';

var initial_fields = {
  email: '',
  year: "2020",
  phoneNumber: '',
  pictureURL: '',
}

class RusheeDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rushee: null,
      editing: false,
      fields: initial_fields,
      success: null,
    };
  }

  componentWillMount() {
    this.firebaseRef = firebase.database().ref('rushees/' + this.props.params.rusheeKey);
    this.setRushee();
  }

  setRushee() {
    this.firebaseRef.once('value', function(snap) {
      var rushee = snap.val();
      this.setState({
        rushee: rushee,
        fields: {
          email: rushee.email,
          year: rushee.year,
          phoneNumber: rushee.phoneNumber,
          pictureURL: rushee.pictureURL,
        },
        editing: false,
        error: null,
      });
    }.bind(this));
  }

  editRushee() {
    var data = {
      email: this.refs.email.value,
      phoneNumber: this.refs.phoneNumber.value,
      year: this.refs.year.value,
      pictureURL: this.refs.pictureURL.value,
    }
    var object = this.firebaseRef.update(
      data,
      function(error) {
        if (error) {
          this.setState({error: 'Error processing form input'});
        } else {
          this.setRushee();
        }
      }.bind(this)
    );
  }

  renderEditing() {
    return (
      <div className="form-fields">
        <div>
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            ref="email"
            defaultValue={this.state.fields.email}
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            className="form-control"
            type="tel"
            ref="phoneNumber"
            defaultValue={this.state.fields.phoneNumber}
          />
        </div>
        <div>
          <label>Year</label>
          <select
            className="form-control"
            ref="year"
            defaultValue={this.state.fields.year}
          >
            <option value="2020">2020</option>
            <option value="2019">2019</option>
          </select>
        </div>
        <div>
          <label>Picture URL</label>
          <input
            className="form-control"
            type="text"
            ref="pictureURL"
            defaultValue={this.state.fields.pictureURL}
          />
        </div>
        <div className="form-footer">
          <button
            className="btn btn-primary pull-right"
            onClick={this.editRushee.bind(this)}
          >
            Submit
          </button>
        </div>
        <div className="clearfix"></div>
        {this.state.error ? (
          <div className="pull-right">
            <div className="alert alert-danger">
              <strong>Error:</strong> {this.state.error}
            </div>
          </div>
        ): null}
      </div>
    );
  }

  setEditMode() {
    this.setState({
      editing: true,
    });
  }

  renderNormal() {
    var rushee_obj = this.state.rushee;
    return (
      <div>
        <p><strong>Email: </strong>{rushee_obj.email}</p>
        <p><strong>Year: </strong>{rushee_obj.year}</p>
        <p><strong>Phone Number: </strong>{rushee_obj.phoneNumber}</p>
        <p>
          <button
            className="btn btn-primary pull-right"
            onClick={this.setEditMode.bind(this)}
          >
            Edit
          </button>
        </p>
      </div>
    );
  }

  render() {
    var rushee_obj = this.state.rushee;
    if (rushee_obj == null) {
      return (<div>loading</div>);
    }

    var url = rushee_obj.pictureURL == null || rushee_obj.pictureURL.length == 0
      ? "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
      : rushee_obj.pictureURL;
    return (
      <div className="container-fluid">
        <div className="row header">
          <div className="col-xs-6"><h3>
            {rushee_obj.firstName + ' ' + rushee_obj.lastName}
          </h3></div>
        <div className="col-xs-6"><span className="link-button">
            <Link to="/">
              <button
                className="btn btn-primary"
              >
                Home
              </button>
            </Link>
          </span></div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="detail-img-container">
              <img className="detail-img" src={url} alt="Rushee photo"/>
            </div>
          </div>
          <div className="col-md-4">
            {this.state.editing ? this.renderEditing() : this.renderNormal()}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-8">
            <div className="row">
              <AllFratRating rusheeKey={this.props.params.rusheeKey} />
            </div>
            <div className="row">
              <UserRating rusheeKey={this.props.params.rusheeKey} />
            </div>
          </div>
        </div>
        <div className="row">
          <CommentList rusheeKey={this.props.params.rusheeKey} />
        </div>
      </div>
    );
  }

}

export default RusheeDetail;
