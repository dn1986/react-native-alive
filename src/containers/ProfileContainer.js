import React, {Component} from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Button } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/user';
import CommonDialog from 'components/common/CommonDialog';

class ProfileContainer extends Component {

    componentDidMount() {
        this._initialize();
        this.props.navigation.addListener('didFocus', this._initialize);
    }

    _initialize = async () => {
        const { UserActions } = this.props;
        await UserActions.checkStatus();
    }

    // 로그아웃
    _onLogout = async () => {
        const { UserActions, navigation } = this.props;

        try {
            await UserActions.logout();
        } catch (e) {
            console.log(e);
        }

        try {
            await AsyncStorage.removeItem('loggedInfo');
        } catch (error) {
            console.log(error)
        }

        navigation.navigate('Login');
    }

    // 공개-비공개 전환
    _onShare = async () => {
        const { UserActions, user } = this.props;
        try {
            await UserActions.share((user.getIn(['loggedInfo', 'shareYn']) === 'Y') ? 'N' : 'Y');
            await UserActions.checkStatus();
        } catch (e) {
            console.log(e);
        }
    }
    
    _renderLine = ({title, content}) => {
        return (
            <View style={{ flexDirection: 'row', alignItms: 'center', marginBottom: 10 }}>
                <View style={{ flex: 3, backgroundColor: '#F2F2F2', alignItems: 'center', borderRadius: 5, marginRight: 10, opacity: 0.7 }}>
                    <Text style={{ padding: 20 }}>{title}</Text>
                </View>
                <View style={{ flex: 7, backgroundColor: '#F2F2F2', borderRadius: 5, opacity: 0.7 }}>
                    <Text style={{ padding: 20 }}>{content}</Text>
                </View>
            </View>
        )
    };
    
    render() {
        const { _onLogout, _onShare } = this;
        const { user } = this.props;
        let shareButton = (user.getIn(['loggedInfo', 'shareYn']) === 'Y') ? '비공개' : '공개';
        let shareText = (user.getIn(['loggedInfo', 'shareYn']) === 'Y') ? '공개' : '비공개';

        return (
            <View style={{flex: 1}}>
                <Container style={{flex: 1}}>
                    <Content style={{flex: 1, margin: 10}}>

                        {this._renderLine({title: '이메일', content: user.getIn(['loggedInfo', 'email'])})}
                        {this._renderLine({title: '가입일', content: user.getIn(['loggedInfo', 'regDt'])})}
                        {this._renderLine({title: 'Alive', content: user.getIn(['loggedInfo', 'aliveCnt'])})}
                        {this._renderLine({title: 'Like', content: user.getIn(['loggedInfo', 'likeCnt'])})}
                        {this._renderLine({title: '상태', content: shareText})}

                        <View style={{flexDirection: 'row'}}>
                            <Button block success style={{flex: 1, marginRight: 10}} onPress={ _onShare }>
                                <Text style={{color: 'white'}}>{shareButton} 전환</Text>
                            </Button>
                            <Button block info style={{flex: 1}} onPress={ () => {this.CommonDialog._onOpen('로그아웃 하시겠습니까?')} }>
                                <Text style={{color: 'white'}}>로그아웃</Text>
                            </Button>
                        </View>
                    </Content>
                </Container>
                <CommonDialog ref={(ref) => this.CommonDialog = ref} onClick={ _onLogout } onText='로그아웃' />
            </View> 
        )
    }
}

export default connect(
    (state) => ({
        user: state.user
    }),
    (dispatch) => ({
        UserActions: bindActionCreators(userActions, dispatch)
    })
)(ProfileContainer);