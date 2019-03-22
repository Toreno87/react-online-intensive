// Core
import React, { Component } from 'react';

// Components
import Composer from 'components/Composer';
import Post from 'components/Post';
import StatusBar from 'components/StatusBar';

// Instrumnets
import Styles from './styles.m.css';

export default class Feed extends Component {
    render() {
        const {
            avatar,
            currentUserFirstName,
            currentUserLastName,
        } = this.props;

        return (
            <section className = { Styles.feed }>
                < StatusBar />
                < Composer
                    avatar = { avatar }
                    currentUserFirstName = { currentUserFirstName }
                />
                < Post { ...this.props } />
            </section>
        );
    }
}
