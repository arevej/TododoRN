import React from 'react';
import { View, Text } from 'react-native';

import Button from 'Tododo/src/components/Button';
import AnimatedAppearance from 'Tododo/src/components/AnimatedAppearance';

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatedAppearance>
          <Text
            style={{
              fontSize: 50,
              fontWeight: '600',
              letterSpacing: 10,
              color: '#000',
            }}
          >
            TODODO
          </Text>
        </AnimatedAppearance>
        <View style={{ height: 40 }} />
        <Button
          label="Start"
          onPress={() => this.props.navigation.navigate('List')}
        />
      </View>
    );
  }
}
