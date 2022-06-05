import React, { useState } from 'react'
import { View, Text, TextInput, Image, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Save(props) {

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);




    const [caption, setCaption] = useState("")

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log('finish' + snapshot)
            })
        }

        const taskError = snapshot => {
            console.log('issue' + snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {

        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.popToTop()
            }))
    }
    return (
        <ScrollView
            style={{ height: 3, }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <View style={{ flex: 1 }}>

                <View style={styles.the}>
                    <Text style={styles.truth}>TRUTH</Text>
                    <Text style={styles.truth}>Social</Text>
                </View>

                <Image source={{ uri: props.route.params.image }} />
                <View style={styles.cap}>
                    <TextInput
                        style={{ color: 'blue', marginLeft: 10 }}
                        placeholder="Write Some Caption..."
                        onChangeText={(caption) => setCaption(caption)}
                    />
                </View>

                <TouchableOpacity
                    style={styles.save}
                    onPress={() => uploadImage()} >
                    <Text style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}>PUSHING</Text>
                </TouchableOpacity>
                <View style={styles.viewTop}>
                    <Text style={styles.name}>Joyful</Text>
                    <Text style={styles.name}>Welcome!</Text>
                </View>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    the: {
        marginTop: 30,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    truth: {
        width: 360,
        fontStyle: 'italic',
        fontSize: 55,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'orange',
    },
    viewTop: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    name: {
        fontStyle: 'italic',
        fontSize: 55,
        fontWeight: 'bold',
        color: 'blue',
        width: 360,
        textAlign: 'center'
    },
    cap: {
        color: 'blue',
        // alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 50,
        borderColor: '#00cc00',
        borderWidth: 2,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
    },
    save: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 50,
        backgroundColor: '#00cc00',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
    },
});
