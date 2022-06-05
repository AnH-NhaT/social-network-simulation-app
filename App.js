import React, { Component } from 'react';

import { View, Text, StyleSheet, LogBox } from 'react-native'
// LogBox.ignoreLogs(['Setting a timer for a long period of time'])
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native'])
LogBox.ignoreLogs(['ImagePicker.requestCameraRollPermissionsAsync()'])
LogBox.ignoreLogs(['"requestPermissionsAsync()" is now deprecated'])
// LogBox.ignoreAllLogs()
import firebase from 'firebase'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyBqSGDnkR54ZJG85_yhegBz7y65Jy8orSs",
  authDomain: "instagram-5ee80.firebaseapp.com",
  projectId: "instagram-5ee80",
  storageBucket: "instagram-5ee80.appspot.com",
  messagingSenderId: "1034450005301",
  appId: "1:1034450005301:web:b672317240e26ceb9a707c",
  measurementId: "G-PCN31T38H6"
};


if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'


const Stack = createStackNavigator();


export class App extends Component {
  constructor(props) {
    super()
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={styles.wrap}>
          <View style={styles.viewTop}>
            <Text style={styles.name}>TRUTH</Text>
            <Text style={styles.name}>Social</Text>
          </View>
        </View >
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer >
          <Stack.Navigator initialRouteName="Main" >
            <Stack.Screen name="Main" component={MainScreen}
              options={{
                title: "THE TRUTH",
                headerStyle: {
                  backgroundColor: '#F7FFFF',
                },
                headerTintColor: '#11d946',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  width: 180,
                  fontSize: 30,
                  fontFamily: 'serif',

                },
              }} />
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation}
              options={{
                title: "THE TRUTH",
                headerStyle: {
                  backgroundColor: '#F7FFFF',
                },
                headerTintColor: '#11d946',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  width: 180,
                  fontSize: 30,
                  fontFamily: 'serif',

                },
              }}
            />
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}
              options={{
                title: "THE TRUTH",
                headerStyle: {
                  backgroundColor: '#F7FFFF',
                },
                headerTintColor: '#11d946',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  width: 180,
                  fontSize: 30,
                  fontFamily: 'serif',

                },
              }}
            />
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}
              options={{
                title: "THE TRUTH",
                headerStyle: {
                  backgroundColor: '#F7FFFF',
                },
                headerTintColor: '#11d946',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  width: 180,
                  fontSize: 30,
                  fontFamily: 'serif',

                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  viewTop: {

  },
  name: {
    fontSize: 100,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'cyan',
  },
})
export default App
