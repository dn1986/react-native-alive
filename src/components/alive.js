import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configure from 'store/configure';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { IndexScreen, LoginScreen, SignupScreen, DetailScreen, HomeScreen, AliveScreen, ProfileScreen, ReviewScreen, ItemScreen } from 'screens';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon, Title } from 'native-base';

const getScreenRegisteredFunctions = navState => {
    const { routes, index, params } = navState;
  
    if (navState.hasOwnProperty('index')) {
      return getScreenRegisteredFunctions(routes[index]);
    } else {
      return params;
    }
}

// Home Tab Navigation
const HomeNavi = createStackNavigator({
    HomeScreen: { screen: HomeScreen},
    DetailScreen: { screen: DetailScreen,
        navigationOptions: {
            header: null
        }
    }
},
{
    defaultNavigationOptions: ({navigation}) => ({
        headerLeft: <Title style={{ paddingLeft: 10, letterSpacing: 7, fontSize: 20, color: '#000' }}>Alive</Title>,
        gesturesEnabled: true
    }),
    initialRouteName: 'HomeScreen'
});

HomeNavi.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible: tabBarVisible,
    };
};

// Alive Tab Navigation
const AliveNavi = createStackNavigator({
    AliveScreen: { screen: AliveScreen },
    ItemScreen: { screen: ItemScreen,
        navigationOptions: {
            header: null
        }
    },
    ReviewScreen: { screen: ReviewScreen,
        navigationOptions: {
            header: null
        }
    }
},
{
    defaultNavigationOptions: ({navigation}) => ({
        headerLeft: <Title style={{ paddingLeft: 10, letterSpacing: 7, fontSize: 20, color: '#000' }}>Alive</Title>,
        gesturesEnabled: true
    }),
    initialRouteName: 'AliveScreen'
});

AliveNavi.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible: tabBarVisible
    };
};

// Profile Tab Navigation
const ProfileNavi = createStackNavigator({
    ProfileScreen: { screen: ProfileScreen}
},
{
    defaultNavigationOptions: ({navigation}) => ({
        headerLeft: <Title style={{ paddingLeft: 10, letterSpacing: 7, fontSize: 20, color: '#000' }}>Alive</Title>,
        gesturesEnabled: true
    }),
    initialRouteName: 'ProfileScreen'
});


const MainApp = createBottomTabNavigator(
    {
        Home: HomeNavi,
        Alive: AliveNavi,
        Profile: ProfileNavi
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
            },
            tabBarOnPress: ({ defaultHandler }) => {
                if (navigation && navigation.isFocused()) {
                    const screenFunctions = getScreenRegisteredFunctions(navigation.state);
                    
                    if (screenFunctions && typeof screenFunctions.tapOnTabNavigator === 'function') {
                        screenFunctions.tapOnTabNavigator()
                    }
                }
                defaultHandler();
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
        initialRouteName: 'Index'
    }
)

const Container = createAppContainer(Navigator);
const store = configure();

export default class alive extends Component {
    

    render() {
        return(
            <Provider store={store}>
                <Container />
            </Provider>
        )
    }
}