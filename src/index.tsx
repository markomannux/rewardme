import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import DatabaseService from './services/database-service';
import * as serviceWorker from './serviceWorker';

const initApp = async () => {
    const databaseService = DatabaseService()
    await databaseService.init()
    ReactDOM.render(<App />, document.getElementById('root'));
}

initApp()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
