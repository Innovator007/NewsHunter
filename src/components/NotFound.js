import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

class NotFound extends Component {
	handleBack = () => {
		this.props.history.push("/");
	}	
	render() {
		return (
			<div className="rmdb-notfound">
				<p>Whoops! This page doesnot exist</p>
				<button onClick={this.handleBack} className="rmdb-notfoundbtn">Go Home</button>
			</div>
		);
	}
}

export default withRouter(NotFound);