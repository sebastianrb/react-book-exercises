import React from "react";

// const Search = props => {
// 	const { value, onChange, children, onSubmit } = props;
// 	return (
// 		<form onSubmit={onSubmit}>
// 			{children} <input type="text" value={value} onChange={onChange} /> <button type="submit">{children}</button>
// 		</form>
// 	);
// };

class Search extends React.Component {
	componentDidMount() {
		console.log(this.input);
		this.input.focus();
	}

	render() {
		const { value, onChange, onSubmit, children } = this.props;
		return (
			<form onSubmit={onSubmit}>
				<input
					type="text"
					value={value}
					onChange={onChange}
					ref={node => {
						this.input = node;
					}}
				/>
				<button type="submit">
					{children}
				</button>
			</form>
		);
	}
}

const Sebastian = {
	name: "sebastian",
	age: 29
};

const Joe = {
	name: "Joe",
	age: 32
};

export { Joe, Sebastian };

export default Search;
