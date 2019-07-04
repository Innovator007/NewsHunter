import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<div className="news-header">
			<div className="d-flex">
				<p className="logo"><Link to="/">Newshunter</Link></p>
				<p><Link to="/news">Latest News</Link></p>
			</div>
			<p>Credits : <a href="https://newsapi.org">Newsapi</a></p>
		</div>
	);
}

export default Header;