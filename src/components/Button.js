import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

export default class Button extends React.Component {
  pressedInAV = new Animated.Value(0);

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        onPressIn={() =>
          Animated.timing(this.pressedInAV, {
            toValue: 1,
            duration: 150,
          }).start()
        }
        onPressOut={() =>
          Animated.timing(this.pressedInAV, {
            toValue: 0,
            duration: 150,
          }).start()
        }
      >
        <Animated.View
          style={{
            backgroundColor: this.pressedInAV.interpolate({
              inputRange: [0, 1],
              outputRange: ['#000', '#555'],
            }),
            borderRadius: 15,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 80,
              paddingVertical: 20,
              color: '#fff',
            }}
          >
            {this.props.label}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
