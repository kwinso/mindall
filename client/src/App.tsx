import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Main from "./pages/main/Main";
import Header from "./components/Header";
import { Provider as AlertProvider } from "react-alert";
//@ts-ignore
import AlertTemplate from "react-alert-template-basic";

function App() {
    return (
        <AlertProvider template={AlertTemplate} position="top center" transition="scale" timeout={4000}>
            <div className="wrapper">
                <Header />
                <Switch>
                    <Route exact path="/">
                        <Main />
                    </Route>
                    <Route exact path="/:id">
                        <Main />
                    </Route>
                    {/* <Route path="/chat">
                        <Chat />
                    </Route> */}
                    <Redirect to="/" />
                </Switch>
            </div>
        </AlertProvider>
    );
}

export default App;
