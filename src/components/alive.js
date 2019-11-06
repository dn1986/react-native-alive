import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { IndexScreen, LoginScreen, SignupScreen } from 'screens';


const Navigator = createSwitchNavigator(
    {
        Index: {screen: IndexScreen},
        Login: {screen: LoginScreen},
        Signup: {screen: SignupScreen}
    },
    {
        initialRouteName: 'Index'
    }
)

const Container = createAppContainer(Navigator);

export default class alive extends Component {
    

    render() {
        return(
            <Container />
        )
    }
}