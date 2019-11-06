import React, { Component } from 'react';
import AliveContainer from 'containers/AliveContainer';

class AliveScreen extends Component {
    render() {
        return (
            <AliveContainer navigation={this.props.navigation} />
        )
    }
}

export default AliveScreen;