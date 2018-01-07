import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import Sort from "./Sort";

const Table = props => {
	const { list, onDismiss, onSort, sortKey, sortObject, isSortReverse } = props;

	const sortedList = sortObject[sortKey](list);
	const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

	return (
		<div className="table">
			<div className="table-header">
				<span style={{ width: "40%" }}>
					<Sort activeSortKey={sortKey} sortKey={"TITLE"} onSort={onSort}>
						{" "}Title
					</Sort>
				</span>
				<span style={{ width: "30%" }}>
					<Sort activeSortKey={sortKey} sortKey={"AUTHOR"} onSort={onSort}>
						{" "}Author
					</Sort>
				</span>
				<span style={{ width: "10%" }}>
					<Sort activeSortKey={sortKey} sortKey={"COMMENTS"} onSort={onSort}>
						Comments
					</Sort>
				</span>
				<span style={{ width: "10%" }}>
					<Sort activeSortKey={sortKey} sortKey={"POINTS"} onSort={onSort}>
						{" "}Points
					</Sort>
				</span>
				<span style={{ width: "10%" }}>Archive</span>
			</div>
			{reverseSortedList.map(item =>
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

Table.propTypes = {
	list: PropTypes.arrayOf(
		PropTypes.shape({
			objectID: PropTypes.string.isRequired,
			author: PropTypes.string,
			url: PropTypes.string,
			num_comments: PropTypes.number,
			points: PropTypes.number
		})
	).isRequired,
	onDismiss: PropTypes.func.isRequired
};

export default Table;
