import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Main from "./pages/main/Main";
import Header from "./components/Header";
import Snowfall from "react-snowfall";
import { isNewYear, timeToNewYear } from "./newYear";

function App() {
    const [color, setColor] = useState("#ffe");
    const [speed, setSpeed] = useState<number>(1);
    const [snowflakeCount, setSnowflakeCount] = useState<number>(100);

    useEffect(() => {
        if (timeToNewYear() < 1000 * 60 * 30) {
            const check = setTimeout(() => {
                if (isNewYear()) {
                    setColor("#33f");
                    setSpeed(0.01);
                    setSnowflakeCount(200);
                    clearTimeout(check);
                }
            }, 10000);
        }
    }, []);

    return (
        <div className="wrapper">
            <Snowfall color={color} snowflakeCount={snowflakeCount} speed={[speed, speed]} />
            <Header />
            <Switch>
                <Route path="/" exact>
                    <Main />
                </Route>
                <Redirect to="/" />
            </Switch>
        </div>
    );
}

export default App;
