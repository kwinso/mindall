import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Main from './pages/main/Main';
import Header from './components/Header';

function App() {
  return (
    <div className="wrapper">
      <Header />
      <Switch>
        <Route path="/" exact>
          <Main />
        </Route>
        {/* <Route path="/chat">
          <Chat />
        </Route> */}
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
