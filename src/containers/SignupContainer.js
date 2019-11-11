import React, {Component} from "react";
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from 'store/modules/auth';
import * as userActions from 'store/modules/user';
import Signup from 'components/Signup';
import { isEmail, isLength } from 'validator';
import debounce from 'lodash/debounce';

class SignupContainer extends Component {

    componentWillUnmount() {
        const { AuthActions } = this.props;
        AuthActions.initializeForm('signup')
    }

    setError = (message) => {
        const { AuthActions } = this.props;
        AuthActions.setError({
            form: 'signup',
            message
        });
        return false;
    }
    
    validate = {
        email: (text) => {
            if(!isEmail(text)) {
                this.setError('잘못된 이메일 형식 입니다.');
                return false;
            }
            return true;
        },
        password: (value) => {
            if(!isLength(value, { min: 4 })) {
                this.setError('비밀번호를 4자 이상 입력하세요.');
                return false;
            }
            this.setError(null); // 이메일 에러 null 처리는 중복확인 부분에서 수행
            return true;
        },
    }

    _onCheckEmailExists = debounce(async (email) => {
        const { AuthActions } = this.props;
        try {
            await AuthActions.checkEmailExists(email);
            
            if(this.props.exists.get('email')) {
                this.setError('이미 존재하는 이메일입니다.');
            }else{
                this.setError(null);
            }
        } catch (e) {
            console.log(e);
        }
    }, 300);

    _onChangeInput = (text, name) => {
        const { AuthActions } = this.props;

        AuthActions.changeInput({
            name,
            text,
            form: 'signup'
        });

        // 데이터 유효성 검증
        const validation = this.validate[name](text);
        // 비밀번호 검증이거나, 검증 실패하면 여기서 마침
        if(name.indexOf('password') > -1 || !validation) return;

        // 이메일 중복 확인
        this._onCheckEmailExists(text);
    }

    _onLogin = () => {
        const { navigation } = this.props;
        navigation.navigate("Login");
    }

    _onSignup = async () => {
        const { form, AuthActions, UserActions, error, navigation } = this.props;
        const { email, password } = form.toJS();
        const { validate } = this;

        // 에러가 있는 상태라면 진행하지 않음
        if(error) return;

        // 한번 더 검증
        if(!validate['email'](email) ||
        !validate['password'](password)) return;

        try {
            await AuthActions.signup({ email, password })
            const loggedInfo = this.props.result.toJS();

            // 로그인 정보 저장
            try {
                await AsyncStorage.setItem('loggedInfo', JSON.stringify(loggedInfo));
            } catch (error) {
                console.log(error)
            }

            UserActions.setLoggedInfo(loggedInfo);
            UserActions.setValidated(true);
            navigation.navigate("Main");
            
        } catch (e) {
            if(e.response.status === 409) {
                const { key } = e.response.data;
                return this.setError('이미 존재하는 이메일 입니다.');
            }
            this.setError('알 수 없는 에러가 발생했습니다.');
        }
    }

    render() {
        const { _onChangeInput, _onSignup, _onLogin } = this;
        const { email, password } = this.props.form.toJS();
        const { error } = this.props;

        return (
            <Signup email={ email } password={ password } error={ error } onSignup={ _onSignup } onLogin={_onLogin} onChangeInput={ _onChangeInput } />
        )
    }
}

export default connect( 
    (state) => ({
        form: state.auth.getIn(['signup', 'form']),
        error: state.auth.getIn(['signup', 'error']),
        exists: state.auth.getIn(['signup', 'exists']),
        result: state.auth.get('result')
    }),
    (dispatch) => ({
        AuthActions: bindActionCreators(authActions, dispatch),
        UserActions: bindActionCreators(userActions, dispatch)
    })
)(SignupContainer);