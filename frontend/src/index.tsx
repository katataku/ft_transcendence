import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { Match} from "./Match";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <div><Routes>
              <Route path="/" element={<App />} />
              <Route path="/match" element={<Match />} />
          </Routes></div>
      </BrowserRouter>
  </React.StrictMode>
);
