import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import SignIn from 'views/auth/signIn';

import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import illustration from "assets/img/auth/auth.png";

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <React.StrictMode>
            <ThemeEditorProvider>
                <HashRouter>
                    <Switch>
                        <Route path="/auth" component={AuthLayout} />
                        <Route path="/admin" component={AdminLayout} />
                        {/* Route for Sign In */}
                        <Route path="/auth/sign-in" component={SignIn} />
                        {/* Redirect to the Sign In page */}
                        <Redirect exact from="/" to="/auth/sign-in" />
                    </Switch>
                </HashRouter>
            </ThemeEditorProvider>
        </React.StrictMode>
    </ChakraProvider>,
    document.getElementById('root')
);
