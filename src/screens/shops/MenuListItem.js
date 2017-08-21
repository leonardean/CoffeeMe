import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class ShopListItem extends Component {
    constructor (props) {
        super(props);
        console.log(this.props)
        this.state = {
            counter: 0
        };
    }

    markItemAdded = (number) => {
        this.setState({
            counter: this.state.counter + number
        })
    }

    markItemRemoved = (number) => {
        this.setState({
            counter: this.state.counter - number
        })
    }

    getItemCounter = () => {
        return this.state.counter
    }

    onItemAdded = () => {
        this.props.onItemAdded(this.props.item)
    }

    onItemRemoved = () => {
        this.props.onItemRemoved(this.props.item)
    }


    render () {
        return (
            <View style={styles.listItemContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        style={{width: 65, height: 65, resizeMode: 'contain'}}
                        source={{uri: this.props.item.avatar_url}}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.row}>
                        <Text style={styles.itemName} numberOfLines={1}>{this.props.item.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rating}> Monthly Sold: {this.props.item.monthly_sold}</Text>
                    </View>
                    <View style={styles.thirdRow}>
                        <Text style={styles.fee}>$ {this.props.item.price}</Text>
                        <View style={styles.counterContainer}>
                            <View display={this.props.item.on_stock === true ? 'none': 'flex'}>
                                <Text style={{color: '#a2a2a2'}}> Item Not Available</Text>
                            </View>
                            <Icon.Button name="ios-remove-circle-outline" size={25}
                                         margin={-5} iconStyle={{marginRight: 0}}
                                         color="black" backgroundColor="white"
                                         display={this.state.counter === 0 ? 'none' : 'flex'}
                                         onPress={this.onItemRemoved}/>
                            <View display={this.state.counter === 0 ? 'none' : 'flex'} width={25} alignItems="center">
                                <Text style={styles.counter}>{this.state.counter}</Text>
                            </View>
                            <Icon.Button name="ios-add-circle-outline" size={25}
                                         margin={-5} iconStyle={{marginRight: 0}} display={this.props.item.on_stock === true ? 'flex': 'none'}
                                         color="black" backgroundColor="white" onPress={this.onItemAdded}/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    listItemContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 4
    },
    avatarContainer: {
        height: 70,
        width: 70,
        margin: 5
    },
    contentContainer: {
        justifyContent: 'space-between',
        margin: 5,
        height: 70,
        flex: 1
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemName: {
        fontSize: 16,
        margin: 5
    },
    rating: {
        fontSize: 10,
        color: '#a2a2a2',
        margin: 3
    },
    thirdRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 5,
        marginRight: 5
    },
    fee: {
        fontSize: 12,
        color: '#7b7b7b',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counter: {
        fontSize: 12,
        color: '#7b7b7b'
    }
})
