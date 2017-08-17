import {Navigation} from 'react-native-navigation';
import {registerScreens} from './screens';
import Icon from 'react-native-vector-icons/Ionicons';

registerScreens();

let shopIcon;
let shopSelectedIcon;
let orderIcon;
let orderSelectedIcon;
let accountIcon;
let accountSelectedIcon;

export default class App {

    constructor () {
        this.populateIcons().then(() => {
            console.disableYellowBox = true;
            this.startApp();
        }).catch((error) => {
            console.error(error);
        });

    }

    populateIcons () {
        return new Promise(function (resolve, reject) {
            Promise.all(
                [
                    Icon.getImageSource('ios-home', 30),
                    Icon.getImageSource('ios-home-outline', 30),
                    Icon.getImageSource('ios-paper', 30),
                    Icon.getImageSource('ios-paper-outline', 30),
                    Icon.getImageSource('ios-contact', 30),
                    Icon.getImageSource('ios-contact-outline', 30)
                ]
            ).then((values) => {
                shopIcon = values[1];
                shopSelectedIcon = values[0];
                orderIcon = values[3];
                orderSelectedIcon = values[2];
                accountIcon = values[5];
                accountSelectedIcon = values[4];
                resolve(true);
            }).catch((error) => {
                console.log(error);
                reject(error);
            }).done();
        });
    }

    startApp () {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    label: 'Shops',
                    screen: 'Shops',
                    icon: shopIcon,
                    selectedIcon: shopSelectedIcon,
                    title: 'Coffee Me'
                },
                {
                    label: 'Orders',
                    screen: 'Orders',
                    icon: orderIcon,
                    selectedIcon: orderSelectedIcon,
                    title: 'My Orders'
                },
                {
                    label: 'Account',
                    screen: 'Account',
                    icon: accountIcon,
                    selectedIcon: accountSelectedIcon,
                    title: 'My Account'
                }
            ]
        });
    }
}




