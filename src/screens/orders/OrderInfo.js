/**
 * Created by leonardean on 09/08/2017.
 */
import React from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Account extends React.Component {

    constructor (props) {
        super(props)
    }

    componentWillMount () {
        switch(this.props.order.order_status) {
            case 0:
                this.setState({
                    iconTitle: "ios-add-circle",
                    iconColor: "#EBDB0A",
                    orderStatus: "Placed"
                })
                break
            case 1:
                this.setState({
                    iconTitle: "ios-locate",
                    iconColor: "#00D7EB",
                    orderStatus: "Accepted"
                })
                break
            case 5:
                this.setState({
                    iconTitle: "ios-checkmark-circle",
                    iconColor: "green",
                    orderStatus: "Completed"
                })
                break
        }

    }

    goToShop = () => {
        this.props.navigator.push({
            screen: 'SingleShop',
            title: this.props.order.shop.name,
            passProps: {
                shopInfo: Object.assign({}, this.props.order.shop,
                    {'_id': this.props.order.shop.id})
            },
            animated: true,
            animationType: 'slide-horizontal',
            backButtonHidden: false,
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    goToComment = () => {
        this.props.navigator.push({
            screen: 'CommentCompose',
            title: 'Comment',
            passProps: {
                shopInfo: Object.assign({}, this.props.order.shop,
                    {'_id': this.props.order.shop.id})
            },
            animated: true,
            animationType: 'slide-horizontal',
            navigatorStyle: {
                tabBarHidden: true
            }
        })

    }

    render() {
        let items = []
        this.props.order.items.forEach((item) => {
            let options = item.options.map((option)=>{
                return option.values.map((value) => {
                    if (value.selected === true)
                        return (
                            <View style={{backgroundColor: '#ebf6ff',
                                padding: 2,
                                paddingHorizontal: 5,
                                borderRadius: 5,
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
            if (item.quantity !== 0)
                items.push(
                    <View style={[styles.row, {marginVertical: 5}]} key={item.feature_id}>
                        <View style={{flex: 1}}>
                            <Text style={styles.textMinor} numberOfLines={2}>{item.name}</Text>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                {options}
                            </View>
                        </View>
                        <View style={{width: 60, alignSelf: 'center'}}>
                            <Text>x {item.quantity}</Text>
                        </View>
                        <View style={{width: 30, alignSelf: 'center'}}>
                            <Text>${item.sub_total}</Text>
                        </View>
                    </View>
                )
        })
        items.push(
            <View style={[styles.row, {marginVertical: 5}]}>
                <View style={{flex: 1}}>
                    <Text>Delivery Fee</Text>
                </View>
                <View style={{width: 30}}>
                    <Text>${this.props.order.delivery_fee}</Text>
                </View>
            </View>
        )

        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.segment}>
                        <TouchableOpacity style={[styles.row, {marginVertical: 10}]}>
                            <View/>
                            <View style={{alignItems: 'center'}}>
                                <Icon name={this.state.iconTitle} size={60} color={this.state.iconColor} />
                                <Text> Order {this.state.orderStatus}</Text>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                            </View>
                        </TouchableOpacity>
                        <View style={{borderTopWidth: 0.5, borderTopColor: '#f0f0f0', paddingVertical: 5, flexDirection:'row', justifyContent: 'space-around'}}>
                            <View>
                                <Icon.Button backgroundColor="#ffffff" color="black" style={{alignSelf: 'center'}}
                                             iconStyle={{marginRight: 0}} onPress={this.goToShop}>
                                    Order Again
                                </Icon.Button>
                            </View>
                            <View style={{display: this.props.order.order_status === 5 ? 'flex' : 'none'}}>
                                <Icon.Button backgroundColor="#ffffff" color="black" style={{alignSelf: 'center'}}
                                             iconStyle={{marginRight: 0}} onPress={this.goToComment}>
                                    Comment
                                </Icon.Button>
                            </View>
                        </View>
                    </View>
                    <View style={styles.segment}>
                        <TouchableOpacity style={[styles.row, {paddingVertical: 5, borderBottomColor: '#f0f0f0', borderBottomWidth: 0.5}]}
                                          onPress={this.goToShop}>
                            <Text style={{alignSelf: 'center', fontSize: 16}}>{this.props.order.shop.name}</Text>
                            <View style={{justifyContent: 'center'}}>
                                <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                            </View>
                        </TouchableOpacity>
                        {items}
                        <View style={[styles.row, {paddingVertical: 10, borderTopColor: '#f0f0f0', borderTopWidth: 0.5}]}>
                            <View style={{flex: 1}}>
                                <Text style={{color: '#a2a2a2'}}>{new Date(this.props.order.timestamp_order_placed).toLocaleString()}</Text>
                            </View>
                            <View>
                                <Text>Total: ${this.props.order.total_price}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.segment, {paddingVertical: 5, flexDirection: 'row'}]}>
                        <View style={styles.receiver}>
                            <Text style={{color: '#a2a2a2'}}>Delivery Address</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                            <Text style={styles.receiver}>{this.props.order.customer.recipient.gender === 0 ? "Mr " : "Ms "}
                            {this.props.order.customer.recipient.first_name + ' '}
                            {this.props.order.customer.recipient.family_name}</Text>
                            <Text>{this.props.order.customer.recipient.phone}</Text>
                            <Text style={styles.receiver} numberOfLines={1}>{this.props.order.customer.recipient.place.formatted_address}</Text>
                        </View>
                    </View>
                    <View style={styles.segment}>
                        <View style={[styles.row, {paddingVertical: 5}]}>
                            <View style={{flex: 1}}>
                                <Text style={{color: '#a2a2a2'}}>Payment Type</Text>
                            </View>
                            <View>
                                <Text>{this.props.order.payment}</Text>
                            </View>
                        </View>
                        <View style={[styles.row, {paddingVertical: 5, borderTopColor: '#f0f0f0', borderTopWidth: 0.5}]}>
                            <View style={{flex: 1}}>
                                <Text style={{color: '#a2a2a2'}}>Order ID</Text>
                            </View>
                            <View>
                                <Text>{this.props.order._id}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
    segment: {
        paddingHorizontal: 10,
        marginBottom: 4,
        backgroundColor: 'white'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2
    },
    receiver: {
        marginVertical: 5
    }
})