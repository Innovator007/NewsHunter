import React, { Component } from 'react';
import { getCountries } from 'country-fns'
import { Link } from 'react-router-dom';
import { API_URL, API_KEY } from '../config';
import Spinner from './Spinner';

class Home extends Component {
	state = {
		channels: [],
		isloading: true,
		country: "us"
	}

	componentDidMount() {
		this.fetch(this.state.country);
	}

	fetch = (country) => {
		const endpoint = `${API_URL}sources?language=en&country=${country}&apiKey=${API_KEY}`;
		this.fetchItems(endpoint);
	}

	fetchItems = (endpoint) => {
		this.setState({ isloading: true });
		fetch(endpoint)
		.then(result => result.json())
		.then(result => {
			if(result.status === "ok") {
				this.setState({ channels: result.sources, isloading: false });
			} else {
				this.setState({ isloading: false });
			}
		})
		.catch(error => console.error("Error: ",error));
	}

	renderChannels = () => {
		if(this.state.channels.length > 0) {
			return (
				<div className="masonry">
				{ this.state.channels.map((channel) => {
					const url = `/${channel.id}`;
					return (
						<div key={channel.id}>
							<Link to={url}>
								<div className="channel-card">
									<div className="channel-header text-center">
										<h5>{channel.name}</h5>
									</div>
									<div className="channel-body">
										<p className="channel-category">Category : {channel.category}</p>
										<p>Channel Description :</p>
										<p>{channel.description}</p>
									</div>
								</div>
							</Link>
						</div>
					);
				}) }
				</div>
			);
		} else {
			if(!this.state.isloading) {
				return (
					<div className="mt-5">
						<h3 className="text-center">Sorry! no channel available :(</h3>
					</div>
				);
			}
		}
	}

	handleChange = (e) => {
		this.fetch(e.target.value);
		this.setState({ [e.target.name]: e.target.value, isloading: false });
	}

	render() {
		return (
			<div className="container">
				<h1 className="text-center mt-3">Channels</h1>
				<div className="d-flex justify-content-center">
				<select value={this.state.country} onChange={this.handleChange} name="country" className="w-50 form-control">
				    {getCountries().map((c) => 
				      <option key={c.iso2} value={c.iso2}>{c.name}</option>
				    )}
				  </select>
				</div>
				{ this.renderChannels() }
				{
					this.state.isloading ? <div className="mt-5 d-flex justify-content-center"><Spinner /></div> : null
				}
			</div>
		);
	}
}

export default Home;