import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Hello from './components/Hello';

export default function App() {
  return (
    <View style={{flex: 1, backgroundColor: 'gray'}} >
     <Hello />
    </View>
  );
}

