/**
 * Created by leonardean on 28/07/2017.
 */
import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import Tabs from './Tabs';
import MenuListItem from './MenuListItem';
import Global from '../../Global';
import Map from '../../components/util/Map';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';

export default class SingleShop extends Component {

    constructor (props) {
        super(props)
        this.state = {
            isLoading: true,
            cart: new Map,
            total: 0,
            BadgeCount: 0
        };
    }

    componentDidMount () {
        return fetch('https://api-jp.kii.com/api/apps/2c1pzz9jg5dd/buckets/STOCK_ITEMS_CONSUMER/query', {
            method: 'POST',
            headers: {
                'Authorization': Global.basicAccessToken,
                'Content-Type': 'application/vnd.kii.QueryRequest+json',
            },
            body: JSON.stringify({
                "bucketQuery": {
                    "clause": {
                        "type": "eq",
                        "field": "shop_id",
                        "value": this.props.shopInfo.shopInfo._id
                    }
                },
                "bestEffortLimit": 10
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    itemsList: responseJson.results.map(item => {
                        return {
                            key: item['_id'],
                            itemInfo: item
                        }
                    })
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onItemAdded = (item) => {
        this.state.cart.put(item, this.state.cart.get(item) ? this.state.cart.get(item) + 1 : 1)
        this.setState({
            BadgeCount: this.state.BadgeCount + 1,
            total: this.state.total + item.price
        })
    }

    onItemRemoved = (item) => {
        this.setState({
            BadgeCount: this.state.BadgeCount - 1,
            total: this.state.total - item.price
        })
    }

    placeOrder = () => {
        if (Global.userAuthenticated === false) {
            this.props.navigator.showModal({
                screen: "Authenticate",
                title: "User Authentication",
                passProps: {
                    props: this.state.order,
                    to: 'OrderConfirm'
                },
                animationType: 'slide-up'
            });
        } else {
            this.props.navigator.push({
                screen: 'OrderConfirm',
                title: 'Order Confirmation',
                passProps: {
                    ...this.state.order
                },
                animated: true,
                animationType: 'slide-horizontal',
            });
        }
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
                <Tabs>
                    {/* First tab */}
                    <View title="Menu" style={styles.content}>
                        <View style={styles.menuContainer}>
                            <View style={styles.menuItemContainer}>
                                <FlatList
                                    data={this.state.itemsList}
                                    renderItem={({item}) => <MenuListItem
                                        item={{...item.itemInfo}}
                                        onItemAdded={this.onItemAdded}
                                        onItemRemoved={this.onItemRemoved}
                                    />}
                                />
                            </View>
                            <View style={styles.cartContainer}>
                                <View style={styles.summary}>
                                    <IconBadge
                                        MainElement={
                                            <View style={{width: 30, height: 30, margin: 5}}>
                                                <Icon name="ios-cart" size={30} alignSelf="center" color="#0c64ff"/>
                                            </View>
                                        }
                                        BadgeElement={
                                            <Text
                                                style={{color: '#FFFFFF', fontSize: 10}}>{this.state.BadgeCount}</Text>
                                        }
                                        IconBadgeStyle={
                                            {width: 16, height: 16, backgroundColor: '#FF0000'}
                                        }
                                        Hidden={this.state.BadgeCount === 0}
                                    />
                                    <View style={styles.totalPrice}>
                                        <Text style={{fontSize: 16, color: '#0c64ff'}}>${this.state.total} </Text>
                                        <Text style={{fontSize: 10, color: '#a2a2a2'}}>
                                            Delivery Fee: {this.props.shopInfo.shopInfo.delivery_fee}
                                        </Text>
                                    </View>

                                </View>
                                <Icon.Button name="ios-pricetag" size={20} iconStyle={{marginRight: 10}}
                                             color="white"
                                             backgroundColor={this.state.BadgeCount === 0 ? '#91b9ff' : '#0c64ff'}
                                             borderRadius={0}
                                             disabled={this.state.BadgeCount === 0} onPress={this.placeOrder}>
                                    Place Order
                                </Icon.Button>
                            </View>
                        </View>
                    </View>
                    {/* Second tab */}
                    <View title="Comments" style={styles.content}>
                        <Text style={styles.header}>
                            Truly Native
                        </Text>
                        <Text style={styles.text}>
                            Components you define will end up rendering as native platform widgets
                        </Text>
                    </View>
                    {/* Third tab */}
                    <View title="Shop" style={styles.content}>
                        <Text style={styles.header}>
                            Ease of Learning
                        </Text>
                        <Text style={styles.text}>
                            It’s much easier to read and write comparing to native platform’s code
                        </Text>
                    </View>

                </Tabs>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    // App container
    container: {
        flex: 1,                            // Take up all screen
        backgroundColor: '#FFFFFF',         // Background color
    },
    // Tab content container
    content: {
        flex: 1,                            // Take up all available space
        justifyContent: 'center',           // Center vertically
        alignItems: 'stretch',               // Center horizontally
        backgroundColor: '#f0f0f0',         // Darker background for content area
    },
    // Content header
    header: {
        margin: 10,                         // Add margin
        color: '#000000',                   // White color
        fontSize: 26,                       // Bigger font size
    },
    // Content text
    text: {
        marginHorizontal: 20,               // Add horizontal margin
        color: 'rgba(0, 0, 0, 0.75)', // Semi-transparent text
        textAlign: 'center',                // Center
        fontFamily: 'Avenir',
        fontSize: 18,
    },
    menuContainer: {
        flex: 1
    },
    menuItemContainer: {
        flex: 1,
    },
    cartContainer: {
        height: 40,
        backgroundColor: 'green',
        flexDirection: 'row',
    },
    summary: {
        flex: 1,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#a2a2a2',
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalPrice: {
        justifyContent: 'space-around',
        marginLeft: 10
    }
});