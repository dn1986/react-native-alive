import React, { Component } from 'react';
import IndexContainer from 'containers/IndexContainer';

class IndexScreen extends Component {
    render() {
        return (
            <IndexContainer navigation={this.props.navigation} />
        )
    }
}

export default IndexScreen;