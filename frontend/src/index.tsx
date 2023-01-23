import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { Matches } from "./Matches";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <div><Routes>
              <Route path="/" element={<App />} />
              <Route path="/matches" element={<Matches />} />
          </Routes></div>
      </BrowserRouter>
  </React.StrictMode>
);
