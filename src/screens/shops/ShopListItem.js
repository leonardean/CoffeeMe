import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class ShopListItem extends Component {
    render () {
        return (
            <View style={styles.listItemContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        style={{width: 70, height: 70, resizeMode: 'contain'}}
                        source={{uri: 'https://2c1pzz9jg5dd.jp.kiiapps.com/api/x/s.d009f7a00022-68b8-7e11-e437-03a0ad8b'}}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.shopName} numberOfLines={1}> StarBuck (Guiping Road)</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    shopName: {
        fontSize: 16
    },
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
        margin: 5,
        height: 70,
        flex: 1,
        backgroundColor: 'darkcyan'
    }
})