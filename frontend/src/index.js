import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 这里可以放置你的全局CSS文件

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
