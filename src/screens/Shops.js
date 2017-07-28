import React, { Component } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Alert} from 'react-native';
import ShopListItem from './shops/ShopListItem';
import Global from '../Global';
import { Navigation } from 'react-native-navigation';

export default class Shops extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        return fetch('https://api-jp.kii.com/api/apps/2c1pzz9jg5dd/buckets/SHOPS/query', {
                method: 'POST',
                headers: {
                    'Authorization': Global.basicAccessToken,
                    'Content-Type': 'application/vnd.kii.QueryRequest+json',
                },
                body: JSON.stringify({
                    "bucketQuery": {
                        "clause": {
                            "type": "all"
                        }
                    },
                    "bestEffortLimit": 10
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    shopsList: responseJson.results.map(shop => {
                        return {
                            key: shop['_id'],
                            shopInfo: shop
                        }
                    })
                })
            })
            .catch((error) => {
                console.error(error);
            });
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
                <FlatList
                    data={this.state.shopsList}
                    renderItem={({item}) => <ShopListItem
                        id={item.shopInfo["_id"]}
                        name={item.shopInfo.name}
                        stars={item.shopInfo.stars}
                        monthlySold={item.shopInfo.monthly_sold}
                        deliveryFee={item.shopInfo.delivery_fee}
                        avatarUrl={item.shopInfo.avatar_url}
                        onPressItem={(id: string) => {
                            this.props.navigator.push({
                                screen: 'SingleShop',
                                title: item.shopInfo.name,
                                passProps: {
                                    shopInfo: item
                                },
                                animated: true,
                                animationType: 'slide-horizontal',
                                backButtonHidden: false,
                            });
                        }}
                    />}
                />
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