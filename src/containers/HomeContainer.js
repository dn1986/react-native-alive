import React, {Component} from 'react';
import { View, Text } from 'react-native';

class HomeContainer extends Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Home Screen</Text>
            </View>
        )
    }
}

export default HomeContainer;