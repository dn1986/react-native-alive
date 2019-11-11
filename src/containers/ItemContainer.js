import React, {Component} from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Button, Container, Content, Header, Left, Right, Title, Body, Input, Item } from "native-base";
import CommonDialog from 'components/common/CommonDialog';
import * as aliveActions from 'store/modules/alive';
import * as utils from 'lib/utils';

class ItemContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itemNo: null,   // 항목 삭제 시 항목번호
            itemName: null  // 항목 추가 시 항목명
        }
    }

    // 항목 추가 유효성 검사
    _onItemAddValidate = () => {
        if (!utils.isEmpty(this.state.itemName)) {
            this.CommonDialog2._onOpen('"' + this.state.itemName + '" 항목을 추가하시겠습니까?');
        } else {
            this.CommonDialog1._onOpen('항목을 입력해주세요.');
        }
    }

    // 항목 추가
    _onItemAdd = async () => {
        const { AliveActions, itemInfo } = this.props;

        await AliveActions.itemAdd({
            mode: itemInfo.mode,
            name: this.state.itemName,
            level: itemInfo.level,
            parent: itemInfo.itemNo
        });

        await AliveActions.itemList({
            mode: itemInfo.mode,
            level: itemInfo.level,
            parent: itemInfo.itemNo
        });

        this.setState({ itemName: null });
    }

    // 항목 삭제
    _onItemDel = async () => {
        const { AliveActions, itemInfo } = this.props;

        await AliveActions.itemDel({
            mode: itemInfo.mode,
            itemNo: this.state.itemNo
        });

        await AliveActions.itemList({
            mode: itemInfo.mode,
            level: itemInfo.level,
            parent: itemInfo.itemNo
        });
    }

    // 항목 입력
    _onChangeInput = (text) => {
        this.setState({ itemName: text });
    }

    // 뒤로 이동
    _onBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
    }

    render() {
        const { _onItemAdd, _onItemAddValidate, _onItemDel, _onChangeInput, _onBack } = this;
        const { itemList, itemInfo, exist, count } = this.props;

        return (
            <View style={{ flex: 1 }}>
                <Container style={{ flex: 1 }}>
                    <Header>
                        <Left>
                            <Button transparent onPress={_onBack}>
                                <Icon name="arrow-back" style={{ paddingLeft: 10 }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title>항목 추가</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Content style={{ margin: 10 }}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {
                                itemList.map((item, key) => {
                                    return (
                                        // 항목 목록이 현재 선택항 항목의 자식인 경우만 표시
                                        (item.parent === itemInfo.itemNo) ?
                                            <Button key={item.itemNo} iconLeft info style={{ padding: 10, marginRight: 10, marginBottom: 10 }}
                                                onPress={() => {
                                                    this.setState({ itemNo: item.itemNo })
                                                    this.CommonDialog3._onOpen('"' + item.name + '" 항목을 삭제하시겠습니까?')
                                                }}>
                                                <Text style={{ color: 'white' }}>{item.name}</Text>
                                                <Icon name='ios-close' />
                                            </Button>
                                            : null
                                    )
                                })
                            }
                        </View>
                        <View>
                            <Item style={{ marginBottom: 10 }}>
                                <Input placeholder="입력" value={this.state.itemName} onChangeText={(text) => _onChangeInput(text)} />
                            </Item>
                            <Button block success onPress={_onItemAddValidate}>
                                <Text style={{ color: 'white' }}>추가하기</Text>
                            </Button>
                            {
                                exist === "Y" && <Text style={{ color: 'red', marginTop: 30, padding: 5 }}>이미 등록된 항목입니다.</Text>
                            }
                            {
                                count > 0 && <Text style={{ color: 'red', marginTop: 30, padding: 5 }}>해당 항목은 이미 사용 중이어 삭제할 수 있습니다.</Text>
                            }
                        </View>
                    </Content>
                </Container>

                <CommonDialog ref={(ref) => this.CommonDialog1 = ref} />
                <CommonDialog ref={(ref) => this.CommonDialog2 = ref} onClick={_onItemAdd} onText='추가' />
                <CommonDialog ref={(ref) => this.CommonDialog3 = ref} onClick={_onItemDel} onText='삭제' />
            </View>
        )
    }
}

export default connect(
    (state) => ({
        itemList: state.alive.get('itemList'),
        itemInfo: state.alive.get('itemInfo'),
        exist: state.alive.get('exist'),
        count: state.alive.get('count')
    }),
    (dispatch) => ({
        AliveActions: bindActionCreators(aliveActions, dispatch)
    })
)(ItemContainer);