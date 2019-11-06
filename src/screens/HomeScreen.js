import React, { Component } from 'react';
import HomeContainer from 'containers/HomeContainer';

class HomeScreen extends Component {
    render() {
        return (
            <HomeContainer navigation={this.props.navigation} />
        )
    }
}

export default HomeScreen;