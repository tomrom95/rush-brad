import React from 'react';
import { Link } from 'react-router';
import CommentList from './CommentList.jsx';
import UserRating from './UserRating.jsx';
import AllFratRating from './AllFratRating.jsx';
import EventTracker from './EventTracker.jsx';
import RusheeDecider from './RusheeDecider.jsx';
import ListDisplay from './ListDisplay.jsx';
import firebase from 'firebase';

var initial_fields = {
  netID: '',
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
      globalRushees: [],
      key: null,
      viewInfo: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("got props");
    if (isNaN(this.props.params.rusheeID)) {
      return;
    }
    var i = nextProps.params.rusheeID;
    var key = this.state.globalRushees[i];
    this.setRushee(key);
  }

  componentWillMount() {
    var globalRushees = JSON.parse(localStorage.getItem("globalRusheeList"));
    this.setState({
      globalRushees: globalRushees
    });
    var key = null;
    if (isNaN(this.props.params.rusheeID)) {
      key = this.props.params.rusheeID;
    } else {
      var i = this.props.params.rusheeID;
      key = globalRushees[i];
    }
    this.setRushee(key);
  }

  setRushee(key) {
    this.firebaseRef = firebase.database().ref('rushees/' + key);
    this.setState({key: key})
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
          this.setRushee(this.state.key);
        }
      }.bind(this)
    );
  }

  renderEditing() {
    return (
      <div className="form-fields row">
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
      <div className="row">
        <p><strong>Net ID: </strong>{rushee_obj.netID}</p>
        <p><strong>Email: </strong>{rushee_obj.email}</p>
        <p><strong>Year: </strong>{rushee_obj.year}</p>
        <p><strong>Phone Number: </strong>{rushee_obj.phoneNumber}</p>
        <p><strong>Major: </strong>{rushee_obj.major}</p>
        <p><strong>Hometown: </strong>{rushee_obj.hometown}</p>
        <p>{"'" + (rushee_obj.inACoffin == null ? "" : rushee_obj.inACoffin)  + "'"} <strong>in a Coffin</strong></p>
        <p><strong>When attending a soiree, what must every dude bring&#63; </strong>{rushee_obj.everyDude}</p>
        <p><strong>What is the necessary complement to sleeping&#63; </strong>{rushee_obj.sleepAndHike}</p>
        <p><strong>1's and 5's&#63; </strong>{rushee_obj.onesAndFives}</p>
        <ListDisplay label="Activities" listKey={"rushees/" + this.state.key + "/activities"}></ListDisplay>
        <ListDisplay label="Rushing With" listKey={"rushees/" + this.state.key + "/rushingWith"}></ListDisplay>
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

  setViewInfo(newState) {
    this.setState({viewInfo: newState});
  }

  render() {
    console.log("in rushee detail");
    var rushee_obj = this.state.rushee;
    if (rushee_obj == null) {
      return (<div>Matt Sullivaning...</div>);
    }

    var url = rushee_obj.pictureURL == null || rushee_obj.pictureURL.length == 0
      ? "https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
      : rushee_obj.pictureURL;

    var prevButton = null;
    var nextButton = null;

    if (!(isNaN(this.props.params.rusheeID))) {
      var i = parseInt(this.props.params.rusheeID);

      if (i > 0) {
        prevButton = (
          <Link to={"/detail/" + (i - 1)}>
            <button
              className="btn btn-primary top-button"
            >
              Previous
            </button>
          </Link>
        );
      }

      if (i < this.state.globalRushees.length - 1) {
        nextButton = (
          <Link to={"/detail/" + (i + 1)}>
            <button
              className="btn btn-primary top-button"
            >
              Next
            </button>
          </Link>
        );
      }
    }

    return (
      <div className="container-fluid main-wrapper detail-wrapper">
        <div className="row header">
          <div className="col-xs-9">
            <h3>
              {rushee_obj.firstName + ' ' + rushee_obj.lastName}
            </h3>
          </div>
          <div className="col-xs-3"><span className="link-button">
              {prevButton}
              {nextButton}
          </span></div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <RusheeDecider rusheeKey={this.state.key}/>
            <div className="detail-img-container">
              <img className="detail-img" src={url} alt="Rushee photo"/>
            </div>
            <div className="row">
              <AllFratRating rusheeKey={this.state.key} />
            </div>
            <div className="row">
              <UserRating rusheeKey={this.state.key} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="input-group toggler">
                <div className="input-group-btn">
                  <button type="button" className={"btn btn-secondary" + (this.state.viewInfo ? " attended" : "")} onClick={this.setViewInfo.bind(this, true)}>View Info</button>
                  <button type="button" className={"btn btn-secondary" + (this.state.viewInfo ? "" : " attended")} onClick={this.setViewInfo.bind(this, false)}>View Events</button>
                </div>
              </div>
            </div>
            {
              this.state.viewInfo ?
              (this.state.editing ? this.renderEditing() : this.renderNormal())
              : <EventTracker rusheeKey={this.state.key}/>
            }
          </div>
        </div>
        <div className="row">
          <CommentList rusheeKey={this.state.key} />
        </div>
      </div>
    );
  }

}

export default RusheeDetail;
