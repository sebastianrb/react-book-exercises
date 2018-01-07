import React from "react";
import classNames from "classnames";
import Button from "./Button";

const Sort = ({ activeSortKey, sortKey, onSort, children }) => {
	const sortClass = classNames("button-inline", { "button-active": sortKey === activeSortKey });

	return (
		<Button className={sortClass} onClick={() => onSort(sortKey)}>
			{children}
		</Button>
	);
};
export default Sort;
