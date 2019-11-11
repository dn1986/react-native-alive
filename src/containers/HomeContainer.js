import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import { Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as homeActions from 'store/modules/home';
import * as utils from 'lib/utils';
import CommonLoader from 'components/common/CommonLoader';
import CommonDialog from 'components/common/CommonDialog';

class HomeContainer extends Component {
    
    constructor (props) {  
        super(props);  
        this.state = {
            loading: false,     // 로딩 참조 변수
            detail: false,      // 상세보기 참조 변수 (상세보기 후 다시 돌아올 경우 새로고침 하면 안됨)
            refreshing: false   // 내려서 새로고침 참조 변수
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('didFocus', this._initialize);
        this.props.navigation.setParams({
            tapOnTabNavigator: this._onScrollTop
        });
    }

    _initialize = () => {
        const { loggedInfo } = this.props;

        if (loggedInfo.get('shareYn') === 'Y') {
            if (this.state.detail) {
                this.setState({ detail: false });
            } else {
                this._onAliveList(0);
            }
        }
    }

    _onScrollTop = () => {
        const { loggedInfo } = this.props;

        if (loggedInfo.get('shareYn') === 'Y') {
            this.flatListRef.scrollToIndex({animated: true, index: 0});
        }
    }

    _onEndReached = async () => {
        const { HomeActions, currentCount } = this.props;
        await HomeActions.aliveList(currentCount);
    }

    _onRefresh = async () => {
        this._onAliveList(0);
    }

    _onAliveList = async (count) => {
        const { HomeActions } = this.props;

        this.setState({ loading: true });

        await HomeActions.aliveReset();
        await HomeActions.aliveNew();
        await HomeActions.aliveList(count).then(response => {
            this.setState({ loading: false });
        }).catch(error => {
            console.log(error);
        });
    }

    _onDetail = (no) => {
        const { navigation } = this.props;
        this.setState({ detail: true });
        navigation.navigate('DetailScreen', {no});
    }

    _onAlive = () => {
        const { navigation } = this.props;
        navigation.navigate('AliveScreen');
    }

    _onProfile = () => {
        const { navigation } = this.props;
        navigation.navigate('ProfileScreen');
    }

    _renderItem = data => {
        const { _onDetail } = this;

        return (
            <TouchableHighlight style={{marginBottom: 10, borderRadius: 5}} onPress={() => _onDetail(data.item.no)}>
                <View style={[styles.viewContainer, data.item.viewYn === '0' ? styles.viewAlive : null]}>
                    <View style={{flexDirection:'row', flex:1, padding: 5}}>
                        <View style={{flex: 1, backgroundColor: '#FFF', borderRadius: 5, justifyContent: 'center', alignItems: 'center'}}>
                            {
                                data.item.filePath ? <Icon name='albums' style={{color:'tomato'}} /> : null
                            }
                        </View>
                    </View>
                    <View style={{flex: 9, flexDirection:'column'}}>
                        <View style={{flexDirection:'row', justifyContent: 'space-between', padding: 5}}>
                            <Text style={{fontWeight: 'bold', color: '#585858'}}>{data.item.w1}</Text>
                            <Text style={{color: '#A4A4A4'}}>{data.item.w2}</Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent: 'space-between', padding: 5}}>
                            <Text style={{color: '#A4A4A4'}}>{data.item.w3}</Text>
                            {
                                data.item.mineYn === 'Y' ? (
                                    <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <View style={{height:10, width:10, backgroundColor: '#06CC8D', borderRadius: 50}}></View>
                                    </View> )
                                : ( null )
                            }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };

    render() {
        const { _onRefresh, _onEndReached, _onAlive, _onProfile } = this;
        const { aliveList, aliveNew, loggedInfo } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, margin: 10, paddingBottom: (aliveNew.get('count') > 0 && aliveList.size > 0) ? 50 : 0 }}>
                    {
                        (loggedInfo.get('shareYn') === 'Y') ?
                            <View style={{ flex: 1 }}>
                                {
                                    (aliveList.size > 0) ?
                                        <View>
                                            {
                                                (aliveNew.get('count') > 0) ?
                                                    <Button block onPress={() => { this.CommonDialog._onOpen('Alive를 작성하시면, 새로 등록된 Alive를 확인하실 수 있습니다.') }}
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#FF845E',
                                                            marginBottom: 10,
                                                            borderRadius: 3,
                                                            borderWidth: 1,
                                                            borderStyle: 'solid',
                                                            borderColor: '#FF845E',
                                                            opacity: 0.9,
                                                            padding: 10
                                                        }}>
                                                        <Text style={{ color: 'white', letterSpacing: 1.2 }}>새로운 Alive가 등록되었습니다.</Text>
                                                    </Button> : null
                                            }
                                            <FlatList
                                                ref={(ref) => this.flatListRef = ref}
                                                data={aliveList.toArray()}
                                                keyExtractor={item => item.no}
                                                initialNumToRender={10}
                                                onEndReachedThreshold={0}
                                                onEndReached={_onEndReached}
                                                refreshing={this.state.refreshing}
                                                onRefresh={_onRefresh}
                                                renderItem={this._renderItem} />
                                        </View>
                                        :
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ marginBottom: 20, fontSize: 15 }}>평범해도 좋아</Text>
                                            <Text style={{ marginBottom: 20, fontSize: 15 }}>혼자라도 좋아</Text>
                                            <Text style={{ marginBottom: 40, fontSize: 15 }}>허전해도 좋아</Text>
                                            <Button danger onPress={_onAlive} style={{ paddingLeft: 10, paddingRight: 10 }}>
                                                <Text style={{ color: '#fff', fontSize: 15 }}>Alive 작성하기</Text>
                                            </Button>
                                        </View>
                                }
                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ marginBottom: 20, fontSize: 15 }}>현재 접속하신 계정은 <Text style={{ color: 'tomato' }}>비공개</Text> 상태입니다.</Text>
                                <Text style={{ marginBottom: 40, fontSize: 15 }}><Text style={{ color: 'tomato' }}>비공개</Text> 상태에서는 Alive를 확인하실 수 없습니다.</Text>
                                <Button danger onPress={_onProfile} style={{ paddingLeft: 10, paddingRight: 10 }}>
                                    <Text style={{ color: '#fff', fontSize: 15 }}>상태 전환하러 가기</Text>
                                </Button>
                            </View>
                    }
                </View>
                <CommonLoader loading={this.state.loading} />
                <CommonDialog ref={(ref) => this.CommonDialog = ref} onClick={ _onAlive } />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    content: {
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: '#dcdcdc',
        borderRadius: 5,
        opacity: 0.6,
        marginBottom: 10,
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    contentText: {
        padding: 10,
        marginRight: 15,
        opacity: 0.8,
        borderRadius: 5
    },
    contentThumbnail: {
        padding: 10,
        width: 35,
        marginRight: 15,
        backgroundColor: '#dcdcdc',
        opacity: 0.8,
        borderRadius: 10
    },
    viewAlive: {
        borderColor: 'tomato',
        borderWidth: 1,
        borderStyle: 'dotted',
        
    },
    viewContainer: {
        flexDirection:'row',
        backgroundColor: '#F2F2F2',
        borderRadius: 5,
        padding: 5
    }
});

export default connect(
    (state) => ({
        aliveList: state.home.get('aliveList'),
        aliveNew: state.home.get('aliveNew'),
        currentCount: state.home.get('currentCount'),
        loggedInfo: state.user.get('loggedInfo')
    }),
    (dispatch) => ({
        HomeActions: bindActionCreators(homeActions, dispatch)
    })
)(HomeContainer);