import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { store} from "./redux/store";
import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
// import Spinner from "./components/spinner";
// import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer, toast } from 'react-toastify';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <ContextProvider>
        <ToastContainer
                className="Toastify"
                position={toast.POSITION.TOP_RIGHT}
                autoClose={3000}
              />
          <App />
        </ContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
