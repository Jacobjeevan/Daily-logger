import React, { Component } from "react";

export class Createexercise extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      description: "",
      duration: 0,
      date: new Date(),
      users: [],
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    const { username, description, duration } = this.state;
    return (
      <div className="card">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              onChange={this.onChange}
              name="username"
              value={username}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              onChange={this.onChange}
              name="description"
              value={description}
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              type="number"
              className="form-control"
              onChange={this.onChange}
              name="duration"
              value={duration}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Createexercise;
