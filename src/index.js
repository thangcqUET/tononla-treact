import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import Modal from "react-modal";
import ReactPixel from 'react-facebook-pixel';
Modal.setAppElement("#root");
const pixelId = '1639306860219722';
ReactPixel.init(pixelId);
ReactPixel.pageView(); // For tracking page views
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);