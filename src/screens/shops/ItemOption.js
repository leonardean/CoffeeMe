/**
 * Created by leonardean on 14/08/2017.
 */
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class ItemOption extends React.Component {

    constructor (props) {
        super(props)
        this.state = this.props
    }

    _onOptionPress = (value) => {
        let newValues = this.state.values.map((oldValue) => {
            if (oldValue.name === value.name) {
                return Object.assign({}, oldValue, {
                    selected: true
                })
            } else {
                return Object.assign({}, oldValue, {
                    selected: false
                })
            }
        })
        this.setState({
            values: newValues
        })
    }

    componentDidUpdate (prevProps, prevState) {
        if (prevState.values === this.state.values)
            return
        let prevPriceModifier = 0
        prevState.values.map((value) => {
            if (value.selected === true)
                prevPriceModifier = value.price_modifier.value
        })
        let currentPriceModifier = 0
        this.state.values.map((value) => {
            if (value.selected === true)
                currentPriceModifier = value.price_modifier.value
        })
        console.log(currentPriceModifier, prevPriceModifier)
        let priceChange = currentPriceModifier - prevPriceModifier
        this.props.onOptionChange(this.state, priceChange)
    }

    render () {
        let optionItems = this.state.values.map((value)=>{
            return (
                <TouchableOpacity onPress={() => this._onOptionPress(value)}
                                  style={value.selected === true ? styles.optionItemSelected : styles.optionItemUnselected}>
                    <Text style={value.selected === true ? styles.textSelected: styles.textUnselected}>{value.name}</Text>
                </TouchableOpacity>
            )
        })
        return (
            <View style={styles.container}>
                <Text style={styles.optionName}>{this.state.name}</Text>
                <View style={styles.options}>
                    {optionItems}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    options: {
        flexDirection: 'row'
    },
    container: {
        margin: 10
    },
    optionItemUnselected: {
        borderWidth: 0.5,
        borderColor: '#a2a2a2',
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
        marginTop: 5
    },
    optionItemSelected: {
        borderWidth: 0.5,
        borderColor: '#0c64ff',
        backgroundColor: '#ebf6ff',
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
        marginTop: 5
    },
    optionName: {
        fontWeight: 'bold'
    },
    textSelected: {
        color: '#0c64ff'
    },
    textUnselected: {
        color: '#686868'
    }
})