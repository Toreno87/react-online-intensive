// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, Redirect } from 'react-router-dom';

// Components
import Catcher from 'components/Catcher';
import Feed from 'components/Feed';
import Profile from 'components/Profile';
import { Provider } from 'components/HOC/withProfile';
import StatusBar from 'components/StatusBar';

//  Instruments
import avatar from 'theme/assets/lisa';

const options = {
    avatar,
    currentUserFirstName: 'Константин',
    currentUserLastName: 'Кудрицкий',
};


@hot(module)
export default class App extends Component {
    render() {
        return (
            <Catcher>
                <Provider value = { options } >
                    <StatusBar />
                    <Switch>
                        <Route component = { Feed } path = '/feed' />
                        <Route component = { Profile } path = '/profile' />
                        <Redirect to = '/feed' />
                    </Switch>
                </Provider>
            </Catcher>
        );
    }
}
