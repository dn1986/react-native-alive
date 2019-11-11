import React, { Component } from 'react';
import DetailContainer from 'containers/DetailContainer';
class DetailScreen extends Component {
    render() {
        return (
            <DetailContainer navigation={this.props.navigation} />
        )
    }
}

export default DetailScreen;