import React, { Component } from 'react';
import { API_URL, API_KEY } from '../config';
import Spinner from './Spinner';
import Modal from './Modal';

class News extends Component {
	state = {
		articles: [],
		originalArticles: [],
		query: "",
		isloading: true,
		modal: false,
		contentModal: false,
		selectedArticle: {}
	}
	componentDidMount() {
		const endpoint = `${API_URL}top-headlines?sources=${this.props.match.params.channelId}&apiKey=${API_KEY}`;
		this.fetchArticles(endpoint);
	}

	getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	fetchArticles = (endpoint) => {
		fetch(endpoint)
			.then(result => result.json())
			.then(result => {
				if(result.status === "ok") {
					this.setState({ articles: result.articles,originalArticles: result.articles, isloading: false });
				} else {
					this.setState({ isloading: false });
				}
			})
			.catch(error => console.error("Error: ",error));
	}
	renderContent() {
		const openContentModal = this.openContentModal;
		if(this.state.articles.length > 0) {
			return (
				<div className="grid">
				{ this.state.articles.map(function(article,i) {
					if(article.urlToImage === null) {
						return (
							<div key={i}>
								<div onClick={() => openContentModal(article)} style={{ backgroundImage: "linear-gradient(180deg, rgba(221,217,217,1) 0%, rgba(25,25,25,1) 100%)"}} className="article-card">
									<div>
									<h5>{article.title}</h5>
									<p>{article.description.substr(0, 100)}...</p>
									</div>
								</div>
							</div>
						);
					} else {
						return (
							<div key={i}>
								<div onClick={() => openContentModal(article)} style={{backgroundImage: `url(${article.urlToImage})`}} className="article-card">
									<div>
									<h5>{article.title}</h5>
									<p>{article.description.substr(0, 100)}...</p>
									</div>
								</div>
							</div>
						);
					}
				}) }
			</div>
			);
		} else {
			if(this.state.query !== "" && !this.state.isloading) {
				return (
					<div>
						<p>No Results found. Please relax the search criteria</p>
						<button onClick={this.goBackToOriginal} className="btn btn-info">See Previous Results</button>
					</div>
				);
			} else {
				return null;
			}
		}
	}

	goBackToOriginal = () => {
		const articles = this.state.originalArticles;
		this.setState({ articles, isloading: false, query: "" });
	}

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	searchArticles = () => {
		if(this.state.query === "") {
			const articles = this.state.originalArticles;
			this.setState({ articles })
		}
		this.setState({ articles: [], isloading: true });
		const endpoint = `${API_URL}/top-headlines/?sources=${this.props.match.params.channelId}&q=${this.state.query}&apiKey=${API_KEY}`;
		fetch(endpoint)
			.then(result => result.json())
			.then(result => {
				if(result.status === "ok") {
					this.setState({ articles: result.articles, isloading: false });
				} else {
					this.setState({ isloading: false });
				}
			})
			.catch(e => console.log(e));
	}

	openModal = () => {
		this.setState({ modal: true });
	}

	openContentModal = (article) => {
		this.setState({ selectedArticle: article, contentModal: true });
	}

	closeContentModal = (article) => {
		this.setState({ selectedArticle: {}, contentModal: false });
	}

	closeModal = () => {
		this.setState({ modal: false });
	}

	render() {
		const {selectedArticle} = this.state;
		return (
			<div className="container">
				<div className="d-flex justify-content-center">
					<div className="w-100 input-group m-3">
					  <input name="query" value={this.state.query} onChange={this.handleChange} type="search" className="form-control" placeholder={"Search News from " + this.props.match.params.channelId} aria-label="Recipient's username" aria-describedby="button-addon2" />
					  <div className="input-group-append">
					    <button onClick={this.searchArticles} className="btn btn-outline-info" type="button" id="button-addon2">Search</button>
					  </div>
					</div>
				</div>
					{ this.renderContent() }
				{
					this.state.isloading ? <div className="d-flex justify-content-center"><Spinner /></div> : null 
				}
				<Modal show={this.state.contentModal} title="News" onClose={this.closeContentModal}>
					<div>
						{ selectedArticle.urlToImage ? <img alt="News Image" className="modal-img" src={selectedArticle.urlToImage} /> : null }
						<h3>{selectedArticle.title}</h3>
						<p>Author : { selectedArticle.author } </p>
						<p>{selectedArticle.description}</p>
					</div>
				</Modal>
			</div>
		);
	}
}

export default News;