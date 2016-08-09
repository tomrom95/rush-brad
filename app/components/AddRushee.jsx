import React from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';

var initial_fields = {
  firstName: '',
  lastName: '',
  email: '',
  year: "2020",
  phoneNumber: '',
  pictureURL: '',
}

class AddRushee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: initial_fields,
      error: null,
      success: null,
    };
  }
  componentWillMount() {
    this.firebaseRef = firebase.database().ref('rushees');
  }

  submitForm() {
    var data = {
      firstName: this.refs.firstName.value,
      lastName: this.refs.lastName.value,
      email: this.refs.email.value,
      phoneNumber: this.refs.phoneNumber.value,
      year: this.refs.year.value,
      pictureURL: this.refs.pictureURL.value,
      rating: -1,
    }
    var self = this;
    this.firebaseRef.push(
      data,
      function(error) {
        if (error) {
          self.setState({error: 'Error processing form input'});
        } else {
          self.setState({success: 'Rushee submitted successfully'});
        }
      }
    );
    this.setState({
      fields: initial_fields
    });
    this.refs.firstName.value = '';
    this.refs.lastName.value = '';
    this.refs.email.value = '';
    this.refs.phoneNumber.value = '';
    this.refs.year.value = '2020';
    this.refs.pictureURL.value = '';
  }

  render() {

    return (
      <div>
        <h2>Add a New Rushee</h2>
        <div className="form-fields">
          <div>
            <label>First Name</label>
            <input
              className="form-control"
              type="text"
              ref="firstName"
              defaultValue={this.state.fields.firstName}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              className="form-control"
              type="text"
              ref="lastName"
              defaultValue={this.state.fields.lastName}
            />
          </div>
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
              onClick={this.submitForm.bind(this)}
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
          {this.state.success ? (
            <div className="pull-right">
              <div className="alert alert-success">
                <strong>Success!</strong> {this.state.success}
              </div>
            </div>
          ): null}
        </div>
      </div>
    );
  }
}

export default AddRushee;
