import React from "react";
import { StyleSheet, Text } from 'react-native';
import { Button, Container, Item, Input } from 'native-base';

const Login = () => (
    <Container style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.mainText}>Alive</Text>
        <Item style={{marginBottom: 10}}>
            <Input placeholder="이메일" />
        </Item>
        <Item style={{marginBottom: 10}}>
            <Input placeholder="비밀번호" secureTextEntry={true} />
        </Item>
        <Button info block style={{marginBottom: 20}} >
            <Text style={{color: 'white'}}>로그인</Text>
        </Button>
        <Button transparent>
            <Text style={{textDecorationColor:'black', textDecorationLine: 'underline', color: 'black', fontSize: 15}}>가입하기</Text>
        </Button>
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

export default Login;