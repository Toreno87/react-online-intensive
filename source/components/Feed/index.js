// Core
import React, { Component } from 'react';

// Components
import Composer from 'components/Composer';
import Post from 'components/Post';
import StatusBar from 'components/StatusBar';
import Spinner from 'components/Spinner';

// Instrumnets
import Styles from './styles.m.css';

export default class Feed extends Component {
    state = {
        posts: [
            { id: '123', comment: 'Hi, I am here!', created: 1526825076849 },
            { id: '456', comment: 'Привет!', created: 1526825076555 },
        ],
        isSpinning: true,
    };

    render() {
        const { posts, isSpinning } = this.state;

        const postJSX = posts.map((post) => {
            return <Post key = { post.id } { ...post } />;
        });

        return (
            <section className = { Styles.feed }>
                < Spinner isSpinning = { isSpinning } />
                < StatusBar />
                < Composer />
                { postJSX }
            </section>
        );
    }
}
