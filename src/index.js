import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";


import { Provider } from 'react-redux';
import reduxStore, { persistor } from './redux';
import { GoogleOAuthProvider } from '@react-oauth/google';

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            {/* <IntlProviderWrapper>
                <App persistor={persistor}/>
            </IntlProviderWrapper> */}
            <GoogleOAuthProvider clientId="298140789180-bgebj01qo9kcjd6h1c5s0n4oihhbdhkm.apps.googleusercontent.com">
                <IntlProviderWrapper>
                    <App persistor={persistor}/>
                </IntlProviderWrapper>
            </GoogleOAuthProvider>
        </Provider>,
        document.getElementById('root')
    );
};

renderApp();
serviceWorker.unregister();
