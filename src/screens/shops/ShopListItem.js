import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';

export default class ShopListItem extends Component {
    constructor (props) {
        super(props);
    }

    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };

    render () {
        return (
            <TouchableOpacity style={styles.listItemContainer} onPress={this._onPress}>
                <View style={styles.avatarContainer}>
                    <Image
                        style={{width: 65, height: 65, resizeMode: 'contain'}}
                        source={{uri: this.props.avatarUrl}}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.row}>
                        <Text style={styles.shopName} numberOfLines={1}>{this.props.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.starContainer}>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={this.props.stars}
                                emptyStar={'ios-star-outline'}
                                fullStar={'ios-star'}
                                halfStar={'ios-star-half'}
                                iconSet={'Ionicons'}
                                starSize={10}
                            />
                        </View>
                        <Text style={styles.rating}>{this.props.stars}</Text>
                        <Text style={styles.rating}>Monthly Sold: {this.props.monthlySold}</Text>
                    </View>
                    <View style={styles.thirdRow}>
                        <Text style={styles.fee}>Delivery Fee: ${this.props.deliveryFee}</Text>
                        <Text style={styles.fee}>0.5 km Away</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

    listItemContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 2
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
    shopName: {
        fontSize: 16,
        margin: 5
    },
    starContainer: {
        width: 70,
        padding: 5,
        paddingLeft: 5
    },
    rating: {
        fontSize: 10,
        color: '#a2a2a2',
        marginRight: 5
    },
    thirdRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 5
    },
    fee: {
        fontSize: 12,
        color: '#7b7b7b',
    }
})