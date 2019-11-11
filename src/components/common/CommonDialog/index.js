import React, {Component} from 'react';
import { Text } from 'react-native';
import Dialog, { DialogTitle, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';

class CommonDialog extends Component {
    
    constructor (props) {  
        super(props);  
        this.state = {
            commonDialog: false,
            text: null
        }
    }

    _onOpen = (text) => {
        this.setState({
            commonDialog: true,
            text
        })
    }

    render() {
        const { onClick, onText } = this.props;
        return (
            <Dialog
                width={0.7}
                visible={this.state.commonDialog}
                rounded
                actionsBordered
                dialogTitle={
                    <DialogTitle
                        title='Alive'
                        style={{ backgroundColor: '#F7F7F8' }}
                        hasTitleBar={false}
                        align='left'
                    />
                }
                footer={
                    <DialogFooter>
                        <DialogButton
                            text='취소'
                            textStyle={{ color: '#2E9AFE' }}
                            bordered
                            onPress={() => {this.setState({commonDialog: false})}}
                        />
                        <DialogButton
                            text={(onText) ? onText : '확인'}
                            textStyle={{ color: '#2E9AFE' }}
                            bordered
                            onPress={() => {
                                this.setState({commonDialog: false});
                                (onClick) ? onClick() : null
                            }}
                        />
                    </DialogFooter>
                }
            >
                <DialogContent style={{ backgroundColor: '#F7F7F8' }}>
                    <Text>{this.state.text}</Text>
                </DialogContent>
            </Dialog>
        )
    }
}

export default CommonDialog;