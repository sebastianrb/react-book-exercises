import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

//hot module refresh

if (process.env.NODE_ENV === "development") {
	if (module.hot) {
		module.hot.accept();
	}
}
