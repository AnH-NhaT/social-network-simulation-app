import React, { Component } from 'react'
import { View, StyleSheet, Button, TextInput, TouchableOpacity, Text } from 'react-native'

import firebase from 'firebase'

export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <View style={styles.main}>

                <View
                    style={styles.email}>
                    <TextInput
                        style={styles.inputE}
                        placeholder="Enter your email"
                        onChangeText={(email) => this.setState({ email })}
                    />
                </View>
                <View
                    style={styles.pass}>
                    <TextInput
                        style={styles.inputP}
                        placeholder="Enter your Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                    />
                </View>

                <View style={styles.signin}>
                    <TouchableOpacity
                        style={styles.inside}
                        onPress={() => this.onSignUp()}>
                        <Text style={styles.text}>SIGN IN</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewTop}>
                    <Text style={styles.name}>Joyful</Text>
                    <Text style={styles.name}>Welcome!</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewTop: {
        width: 200,
        marginTop: 50,
        width: 300,
    },
    text: { fontSize: 20, },
    name: {
        fontStyle: 'italic',
        fontSize: 55,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'blue',
    },
    main: {
        alignItems: "center",
    },
    inside: {
        borderWidth: 5,
        borderColor: '#CCFFFF',
        width: 250,
        backgroundColor: 'cyan',
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 35,
    },
    signin: {
        alignItems: "center",
        justifyContent: "center",
    },
    inputE: {
        fontSize: 15,
        color: 'blue',
    },
    inputP: {
        fontSize: 15,
        color: 'blue',
    },
    email: {
        borderWidth: 5,
        borderColor: 'orange',
        borderRadius: 35,
        height: 70,
        width: 300,
        marginBottom: 10,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    pass: {
        marginBottom: 10,
        width: 300,
        height: 70,
        borderWidth: 5,
        borderColor: 'orange',
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
    },
});
export default Login
