import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import JoinRoomScreen from './src/screens/JoinRoom';
import ChatRoomScreen from './src/screens/ChatRoom';

const JoinRoomStack = createStackNavigator({ JoinRoom: JoinRoomScreen });
const ChatRoomStack = createStackNavigator({ ChatRoom: ChatRoomScreen });
export default createAppContainer(
  createSwitchNavigator({
    JoinRoom: {
      screen: JoinRoomStack,
    },
    ChatRoom: {
      screen: ChatRoomStack,
    },
  }, {
    initialRouteName: 'JoinRoom',
  }),
);
