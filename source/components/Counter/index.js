//Core
import React from 'react';
import { number } from 'prop-types';

//instruments
import Styles from './styles.m.css';

const Counter = ({ count }) => {
    return <section className = { Styles.counter }>Posts count: { count }</section>
};

Counter.propTypes = {
    count: number.isRequired,
};

Counter.defaultProps = {
    count: 0,
};

export default Counter;
