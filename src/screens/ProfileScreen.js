import React, { Component } from 'react';
import ProfileContainer from 'containers/ProfileContainer';

class ProfileScreen extends Component {
    render() {
        return (
            <ProfileContainer navigation={this.props.navigation} />
        )
    }
}

export default ProfileScreen;