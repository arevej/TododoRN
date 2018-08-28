import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SWIPE_BUTTON_WIDTH = 60;
export default class Swiper extends React.Component {
  _av: Animated.Value = new Animated.Value(0);

  state = {
    diffX: 0,
  };

  _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dx < 0,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => {
      return true;
    },
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      return true;
    },

    onPanResponderGrant: (evt, gestureState) => {
      if (this.props.onSwiped) {
        this.props.onSwiped(this);
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      let diffX = this.state.diffX;
      if (gestureState.dx < 0) {
        diffX = Math.max(gestureState.dx, -SWIPE_BUTTON_WIDTH);
      } else if (this.state.diffX < 0 && gestureState.dx > 0) {
        diffX = diffX + gestureState.dx;
      } else if (this.props.isSwipeableRight && gestureState.dx > 0) {
        diffX = Math.min(gestureState.dx, SWIPE_BUTTON_WIDTH);
      }
      this.setState({ diffX });
      Animated.timing(this._av, {
        toValue: diffX,
        duration: 1,
      }).start();
    },
    onPanResponderTerminationRequest: (evt, gestureState) => false,
    onPanResponderRelease: (evt, gestureState) => {
      let diffX;
      if (gestureState.dx < -SWIPE_BUTTON_WIDTH / 0.7) {
        diffX = -SWIPE_BUTTON_WIDTH;
      } else if (
        this.props.isSwipeableRight &&
        gestureState.dx > SWIPE_BUTTON_WIDTH * 3
      ) {
        this.props.onDone();
        Vibration.vibrate();
        diffX = 0;
      } else {
        diffX = 0;
      }
      this.setState({ diffX });
      Animated.timing(this._av, {
        toValue: diffX,
        duration: 300,
      }).start();
    },
    onPanResponderTerminate: (evt, gestureState) => {},
  });

  close() {
    this.setState({ diffX: 0 });
    Animated.timing(this._av, {
      toValue: 0,
      duration: 300,
    }).start();
  }

  render() {
    return (
      <View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            zIndex: 1,
          }}
        >
          {this.props.leftButton}
        </View>
        <Animated.View
          {...this._panResponder.panHandlers}
          style={{
            transform: [
              {
                translateX: this._av,
              },
            ],
            zIndex: 2,
          }}
        >
          {this.props.children}
        </Animated.View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            zIndex: 1,
          }}
        >
          {this.props.rightButton}
        </View>
      </View>
    );
  }
}

function SwiperButton({ icon, color, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          width: 60,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name={icon} size={50} color="white" />
      </View>
    </TouchableWithoutFeedback>
  );
}

Swiper.Button = SwiperButton;
