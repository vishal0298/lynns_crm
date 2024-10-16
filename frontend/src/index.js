import React from "react";
import AppRouter from "./approuter";
import * as serviceWorkerRegistration from "./serviceWorker";
import { createRoot } from "react-dom/client";
// boostrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
//import './assets/js/bootstrap.bundle.min.js';

//fontawesome
import "./assets/plugins/fontawesome/css/all.css";
import "./assets/plugins/fontawesome/css/all.min.css";
import "./assets/plugins/fontawesome/css/fontawesome.min.css";
import "react-datepicker/dist/react-datepicker.css";

//style
import "./assets/css/style.css";
import "./assets/plugins/datatables/datatables.min.css";
import "./assets/plugins/jvectormap/jquery-jvectormap-2.0.3.css";
import "./assets/js/bootstrap.min.js";

// eslint-disable-next-line no-undef
window.$ = $;

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<AppRouter />);

serviceWorkerRegistration.register();
