/**
 * Created by leonardean on 03/08/2017.
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Alert, Platform} from 'react-native';
import Picker from 'react-native-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Global from '../../Global';
import Spinner from 'react-native-loading-spinner-overlay';

export default class OrderConfirm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order: Object.assign({}, this.props.order, {
                payment: 'Credit Point',
                total_price: this.props.order.total_price + this.props.order.delivery_fee
            }),
            ready: false,
            isLoading: true,
            placingOrder: false
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
                    if (recipient.primary === true) {
                        this.setState({
                            ready: true
                        })
                        return recipient
                    }
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

    placeOrder = () => {
        this.setState({
            placingOrder: true,
            order: Object.assign({}, this.state.order, {
                order_status: 0,
                timestamp_order_status_0: new Date()
            })
        }, () => {
            fetch('https://api-jp.kii.com/api/apps/2c1pzz9jg5dd/buckets/ORDERS/objects', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+ Global.userAccessToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.state.order)
            })
                .then((response) => {
                    // console.log(response)
                    if (response.status === 201)
                        return response.json()
                })
                .then((responseJson) => {
                    fetch('https://api-jp.kii.com/api/apps/2c1pzz9jg5dd/buckets/ORDERS/objects/' + responseJson.objectID, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer '+ Global.userAccessToken
                        },
                    })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            fetch('https://api-jp.kii.com/api/apps/2c1pzz9jg5dd/users/'
                                + Global.userID, {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer ' + Global.userAccessToken
                                }
                            })
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    let userAttribute = responseJson
                                    userAttribute.member_point += userAttribute.member_point += this.state.order.total_price * 10
                                    userAttribute.balance  = userAttribute.balance - this.state.order.total_price
                                    fetch('https://api-jp.kii.com/api/apps/2c1pzz9jg5dd/users/'
                                        + Global.userID, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': 'Bearer ' + Global.userAccessToken,
                                            'Content-Type': 'application/vnd.kii.UserUpdateRequest+json'
                                        },
                                        body: JSON.stringify(userAttribute)
                                    }).then((response) => {
                                        console.log(response)
                                        return response.json()
                                    }).then((responseJson) => {
                                        console.log(responseJson)
                                    })
                                })
                                .catch((error) => {
                                    console.error(error);
                                });

                            this.setState({
                                placingOrder: false
                            }, () => {
                                this.props.navigator.push({
                                    screen: 'OrderInfo',
                                    title: 'Order Details',
                                    animated: true,
                                    animationType: 'slide-horizontal',
                                    backButtonHidden: false,
                                    navigatorStyle: {
                                        tabBarHidden: true
                                    },
                                    passProps: {
                                        order: responseJson
                                    },
                                })
                            })
                        })
                })
                .catch((error) => {
                    console.error(error);
                });
        })
    }

    onPress = () => {
        let data = [
            'Visa',
            'Mastercard',
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
                    order: Object.assign({}, this.state.order, { payment: data[0]})
                })
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        if (Platform.OS === 'android')
            Picker.show()
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Spinner visible={this.state.placingOrder} size="small" textContent={"Placing Order..."}
                         textStyle={{color: '#FFF', marginTop: -30, fontSize: 14}} />
                <View style={styles.contentContainer}>
                    <ScrollView>
                        <TouchableOpacity style={[styles.segment, styles.row]}>
                            <View>
                                <Text style={styles.textMain}>
                                    {this.state.order.customer.recipient.gender === 0 ? "Mr. " : "Ms. "}
                                    {this.state.order.customer.recipient.first_name + " "}
                                    {this.state.order.customer.recipient.family_name + "  "}
                                </Text>
                                <Text>{this.state.order.customer.recipient.phone}</Text>
                                <Text style={styles.textMain}>{this.state.order.customer.recipient.place.formatted_address}</Text>
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
                        <View style={styles.segment}>
                            <View style={styles.row}>
                                <Text style={styles.textMain}>{this.state.order.shop.name}</Text>
                            </View>
                            <View style={styles.row}>
                                <FlatList
                                    data={this.state.order.items.map((item, index) => {
                                        return Object.assign({}, item, { key: index})
                                    })}
                                    renderItem={({item}) => {
                                        let options = item.options.map((option)=>{
                                            return option.values.map((value) => {
                                                if (value.selected === true)
                                                    return (
                                                        <View style={{backgroundColor: '#ebf6ff',
                                                            padding: 2,
                                                            paddingHorizontal: 5,
                                                            borderRadius: 5,
                                                            marginTop: -5,
                                                            marginBottom: 5,
                                                            marginRight: 5,
                                                            flexWrap: 'nowrap',
                                                            height: 18}}
                                                              key={value.name}
                                                        >
                                                            <Text style={{color: '#0c64ff', fontSize: 10}}>{value.name}</Text>
                                                        </View>
                                                    )
                                            })
                                        })

                                        return (<View style={{flexDirection: 'row', alignItems: 'center'}} key={item.feature_id}>
                                        <View style={{flex: 1}}>
                                            <Text style={styles.textMinor} numberOfLines={2}>{item.name}</Text>
                                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                                {options}
                                            </View>
                                        </View>
                                        <View style={{width: 50}}>
                                            <Text style={styles.textMinor} numberOfLines={1}>{item.quantity}</Text>
                                        </View>
                                        <View style={{width: 50, alignItems: 'flex-end'}}>
                                            <Text style={styles.textMinor} numberOfLines={1}>$ {item.sub_total}</Text>
                                        </View>
                                    </View>)}}
                                />
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={styles.textMinor}>Delivery Fee</Text>
                                <Text style={styles.textMinor}>$ {this.state.order.delivery_fee}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.summaryContainer}>
                    <View style={styles.summary}>
                        <View style={styles.totalPrice}>
                            <Text style={{fontSize: 16, color: '#0c64ff'}}>Total: $ {this.state.order.total_price} </Text>
                        </View>
                    </View>
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
    textMinor: {
        marginVertical: 8,
        color: '#a2a2a2',
        fontSize: 12
    },
    summaryContainer: {
        height: 40,
        flexDirection: 'row',
    },
    summary: {
        flex: 1,
        backgroundColor: 'white',
        borderTopWidth: 0.5,
        paddingLeft: 10,
        borderTopColor: '#a2a2a2',
        flexDirection: 'row',
        alignItems: 'center'
    },
});