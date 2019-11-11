import React, {Component} from 'react';
import { View, Text, FlatList } from 'react-native';
import { Icon, Button, Container } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as aliveActions from 'store/modules/alive';
import * as utils from 'lib/utils';
import CommonDialog from 'components/common/CommonDialog';

class AliveContainer extends Component {

    constructor (props) {
        super(props);
        this.state = {
            refresh: false  // 새로고침 참조 변수
        }
    }

    // Alive 탭 선택 시
    componentDidMount() {
        this.props.navigation.addListener('didFocus', this._initialize);
        
        this.props.navigation.setParams({
            tapOnTabNavigator: () => {
                this.CommonDialog2._onOpen('다시 설정 하시겠습니까?');
            }
        });
    }

    _initialize = async () => {
        const { AliveActions, result } = this.props;

        // 항목 추가, 검토 화면으로 이동 후 다시 돌아올 경우 새로고침 안함.
        if(this.state.refresh && !result) {
            this.setState({ refresh: false });
        } else {
            await AliveActions.aliveItemReset();
            await AliveActions.itemList({mode: 'w1', level: '1'});
            await AliveActions.itemChange({itemNo: '', mode: 'w1', name: '', level: '1', parent: ''});
        }

        AliveActions.itemReset();
    }

    // 이전
    _onAlivePrev = () => {
        const { AliveActions, aliveItem } = this.props;

        // 선택한 항목이 하나라도 있는 경우 이전으로 이동 가능
        if (aliveItem.size > 0) {
            const item = aliveItem.get(aliveItem.size - 1);
            // 마지막 선택 항목 제거
            AliveActions.aliveItemDel();
            // 마지막 선택 항목에 대한 항목 목록 조회
            AliveActions.itemList({ mode: item.mode, level: item.level, parent: item.parent });
            this._onItem(item.parent, item.mode);
        }
    }

    _onItem = (itemNo, mode) => {
        const { AliveActions, aliveItem } = this.props;
        const item = aliveItem.find(function(item){
            return item.itemNo === itemNo;
        });

        if(utils.isEmpty(item)){
            AliveActions.itemChange({itemNo: '', mode: mode, name: '', level: '1', parent: ''});
        }else{
            AliveActions.itemChange({itemNo: item.itemNo, mode: item.mode, name: item.name, level: parseInt(item.level, 10) + 1, parent: item.parent});
        }
    }


    // 다음
    _onAliveNext = () => {
        const { AliveActions, aliveItem, itemInfo } = this.props;

        // 선택한 항목이 하나라도 있다면
        if (aliveItem.size > 0) {

            const item = aliveItem.get(aliveItem.size - 1);

            let mode = '';
            let next = false;

            if (item.mode === itemInfo.mode) {
                if (item.mode === 'w1') {
                    mode = 'w3';
                    next = true;
                } else if (item.mode === 'w3') {
                    mode = 'w4';
                    next = true;
                } else if (item.mode === 'w4') {
                    mode = 'w5';
                    next = true;
                } else if (item.mode === 'w5') {
                    mode = 'h1';
                    next = true;
                } else if (item.mode === 'h1') {
                    next = false;
                }

                AliveActions.itemChange({itemNo: '', mode: mode, name: '', level: '1', parent: ''});

                if (next)
                    AliveActions.itemList({ mode, level: '1' });
                else
                    this._onReview();

            } else {
                this.CommonDialog1._onOpen('항목을 선택해주세요.');
            }
        } else {
            this.CommonDialog1._onOpen('항목을 선택해주세요.');
        }
    }

    // 항목 추가
    _onItemAdd = () => {
        const { navigation } = this.props;
        this.setState({ refresh: true });
        navigation.navigate('ItemScreen');
    }

    // 검토
    _onReview = () => {
        const { navigation } = this.props;
        this.setState({ refresh: true });
        navigation.navigate('ReviewScreen');
    }

    // 항목 선택
    _onItemSelect = (item) => {
        const { AliveActions, aliveItem } = this.props;
        // 항목 선택 표시
        AliveActions.itemSelect(item.itemNo);

        // useYn 선택 여부 플래그
        if(item.useYn === null || item.useYn === 'N') {
            // 선택
            // aliveItem 항목 최초 추가라면(aliveItem.size > 0) 바로 추가로 이동 (else)
            if(aliveItem.size > 0) {

                // 항목 교체 참조 변수
                let replace = false;
    
                // aliveItem에 선택항목과 동일한 mode, level의 항목이 이미 있는 경우는 교체
                for (const [index, value] of aliveItem.entries()) {
                    if(value.mode === item.mode && value.level === item.level){
                        replace = true;
                        AliveActions.aliveItemAdd({item, index, replace});
                    }
                }
    
                // aliveItem에 선택항목과 동일한 mode, level의 항목이 없는 경우는 추가
                // 경우 1 : 선택항목의 mode가 처음인 경우 (w1 -> w2)
                // 경우 2 : 선택항목의 mode와 동일하지만, level의 항목이 처음인 경우 (w1/1 -> w1/2) (즉, 동일 mode 에서 level이 다른 경우는 계속해서 추가됨)
                if(!replace) {
                    AliveActions.aliveItemAdd({item});
                }

            } else {
                AliveActions.aliveItemAdd({item});
            }

            // 선택한 항목에 하위 항목이 존재하는 경우 하위 항목 목록 조회
            if(parseInt(item.childCnt, 10) > 0) {
                AliveActions.itemList({mode: item.mode, level: parseInt(item.level, 10) + 1, parent: item.itemNo});
            }
        } else {
            // 해제
            this._onAlivePrev();
        }
    }
    
