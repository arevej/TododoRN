import React from 'react';

import { createStackNavigator } from 'react-navigation';

import HomeScreen from 'Tododo/src/screens/HomeScreen';
import ListScreen from 'Tododo/src/screens/ListScreen';

const RootStack = createStackNavigator(
  {
    Home: ({ navigation }) => <HomeScreen navigation={navigation} />,
    List: ({ navigation }) => <ListScreen navigation={navigation} />,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
