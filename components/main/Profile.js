import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native'
import { reload } from '../../redux/actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import firebase from 'firebase'
require('firebase/firestore')

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false)
        });
    }, []);

    console.log('id = ' + props.route.params.uid);

    useEffect(() => {

        firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    setUser(snapshot.data());
                }
                else {
                    console.log('does not exist')
                }
            })

        firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserPosts(posts)
            })

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }

    if (user === null) {
        return <View></View>
    }

    return (

        <View style={styles.container}>

            <View style={styles.containerInfo}>
                <Text
                    style={{ fontSize: 20, fontStyle: 'italic' }}
                >Name: {user.name}</Text>
                <Text
                    style={{ fontSize: 20, fontStyle: 'italic' }}
                >Email: {user.email}</Text>

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <TouchableOpacity
                                style={styles.follow}
                                onPress={() => onUnfollow()}>
                                <Text
                                    style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}
                                >FOLLOWING</Text>
                            </TouchableOpacity>
                        ) :
                            (
                                <TouchableOpacity
                                    style={styles.follow}
                                    onPress={() => onFollow()}>
                                    <Text
                                        style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}
                                    >FOLLOW</Text>
                                </TouchableOpacity>
                            )}
                    </View>
                ) :
                    <TouchableOpacity
                        style={styles.logout}
                        onPress={() => onLogout()}>
                        <Text
                            style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}
                        >LOG OUT</Text>
                    </TouchableOpacity>

                }
            </View>

            <View style={styles.containerGallery}>
                <FlatList
                    style={{ height: 3, }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                onRefresh
                                props.reload()
                            }} />}
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                        </View>

                    )}

                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    logout: {
        marginTop: 20,
        height: 50,
        backgroundColor: 'red',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    follow: {
        marginTop: 20,
        height: 50,
        backgroundColor: '#00e600',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})
const mapDispatchProps = (dispatch) => bindActionCreators({ reload }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Profile);
