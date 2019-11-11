import React, {Component} from "react";
import SignupContainer from 'containers/SignupContainer';

class SignupScreen extends Component {
    render() {
        return (
            <SignupContainer navigation={this.props.navigation} />
        )
    }
}

export default SignupScreen;