import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native'

import firebase from 'firebase';
require('firebase/firestore');

export default function Search(props) {

    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
            })
    }
    return (
        <View style={styles.container}>
            <View style={styles.outside}>
                <TextInput
                    style={styles.placeholder}
                    placeholder="Type Here To Search..."
                    onChangeText={(search) => fetchUsers(search)} />
            </View>
            <Text style={styles.recent}>Recently Search</Text>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.user}
                        onPress={() => props.navigation.navigate("Profile", { uid: item.id })}>
                        <Text style={styles.inUser}>{item.name}</Text>
                    </TouchableOpacity>

                )}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        // backgroundColor:'white',
    },
    inUser: {
        margin: 11,
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: 'red',
        // borderWidth: 1,
        // borderColor: 'cyan',
    },
    recent: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        fontStyle: 'italic',
    },
    user: {
        backgroundColor: '#C0C0C0',
        height: 50,
        margin: 5,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
    },
    placeholder: {
        fontSize: 20,
        color: 'blue',
    },
    outside: {
        backgroundColor: '#CACACA',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        margin: 10,
    },
});
