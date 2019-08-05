import React from 'react';
import {
  View, FlatList, TextInput, TouchableOpacity, Text,
} from 'react-native';
import firebase from 'react-native-firebase';

export default class ChatRoom extends React.PureComponent {
  state = {
    chatData: [],
    chatInputContent: '',
    username: '',
  }

  _loadData=() => {
    firebase.database().ref('/chatRoom').on('value', (snapshot) => {
      console.log('================================================');
      console.log('snapshot', snapshot);
      console.log('================================================');
      if (snapshot.val() !== undefined && snapshot.val() !== null) {
        this.setState({
          chatData: Object.values(snapshot.val()),
          chatInputContent: '',
        });
      }
    });
  }

  componentWillMount() {
    this._loadData();
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({ username: navigation.state.params.name });
  }

  _sendMessage = () => {
    const { username, chatInputContent } = this.state;
    try {
      firebase.database().ref('/chatRoom').push({
        userName: username,
        chatContent: chatInputContent,
      }).then((data) => {
        this._loadData();
      });
    } catch (error) {
      console.log('_sendMessage error', error);
    }
  }

  _onChangeChatInput = (text) => {
    this.setState({ chatInputContent: text });
  }

  _renderChatLine = (item) => {
    const { username } = this.state;
    const { userName, chatContent } = item.item;
    if (userName === username) {
      return (
        <View style={{ alignItems: 'flex-end', width: '100%', backgroundColor: 'red' }}>
          <View style={{
            flexDirection: 'column',
            width: '50%',
            alignItems: 'flex-start',
            padding: 8,
            backgroundColor: '#FFF',
            borderRadius: 8,
            marginBottom: 10,
            marginTop: 10,
            marginLeft: 5,
            marginRight: 5,
          }}
          >
            <Text style={{ color: '#005ce6', marginBottom: 5 }}>YOU</Text>
            <Text>{chatContent}</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={{
        flexDirection: 'column',
        width: '50%',
        alignItems: 'flex-start',
        padding: 8,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
      }}
      >
        <Text style={{ color: '#005ce6', marginBottom: 5 }}>{userName}</Text>
        <Text>{chatContent}</Text>
      </View>
    );
  };

  render() {
    const { chatData, chatInputContent } = this.state;
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <FlatList
          style={{ flex: 1, backgroundColor: '#e5e5' }}
          data={chatData}
          renderItem={this._renderChatLine}
          keyExtractor={(item, index) => `${item}-${index}`}
          inverted
        />
        {/* </ImageBackground> */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#FFF',
          alignItems: 'center',
        }}
        >
          <View style={{ flex: 9 }}>
            <TextInput
              placeholder="Nhập nội dung chat"
              value={chatInputContent}
              onChangeText={this._onChangeChatInput}
              style={{ height: 100, fontSize: 18 }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={this._sendMessage}>
              <Text style={{ color: '#0099ff', fontSize: 14, marginRight: 15 }}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
