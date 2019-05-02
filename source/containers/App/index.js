// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, Redirect } from 'react-router-dom';

// Components
import Catcher from 'components/Catcher';
import Feed from 'components/Feed';
import Profile from 'components/Profile';
import Login from 'components/Login';
import Spinner from 'components/Spinner';
import { Provider } from 'components/HOC/withProfile';
import StatusBar from 'components/StatusBar';

//  Instruments
import avatar from 'theme/assets/lisa';
import { delay } from 'instruments';

const options = {
    avatar,
    currentUserFirstName: 'Anonymus',
    currentUserLastName: '',
    authenticated: false,
};


@hot(module)
export default class App extends Component {
    state = {
        ...options,
        isPostsFetching: false,
    }

    componentDidMount () {
        this._fethingLogin();
    }

    _setPostFetchingState = (state) => {
        this.setState({
            isPostsFetching: state,
        });
    }

    _fethingLogin = async () => {
        const userObject = localStorage.getItem('authenticated');
        const authenticatedUser = JSON.parse(userObject);

        if (authenticatedUser) {
            this._setPostFetchingState(true);

            await delay(500);
            this.setState({
                currentUserFirstName: authenticatedUser.currentUserFirstName,
                currentUserLastName: authenticatedUser.currentUserLastName,
                authenticated: true,
            });

            this._setPostFetchingState(false);
        }
    }

    _setLoginAsync = async () => {
        this._setPostFetchingState(true);

        await delay(2000);

        const responce = {
            currentUserFirstName: 'Lisa',
            currentUserLastName: 'Simpson',
        };

        localStorage.setItem('authenticated', JSON.stringify(responce));

        this.setState({
            ...responce,
            isPostsFetching: false,
            authenticated: true,
        });
    }

    _setLogoutAsync = async () => {
        this._setPostFetchingState(true);

        await delay(500);

        localStorage.removeItem('authenticated');

        this.setState({
            ...options,
            isPostsFetching: false,
            authenticated: false,
        });
    }

    render() {
        const { authenticated, isPostsFetching } = this.state;
        const params = this.state;

        const feed = (() => (
            <Switch>
                <Route component = { Feed } path = '/feed' />
                <Route component = { Profile } path = '/profile' />
                <Redirect to = 'feed' />
            </Switch>
        ))();

        const login = (() => (
            <Switch>
                <Route render = { () => <Login _setLoginAsync = { this._setLoginAsync } /> } path = '/login' />
                <Redirect to = 'login' />
            </Switch>
        ))();

        return (
            <Catcher>
                <Provider value = { params } >
                    < Spinner isSpinning = { isPostsFetching } />
                    <StatusBar
                        _setLoginAsync = { this._setLoginAsync }
                        _setLogoutAsync = { this._setLogoutAsync }
                        authenticated = { authenticated }
                    />
                    { authenticated ? feed : login }
                </Provider>
            </Catcher>
        );
    }
}
