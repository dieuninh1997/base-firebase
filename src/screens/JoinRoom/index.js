import React from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, AsyncStorage,
} from 'react-native';

export default class JoinRoom extends React.PureComponent {
  state={
    name: '',
  }

  _toChatRoom=() => {
    this.props.navigation.navigate('ChatRoom', { name: this.state.name });
  }

  _onChangeName=(text) => {
    this.setState({ name: text });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>ENTER YOUR NAME :</Text>
        <TextInput
          placeholder=""
          style={styles.textInput}
          onChangeText={text => this._onChangeName(text)}
        />
        <TouchableOpacity onPress={this._toChatRoom}>
          <Text style={styles.buttonJoin}>Join Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    paddingBottom: 15,
  },
  textInput: {
    borderColor: '#A5A5A5',
    borderWidth: 0.5,
    padding: 8,
    width: '100%',
    marginBottom: 15,
    marginTop: 15,
  },
  buttonJoin: {
    fontWeight: 'bold',
  },
});
