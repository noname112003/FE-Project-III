import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import {applyMiddleware, createStore} from 'redux';
import { Provider } from 'react-redux';
import rootReducer from "./reducers/rootReducer.tsx";
import logger from 'redux-logger';

const store = createStore(rootReducer, applyMiddleware(logger));
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
      <Provider store={store}>
          <RouterProvider router={router} />
      </Provider>
  // </React.StrictMode>,
)
