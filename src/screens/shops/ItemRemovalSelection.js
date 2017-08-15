/**
 * Created by leonardean on 15/08/2017.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class ItemRemovalSelection extends React.Component {

    constructor (props) {
        super (props)
        this.state = this.props
    }

    onItemAdded = () => {
        this.setState({
            item: Object.assign({}, this.state.item, {
                quantity: this.state.item.quantity + 1
            }, this.props.onItemAdded(this.state.item))
        })
    }

    onItemRemoved = () => {
        this.setState({
            item: Object.assign({}, this.state.item, {
                quantity: this.state.item.quantity - 1
            }, this.props.onItemRemoved(this.state.item))
        })
    }

    render () {
        let options = this.state.item.options.map((option) => {
            return option.values.map((value) => {
                if (value.selected === true)
                    return (
                        <View key={value.name} style={styles.optionItem}>
                            <Text style={styles.optionText}>{value.name}</Text>
                        </View>
                    )
            })
        })
        return (
            <View style={styles.container}>
                <View style={styles.options}>
                    {options}
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>$ {this.state.item.price}</Text>
                </View>
                <View style={styles.counterContainer}>
                    <Icon.Button name="ios-remove-circle-outline" size={25}
                                 margin={-5} iconStyle={{marginRight: 0}}
                                 color='#0c64ff' backgroundColor="white"
                                 display={this.state.item.quantity === 0 ? 'none' : 'flex'}
                                 onPress={this.onItemRemoved}/>
                    <View display={this.state.item.quantity === 0 ? 'none' : 'flex'} width={25} alignItems="center">
                        <Text style={styles.counter}>{this.state.item.quantity}</Text>
                    </View>
                    <Icon.Button name="ios-add-circle-outline" size={25}
                                 margin={-5} iconStyle={{marginRight: 0}}
                                 color='#0c64ff' backgroundColor="white" onPress={this.onItemAdded}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0'
    },
    optionItem: {
        backgroundColor: '#ebf6ff',
        padding: 5,
        borderRadius: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        flexWrap: 'nowrap',
        height: 25
    },
    optionText: {
        color: '#0c64ff',
        fontSize: 12
    },
    options: {
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap'
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 80,
        justifyContent: 'space-between'
    },
    counter: {
        fontSize: 12,
        color: '#7b7b7b'
    },
    priceContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    priceText: {
        color: '#0c64ff',
        fontSize: 16
    }

})