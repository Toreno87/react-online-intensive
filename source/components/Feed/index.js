// Core
import React, { Component } from 'react';
import { Transition, CSSTransition, TransitionGroup } from 'react-transition-group';
import { fromTo } from 'gsap';

// Components
import { withProfile } from 'components/HOC/withProfile';
import Catcher from 'components/Catcher';
import Composer from 'components/Composer';
import Post from 'components/Post';
import StatusBar from 'components/StatusBar';
import Spinner from 'components/Spinner';
import Postman from 'components/Postman';
import Counter from 'components/Counter';


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
    }

    componentWillUnmount () {
        socket.removeListener('create');
        socket.removeListener('remove');
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

    _animateComposerEnter = (composer) => {
        fromTo(composer, 1, { opacity: 0, rotationX: 50 }, { opacity: 1, rotationX: 0 });
    }

    render() {
        const { posts, isPostsFetching } = this.state;

        const postJSX = posts.map((post) => {
            return (
                <CSSTransition
                    classNames = {{
                        enter: Styles.postInStart,
                        enterActive: Styles.postInEnd,
                        exitActive: Styles.postOutStart,
                        exit: Styles.postOutEnd,
                    }}
                    key = { post.id }
                    timeout = {{ enter: 500, exit: 400}}>
                    <Catcher>
                        <Post
                            { ...post }
                            _likePost = { this._likePost }
                            _removePost = { this._removePost }
                        />
                    </Catcher>
                </CSSTransition>
            );
        });

        return (
            <section className = { Styles.feed }>
                < Spinner isSpinning = { isPostsFetching } />
                < StatusBar />
                <Transition
                    appear
                    in
                    timeout = { 4000 }
                    onEnter = { this._animateComposerEnter }>
                    <Composer _createPost = { this._createPost } />
                </Transition>
                <Counter count = { postJSX.length } />
                <Postman />
                <TransitionGroup>
                    { postJSX }
                </TransitionGroup>
            </section>
        );
    }
}

