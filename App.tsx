import React, { useEffect } from 'react';
import { View, Text, Button, Linking, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as RootNavigation from './RootNavigation'
import { LogLevel, OneSignal } from 'react-native-onesignal';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 50 }}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 50 }}>Details Screen</Text>
      <Button
        title='Go to Home Screen'
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

// Secret Screen only accessible via Deep Link 
// myapp://Secret
function SecretScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 50 }}>Secret Screen</Text>
      <Button
        title='Go to Home Screen'
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  // OneSignal Initialization
  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize("c7d0f879-3809-49f7-adf5-b6ff75552506");

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', (event) => {
    console.log('OneSignal: notification clicked:', event);
  });


  const linking = {
    prefixes: ['myapp://']
  };

  useEffect(() => {
    // Get the deep link used to open the app
    // When the app launches get the URL if it is NOT null 
    // It will be null if there was no Deep Link used to open the app, such as when the app is opened normally
    const getUrl = async () => {
      const initialUrl = await Linking.getInitialURL();

      if (initialUrl === null) {
        return;
      }

      // Show an alert with the link
      if (initialUrl.includes('Details')) {
        Alert.alert(initialUrl);
        RootNavigation.navigate('Details');
      } else if (initialUrl.includes('Secret')) {
        Alert.alert(initialUrl);
        RootNavigation.navigate('Secret');
      }
    };

    getUrl();
  });

  return (
    <NavigationContainer linking={linking} 
    ref={RootNavigation.navigationRef} 
    fallback={<Text>Loading...</Text>}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Secret" component={SecretScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

// Commands to test deep links
// Android
// adb shell am start -W -a android.intent.action.VIEW -d "myapp://Details" com.onesignal_deeplink_demo
// adb shell am start -W -a android.intent.action.VIEW -d "myapp://Secret" com.onesignal_deeplink_demo

// iOS
// xcrun simctl openurl booted "myapp://Details"
// xcrun simctl openurl booted "myapp://Secret"
