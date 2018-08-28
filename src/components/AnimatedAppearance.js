import React from 'react';
import { Animated } from 'react-native';

export default class AnimatedAppearance extends React.Component {
  _av: Animated.Value = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this._av, {
      toValue: 1,
      duration: 1000,
    }).start();
  }

  render() {
    return (
      <Animated.View
        style={{
          opacity: this._av.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
