import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import register from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
reportWebVitals();
register();
