/**
 * Created by leonardean on 18/08/2017.
 */
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CommentSuccess extends React.Component {

    constructor (props) {
        super (props)
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    static navigatorButtons = {
        rightButtons: [
            {
                title: 'Close',
                id: 'close'
            }
        ]
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'close') {
                this.props.navigator.popToRoot()
            }
        }
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center'}}>
                    <Icon name={'ios-checkmark-circle'} size={60} color={'green'} />
                    <Text>Comment Successful!</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50
    }
})