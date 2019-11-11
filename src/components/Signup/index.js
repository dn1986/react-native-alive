import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button, Container, Input, Item } from 'native-base';

const Signup = ({email, password, error, onSignup, onLogin, onChangeInput}) => (
    <Container style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.mainText}>Alive</Text>
        <Item style={{marginBottom: 10}} >
            <Input placeholder={'이메일'} value={email} onChangeText={(text)=> onChangeInput(text, 'email')} />
        </Item>
        <Item style={{marginBottom: 10}} >
            <Input placeholder={'비밀번호'} value={password} onChangeText={(text)=> onChangeInput(text, 'password')} secureTextEntry={true} />
        </Item>
        <Button info block style={{marginBottom: 20}} onPress={onSignup}>
            <Text style={{color: 'white'}}>가입하기</Text>
        </Button>
        <Button transparent onPress={onLogin}>
            <Text style={{textDecorationColor:'black', textDecorationLine: 'underline', color: 'black', fontSize: 15}}>로그인</Text>
        </Button>
        {
            error && <Text style={{color: 'red', marginBottom: 30}}>{error}</Text>
        }
    </Container>
)

const styles = StyleSheet.create({
    mainText: {
        fontSize: 40,
        color: 'black',
        padding: 10,
        marginBottom: 20,
        letterSpacing: 10,
    }
})

export default Signup;