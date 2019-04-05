// Core
import React, { Component, createContext } from 'react';

const { Provider, Consumer } = createContext();

const withProfile = (Enchanceable) => {
    return class withProfile extends Component {
        render () {
            return (
                <Consumer>
                    {(context) => <Enchanceable { ...context } { ...this.props } />}
                </Consumer>
            );
        }
    }
};

export { Provider, Consumer, withProfile };
