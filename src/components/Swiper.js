import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Vibration,
} from 'react-native';
import { Haptic } from 'expo';
import { Ionicons } from '@expo/vector-icons';

const BUTTON_WIDTH = 60;

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
      const SWIPE_LEFT_BUTTON_WIDTH =
        BUTTON_WIDTH * this.props.rightButtons.length;
      const SWIPE_RIGHT_BUTTON_WIDTH =
        BUTTON_WIDTH * this.props.leftButtons.length;
      let diffX = this.state.diffX;
      if (gestureState.dx < 0) {
        diffX = Math.max(gestureState.dx, -SWIPE_LEFT_BUTTON_WIDTH);
      } else if (this.state.diffX < 0 && gestureState.dx > 0) {
        diffX = diffX + gestureState.dx;
      } else if (gestureState.dx > 0) {
        diffX = Math.min(gestureState.dx, SWIPE_RIGHT_BUTTON_WIDTH);
      }
      this.setState({ diffX });
      Animated.timing(this._av, {
        toValue: diffX,
        duration: 1,
      }).start();
    },
    onPanResponderTerminationRequest: (evt, gestureState) => false,
    onPanResponderRelease: (evt, gestureState) => {
      const SWIPE_LEFT_BUTTON_WIDTH =
        BUTTON_WIDTH * this.props.leftButtons.length;
      const SWIPE_RIGHT_BUTTON_WIDTH =
        BUTTON_WIDTH * this.props.rightButtons.length;
      const shouldLeftButtonReleaseOnSwipe =
        this.props.onLeftSwipeRelease != null;
      const shouldRightButtonReleaseOnSwipe =
        this.props.onRightSwipeRelease != null;
      let diffX;

      const SWIPE_STICK_THRESHOLD = 0.7;
      const RELEASE_THRESHOLD = 10;

      if (
        !shouldRightButtonReleaseOnSwipe &&
        gestureState.dx < -SWIPE_LEFT_BUTTON_WIDTH / SWIPE_STICK_THRESHOLD
      ) {
        diffX = -SWIPE_LEFT_BUTTON_WIDTH;
      } else if (
        !shouldLeftButtonReleaseOnSwipe &&
        gestureState.dx > SWIPE_RIGHT_BUTTON_WIDTH / SWIPE_STICK_THRESHOLD
      ) {
        diffX = SWIPE_RIGHT_BUTTON_WIDTH;
      } else if (
        shouldLeftButtonReleaseOnSwipe &&
        gestureState.dx > SWIPE_LEFT_BUTTON_WIDTH + RELEASE_THRESHOLD
      ) {
        Haptic.impact(Haptic.ImpactStyles.Light);
        this.props.onLeftSwipeRelease();
        diffX = 0;
      } else if (
        shouldRightButtonReleaseOnSwipe &&
        gestureState.dx < -SWIPE_RIGHT_BUTTON_WIDTH + RELEASE_THRESHOLD
      ) {
        Haptic.impact(Haptic.ImpactStyles.Light);
        this.props.onRightSwipeRelease();
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
          {this.props.leftButtons}
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
          {this.props.rightButtons}
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
          width: BUTTON_WIDTH,
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
