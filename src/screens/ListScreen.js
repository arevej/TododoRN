import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo';

import Swiper from 'Tododo/src/components/Swiper';

let idCounter = 0;

function CheckBox({ onDone, isDone }) {
  return (
    <TouchableWithoutFeedback
      onPress={onDone}
      hitSlop={{ top: 10, left: 30, bottom: 10, right: 50 }}
    >
      <View style={{ paddingVertical: 20, paddingLeft: 20, paddingRight: 20 }}>
        <View
          style={[
            styles.listItemButton,
            isDone ? styles.listItemButtonActive : null,
          ]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

function ListItem({
  text,
  inputRef,
  isDone,
  onDone,
  onChangeText,
  onBlur,
  onDelete,
  onReturn,
  onSwiped,
}) {
  return (
    <Swiper
      onSwiped={onSwiped}
      rightButton={
        <Swiper.Button
          color="red"
          icon="ios-close-outline"
          onPress={onDelete}
        />
      }
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.listItem}>
          <CheckBox onDone={onDone} isDone={isDone} />
          <TextInput
            onChangeText={onChangeText}
            onBlur={onBlur}
            onKeyPress={event =>
              event.nativeEvent.key === 'Backspace' && text === ''
                ? onDelete()
                : null
            }
            onSubmitEditing={onReturn}
            scrollEnabled={false}
            ref={inputRef}
            style={[
              styles.listItemText,
              isDone ? styles.listItemTextDone : null,
            ]}
            value={text}
          />
        </View>
      </View>
    </Swiper>
  );
}

export default class ListScreen extends React.Component {
  state = {
    todoList: [
      { id: idCounter++, text: 'Apple', isDone: false },
      { id: idCounter++, text: 'Juice', isDone: false },
      { id: idCounter++, text: 'Rolling pin', isDone: false },
      { id: idCounter++, text: 'Extension cord', isDone: false },
      { id: idCounter++, text: 'Bread', isDone: false },
    ],
  };

  _lastSwiper = null;

  inputs = {};

  handleTaskPerfomance = id => {
    const newTodoList = this.state.todoList.map(item => {
      if (id === item.id) {
        return { ...item, isDone: !item.isDone };
      }
      return item;
    });

    this.setState({ todoList: newTodoList });
  };

  deleteItemIfEmpty = id => {
    this.setState(state => {
      const newTodoList = state.todoList.filter(item => {
        if (id === item.id) {
          return item.text !== '';
        }
        return true;
      });
      return { todoList: newTodoList };
    });
  };

  changeItemText = (text, id) => {
    this.setState(state => {
      const newTodoList = state.todoList.map(item => {
        if (id === item.id) {
          return { ...item, text: text };
        }
        return item;
      });
      return { todoList: newTodoList };
    });
  };

  deleteItem = id => {
    this.setState({
      todoList: this.state.todoList.filter(item => item.id != id),
    });
  };

  createNewItem = (index, id) => {
    const { todoList } = this.state;
    const before = todoList.slice(0, index + 1);
    const after = todoList.slice(index + 1);
    const item = {
      id: idCounter++,
      text: '',
      isDone: false,
    };
    const newTodoList = [...before, item, ...after];
    this.setState({ todoList: newTodoList }, () => {
      const element = this.inputs[item.id];
      element.focus();
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>TODODO</Text>
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
            style={{
              height: 25,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
            }}
          />
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={105}
            behavior="padding"
            enabled
          >
            <ScrollView
              style={{ flex: 1, paddingTop: 10 }}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {this.state.todoList.map((item, index) => (
                <ListItem
                  key={item.id}
                  inputRef={element => (this.inputs[item.id] = element)}
                  text={item.text}
                  isDone={item.isDone}
                  onDone={() => this.handleTaskPerfomance(item.id)}
                  onChangeText={text => this.changeItemText(text, item.id)}
                  onBlur={() => this.deleteItemIfEmpty(item.id)}
                  onDelete={() => {
                    this.deleteItem(item.id);
                    this._lastSwiper = null;
                  }}
                  onReturn={() => this.createNewItem(index, item.id)}
                  onSwiped={swiper => {
                    if (this._lastSwiper) {
                      this._lastSwiper.close();
                    }
                    this._lastSwiper = swiper;
                  }}
                />
              ))}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },

  logo: {
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 10,
    paddingBottom: 15,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },

  listItemText: {
    fontSize: 22,
    flex: 1,
    letterSpacing: 3,
    color: '#000',
  },

  listItemTextDone: {
    color: '#aaa',
  },

  listItemButton: {
    width: 17,
    height: 17,
    borderWidth: 2,
    borderColor: '#111',
    borderRadius: 18,
    backgroundColor: '#fff',
  },

  listItemButtonActive: {
    backgroundColor: '#111',
  },
};
