import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RepositoryProvider from "./components/RepositoryProvider";
import Home from "./views/Home";

function render() {
    ReactDOM.render(
        <RepositoryProvider>
            <Home />
        </RepositoryProvider>,
        document.getElementById("root")
    );
}

render();