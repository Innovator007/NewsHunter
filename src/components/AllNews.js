import React, { Component } from 'react';
import { API_URL, API_KEY } from '../config';
import Spinner from './Spinner';
import Modal from './Modal';

class AllNews extends Component {
	state = {
		articles: [],
		originalArticles: [],
		heights: [],
		query: "",
		isloading: true,
		modal: false,
		from: "",
		to: "",
		contentModal: false,
		selectedArticle: {},
		sortBy: "popularity"
	}
	componentDidMount() {
		const endpoint = `${API_URL}top-headlines?country=us&apiKey=${API_KEY}`;
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
								<div onClick={() => openContentModal(article)} style={{ backgroundImage: "linear-gradient(180deg, rgba(221,217,217,1) 0%, rgba(25,25,25,1) 100%)" }} className="article-card">
									<div>
									<p>Source: {article.source.name}</p>
									<h5>{article.title}</h5>
									</div>
								</div>
							</div>
						);
					} else {
						return (
							<div key={i}>
								<div onClick={() => openContentModal(article)} style={{ backgroundImage: `url(${article.urlToImage})` }} className="article-card">
									<div>
									<p>Source: {article.source.name}</p>
									<h5>{article.title}</h5>
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

	searchArticles = (endpoint) => {
		this.setState({ articles: [], isloading: true, modal: false });
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

	applyFilters = () => {
		if(this.state.query === "" || this.state.from === "" || this.state.to === "") {
			return null;
		}
		const endpoint = `${API_URL}everything?q=${this.state.query}&from=${this.state.from}&to=${this.state.to}&sortBy=${this.state.sortBy}&apiKey=${API_KEY}`;
		this.searchArticles(endpoint);
	}

	clearFilters = () => {
		const articles = this.state.originalArticles;
		this.setState({ articles, query: "", from: "", to: "", sortBy: "popularity", modal: false });
	}

	render() {
		const {selectedArticle} = this.state;
		return (
			<div className="mt-2 container">
				<div className="text-right">
					<button className="btn btn-outline-info" onClick={() => this.openModal()}>Filters</button>
				</div>
					{ this.renderContent() }
				{
					this.state.isloading ? <div className="d-flex justify-content-center"><Spinner /></div> : null 
				}
				<Modal show={this.state.modal} title="Filters" onClose={this.closeModal}>
					<div className="text-center text-danger">All * are required</div>
					<div className="form-group">
					    <label>Query *</label>
					    <input placeholder="Query..." type="text" name="query" onChange={this.handleChange} value={this.state.query} className="form-control" />
					 </div>
					<div className="form-group">
					    <label>From *</label>
					    <input type="date" name="from" onChange={this.handleChange} value={this.state.from} className="form-control" />
					 </div>
					 <div className="form-group">
					    <label>To *</label>
					    <input type="date" name="to" onChange={this.handleChange} value={this.state.to} className="form-control" />
					 </div>
					 <div className="form-group">
					    <label>Sort By</label>
					    <select value={this.state.sortBy} name="sortBy" onChange={this.handleChange} className="form-control">
					    	<option value="popularity">Popularity</option>
					    	<option value="relevancy">Relevancy</option>
					    	<option value="publishedAt">Published At</option>
					    </select>
					 </div>
					 <button onClick={this.applyFilters} className="btn btn-info">
					 	Apply
					 </button>
					 <button onClick={this.clearFilters} className="ml-2 btn btn-danger">Clear</button>
				</Modal>

				<Modal show={this.state.contentModal} title="News" onClose={this.closeContentModal}>
					<div>
						{ selectedArticle.urlToImage ? <img alt="News Image" className="modal-img" src={selectedArticle.urlToImage} /> : null }
						<h3>{selectedArticle.title}</h3>
						<p>Author : {selectedArticle.author}</p>
						<p>{selectedArticle.description}</p>
					</div>
				</Modal>
			</div>
		);
	}
}

export default AllNews;