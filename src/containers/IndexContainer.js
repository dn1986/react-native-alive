import React, {Component} from "react";
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/user';
import * as utils from 'lib/utils';
import SplashScreen from 'react-native-splash-screen';

class IndexContainer extends Component {

    componentDidMount() {
        this._initializeUserInfo();
        setTimeout(() => {
                SplashScreen.hide();
        }, 1000);
    }

    _initializeUserInfo = async () => {
        const { UserActions, navigation } = this.props;

        const loggedInfo = await AsyncStorage.getItem('loggedInfo');

        if(!utils.isEmpty(loggedInfo)) {
         
            UserActions.setLoggedInfo(JSON.parse(loggedInfo));

            try {
                await UserActions.checkStatus();
                navigation.navigate('Main');
            } catch (e) {
                await AsyncStorage.removeItem('loggedInfo');
                navigation.navigate('Login');
            }

        }else {
            navigation.navigate('Login');
        }
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ fontSize: 20, paddingLeft: 10, letterSpacing: 7, marginBottom: 20 }}>지금 이 순간</Text>
                <Text style={{ fontSize: 40, paddingLeft: 10, letterSpacing: 7 }}>Alive</Text>
            </View>
        )
    }
}

export default connect(
    null,
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch)
    })
)(IndexContainer);