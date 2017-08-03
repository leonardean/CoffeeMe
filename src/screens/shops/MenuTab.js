/**
 * Created by leonardean on 02/08/2017.
 */
import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import MenuListItem from './MenuListItem';
import Global from '../../Global';
import Map from '../../components/util/Map';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';

export default class MenuTab extends Component {
    constructor (props) {
        super (props);
        this.state = {
            isLoading: true,
            cart: new Map,
            BadgeCount: 0,
            order: {
                shop: {
                    id: this.props._id,
                    name: this.props.name,
                    place: this.props.place
                },
                items: [],
                delivery_fee: this.props.delivery_fee,
                total_price: 0
            }
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
                        "value": this.props._id
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
        const order = Object.assign({}, this.state.order, { total_price: this.state.order.total_price + item.price });
        this.setState({ order, BadgeCount: this.state.BadgeCount + 1 });
    }

    onItemRemoved = (item) => {
        this.state.cart.put(item, this.state.cart.get(item) - 1)
        const order = Object.assign({}, this.state.order, { total_price: this.state.order.total_price - item.price });
        this.setState({ order, BadgeCount: this.state.BadgeCount - 1 });
    }

    placeOrder = () => {
        let promises = []
        let items = []
        let total_price = 0
        for(let i = 0; i++ < this.state.cart.size; this.state.cart.next()) {
            let promise = new Promise((resolve, reject) => {
                let item = {
                    id: this.state.cart.key()._id,
                    avatar_url: this.state.cart.key().avatar_url,
                    name: this.state.cart.key().name,
                    price: this.state.cart.key().price,
                    quantity: this.state.cart.value(),
                    sub_total: this.state.cart.key().price * this.state.cart.value()
                }
                total_price += item.sub_total
                items.push(item)
                resolve(item)
            })
            promises.push(promise)
        }
        Promise.all(promises).then(() => {
            const order = Object.assign({}, this.state.order, { items: items, total_price: total_price });
            this.setState({order});
            this.props.placeOrder(this.state.order);
        })
    }

    render () {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
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
                            <Text style={{fontSize: 16, color: '#0c64ff'}}>${this.state.order.total_price} </Text>
                            <Text style={{fontSize: 10, color: '#a2a2a2'}}>
                                Delivery Fee: {this.props.delivery_fee}
                            </Text>
                        </View>

                    </View>
                    <Icon.Button name="ios-pricetag" size={22} iconStyle={{marginRight: 10}}
                                 color="white"
                                 backgroundColor={this.state.BadgeCount === 0 ? '#91b9ff' : '#0c64ff'}
                                 borderRadius={0}
                                 disabled={this.state.BadgeCount === 0} onPress={this.placeOrder}>
                        Place Order
                    </Icon.Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
        borderTopWidth: 0.5,
        borderTopColor: '#a2a2a2',
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalPrice: {
        justifyContent: 'space-around',
        marginLeft: 10
    }
})