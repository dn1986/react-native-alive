import React, { Component } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { IndexScreen, LoginScreen, SignupScreen, HomeScreen, AliveScreen, ProfileScreen } from 'screens';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Icon, Title } from 'native-base';


const MainApp = createBottomTabNavigator(
    {
        Home: HomeScreen,
        Alive: AliveScreen,
        Profile: ProfileScreen
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                let icon = "";

                if(routeName === 'Home'){
                    icon = "ios-home";
                } else if(routeName === 'Alive'){
                    icon = "ios-add-circle";
                } else if(routeName === 'Profile'){
                    icon = "ios-settings";
                }

                return <Icon name={icon} style={{fontSize: 30, color: tintColor}} />
            }
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            showLabel: true,
            showIcon: true,
            style:{
                height: 50,
                backgroundColor: '#FAFAFA'
            }
        }
    }
)

const Navigator = createSwitchNavigator(
    {
        Index: {screen: IndexScreen},
        Login: {screen: LoginScreen},
        Signup: {screen: SignupScreen},
        Main: {screen: MainApp}
    },
    {
        initialRouteName: 'Main'
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