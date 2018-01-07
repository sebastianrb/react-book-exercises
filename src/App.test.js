import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App from "./App";
import Search from "./components/Search";
import Table from "./components/Table";
import Button from "./components/Button";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
	it("renders without crashing", () => {
		const div = document.createElement("div");
		ReactDOM.render(<App />, div);
	});

	test("has a valid snapshot", () => {
		const component = renderer.create(<App />);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe("Search", () => {
	it("renders without crashing", () => {
		const div = document.createElement("div");
		ReactDOM.render(<Search>Search</Search>, div);
	});
	test("has a valid snapshot", () => {
		const component = renderer.create(<Search>Search</Search>);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe("Button", () => {
	it("renders without crashing", () => {
		const div = document.createElement("div");
		ReactDOM.render(
			<Button
				onClick={() => {
					return;
				}}
			>
				Give Me More
			</Button>,
			div
		);
	});
	test("has a valid snapshot", () => {
		const component = renderer.create(<Button>Give Me More</Button>);
		let tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it("shows right text", () => {
		const element = shallow(
			<Button
				onClick={() => {
					return;
				}}
			>
				Button
			</Button>
		);
		expect(element.text()).toEqual("Button");
	});
});

// describe("Table", () => {
// 	const props = {
// 		list: [
// 			{ title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
// 			{ title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" }
// 		],
// 		onDismiss: function() {
// 			console.log("On Dismiss");
// 		},
// 		sortKey: "TITLE",
// 		isSortReverse: false
// 	};

// 	it("renders without crashing", () => {
// 		const div = document.createElement("div");
// 		ReactDOM.render(<Table {...props} />, div);
// 	});
// 	test("has a valid snapshot", () => {
// 		const component = renderer.create(<Table {...props} />);
// 		let tree = component.toJSON();
// 		expect(tree).toMatchSnapshot();
// 	});

// 	//enzyme unit test
// 	it("shows two items in list", () => {
// 		const element = shallow(<Table {...props} />);
// 		expect(element.find(".table-row").length).toBe(2);
// 	});
// });
