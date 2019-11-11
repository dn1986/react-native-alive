import React, {Component} from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import Slider from '@react-native-community/slider';
import { Icon, Header, Content, Left, Right, Button } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as homeActions from 'store/modules/home';
import CommonDialog from 'components/common/CommonDialog';

class DetailContainer extends Component {

    constructor (props) {  
        super(props);  
        this.state = {
            opacity: 0.5
        }
    }

    componentWillMount(){
        this._initialize();
    }

    _initialize = async () => {
        const { HomeActions, navigation } = this.props;
        const no = navigation.getParam('no');
        await HomeActions.aliveOneReset();
        await HomeActions.aliveOne(no);
    }

    _onBack = () => {
        const { navigation } = this.props;
        navigation.navigate('HomeScreen');
    }

    _onAliveLike = (no) => {
        const { HomeActions } = this.props;
        HomeActions.aliveLike(no);
    }

    _onAliveDel = async (no) => {
        const { HomeActions, navigation } = this.props;
        await HomeActions.aliveDel(no);
        await HomeActions.aliveReset();
        await HomeActions.aliveList(0);
        navigation.navigate('HomeScreen');
    }

    _renderLine = ({title, content}) => {
        return (
            <View style={styles.content}>
                <View style={{ flex: 3, backgroundColor: '#F2F2F2', borderRadius: 5, marginRight: 10 }}>
                    <Text style={styles.contentText}>{title}</Text>
                </View>
                <View style={{ flex: 7, backgroundColor: '#F2F2F2', borderRadius: 5 }}>
                    <Text style={styles.contentText}>{content}</Text>
                </View>
            </View>
        )
    };

    render() {
        const { _onBack, _onAliveLike, _onAliveDel } = this;
        const { aliveOne, user } = this.props;
        let { opacity } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={(aliveOne.filePath === null) ? require('./../../img/sky.jpg') : { uri: aliveOne.filePath }}
                    style={{ flex: 1, resizeMode: 'contain', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center' }}>
                    <Header transparent>
                        <Left>
                            <Button transparent onPress={_onBack}>
                                <Icon name='arrow-back' style={{ paddingLeft: 5, color: 'white' }} />
                            </Button>
                        </Left>
                        <Right>
                            {
                                aliveOne.regNo === user.getIn(['loggedInfo', 'userNo']) ?
                                    <Button transparent onPress={() => { this.CommonDialog._onOpen('Alive를 삭제 하시겠습니까?') }}>
                                        <Icon name='trash' style={{ color: 'white' }} />
                                    </Button> :
                                    <Button transparent onPress={() => { _onAliveLike(aliveOne.no) }}>
                                        <Icon name='heart' style={{ color: aliveOne.likeCnt === '1' ? '#FF5274' : 'white' }} />
                                    </Button>
                            }
                        </Right>
                    </Header>
                    <Content>
                        <View style={{ margin: 10, flex: 1, flexDirection: 'column', opacity: opacity }}>
                            {this._renderLine({ title: '누가', content: aliveOne.w1 })}
                            {this._renderLine({ title: '언제', content: aliveOne.w2 })}
                            {this._renderLine({ title: '어디서', content: aliveOne.w3 })}
                            {this._renderLine({ title: '무엇을', content: aliveOne.w4 })}
                            {this._renderLine({ title: '왜', content: aliveOne.w5 })}
                            {this._renderLine({ title: '어떻게', content: aliveOne.h1 })}
                        </View>
                        <View style={{ margin: 10, flex: 1 }}>
                            <Slider
                                onValueChange={(value) => (this.setState({ opacity: value }))}
                                style={{ height: 40 }}
                                minimumValue={0}
                                maximumValue={1}
                                value={0.5}
                                minimumTrackTintColor='#FFFFFF'
                                maximumTrackTintColor='#000000'
                            />
                        </View>
                    </Content>
                </ImageBackground>
                <CommonDialog ref={(ref) => this.CommonDialog = ref} onClick={() => { _onAliveDel(aliveOne.no) }} onText='삭제' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    contentText: {
        flex: 1,
        padding: 15,
    }
});

export default connect(
    (state) => ({
        aliveOne: state.home.get('aliveOne'),
        user: state.user
    }),
    (dispatch) => ({
        HomeActions: bindActionCreators(homeActions, dispatch)
    })
)(DetailContainer);