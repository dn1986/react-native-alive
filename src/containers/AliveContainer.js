import React, {Component} from 'react';
import { View, Text } from 'react-native';

class AliveContainer extends Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Alive Screen</Text>
            </View>
        )
    }
}

export default AliveContainer;