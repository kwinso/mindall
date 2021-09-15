import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from './pages/main/Main';
import Chat from './pages/chat/Chat';
import Header from './components/Header';

function App() {
  return (
    <div className="wrapper">
      <Header />
      <Switch>
        <Route path="/" exact>
          <Main />
        </Route>
        <Route path="/chat">
          <Chat />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
