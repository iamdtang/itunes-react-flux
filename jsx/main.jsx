var actions = Reflux.createActions([
	'iTunesApiSearch'
]);

var iTunesApiStore = Reflux.createStore({
	init: function() {
		this.listenTo(actions.iTunesApiSearch, this.search);
	},

	search: function(searchTerm) {
		var self = this;
		var base = 'https://itunes.apple.com/search';
		var url = base + '?' + $.param({ term: searchTerm }) + '&callback=?';

		self.trigger('')

		return $.getJSON(url).then(function(response) {
			console.log(response);
			self.trigger(response.results);
		});
	}
});

var Search = React.createClass({
	getInitialState: function() {
		return {
			searchTerm: 'limp bizkit'
		}
	},

	handleSearch: function(e) {
		e.preventDefault();
		actions.iTunesApiSearch(this.refs.searchTerm.getDOMNode().value);
	},

	render: function() {
		return (
			<form onSubmit={this.handleSearch}>
				<div className="form-group">
					<input type="text" ref="searchTerm" value={this.state.searchTerm} className="search-input" />
				</div>
				<div className="form-group">
					<input type="submit" value="Search" className="btn btn-primary" />
				</div>
			</form>
		);
	}
});

var ItunesResults = React.createClass({
	mixins: [Reflux.connect(iTunesApiStore, 'results')],
	getInitialState: function() {
		return {
			results: [],
			searchTerm: null
		};
	},

	render: function() {
		if (this.state.results.length === 0 && !this.state.searchTerm) {
			return <MakeASearch />;
		} 

		if (this.state.results.length === 0) {
			return <NoResults />;
		}

		return (
			<div>
				<ResultCount count={this.state.results.length} />
				{this.state.results.map(function(item) {
					return <ItunesItemResult item={item} />
				})}
			</div>
		);
	}
});

var ItunesItemResult = React.createClass({
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

var NoResults = React.createClass({
	render: function() {
		return (
			<div>
				<p>No results found.</p>
			</div>
		);
	}
});

var ResultCount = React.createClass({
	render: function() {
		var message;

		if (this.props.count === 1) {
			message = this.props.count + " result found.";
		} else {
			message = this.props.count + " results found.";
		}

		return (
			<p><strong>{message}</strong></p>
		);
	}
});

React.render(<Search />, document.querySelector('.search'));
React.render(<ItunesResults />, document.querySelector('.results'));