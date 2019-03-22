// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import moment from 'moment';

export default class Post extends Component {
    render() {
        const {
            avatar,
            currentUserFirstName,
            currentUserLastName,
        } = this.props;

        return (
            <section className = { Styles.post }>
                <img src = { avatar } />
                <a>{`${currentUserFirstName} ${currentUserLastName}`}</a>
                <time>{ moment().format('MMMM D h:mm:ss a') }</time>
                <p>Hwday</p>
            </section>
        );
    }
}
