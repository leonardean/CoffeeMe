/**
 * Created by leonardean on 07/08/2017.
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class OrderListItem extends Component {
    constructor (props) {
        super(props)
        console.log(this.props)
    }

    componentDidMount () {

    }

    goToShop = () => {
        this.props.onShopPress(this.props.order)
    }

    render () {
        let items = []
        this.props.order.items.forEach((item) => {
            if (item.quantity !== 0)
                items.push(
                    <View style={[styles.row, {marginHorizontal: 5}]}>
                        <Text>{item.name}</Text>
                        <View style={{width: 20}}>
                            <Text>x {item.quantity}</Text>
                        </View>
                    </View>
                )
        })
        if (items.length > 3) {
            items = items.slice(0, 3)
            items.push(
                <View style={[styles.row, {marginHorizontal: 5}]}>
                    <Text>...</Text>
                </View>
            )
        }
        items.push(
            <View style={[styles.row, {marginHorizontal: 5}]}>
                <Text style={{fontSize: 12, color: '#c2c2c2'}}>{new Date(this.props.order.timestamp_order_placed).toLocaleString()}</Text>
                <Text>Total: $ {this.props.order.total_price}</Text>
            </View>
        )

        return (
            <TouchableOpacity style={styles.listItemContainer} onPress={this.props.onPress}>
                <TouchableOpacity style={[styles.segment, styles.header, styles.row,
                    {borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0'}]}
                                  onPress={this.goToShop}>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={{height: 40, width: 40, resizeMode: 'contain'}}
                            source={{uri: this.props.order.shop.avatar_url}}
                        />
                    </View>
                    <Text style={{alignSelf: 'center', flex: 1, fontSize: 14}}> {this.props.order.shop.name} </Text>
                    <View style={{justifyContent: 'center'}}>
                        <Icon name="ios-arrow-forward" size={25} color="#a2a2a2"/>
                    </View>
                </TouchableOpacity>
                <View style={[styles.segment]}>
                    {items}
                </View>
                <View style={[styles.segment, styles.footer, styles.row,
                    {borderTopWidth: 0.5, borderTopColor: '#f0f0f0', paddingVertical: 3}]}>
                    <Text style={{alignSelf: 'center', color: '#c2c2c2', marginLeft: 5}}>Order Completed</Text>
                    <Icon.Button backgroundColor="#0c64ff" iconStyle={{marginRight: 0}} onPress={this.goToShop} >
                        Order Again
                    </Icon.Button>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 4
    },
    segment: {
        flex: 1,
        marginHorizontal: 10
    },
    header: {
        height: 50
    },
    footer: {
        height: 40
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2
    },
    avatarContainer: {
        height: 50,
        width: 50,
        margin: 5
    }
})