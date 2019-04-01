// Core
import React, { Component } from 'react';
import moment from 'moment';

// Components
import Composer from 'components/Composer';
import Post from 'components/Post';
import StatusBar from 'components/StatusBar';
import Spinner from 'components/Spinner';

// Instrumnets
import Styles from './styles.m.css';
import { getUniqueID } from 'instruments';

export default class Feed extends Component {
    constructor () {
        super();

        this._createPost = this._createPost.bind(this);
    }

    state = {
        posts: [
            { id: '123', comment: 'Hi, I am here!', created: 1526825076849 },
            { id: '456', comment: 'Привет!', created: 1526825076555 },
        ],
        isPostsFetching: true,
    };

    _createPost (comment) {
        const post = {
            id: getUniqueID(),
            created: moment.utc(),
            comment: comment,
        };

        this.setState(({ posts }) => ({
            posts: [ post, ...posts ],
        }));
    }

    render() {
        const { posts, isPostsFetching } = this.state;

        const postJSX = posts.map((post) => {
            return <Post key = { post.id } { ...post } />;
        });

        return (
            <section className = { Styles.feed }>
                < Spinner isSpinning = { isPostsFetching } />
                < StatusBar />
                < Composer _createPost = { this._createPost } />
                { postJSX }
            </section>
        );
    }
}
