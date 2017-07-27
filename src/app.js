import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screens';

registerScreens(); // this is where you register all of your app's screens

Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'Shops',
            screen: 'Shops',
            title: 'Coffee Me'
        },
        {
            label: 'Orders',
            screen: 'Orders',
            title: 'My Orders'
        },
        {
            label: 'Account',
            screen: 'Account',
            title: 'My Account'
        }
    ]
});


