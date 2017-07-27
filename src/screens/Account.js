import React from 'react';
import { Text, View, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Account extends React.Component {
    render() {
        return (
            <View>
                <Text>Hello, Chat App!</Text>
                <Icon.Button name="facebook" backgroundColor="#3b5998">
                    Login with Facebook
                </Icon.Button>
            </View>
        );
    }
}