/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import alive from './src/components/alive';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => alive);
