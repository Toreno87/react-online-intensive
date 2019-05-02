// Core
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { func } from 'prop-types';

// Components
import { withProfile } from 'components/HOC/withProfile';

// Instrumnets
import Styles from './styles.m.css';


@withProfile
export default class Login extends Component {
    static propTypes = {
        _setLoginAsync: func.isRequired,
    }

    _hendlerLoginAsync = () => {
        const { _setLoginAsync } = this.props;

        _setLoginAsync();
    };

    render() {
        const { currentUserFirstName } = this.props;

        return (
            <section className = { Styles.login }>
                <h1>Welcome, {currentUserFirstName} </h1>
                <Link to = '/feed' onClick = { this._hendlerLoginAsync } >
                    login to your account?
                </Link>
            </section>
        );
    }
}

