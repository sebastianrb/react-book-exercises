import React, { Component } from "react";
import fetch from "isomorphic-fetch";
import _ from "lodash";
import Table from "./components/Table";
import Search, { Sebastian, Joe } from "./components/Search";
import Button from "./components/Button";
import "./App.css";

console.log("Sebastian object: ", Sebastian);
console.log("Joe object: ", Joe);

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "20";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

//define higher order function for evaluating searches
function isSearched(searchTerm) {
	//returns a function, which will be the filter parameter (needs a function)
	//this returned function will have access to each item of the filtered array
	return function(item) {
		return item.title.toLowerCase().includes(searchTerm.toLowerCase());
	};
}

//sort object
const SORTS = {
	NONE: list => list,
	TITLE: list => _.sortBy(list, "title"),
	AUTHOR: list => _.sortBy(list, "author"),
	COMMENTS: list => _.sortBy(list, "num_comments").reverse(),
	POINTS: list => _.sortBy(list, "points").reverse()
};

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			//serach key holds each term submitted to the API. Search term changes every time the user types
			searchKey: "",
			results: null,
			searchTerm: DEFAULT_QUERY,
			error: null,
			isLoading: false,
			sortKey: "NONE",
			isSortReverse: false
		};

		this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onSort = this.onSort.bind(this);
	}

	componentDidMount() {
		const { searchTerm } = this.state;
		this.setState({
			searchKey: searchTerm
		});
		this.fetchSearchTopStories(searchTerm);
	}

	onSort(sortKey) {
		const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
		this.setState({ sortKey, isSortReverse });
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
			},
			isLoading: false
		});
	}

	fetchSearchTopStories(searchTerm, page = 0) {
		//set loading state
		this.setState({
			isLoading: true
		});
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
		const { searchTerm, results, searchKey, error, isLoading, sortKey, isSortReverse } = this.state;
		const page = (results && results[searchKey] && results[searchKey].page) || 0;

		const list = (results && results[searchKey] && results[searchKey].hits) || [];

		let table;

		if (!results) {
			table = null;
		} else {
			table = (
				<Table
					sortObject={SORTS}
					sortKey={sortKey}
					onSort={this.onSort}
					list={list}
					onDismiss={this.onDismiss}
					isSortReverse={isSortReverse}
				/>
			);
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
					{/*					{isLoading
						? <Loading />
						: <Button
								onClick={() => {
									this.fetchSearchTopStories(searchKey, page + 1);
								}}
							>
								More Stories
							</Button>}*/}
					<ButtonWithLoading
						isLoading={isLoading}
						onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
					>
						More Stories
					</ButtonWithLoading>
				</div>
			</div>
		);
	}
}

//use a Higher Order component to handle the Loader
const withLoading = Component => props => {
	console.log(props);
	return props.isLoading ? <Loading /> : <Component {...props} />;
};

const ButtonWithLoading = withLoading(Button);

const Loading = props => {
	return <h3>Loading...</h3>;
};

export default App;
