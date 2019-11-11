import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'store/modules/auth';
import * as userActions from 'store/modules/user';
import Login from 'components/Login';

class LoginContainer extends Component {

    componentWillUnmount() {
        const { AuthActions } = this.props;
        AuthActions.initializeForm('login')
    }

    setError = (message) => {
        const { AuthActions } = this.props;
        AuthActions.setError({
            form: 'login',
            message
        });
        return false;
    }

    _onChangeInput = (text, name) => {
        const { AuthActions } = this.props;

        AuthActions.changeInput({
            name,
            text,
            form: 'login'
        });
    }

    _onLogin = async () => {
        const { form, AuthActions, UserActions, navigation } = this.props;
        const { email, password } = form.toJS();

        try {
            await AuthActions.login({email, password});
            const loggedInfo = this.props.result.toJS();

            // 로그인 정보 저장
            try {
                await AsyncStorage.setItem('loggedInfo', JSON.stringify(loggedInfo));
            } catch (error) {
                console.log(error)
            }

            UserActions.setLoggedInfo(loggedInfo);
            navigation.navigate("Main");

        } catch(e) {
            console.log(e);
            this.setError('잘못된 계정정보입니다.');
        }
    }

    _onSignup = () => {
        const { navigation } = this.props;
        navigation.navigate("Signup");
    }

    render() {
        const { _onChangeInput, _onLogin, _onSignup } = this;
        const { email, password } = this.props.form.toJS();
        const { error } = this.props;

        return (
            <Login email={ email } password={ password } error={ error } onLogin={ _onLogin } onSignup={ _onSignup } onChangeInput={ _onChangeInput } />
        )
    }
}

export default connect(
    (state) => ({
        form: state.auth.getIn(['login', 'form']),
        error: state.auth.getIn(['login', 'error']),
        result: state.auth.get('result')
    }),
    (dispatch) => ({
        AuthActions: bindActionCreators(authActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch)
    })
)(LoginContainer);