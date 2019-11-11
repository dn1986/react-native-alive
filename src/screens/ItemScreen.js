import React, { Component } from "react";
import ItemContainer from 'containers/ItemContainer';

class ItemScreen extends Component {
    render() {
        return (
            <ItemContainer navigation={this.props.navigation} />
        );
    }
};

export default ItemScreen;