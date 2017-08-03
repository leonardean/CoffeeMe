/**
 * Created by leonardean on 03/08/2017.
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import Picker from 'react-native-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Global from '../../Global';

export default class OrderConfirm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order: Object.assign({}, this.props.order, { payment: 'Credit Point' }),
            ready: false,
            isLoading: true
        }
    }

    componentDidMount() {
        return fetch('https://api-jp.kii.com/api/apps/2c1pzz9jg5dd/users/'
            + Global.userID, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Global.userAccessToken
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                const recipient = responseJson.recipients.map((recipient) => {
                    if (recipient.primary === true)
                        return recipient
                })
                this.setState({
                    isLoading: false,
                    order: Object.assign({}, this.state.order, { customer: {
                        id: responseJson.userID,
                        username: responseJson.loginName,
                        avatar_url: responseJson.avatar_url,
                        recipient: recipient[0]
                    }})
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentWillUnmount() {
        Picker.hide()
    }

    onPress = () => {
        let data = [
            'Credit Card',
            'Paypal',
            'Credit Point',
            'Cash'
        ];
        Picker.init({
            pickerConfirmBtnText: 'Confirm',
            pickerTitleText: 'Please Select',
            pickerCancelBtnText: 'Cancel',
            pickerConfirmBtnColor: [12, 100, 255, 1],
            pickerCancelBtnColor: [12, 100, 255, 1],
            pickerData: data,
            selectedValue: [this.state.order.payment],
            pickerFontSize: 20,
            onPickerConfirm: data => {
                this.setState({
                    order: Object.assign({}, this.props.order, { payment: data[0]})
                })
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <ScrollView>
                        <TouchableOpacity style={[styles.segment, styles.row]}>
                            <View>
                                <Text style={styles.textMain}>Mr. Andy Williams</Text>
                                <Text>18551815695</Text>
                                <Text style={styles.textMain}>南方心存178号502室</Text>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.segment, styles.row]} onPress={this.onPress}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
                                <Text style={styles.textMain}>Payment</Text>
                                <Text style={styles.textOff}>{this.state.order.payment}</Text>
                            </View>
                            <View style={{justifyContent: 'center', marginLeft: 10}}>
                                <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <View style={styles.summaryContainer}>

                    <Icon.Button name="ios-flag" size={22} iconStyle={{marginRight: 10}}
                                 color="white"
                                 backgroundColor={!this.state.ready ? '#91b9ff' : '#0c64ff'}
                                 borderRadius={0}
                                 disabled={!this.state.ready} onPress={this.placeOrder}>
                        Confirm Order
                    </Icon.Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    segment: {
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white'
    },
    row: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textMain: {
        marginVertical: 10
    },
    textOff: {
        marginVertical: 10,
        color: '#a2a2a2'
    },
    summaryContainer: {
        height: 40,
        backgroundColor: 'green',
        flexDirection: 'row',
    }
});