import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './app.css'
import App from './App';
import { Provider } from 'react-redux';
import {store} from "../src/Redux/store"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store} >
    <App />
  </Provider>
);
