import React from 'react';
import { Text, View, StyleSheet, RefreshControl, ActivityIndicator, ScrollView} from 'react-native';
import Global from '../Global';
import Icon from 'react-native-vector-icons/FontAwesome';
import OrderListItem from './orders/OrderListItem';

export default class Orders extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            isLogin: false,
            refreshing: false
        };
    }

    _refresh = () => {
        return new Promise((resolve) => {
            this.setState({
                refreshing: true
            })
            this.fetchOrders(() => {
                this.state.orderList.map((order, index) => {
                    this.refs[index].reload(order.orderInfo)
                })
                this.setState({
                    refreshing: false
                }, resolve())
            })
        });
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

    fetchOrders = (cb) => {
        fetch('https://api-jp.kii.com/api/apps/' + Global.appID + '/buckets/ORDERS/query', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + Global.userAccessToken,
                'Content-Type': 'application/vnd.kii.QueryRequest+json',
            },
            body: JSON.stringify({
                "bucketQuery": {
                    "clause": {
                        "type": "eq",
                        "field": "customer.id",
                        "value": Global.userID
                    },
                    "orderBy": "timestamp_order_status_0",
                    "descending": true
                },
                "bestEffortLimit": 10
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('fetched')
                this.setState({
                    isLoading: false,
                    orderList: responseJson.results.map(order => {
                        return {
                            key: order['_id'],
                            orderInfo: order
                        }
                    })
                }, cb)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidUpdate (prevProps, prevState) {
        if (prevState.isLogin === false && this.state.isLogin === true) {
            this.fetchOrders()
        }
    }

    goToShop = (item) => {
        this.props.navigator.push({
            screen: 'SingleShop',
            title: item.shop.name,
            passProps: {
                shopInfo: Object.assign({}, item.shop,
                    {'_id': item.shop.id})
            },
            animated: true,
            animationType: 'slide-horizontal',
            backButtonHidden: false,
            navigatorStyle: {
                tabBarHidden: true
            }
        });
    }

    goToOrderInfo = (order) => {
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
                order: order
            },
        })
    }

    showAuthenticate = () => {
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

    render () {
        console.log('re-rendering')
        if (this.state.isLoading && this.state.isLogin) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }
        let orderListItems
        if (Global.userAuthenticated === true)
            orderListItems = this.state.orderList.map((order, index) => {
                return (
                    <OrderListItem
                        key={index}
                        ref={index}
                        order={order.orderInfo}
                        onOrderAgainPress={this.goToShop}
                        onShopPress={this.goToShop}
                        onOrderPress={this.goToOrderInfo}
                    />
                )
            })

        return(
            <View style={styles.container}>
                {Global.userAuthenticated ?
                    <View>
                        <ScrollView refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._refresh}
                            />
                        }>
                            {orderListItems}
                        </ScrollView>
                        {/*<FlatList*/}
                            {/*onRefresh={this._refresh}*/}
                            {/*refreshing={this.state.refreshing}*/}
                            {/*data={this.state.orderList}*/}
                            {/*renderItem={({item}) => <OrderListItem*/}
                                {/*order={item.orderInfo}*/}
                                {/*onOrderAgainPress={this.goToShop}*/}
                                {/*onShopPress={this.goToShop}*/}
                                {/*onOrderPress={this.goToOrderInfo}*/}
                            {/*/>}*/}
                        {/*/>*/}
                    </View>:
                    <View style={{alignSelf: 'center', marginTop: 100}}>
                        <Text style={{ color: '#a2a2a2', alignSelf: 'center', fontSize: 12, marginBottom: 20 }}>
                            You Are Not Currently Logged In
                        </Text>
                        <Icon.Button backgroundColor="#0c64ff" borderRadius={2}
                                     iconStyle={{marginRight: 0}} style={{alignSelf: 'center'}}
                                     onPress={this.showAuthenticate}>
                            Press to Login
                        </Icon.Button>
                    </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    }
})