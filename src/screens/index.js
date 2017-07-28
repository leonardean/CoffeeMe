/**
 * Created by leonardean on 27/07/2017.
 */
import { Navigation } from 'react-native-navigation';

import Shops from './Shops';
import Orders from './Orders';
import Account from './Account';
import SingleShop from './shops/SingleShop'

// register all screens of the app (including internal ones)
export function registerScreens() {
    Navigation.registerComponent('Shops', () => Shops);
    Navigation.registerComponent('Orders', () => Orders);
    Navigation.registerComponent('Account', () => Account);
    Navigation.registerComponent('SingleShop', () => SingleShop);
}