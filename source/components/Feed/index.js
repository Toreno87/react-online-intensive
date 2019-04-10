// Core
import React, { Component } from 'react';

// Components
import { withProfile } from 'components/HOC/withProfile';
import Catcher from 'components/Catcher';
import Composer from 'components/Composer';
import Post from 'components/Post';
import StatusBar from 'components/StatusBar';
import Spinner from 'components/Spinner';


// Instrumnets
import Styles from './styles.m.css';
import { api, TOKEN, GROUP_ID } from 'config/api';
import { socket } from 'socket/init';

@withProfile
export default class Feed extends Component {
    state = {
        posts: [],
        isPostsFetching: false,
    };

    componentDidMount () {
        const { currentUserFirstName, currentUserLastName} = this.props;

        this._fetchPosts();
        socket.emit('join', GROUP_ID);

        socket.on('create', (postJSON) => {
            const { data: createdPost, meta } = JSON.parse(postJSON);

            if (
                `${currentUserFirstName} ${currentUserLastName}` !==
                `${meta.authorFirstName} ${meta.authorLastName}`
            ) {
                this.setState(({ posts }) ({
                    posts: [ createdPost, ...posts ],
                }));
            }
        });

        socket.on('remove', (postJSON) => {
            const { data: removedPost, meta } = JSON.parse(postJSON);

            if (
                `${currentUserFirstName} ${currentUserLastName}` !==
                `${meta.authorFirstName} ${meta.authorLastName}`
            ) {
                this.setState(({ posts }) ({
                    posts: posts.filter((post) => post.id !== removedPost.id),
                }));
            }
        });

        socket.on('like', (postJSON) => {
            const { data: {id, likes}, meta } = JSON.parse(postJSON);

            if (
                `${currentUserFirstName} ${currentUserLastName}` !==
                `${meta.authorFirstName} ${meta.authorLastName}`
            ) {
                this.setState(({ posts }) => {
                    return (
                        {
                            posts: posts.map((post) => {
                                if (post.id === id) {
                                    post.likes = [ ...likes ];
                                }

                                return post;
                            }),
                        }
                    );
                });
            }
        });
    }

    componentWillUnmount () {
        socket.removeListener('create');
        socket.removeListener('remove');
        socket.removeListener('like');
    }

    _setPostFetchingState = (state) => {
        this.setState({
            isPostsFetching: state,
        });
    }

    _fetchPosts = async () => {
        this._setPostFetchingState(true);

        const responce = await fetch(api, {
            method: 'GET',
        });

        const { data: posts } = await responce.json();

        this.setState({
            posts,
            isPostsFetching: false,
        });
    }

    _createPost = async (comment) => {

        this._setPostFetchingState(true);
        const responce = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify({ comment }),
        });
        const { data: post } = await responce.json();
        this.setState(({ posts }) => ({
            posts: [ post, ...posts ],
            isPostsFetching: false,
        }));
    }

    _likePost = async (id) => {
        this._setPostFetchingState(true);

        const responce = await fetch(`${api}/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: TOKEN,
            },
        });

        const { data: likePost } = await responce.json();

        this.setState(({ posts }) => ({
            posts: posts.map(
                (post) => post.id === likePost.id ? likePost : post,
            ),
            isPostsFetching: false,
        }));
    }

    _removePost = async (id) => {
        this._setPostFetchingState(true);

        await fetch(`${api}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        this.setState(({ posts }) => ({
            posts: posts.filter((post) => post.id !== id),
            isPostsFetching: false,
        }));
    }

    render() {
        const { posts, isPostsFetching } = this.state;

        const postJSX = posts.map((post) => {
            return (
                <Catcher key = { post.id }>
                    <Post
                        { ...post }
                        _likePost = { this._likePost }
                        _removePost = { this._removePost }
                    />
                </Catcher>
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

