import React from 'react';
import './AppLayout.css';

import { renderRoutes } from 'react-router-config';

function App({ route }) {
  return (
    <div className="app">
      <header className="app-header">
        {renderRoutes(route.routes)}
      </header>
    </div>
  );
}

export default App;