    _renderItem = item => {
        const { _onItemSelect } = this;
        return (
            <Button block style={{justifyContent: 'space-between', marginBottom: 10, backgroundColor: (item.useYn === 'Y') ? '#00CAEB' : '#F2F2F2'}} onPress={() => _onItemSelect(item)}>
                <Text style={{paddingLeft: 10, color: (item.useYn === 'Y') ? '#fff' : '#6E6E6E'}}>{item.name}</Text>
                {(parseInt(item.childCnt, 10) > 0) ? <Icon style={{color: (item.useYn === 'Y') ? '#fff' : '#6E6E6E'}} name='add-circle' /> : null}
            </Button>
        )
    };

    render() {
        const { _onAlivePrev, _onAliveNext, _onItemAdd, _onReview, _initialize } = this;
        const { itemList, itemInfo } = this.props;

        return (
            <View style={{flex: 1}}>
                <Container style={{flex: 1}}>
                    <View style={{flexDirection: 'row', padding: 10, backgroundColor: '#E6E6E6', justifyContent: 'space-evenly'}}>
                        <View style={{padding: 10, marginRight: 5, borderRadius: 100, backgroundColor: (itemInfo.mode === 'w1') ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}>
                            <Text style={{color: 'white'}}>누가</Text>
                        </View>
                        <View style={{padding: 10, marginRight: 5, borderRadius: 100, backgroundColor: (itemInfo.mode === 'w2') ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}>
                            <Text style={{color: 'white'}}>언제</Text>
                        </View>
                        <View style={{padding: 10, marginRight: 5, borderRadius: 100, backgroundColor: (itemInfo.mode === 'w3') ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}>
                            <Text style={{color: 'white'}}>어디서</Text>
                        </View>
                        <View style={{padding: 10, marginRight: 5, borderRadius: 100, backgroundColor: (itemInfo.mode === 'w4') ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}>
                            <Text style={{color: 'white'}}>무엇을</Text>
                        </View>
                        <View style={{padding: 10, marginRight: 5, borderRadius: 100, backgroundColor: (itemInfo.mode === 'w5') ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}>
                            <Text style={{color: 'white'}}>왜</Text>
                        </View>
                        <View style={{padding: 10, marginRight: 5, borderRadius: 100, backgroundColor: (itemInfo.mode === 'h1') ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)' }}>
                            <Text style={{color: 'white'}}>어떻게</Text>
                        </View>
                    </View>

                    <View style={{ margin: 10 }}>
                        <FlatList
                            data={itemList}
                            keyExtractor={item => item.itemNo}
                            renderItem={({ item }) => this._renderItem(item)} />

                        <View style={{ flexDirection: 'row' }}>
                            <Button info style={{ flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center' }} onPress={_onAlivePrev}>
                                <Text style={{ color: 'white' }}>이전</Text>
                            </Button>
                            <Button info style={{ flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center' }} onPress={_onAliveNext}>
                                <Text style={{ color: 'white' }}>다음</Text>
                            </Button>
                            <Button success style={{ flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center' }} onPress={_onItemAdd}>
                                <Text style={{ color: 'white' }}>항목 추가</Text>
                            </Button>
                            <Button success style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }} onPress={_onReview}>
                                <Text style={{ color: 'white' }}>검토</Text>
                            </Button>
                        </View>
                    </View>
                </Container>
                
                <CommonDialog ref={(ref) => this.CommonDialog1 = ref} />
                <CommonDialog ref={(ref) => this.CommonDialog2 = ref} onClick={ _initialize } onText='재설정' /> 
            </View>
        )
    }
}

export default connect(
    (state) => ({
        itemList: state.alive.get('itemList'),
        itemInfo: state.alive.get('itemInfo'),
        aliveItem: state.alive.get('aliveItem'),
        result: state.alive.get('result')
    }),
    (dispatch) => ({
        AliveActions: bindActionCreators(aliveActions, dispatch)
    })
)(AliveContainer);