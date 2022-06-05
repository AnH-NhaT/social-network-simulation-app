import React from 'react'
import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native'

export default function Landing({ navigation }) {
    return (
        <View style={styles.view}>
            <View style={styles.viewTop}>
                <Text style={styles.name}>TRUTH</Text>
                <Text style={styles.name}>Social</Text>
            </View>
            <TouchableOpacity
                style={styles.btlRegis}
                title="Register"
                onPress={() => navigation.navigate("Register")} >
                <Text style={styles.text}>REGISTER</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.btlLogin}
                onPress={() => navigation.navigate("Login")}>
                <Text style={styles.text}>LOGIN</Text>
            </TouchableOpacity>
        </View >
    )
}
const styles = StyleSheet.create({
    viewTop: {
        width: 200,
    },
    name: {
        fontStyle: 'italic',
        fontSize: 55,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'green',
    },
    view: {
        height: 600,
        alignItems: "center",
        justifyContent: "center",
    }, btlRegis: {
        marginTop: 70,
        marginBottom: 10,
        backgroundColor: 'orange',
        height: 70,
        width: 250,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    btlLogin: {
        backgroundColor: 'blue',
        height: 70,
        width: 250,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 35,
    },
    text: {
        fontSize: 20,
        color: '#fff',
    },
});