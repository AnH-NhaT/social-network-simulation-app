import React, { Component } from 'react'
import { View, StyleSheet, Button, TextInput, TouchableOpacity, Text } from 'react-native'

import firebase from 'firebase'
import "firebase/firestore";

export class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        email
                    })
                console.log(result)
                
                firebase.firestore()
                    .collection("following")
                    .doc(firebase.auth().currentUser.uid)
                    .collection("userFollowing")
                    .doc(firebase.auth().currentUser.uid)
                    .set({})
            })
            .catch((error) => {
                console.log(error)
            })

    }

    render() {
        return (
            <View style={styles.main}>
                <View style={styles.viewName}>
                    <TextInput
                        style={styles.inputN}
                        placeholder="Enter your name"
                        onChangeText={(name) => this.setState({ name })}
                    />
                </View>
                <View style={styles.email}>
                    <TextInput
                        style={styles.inputE}
                        placeholder="Enter your email"
                        onChangeText={(email) => this.setState({ email })}
                    />
                </View>
                <View style={styles.pass}>
                    <TextInput
                        style={styles.inputP}
                        placeholder="Enter your Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                    />
                </View>

                <TouchableOpacity
                    style={styles.inside}
                    onPress={() => this.onSignUp()}>
                    <Text style={styles.text}>SIGN UP</Text>
                </TouchableOpacity>
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
        marginTop: 20,
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
    inputN: {
        fontSize: 15,
        color: 'blue',
    },
    inputE: {
        fontSize: 15,
        color: 'blue',
    },
    inputP: {
        fontSize: 15,
        color: 'blue',
    },
    viewName: {
        borderWidth: 5,
        borderColor: 'orange',
        borderRadius: 35,
        height: 70,
        width: 300,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    email: {
        borderWidth: 5,
        borderColor: 'orange',
        borderRadius: 35,
        height: 70,
        width: 300,
        marginBottom: 10,
        marginTop: 10,
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
export default Register
