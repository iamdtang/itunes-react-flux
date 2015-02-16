/*
 * ========================================================================
 * Actions
 * ========================================================================
 */
var actions = Reflux.createActions([
	'iTunesApiSearch'
]);

/*
 * ========================================================================
 * Data Stores
 * ========================================================================
 */
var iTunesApiStore = Reflux.createStore({
	init: function() {
		this.listenTo(actions.iTunesApiSearch, this.search);
	},

	search: function(searchTerm) {
		var self = this;
		var base = 'https://itunes.apple.com/search';
		var url = base + '?' + $.param({ term: searchTerm }) + '&callback=?';

		return $.getJSON(url).then(function(response) {
			console.log(response);
			self.trigger(response.results);
		});
	}
});

/*
 * ========================================================================
 * React Components
 * ========================================================================
 */
var App = React.createClass({
	mixins: [Reflux.connect(iTunesApiStore, 'results')],
	getInitialState: function() {
		return {
			results: []
		};
	},
	
	handleSearch: function(term) {
		this.setState({ search: term });
		actions.iTunesApiSearch(term);
	},

	render: function() {
		var content;

		if (this.state.search && this.state.results.length > 0) {
			content = <ItunesResults results={this.state.results} term={this.state.search} />;
		} else {
			content = <MakeASearch />;
		}

		return (
			<div className="container">
				<h1>iTunes Search App</h1>
				<Search onSearch={this.handleSearch} />
				{content}
			</div>
		);
	}
});

var Search = React.createClass({
	propTypes: {
		onSearch: React.PropTypes.func.isRequired
	},

	handleSubmit: function(e) {
		e.preventDefault();
		this.props.onSearch(this.refs.searchTerm.getDOMNode().value);
	},

	render: function() {
		return (
			<form onSubmit={this.handleSubmit}>
				<div className="form-group">
					<input type="text" ref="searchTerm" defaultValue="limp bizkit" className="search-input" />
				</div>
				<div className="form-group">
					<input type="submit" value="Search" className="btn btn-primary" />
				</div>
			</form>
		);
	}
});

var ItunesResults = React.createClass({
	propTypes: {
		results: React.PropTypes.array.isRequired,
		term: React.PropTypes.string.isRequired
	},

	render: function() {
		return (
			<div>
				<ResultCount count={this.props.results.length} term={this.props.term} />
				{this.props.results.map(function(item) {
					return <ItunesItemResult item={item} />
				})}
			</div>
		);
	}
});

var ItunesItemResult = React.createClass({
	propTypes: {
		item: React.PropTypes.object.isRequired    
	},

	render: function() {
		return (
			<div className="itunes-item clearfix">
				<img src={this.props.item.artworkUrl100} />
				<h5>{this.props.item.artistName}</h5>
				<p>{this.props.item.trackName}</p>
				<p>Album: {this.props.item.collectionName} (${this.props.item.collectionPrice})</p>
				<p>Price: ${this.props.item.trackPrice}</p>
			</div>
		);
	}
});

var MakeASearch = React.createClass({
	render: function() {
		return (
			<div className="make-a-search">
				<p>Please make a search ...</p>
			</div>
		);
	}
});

var ResultCount = React.createClass({
	propTypes: {
		count: React.PropTypes.number.isRequired,
		term: React.PropTypes.string.isRequired    
	},

	render: function() {
		var message;

		if (this.props.count === 1) {
			message = this.props.count + " result found for " + this.props.term;
		} else {
			message = this.props.count + " results found for " + this.props.term;
		}

		return (
			<p><strong>{message}</strong></p>
		);
	}
});

/*
 * ========================================================================
 * Bootstrapping
 * ========================================================================
 */
React.render(<App />, document.body);
