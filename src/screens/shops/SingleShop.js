/**
 * Created by leonardean on 28/07/2017.
 */
import React, {Component} from 'react';
import { View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Tabs from './Tabs';
import Global from '../../Global';
import MenuTab from './MenuTab';
import CommentsTab from './CommentsTab';

export default class SingleShop extends Component {

    constructor (props) {
        super(props)
        this.state = {
        };
    }

    placeOrder = (order) => {
        if (Global.userAuthenticated === false) {
            this.props.navigator.push({
                screen: 'Authenticate',
                title: 'User Authentication',
                animated: true,
                animationType: 'fade',
                backButtonHidden: true,
                navigatorStyle: {
                    tabBarHidden: true
                }
            });
        } else {
            this.props.navigator.push({
                screen: 'OrderConfirm',
                title: 'Order Confirmation',
                passProps: {
                    order: order
                },
                animated: true,
                animationType: 'slide-horizontal',
                navigatorStyle: {
                    tabBarHidden: true
                }
            });
        }
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
                <Tabs>
                    <View title="Menu" style={styles.content}>
                        <MenuTab
                            {...this.props.shopInfo}
                            placeOrder={this.placeOrder} />
                    </View>
                    {/* Second tab */}
                    <View title="Comments" style={styles.content}>
                        <CommentsTab></CommentsTab>
                    </View>
                    {/* Third tab */}
                    <View title="Shop" style={styles.content}>
                        <Text style={styles.header}>
                            Ease of Learning
                        </Text>
                        <Text style={styles.text}>
                            It’s much easier to read and write comparing to native platform’s code
                        </Text>
                    </View>

                </Tabs>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    // App container
    container: {
        flex: 1,                            // Take up all screen
        backgroundColor: '#FFFFFF',         // Background color
    },
    // Tab content container
    content: {
        flex: 1,                            // Take up all available space
        justifyContent: 'center',           // Center vertically
        alignItems: 'stretch',              // Center horizontally
        backgroundColor: '#f0f0f0',         // Darker background for content area
    },
    // Content header
    header: {
        margin: 10,                         // Add margin
        color: '#000000',                   // White color
        fontSize: 26,                       // Bigger font size
    },
    // Content text
    text: {
        marginHorizontal: 20,               // Add horizontal margin
        color: 'rgba(0, 0, 0, 0.75)',       // Semi-transparent text
        textAlign: 'center',                // Center
        fontFamily: 'Avenir',
        fontSize: 18,
    }
});