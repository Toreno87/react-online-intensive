// Core
import React, { Component } from 'react';
import moment from 'moment';

// Components
import { withProfile } from 'components/HOC/withProfile';
import Composer from 'components/Composer';
import Post from 'components/Post';
import StatusBar from 'components/StatusBar';
import Spinner from 'components/Spinner';

// Instrumnets
import Styles from './styles.m.css';
import { getUniqueID, delay } from 'instruments';

@withProfile
export default class Feed extends Component {
    state = {
        posts: [
            {
                id: '123',
                comment: 'Hi, I am here!',
                created: moment.utc(1526825076849),
                likes: [],
            },
            {
                id: '456',
                comment: 'Привет!',
                created: moment.utc(1526825076555),
                likes: [],
            },
        ],
        isPostsFetching: false,
    };

    _setPostFetchingState = (state) => {
        this.setState({
            isPostsFetching: state,
        });
    }

    _createPost = async (comment) => {
        this._setPostFetchingState(true);

        const post = {
            id: getUniqueID(),
            created: moment.utc(),
            comment: comment,
            likes: [],
        };

        await delay(1200);

        this.setState(({ posts }) => ({
            posts: [ post, ...posts ],
            isPostsFetching: false,
        }));
    }

    _likePost = async (id) => {
        const { currentUserFirstName, currentUserLastName} = this.props;
        this._setPostFetchingState(true);

        await delay(1200);

        const newPosts = this.state.posts.map((post) => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: [
                        {
                            id: getUniqueID(),
                            firstName: currentUserFirstName,
                            lastName: currentUserLastName,
                        },
                    ],
                };
            }

            return post;
        });

        this.setState({
            posts: newPosts,
            isPostsFetching: false,
        });
    }

    _removePost = async (id) => {
        this._setPostFetchingState(true);

        await delay(1200);

        const newPosts = this.state.posts.filter(post => post.id !== id);

        this.setState({
            posts: newPosts,
            isPostsFetching: false,
        });
    }

    render() {
        const { posts, isPostsFetching } = this.state;

        const postJSX = posts.map((post) => {
            return (
                <Post
                    key = { post.id }
                    { ...post }
                    _likePost = { this._likePost }
                    _removePost = { this._removePost }
                />
            );
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

