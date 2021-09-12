import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from './pages/main/Main';
import Chat from './pages/chat/Chat';
import Header from './components/header/Header';

function App() {
  return (
    <div>
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