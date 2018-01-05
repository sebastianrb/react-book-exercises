import React, { Component } from "react";
import "./App.css";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "20";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

// const url = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

const list = [
	{
		title: "React",
		url: "https://facebook.github.io/react/",
		author: "Jordan Walke",
		num_comments: 3,
		points: 4,
		objectID: 0
	},
	{
		title: "JS",
		url: "javascript.com",
		author: "World",
		num_comments: 2,
		points: 5,
		objectID: 1
	},
	{
		title: "CSS",
		url: "css.com",
		author: "World",
		num_comments: 2,
		points: 5,
		objectID: 2
	},
	{
		title: "HTML",
		url: "html.com",
		author: "World",
		num_comments: 5,
		points: 5,
		objectID: 3
	},
	{
		title: "Sass",
		url: "sass.com",
		author: "World",
		num_comments: 1,
		points: 5,
		objectID: 4
	}
];

//define higher order function for evaluating searches
function isSearched(searchTerm) {
	//returns a function, which will be the filter parameter (needs a function)
	//this returned function will have access to each item of the filtered array
	return function(item) {
		return item.title.toLowerCase().includes(searchTerm.toLowerCase());
	};
}

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			//serach key holds each term submitted to the API. Search term changes every time the user types
			searchKey: "",
			results: null,
			searchTerm: DEFAULT_QUERY,
			error: null
		};

		this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
	}

	componentDidMount() {
		const { searchTerm } = this.state;
		this.setState({
			searchKey: searchTerm
		});
		this.fetchSearchTopStories(searchTerm);
	}

	needsToSearchTopStories(searchTerm) {
		return !this.state.results[searchTerm];
	}

	onSearchSubmit(event) {
		const { searchTerm } = this.state;
		this.setState({
			searchKey: searchTerm
		});

		//only make API call if the search term isn't yet in the results object
		if (this.needsToSearchTopStories(searchTerm)) {
			this.fetchSearchTopStories(searchTerm);
		}

		event.preventDefault();
	}

	setSearchTopStories(result) {
		//process the returned data and save to internal state
		const { hits, page } = result;
		const { searchKey, results } = this.state;
		// const oldHits = page !== 0 ? this.state.result.hits : [];
		const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
		const updatedHits = [...oldHits, ...hits];
		this.setState({
			// result: {
			// 	hits: updatedHits,
			// 	page
			// }
			results: {
				...results,
				[searchKey]: { hits: updatedHits, page }
			}
		});
	}

	fetchSearchTopStories(searchTerm, page = 0) {
		//using the native fetch API, call Hacker News endpoint
		fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
			.then(response => response.json())
			.then(result => this.setSearchTopStories(result))
			.catch(error => {
				this.setState({
					error
				});
			});
	}

	onDismiss(id) {
		const { searchKey, results } = this.state;
		const { hits, page } = results[searchKey];
		function isNotId(item) {
			return item.objectID !== id;
		}
		const updatedHits = hits.filter(isNotId);
		//create new object in state by merging other objects
		this.setState({
			// result: Object.assign({}, this.state.result, { hits: updatedHits })
			results: { ...results, [searchKey]: { hits: updatedHits, page } }
		});
	}

	onSearchChange(event) {
		let input = event.target.value;
		this.setState({
			searchTerm: input
		});
	}

	render() {
		const { searchTerm, results, searchKey, error } = this.state;
		const page = (results && results[searchKey] && results[searchKey].page) || 0;
		console.log("Page: ", page);

		const list = (results && results[searchKey] && results[searchKey].hits) || [];

		let table;

		if (!results) {
			table = null;
		} else {
			table = <Table list={list} onDismiss={this.onDismiss} />;
		}

		if (error) {
			table = <p>Something went wrong.</p>;
		}

		return (
			<div className="page">
				<div className="App interactions">
					<Search onSubmit={this.onSearchSubmit} value={this.state.searchTerm} onChange={this.onSearchChange}>
						Search
					</Search>
					{table}
				</div>
				<div className="interactions">
					<Button
						onClick={() => {
							this.fetchSearchTopStories(searchKey, page + 1);
						}}
					>
						More
					</Button>
				</div>
			</div>
		);
	}
}

// class Search extends Component {
// 	render() {
// 		const { value, onChange } = this.props;
// 		return (
// 			<form>
// 				<input type="text" value={value} onChange={onChange} /> {this.props.children}
// 			</form>
// 		);
// 	}
// }

const Search = props => {
	const { value, onChange, children, onSubmit } = props;
	return (
		<form onSubmit={onSubmit}>
			{children} <input type="text" value={value} onChange={onChange} /> <button type="submit">{children}</button>
		</form>
	);
};

const Table = props => {
	const { list, onDismiss } = props;
	return (
		<div className="table">
			{list.map(item =>
				<div key={item.objectID} className="table-row">
					<span>
						<a href={item.url}>
							{item.title}
						</a>
					</span>
					<span>
						{item.author}
					</span>
					<span>
						{item.num_comments}
					</span>
					<span>
						{item.points}
					</span>
					<span>
						<Button
							onClick={() => {
								onDismiss(item.objectID);
							}}
							className="button-inline"
						>
							Dismiss
						</Button>
					</span>
				</div>
			)}
		</div>
	);
};

// class Table extends Component {
// 	render() {
// 		const { list, pattern, onDismiss } = this.props;
// 		return (
// 			<div>
// 				{list.filter(isSearched(pattern)).map(item =>
// 					<div key={item.objectID}>
// 						<span>
// 							<a href={item.url}>
// 								{item.title}
// 							</a>
// 						</span>
// 						<span>
// 							{item.author}
// 						</span>
// 						<span>
// 							{item.num_comments}
// 						</span>
// 						<span>
// 							{item.points}
// 						</span>
// 						<span>
// 							<Button
// 								onClick={() => {
// 									onDismiss(item.objectID);
// 								}}
// 								className="button-class"
// 							>
// 								Dismiss
// 							</Button>
// 						</span>
// 					</div>
// 				)}
// 			</div>
// 		);
// 	}
// }

const Button = props => {
	const { onClick, className = "", children } = props;
	return (
		<button onClick={onClick} className={className} type="button">
			{children}
		</button>
	);
};

// class Button extends Component {
// 	render() {
// 		const { onClick, className = "", children } = this.props;
// 		return (
// 			<button onClick={onClick} className={className} type="button">
// 				{children}
// 			</button>
// 		);
// 	}
// }

export default App;
