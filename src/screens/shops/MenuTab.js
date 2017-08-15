/**
 * Created by leonardean on 02/08/2017.
 */
import React, {Component} from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import MenuListItem from './MenuListItem';
import Global from '../../Global';
import Map from '../../components/util/Map';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import ItemOption from './ItemOption';
import ItemRemovalSelection from './ItemRemovalSelection';
import SummarySelection from './SummarySelection';

export default class MenuTab extends Component {
    constructor (props) {
        super (props);
        console.log(this.props)
        this.state = {
            isLoading: true,
            cart: new Map,
            cartItems: [],
            BadgeCount: 0,
            itemFocus: false,
            order: {
                shop: {
                    id: this.props.shop._id,
                    ...this.props.shop
                },
                items: [],
                delivery_fee: this.props.shop.delivery_fee,
                total_price: 0
            }
        };
    }

    componentWillMount () {
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
                        "value": this.props.shop._id
                    }
                },
                "bestEffortLimit": 10
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
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
        this.setState({
            currentItem: item,
            itemFocus: true,
        }, this.refs.itemCustomizationModal.open)
    }

    getItemFeatureKey = (item) => {
        let key = item._id + '|'
        item.options.forEach((option) => {
            option.values.forEach((value, index) => {
                if (value.selected === true)
                    key += index.toString()
            })
        })
        return key
    }

    onItemAddedToCart = () => {
        let itemFeatureKey = this.getItemFeatureKey(this.state.currentItem)
        this.state.cart.put(itemFeatureKey, this.state.cart.get(itemFeatureKey) ?
            Object.assign({},this.state.cart.get(itemFeatureKey), {
                quantity: this.state.cart.get(itemFeatureKey).quantity + 1,
                sub_total: this.state.cart.get(itemFeatureKey).sub_total + this.state.currentItem.price
        }) : Object.assign({},this.state.currentItem, {
                quantity: 1,
                sub_total: this.state.currentItem.price
            }))
        const order = Object.assign({}, this.state.order, { total_price: this.state.order.total_price + this.state.currentItem.price})
        this.setState({ order, BadgeCount: this.state.BadgeCount + 1}, () => {
            this.refs[this.state.currentItem._id].markItemAdded(1)
            this.refs.itemCustomizationModal.close()
        })
    }

    onItemRemovedFromCart = () => {
        let itemFeatureKey = this.getItemFeatureKey(this.state.currentItem)
        if (this.state.cart.get(itemFeatureKey).quantity === 1)
            this.state.cart.remove(itemFeatureKey)
        else
            this.state.cart.put(itemFeatureKey,
                Object.assign({},this.state.cart.get(itemFeatureKey), {
                    quantity: this.state.cart.get(itemFeatureKey).quantity - 1,
                    sub_total: this.state.cart.get(itemFeatureKey).sub_total - this.state.currentItem.price
                }))
        const order = Object.assign({}, this.state.order, { total_price: this.state.order.total_price - this.state.currentItem.price });
        this.setState({ order, BadgeCount: this.state.BadgeCount - 1 }, () => {
            this.refs[this.state.currentItem._id].markItemRemoved(1)
        });
    }

    onItemRemoved = (item) => {
        let itemCount = this.refs[item._id].getItemCounter()
        if (itemCount === 1) {
            this.state.cart.put(item, this.state.cart.get(item) - 1)
            const order = Object.assign({}, this.state.order, { total_price: this.state.order.total_price - item.price });
            this.setState({ order, BadgeCount: this.state.BadgeCount - 1 }, () => {
                this.refs[item._id].markItemRemoved(1)
            });
        } else {
            let currentItemsToBeRemoved = []
            let promises = []
            for (let i = 0; i ++ < this.state.cart.size; this.state.cart.next()) {
                let promise = new Promise((resolve) => {
                    if (this.state.cart.key().split('|')[0] === item._id) {
                        currentItemsToBeRemoved.push(
                            <ItemRemovalSelection
                                key={this.state.cart.key()}
                                item={this.state.cart.value()}
                                onItemAdded={(item) => {
                                    this.setState({
                                        currentItem: item,
                                        itemFocus: true,
                                    }, this.onItemAddedToCart)
                                }}
                                onItemRemoved={(item) => {
                                    this.setState({
                                        currentItem: item,
                                        itemFocus: true,
                                    }, this.onItemRemovedFromCart)
                                }}
                            />
                        )
                    }
                    resolve()
                })
                promises.push(promise)
            }
            Promise.all(promises).then(() => {
                this.setState({
                    currentItem: item,
                    itemFocus: true,
                    currentItemsToBeRemoved: currentItemsToBeRemoved
                }, () => {
                    this.refs.itemRemovalModal.open()
                    for (let i = 0; i ++ < this.state.cart.size; this.state.cart.next()) {
                    }
                })
            })
        }
    }

    onOptionChange = (option, priceChange) => {
        this.setState({
            currentItem: Object.assign({}, this.state.currentItem, {
                price: this.state.currentItem.price + priceChange,
                options: this.state.currentItem.options.map((prevOption) => {
                    if (prevOption.name === option.name)
                        return option
                    else
                        return prevOption

                })
            })
        })
    }

    placeOrder = () => {
        let promises = []
        let items = []
        let total_price = 0
        for(let i = 0; i++ < this.state.cart.size; this.state.cart.next()) {
            let promise = new Promise((resolve) => {
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

    onSummaryPressed = () => {
        let allItems = []
        let promises = []
        for (let i = 0; i ++ < this.state.cart.size; this.state.cart.next()) {
            let promise = new Promise((resolve) => {
                allItems.push(
                    <SummarySelection
                        key={this.state.cart.key()}
                        item={this.state.cart.value()}
                        onItemAdded={(item) => {
                            this.setState({
                                currentItem: item,
                                itemFocus: true,
                            }, this.onItemAddedToCart)
                        }}
                        onItemRemoved={(item) => {
                            this.setState({
                                currentItem: item,
                                itemFocus: true,
                            }, this.onItemRemovedFromCart)
                        }}
                    />
                )
                resolve()
            })
            promises.push(promise)
        }
        Promise.all(promises).then(() => {
            this.setState({
                allItems: allItems
            }, () => {
                this.refs.summaryModal.open()
                for (let i = 0; i ++ < this.state.cart.size; this.state.cart.next()) {
                }
            })
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
        let items = this.state.itemsList.map(item => {
            return (
                <MenuListItem
                    key={item.key}
                    ref={item.key}
                    item={{...item.itemInfo}}
                    onItemAdded={this.onItemAdded}
                    onItemRemoved={this.onItemRemoved}
                />
            )
        })

        let options
        if (this.state.currentItem !== undefined)
            options = this.state.currentItem.options.map(option => {
                return (
                    <ItemOption {...option} key={option.name} onOptionChange={this.onOptionChange}/>
                )
            })

        return (
            <View style={styles.menuContainer}>
                <View style={styles.menuItemContainer}>
                    <ScrollView>
                        {items}
                    </ScrollView>
                    <Modal style={[styles.itemCustomizationModal]}
                           position={"bottom"} ref={"summaryModal"}
                           swipeToClose={false}>
                        <View style={styles.customizationTitle}>
                            <View style={styles.customizationAvatarContainer}>
                                <Image
                                    style={{width: 65, height: 65, resizeMode: 'contain'}}
                                    source={{uri: this.props.shop.avatar_url}}
                                />
                            </View>
                            <View style={{justifyContent: 'space-around', paddingVertical: 10, flex: 1}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{flex: 1}}>
                                        <Text numberOfLines={1} style={styles.itemName}>{this.props.shop.name}</Text>
                                    </View>
                                </View>
                                <Text style={styles.rating}>Monthly Sold: {this.props.shop.monthly_sold}</Text>
                            </View>
                                <View style={{marginRight: 10, flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon.Button name="ios-trash-outline" size={20} iconStyle={{marginRight: 5}}
                                                 color={'#ffffff'}
                                                 backgroundColor={'#f20000'}
                                                 borderRadius={5} height={30} style={{marginRight:0}}>
                                        <Text style={{fontSize: 14, color: '#ffffff'}}>Clear</Text>

                                    </Icon.Button>
                                </View>
                        </View>
                        <ScrollView style={styles.customizationOptions}>
                            {this.state.allItems}
                        </ScrollView>
                    </Modal>
                </View>

                <View style={styles.cartContainer}>
                    <TouchableOpacity style={styles.summary} onPress={this.onSummaryPressed}>
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
                                Delivery Fee: {this.props.shop.delivery_fee}
                            </Text>
                        </View>

                    </TouchableOpacity>
                    <Icon.Button name="ios-pricetag" size={22} iconStyle={{marginRight: 10}}
                                 color="white"
                                 backgroundColor={this.state.BadgeCount === 0 ? '#91b9ff' : '#0c64ff'}
                                 borderRadius={0}
                                 disabled={this.state.BadgeCount === 0} onPress={this.placeOrder}>
                        Place Order
                    </Icon.Button>
                </View>
                <Modal style={[styles.itemCustomizationModal]} position={"center"} ref={"itemCustomizationModal"} swipeToClose={false}>
                    <View style={styles.customizationTitle}>
                        <View style={styles.customizationAvatarContainer}>
                            <Image
                                style={{width: 65, height: 65, resizeMode: 'contain'}}
                                source={{uri: this.state.itemFocus === true ? this.state.currentItem.avatar_url: ''}}
                            />
                        </View>
                        <View style={{justifyContent: 'space-around', paddingVertical: 10}}>
                            <Text style={styles.itemName}>{this.state.itemFocus === true ? this.state.currentItem.name : ''}</Text>
                            <Text style={styles.rating}>Monthly Sold: {this.state.itemFocus === true ? this.state.currentItem.monthly_sold : ''}</Text>
                        </View>
                    </View>
                    <ScrollView style={styles.customizationOptions}>
                        {options}
                    </ScrollView>
                    <View style={styles.customizationFooter}>
                        <Text style={{fontSize: 16, color: '#0c64ff'}}>
                            $ {this.state.itemFocus === true ? this.state.currentItem.price: ''}
                        </Text>
                        <Button style={styles.button}
                                containerStyle={{borderRadius: 2, overflow: 'hidden'}}
                                onPress={this.onItemAddedToCart}>
                            Add to Cart
                        </Button>
                    </View>
                </Modal>
                <Modal style={[styles.itemCustomizationModal]} position={"center"} ref={"itemRemovalModal"} swipeToClose={false}>
                    <View style={styles.customizationTitle}>
                        <View style={styles.customizationAvatarContainer}>
                            <Image
                                style={{width: 65, height: 65, resizeMode: 'contain'}}
                                source={{uri: this.state.itemFocus === true ? this.state.currentItem.avatar_url: ''}}
                            />
                        </View>
                        <View style={{justifyContent: 'space-around', paddingVertical: 10}}>
                            <Text style={styles.itemName}>{this.state.itemFocus === true ? this.state.currentItem.name : ''}</Text>
                            <Text style={styles.rating}>Monthly Sold: {this.state.itemFocus === true ? this.state.currentItem.monthly_sold : ''}</Text>
                        </View>
                    </View>
                    <ScrollView style={styles.customizationOptions}>
                        {this.state.currentItemsToBeRemoved}
                    </ScrollView>
                </Modal>
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
    },
    itemCustomizationModal: {
        height: 300,
        justifyContent: 'space-between',
    },
    customizationTitle: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0'
    },
    customizationAvatarContainer: {
        height:80,
        width: 85,
        margin: 5,
        backgroundColor: 'white',
        marginTop: -20,
        padding: 10,
        borderRadius: 5
    },
    itemName: {
        fontSize: 16,
        marginHorizontal: 5
    },
    rating: {
        fontSize: 10,
        color: '#a2a2a2',
        marginHorizontal: 5
    },
    customizationOptions: {
        flex: 1
    },
    customizationFooter: {
        height: 40,
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderTopColor: '#f0f0f0',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: "#0c64ff",
        color: "white",
        padding: 8,
        fontSize: 14,
    }
})