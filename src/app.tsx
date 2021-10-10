import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Home from "./views/Home";

function render() {
    ReactDOM.render(
        <Home />,
        document.getElementById("root")
    );
}

render();