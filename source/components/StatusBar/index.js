// Core
import React, { Component } from 'react';
import cx from 'classnames';
import { Transition } from 'react-transition-group';
import { fromTo } from 'gsap';
import { Link } from 'react-router-dom';
import { func, bool } from 'prop-types';

//Components
import { withProfile } from 'components/HOC/withProfile';

// Instruments
import Styles from './styles.m.css';
import { socket } from 'socket/init';

@withProfile
export default class StatusBar extends Component {
    static propTypes = {
        _setLoginAsync: func.isRequired,
        _setLoginAsync: func.isRequired,
        authenticated: bool.isRequired,
    }

    state = {
        online: false,
    }

    componentDidMount() {
        socket.on('connect', () => {
            this.setState({
                online: true,
            });
        });

        socket.on('disconnect', () => {
            this.setState({
                online: false,
            });
        });
    }

    componentWillUnmount() {
        socket.removeLisener('connect');
        socket.removeLisener('disconnect');
    }

    _animateStatusBarEnter = (composer) => {
        fromTo(composer, 1, { opacity: 0 }, { opacity: 1 });
    }

    _hendlerLogoutAsync = () => {
        const { _setLogoutAsync } = this.props;

        _setLogoutAsync();
    }

    _hendlerLoginAsync = () => {
        const { _setLoginAsync } = this.props;

        _setLoginAsync();
    };

    render() {
        const { avatar, currentUserFirstName, authenticated } = this.props;
        const { online } = this.state;

        const statusStyle = cx(Styles.status, {
            [ Styles.online ]: online,
            [ Styles.offline ]: !online,
        });

        const statusMessage = online ? 'Online' : 'Offline';

        const loginMenu = (() => {
            return (
                <>
                    <div className = { statusStyle } >
                        <div>{ statusMessage }</div>
                        <span />
                    </div>
                    <Link to = '/profile'>
                        <img src = { avatar } />
                        <span>{`${currentUserFirstName}`}</span>
                    </Link>
                    <Link to = '/feed'>Feed</Link>
                    <Link to = '/login' onClick = { this._hendlerLogoutAsync }>Logout</Link>
                </>
            );
        })();

        const logoutMenu = (() => {
            return (
                <Link to = '/feed' onClick = { this._hendlerLoginAsync }>Login</Link>
            );
        })();

        return (
            <Transition
                appear
                in
                timeout = { 1000 }
                onEnter = { this._animateStatusBarEnter }>
                <section className = { Styles.statusBar } >
                    { authenticated ? loginMenu : logoutMenu }
                </section>
            </Transition>
        );
    }
}
