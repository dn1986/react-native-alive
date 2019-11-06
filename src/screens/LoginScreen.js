import React, { Component } from 'react';
import LoginContainer from 'containers/LoginContainer';

class LoginScreen extends Component {
    render() {
        return (
            <LoginContainer navigation={this.props.navigation} />
        )
    }
}

export default LoginScreen;