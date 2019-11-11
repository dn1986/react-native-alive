import React, {Component} from 'react';
import { StyleSheet, View, Text, ImageBackground, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button, Header, Content, Body, Title, Left, Right, Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as aliveActions from 'store/modules/alive';
// import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import CommonDialog from 'components/common/CommonDialog';
import CommonLoader from 'components/common/CommonLoader';
import * as utils from 'lib/utils';
import { NavigationActions } from 'react-navigation';


class ReviewContainer extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            opacity: 0.5,
            image: '',
            loading: false
        }
    }

    // 뒤로가기
    _onBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
    }

     // 앨범에서 사진 가져오기
     _pickImage = async () => {

         let options = {
             title: 'Select Photo',
             storageOptions: {
                 skipBackup: true,
                 path: 'images',
             },
         };

         await ImagePicker.launchImageLibrary(options, (response) => {
             if (response.didCancel) {
                 console.log('User cancelled image picker');
             } else if (response.error) {
                 console.log('ImagePicker Error: ', response.error);
             } else if (response.customButton) {
                 console.log('User tapped custom button: ', response.customButton);
             } else {
                 const source = { uri: response.uri };
                 console.log('response', JSON.stringify(response));
                 this.setState({
                     image: response,
                 });
             }
         });
     }

    // 카메라로 사진 찍어서 가져오기
    _takeImage = async () => {

        let options = {
            title: 'Select Photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        await ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                console.log('response', JSON.stringify(response));
                this.setState({
                    image: response,
                });
            }
        });
    }

    // Alive 등록 유효성 검사
    _onAliveAddValidate = () => {
        const { aliveItem } = this.props;
        
        let { w1, w3, w4, w5, h1, msg } = '';

        for (const [key, value] of aliveItem.entries()) {
            if(value.mode === 'w1')
                w1 = value.itemNo;
            else if(value.mode === 'w3')
                w3 = value.itemNo;
            else if(value.mode === 'w4')
                w4 = value.itemNo;
            else if(value.mode === 'w5')
                w5 = value.itemNo;
            else if(value.mode === 'h1')
                h1 = value.itemNo;
        }

        if(utils.isEmpty(w1))
            msg = "'누가' 항목을 선택해주세요.";
        else if(utils.isEmpty(w3))
            msg = "'어디서' 항목을 선택해주세요.";
        else if(utils.isEmpty(w4))
            msg = "'무엇을' 항목을 선택해주세요.";
        else if(utils.isEmpty(w5))
            msg = "'왜' 항목을 선택해주세요.";
        else if(utils.isEmpty(h1))
            msg = "'어떻게' 항목을 선택해주세요.";

        if(utils.isEmpty(msg)) {
            this.CommonDialog2._onOpen('Alive를 등록 하시겠습니까?');
        }else {
            this.CommonDialog1._onOpen(msg);
        }
    }

    // Alive 등록
    _onAliveAdd = async () => {
        this.setState({
            loading: true
        });

        const { AliveActions, aliveItem, navigation } = this.props;
        const formData = this._createFormData(this.state.image, aliveItem);

        await AliveActions.aliveAdd(formData).then(response => {
            this.setState({
                loading: false
            });
        }).catch(error => {
            console.log(error);
        });

        const resetAction = NavigationActions.navigate({
            routeName: 'Home',
            params: {},
            action: navigation.popToTop(),
        });

        navigation.dispatch(resetAction);
    }

    // 폼 데이터 셋팅
    _createFormData = (photo, body) => {
        const data = new FormData();

        if (photo) {
            data.append('file', {
                name: photo.uri.split('/').pop(),
                type: 'image/jpg',
                uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
            });
        }

        if (body.size > 0) {
            let { w1, w3, w4, w5, h1 } = '';

            for (const [key, value] of body.entries()) {
                if (value.mode === 'w1')
                    w1 = value.itemNo;
                else if (value.mode === 'w3')
                    w3 = value.itemNo;
                else if (value.mode === 'w4')
                    w4 = value.itemNo;
                else if (value.mode === 'w5')
                    w5 = value.itemNo;
                else if (value.mode === 'h1')
                    h1 = value.itemNo;
            }

            data.append('w1', w1);
            data.append('w3', w3);
            data.append('w4', w4);
            data.append('w5', w5);
            data.append('h1', h1);
        }

        return data;
    }

    _renderLine = ({ title, content }) => {
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
    }

    render() {
        const { _onAliveAdd, _onAliveAddValidate, _onBack, _pickImage, _takeImage } = this;
        const { aliveItem } = this.props;
        let { image, opacity } = this.state;

        let {w1, w3, w4, w5, h1} = '';

        for (const [key, value] of aliveItem.entries()) {
            if(value.mode === 'w1')
                w1 = value.name;
            else if(value.mode === 'w3')
                w3 = value.name;
            else if(value.mode === 'w4')
                w4 = value.name;
            else if(value.mode === 'w5')
                w5 = value.name;
            else if(value.mode === 'h1')
                h1 = value.name;
        }

        return (
            <View style={{flex: 1}}>
                <ImageBackground source={ (image) ?  { uri: image.uri } : require('./../../img/sky.jpg') }
                    style={{ flex:1, resizeMode: 'contain', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center'}}>
                    <Header transparent>
                        <Left>
                            <Button transparent onPress={ _onBack }>
                                <Icon name='arrow-back' style={{ paddingLeft: 5, color: 'white' }} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: 'white' }}>검토</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Content style={{ margin: 10 }}>
                        <View style={{ flexDirection: 'column', opacity: opacity }}>
                            {this._renderLine({title: '누가', content: w1})}
                            {this._renderLine({title: '언제', content: utils.getDate()})}
                            {this._renderLine({title: '어디서', content: w3})}
                            {this._renderLine({title: '무엇을', content: w4})}
                            {this._renderLine({title: '왜', content: w5})}
                            {this._renderLine({title: '어떻게', content: h1})}
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 20 }}>
                            <Button success style={{flex:1, flexDirection: 'row', justifyContent:'center', marginRight: 10}} onPress={ _pickImage }>
                                <Text style={{color: 'white'}}>사진</Text>
                            </Button>
                            <Button success style={{flex:1, flexDirection: 'row', justifyContent:'center', marginRight: 10}} onPress={ _takeImage } >
                                <Text style={{color: 'white'}}>카메라</Text>
                            </Button>
                            <Button info style={{flex:1, flexDirection: 'row', justifyContent:'center'}} onPress={ _onAliveAddValidate }>
                                <Text style={{color: 'white'}}>등록</Text>
                            </Button>
                        </View>

                        <View style={{ flex:1 }}>
                            <Slider
                                onValueChange={(value) => (this.setState({opacity: value}))}
                                style={{height: 40}}
                                minimumValue={0}
                                maximumValue={1}
                                value={0.5}
                                minimumTrackTintColor='#FFFFFF'
                                maximumTrackTintColor='#000000' />
                        </View>
                    </Content>
                </ImageBackground>
                <CommonLoader loading={this.state.loading} />
                <CommonDialog ref={(ref) => this.CommonDialog1 = ref} />
                <CommonDialog ref={(ref) => this.CommonDialog2 = ref} onClick={ _onAliveAdd } onText='등록' />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5,
    },
    contentText: {
        padding: 15,
    }
});

export default connect(
    (state) => ({
        aliveItem: state.alive.get('aliveItem')
    }),
    (dispatch) => ({
        AliveActions: bindActionCreators(aliveActions, dispatch)
    })
)(ReviewContainer);