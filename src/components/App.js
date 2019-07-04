import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Header';
import AllNews from './AllNews';
import News from './News';
import Home from './Home';
import NotFound from './NotFound';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<React.Fragment>
					<Header />
					<Switch>
						<Route path="/" component={Home} exact />
						<Route path="/news" component={AllNews} exact />
						<Route path="/:channelId" component={News} exact />
						<Route component={NotFound} />
					</Switch>
				</React.Fragment>
			</BrowserRouter>
		);
	}
}

export default App;
