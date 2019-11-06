import React, { Component } from 'react';
import { View, Text } from 'react-native';

class IndexScreen extends Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Index Screen!!</Text>
            </View>
        )
    }
}

export default IndexScreen;