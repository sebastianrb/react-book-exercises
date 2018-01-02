import React, { Component } from "react";
import "./App.css";

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
			list,
			searchTerm: ""
		};

		this.onDismiss = this.onDismiss.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
	}

	onDismiss(id) {
		function isNotId(item) {
			return item.objectID !== id;
		}
		const updatedList = this.state.list.filter(isNotId);

		this.setState({ list: updatedList });
	}

	onSearchChange(event) {
		let input = event.target.value;
		this.setState({
			searchTerm: input
		});
	}

	render() {
		return (
			<div className="page">
				<div className="App interactions">
					<Search value={this.state.searchTerm} onChange={this.onSearchChange}>
						Search text
					</Search>
					<Table list={this.state.list} pattern={this.state.searchTerm} onDismiss={this.onDismiss} />
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
	const { value, onChange, children } = props;
	return (
		<form>
			{children} <input type="text" value={value} onChange={onChange} />{" "}
		</form>
	);
};

const Table = props => {
	const { list, pattern, onDismiss } = props;
	return (
		<div className="table">
			{list.filter(isSearched(pattern)).map(item =>
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
