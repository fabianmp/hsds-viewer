import React from 'react';
import ReactDOM from 'react-dom';
import { SWRConfig } from 'swr';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig value={{ fetcher: (resource, init) => fetch(resource, init).then(res => res.json()) }}>
      <App />
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root')
);
