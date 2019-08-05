import React from 'react';
import {
  View, ImageBackground, FlatList, TextInput, TouchableOpacity, Text,
} from 'react-native';
import firebase from 'react-native-firebase';
import ChatLine from './ChatLine';

export default class ChatRoom extends React.PureComponent {
  static navigationOptions = {
    title: 'Chat',
  };

  state = {
    chatData: [],
    chatInputContent: '',
    username: '',
  }

  componentDidMount() {
    this.setState({ username: this.props.navigation.getParam('name', 'test') });
  }

  _sendMessage = () => {
    try {
      firebase.database().ref('/chatRoom').push({
        userName: this.state.username,
        chatContent: this.state.chatInputContent,
      }).then((data) => {
        firebase.database().ref('/chatRoom').on('value', (snapshot) => {
          console.log('================================================');
          console.log('data', data);
          console.log('================================================');
          if (snapshot.val() !== undefined && snapshot.val() !== null) {
            console.log('================================================');
            console.log('Object.values(snapshot.val())', Object.values(snapshot.val()));
            console.log('================================================');
            this.setState({
              chatData: Object.values(snapshot.val()),
              chatInputContent: '',
            });
          }
        });
      })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log('_sendMessage error', error);
    }
  }

  _onChangeChatInput = (text) => {
    this.setState({ chatInputContent: text });
  }

  _renderChatLine = (item) => {
    if (item.userName === this.state.username) {
      return (
        <View style={{ alignItems: 'flex-end' }}>
          <ChatLine sender="YOU" chatContent={item.chatContent} />
        </View>
      );
    }
    return (
      <ChatLine sender={item.userName} chatContent={item.chatContent} />
    );
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
        {/* <ImageBackground
          imageStyle={{ opacity: 0.4 }}
          source={require('../../assets/images/background.jpg')}
          style={{
            flex: 9 / 10, backgroundColor: '#A5A5A5', flexDirection: 'column', justifyContent: 'flex-end',
          }}
        > */}
        <FlatList
          style={{ flex: 1, backgroundColor: '#ccc' }}
          data={this.state.chatData}
          renderItem={({ item }) => this._renderChatLine(item)}
        />
        {/* </ImageBackground> */}
        <View style={{ flex: 1 / 10 }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: '#FFF',
            width: '100%',
            height: '100%',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginLeft: 2,
          }}
          >
            <View style={{ flex: 9 / 10 }}>
              <TextInput
                placeholder="Nhập nội dung chat"
                value={this.state.chatInputContent}
                onChangeText={text => this._onChangeChatInput(text)}
                style={{ height: 100, fontSize: 18 }}
              />
            </View>
            <View style={{ flex: 1 / 10 }}>
              <TouchableOpacity onPress={this._sendMessage}>
                <Text style={{ color: '#0099ff', fontSize: 14, marginRight: 15 }}>
                      Gửi
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
