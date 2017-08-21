import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Button, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Global from '../Global';

export default class Account extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            isLoading: true,
            isLogin: false
        }
    }

    componentDidMount () {
        let monitorLogin = setInterval(() => {
            if (Global.userAuthenticated === true && this.state.isLogin === false) {
                this.setState({
                    isLogin: true
                })
            } else if (Global.userAuthenticated === false) {
                this.setState({
                    isLogin: false
                })
            }
        }, 2000)
    }

    componentDidUpdate (prevProps, prevState) {
        if (prevState.isLogin === false && this.state.isLogin === true) {
            this.fetchUser()
        }
    }

    fetchUser = () => {
        console.log(Global.userAccessToken)
        fetch('https://api-jp.kii.com/api/apps/' + Global.appID + '/users/'
            + Global.userID, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Global.userAccessToken
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({
                    isLoading: false,
                    userInfo: responseJson
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    showAuthenticate = () => {
        if (this.state.isLogin === false)
            this.props.navigator.push({
                screen: 'Authenticate',
                title: 'User Authentication',
                animated: true,
                animationType: 'fade',
                backButtonHidden: true,
                passProps: {
                    didLogin: () => {
                        this.setState({
                            isLogin: true
                        })
                    }
                },
            });
    }

    doLogout = () => {
        Alert.alert(
            'Warning',
            'Are you sure you want to logout?',
            [
                {text: 'Yes', onPress: () => {
                    Global.userAuthenticated = false;
                    this.setState({
                        isLogin: false
                    })
                }},
                {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
            ],
            { cancelable: false }
        )

    }

    render() {
        if (this.state.isLoading && this.state.isLogin) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }
        let userInfo
        if (Global.userAuthenticated === true) {
            userInfo =
                <View style={{alignItems: 'center', backgroundColor: 'white', marginBottom: 4}}>
                    <Image
                        style={{width: 80, height: 80, resizeMode: 'contain', borderRadius: 40, marginTop: 40}}
                        source={{uri: this.state.userInfo.avatar_url}}
                    />
                    <Text style={{marginVertical: 10, fontSize: 16, fontWeight: 'bold'}}>{this.state.userInfo.displayName}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', width: 250}}>
                        <Text style={{marginBottom: 10, color: '#a2a2a2', fontSize: 12}}>Balance: $ {this.state.userInfo.balance}</Text>
                        <Text style={{marginBottom: 10, color: '#a2a2a2', fontSize: 12}}>Points: {this.state.userInfo.member_point}</Text>
                    </View>
                </View>
        } else {
            userInfo =
                <View style={{alignItems: 'center', backgroundColor: 'white', height: 190, marginBottom: 4}}>
                    <Image
                        style={{width: 80, height: 80, resizeMode: 'contain', borderRadius: 40, marginTop: 40}}
                        source={{uri: "https://1.gravatar.com/avatar/ad516503a11cd5ca435acc9bb6523536?s=500"}}
                    />
                    <Button title="Press to Login" onPress={this.showAuthenticate}/>
                </View>
        }
        let logoutButton = this.state.isLogin === false ? <View/> :
            <TouchableOpacity style={[styles.row, {paddingVertical: 10, backgroundColor: '#e30000'}]} onPress={this.doLogout}>
                <View/>
                <Text style={{alignSelf: 'center', fontSize: 16, color: 'white'}}>Logout</Text>
                <View/>
            </TouchableOpacity>

        return(
            <View style={styles.container}>
                <View>
                    {userInfo}
                </View>

                <View style={{backgroundColor: 'white'}}>
                    <TouchableOpacity style={styles.row} onPress={this.showAuthenticate}>
                        <Text style={{alignSelf: 'center', fontSize: 16}}>Delivery Address</Text>
                        <View style={{justifyContent: 'center'}}>
                            <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <Text style={{alignSelf: 'center', fontSize: 16}}>Stared Shops</Text>
                        <View style={{justifyContent: 'center'}}>
                            <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <Text style={{alignSelf: 'center', fontSize: 16}}>My Comments</Text>
                        <View style={{justifyContent: 'center'}}>
                            <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                        </View>
                    </TouchableOpacity>
                    <View style={{height: 4, backgroundColor: '#f0f0f0'}}/>
                    <TouchableOpacity style={styles.row}>
                        <Text style={{alignSelf: 'center', fontSize: 16}}>About</Text>
                        <View style={{justifyContent: 'center'}}>
                            <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row}>
                        <Text style={{alignSelf: 'center', fontSize: 16}}>App Feedback</Text>
                        <View style={{justifyContent: 'center'}}>
                            <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                        </View>
                    </TouchableOpacity>
                    <View style={{backgroundColor: '#f0f0f0', height: 4}}/>
                    {logoutButton}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
    row: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 0.5
    }
})