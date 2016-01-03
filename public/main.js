var React = require('react');
var ReactDOM = require('react-dom');


//General item list contains list element(sublist, next button, pre button)
//initially query the top list from the api
var HNReaderItemPanel = React.createClass({
	getInitialState: function() {
		return {top: [], current: [], page: 1};
	},
	componentDidMount: function() {
		$.ajax({
			url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
			dataType: 'json',
			cache: true,
			success: function(data) {
				this.setState({top: data, current: data.slice(0, 10)});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error('https://hacker-news.firebaseio.com/v0/topstories.json', 
					status, err.toString());
			}.bind(this)
		});
	},
	handleNextClick: function(event) {
		var page = (this.state.page == 50) ? this.stage.page : this.state.page + 1;
		var top = this.state.top;
		this.setState({page: page, current: top.slice(page * 10 - 9, page * 10)});
	},
	handlePreviousClick: function(event) {
		var page = (this.state.page == 1) ? this.state.page : this.state.page - 1;
		var top = this.state.top;
		this.setState({page: page, current: top.slice(page * 10 - 9, page * 10)});

	},
	render: function() {
		return (
			<div className="ui two column grid stackable">
				<div className="column">
					<div className="ui segment">
						<div className="ui top attached button" onClick={this.handlePreviousClick}>Previous</div>
						<HNReaderItemList current={this.state.current} />
						<div className="ui bottom attached button" onClick={this.handleNextClick}>Next</div>
					</div>
				</div>
				<div className="column">
					<div className="ui text container">
						<div className="ui header">
							React-HN-Reader
						</div>
						<p>Source code: <a href="https://github.com/r2dev/React-HN-Reader" target="_blank">github.com/r2dev/React-HN-Reader</a></p>
						<p>Built with: 
							<a href="https://facebook.github.io/react/" target="_blank">ReactJS</a>
							<span>&</span>
							<a href="http://semantic-ui.com/" target="_blank">Semantic-ui</a>
						</p>
					</div>
				</div>
			</div>
			);
	}
});

//10 items
var HNReaderItemList = React.createClass({
	render: function() {
		var itemNodes = this.props.current.map(function(itemId) {
			return (
				<HNReaderItem itemId={itemId} key={itemId} />
				);
		});
		return (
			<div className="ui list divided">
				{itemNodes}
			</div>
			);
	}
}); 

//Single story item
var HNReaderItem = React.createClass({
	getInitialState: function() {
		return {item: {}};
	},
	componentDidMount: function() {
		$.ajax({
			url: 'https://hacker-news.firebaseio.com/v0/item/' + this.props.itemId + '.json',
			dataType: 'json',
			cache: true,
			success: function(data) {
				this.setState({item: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error('https://hacker-news.firebaseio.com/v0/item/' + this.props.itemId + 
					'.json', status, err.toString());
			}.bind(this)
		});
	},
	render: function() {
		var comment_url = "https://news.ycombinator.com/item?id=" + this.state.item.id;
		return (
			<div className="item">
				<div className="right floated content">
					<a href={comment_url} target="_blank">
						<div className="ui button">{this.state.item.descendants}</div>
					</a>
				</div>
				<div className="content">
					<a href={this.state.item.url} target="_blank">
						<div className="header">{this.state.item.title}</div>
						<div className="meta">
							<span className="author">{this.state.item.by}</span>
						</div>
					</a>
				</div>
			</div>
			);
	}
});

ReactDOM.render(<HNReaderItemPanel/>, document.getElementById('content'));