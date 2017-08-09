/**
 * Created by leonardean on 02/08/2017.
 */
import React from 'react';
import { View, Button, TextInput, StyleSheet} from 'react-native';
import Global from '../../Global';
import Toast from 'react-native-root-toast';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Authenticate extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggingIn: false
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    static navigatorButtons = {
        leftButtons: [
            {
                title: 'Cancel',
                id: 'cancel'
            }
        ]
    }

    onNavigatorEvent (event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'cancel') {
                this.props.navigator.pop({
                    animated: true,
                    animationType: 'fade'
                });
            }
        }
    }

    login = () => {
        this.setState({
            loggingIn: true
        }, () => {
            fetch('https://api-jp.kii.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'X-Kii-AppID': Global.appID,
                'X-Kii-AppKey': Global.appKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": this.state.username,
                "password": this.state.password
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                Global.userAuthenticated = true
                Global.userID = responseJson.id
                Global.userAccessToken = responseJson.access_token
                Global.username = this.state.username
                Toast.show('Login Success!')
                if (this.props.didLogin)
                    this.props.didLogin()
                this.setState({
                    loggingIn: false
                }, () => {
                    this.props.navigator.pop({
                        animated: true,
                        animationType: 'fade'
                    });
                })
            })
            .catch((error) => {
                console.error(error);
            });
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.loggingIn} size="small" textContent={"Logging In..."}
                         textStyle={{color: '#FFF', marginTop: -30, fontSize: 14}} />
                <View style={{borderBottomColor: '#c3c3c3', borderBottomWidth: 0.5}}>
                    <TextInput
                        style={styles.input}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        placeholder="Username"
                        autoFocus={true}
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                    />
                </View>
                <View style={{borderBottomColor: '#c3c3c3', borderBottomWidth: 0.5}}>
                    <TextInput
                        style={styles.input}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                    />
                </View>
                <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Button
                        onPress={this.login}
                        title="Login"
                        color="#0c64ff"
                        disabled={!(this.state.username && this.state.password)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f0f0f0'
        padding: 10
    },
    input: {
        height: 50,
    }
})