import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { reload, deletePost } from '../../redux/actions/index';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function Feed(props) {
    const [modalShow, setModalShow] = useState({ visible: false, item: null })
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false)
        });
    }, []);

    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }
        console.log(posts)

    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }
    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }
    const onDeletePost = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .delete()
    }
    return (
        <View style={styles.container}>
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
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <TouchableOpacity
                                style={styles.avatar}
                                onPress={() => props.navigation.navigate("Profile", { uid: item.user.uid })}>
                                <View style={styles.circle}>
                                    <View style={styles.faker}>
                                        <Text style={styles.img}>ava</Text>
                                    </View>
                                </View>
                                <View style={styles.nameA}>
                                    <Text style={styles.inNameA}>{item.user.name}</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.viewCap}>
                                <Text style={styles.textCap}>{item.caption}</Text>
                            </View>

                            {/* <View >
                                <TouchableOpacity
                                    style={styles.testDelete}
                                    onPress={() => onDeletePost(item.user.uid, item.id)}
                                >
                                </TouchableOpacity>
                            </View> */}

                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }} />

                            <View style={styles.lico}>

                                {item.currentUserLike ?
                                    (
                                        <View style={styles.viewD}>
                                            <TouchableOpacity
                                                style={styles.dis}
                                                onPress={() => onDislikePress(item.user.uid, item.id)}>
                                                <Text style={styles.texttD}>DISLIKE</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                    :
                                    (
                                        <View style={styles.viewL}>
                                            <TouchableOpacity
                                                style={styles.like}
                                                onPress={() => onLikePress(item.user.uid, item.id)}>
                                                <Text style={styles.textt}>LIKE</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }

                                <View style={styles.viewC}>
                                    <TouchableOpacity
                                        style={styles.commen}
                                        onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}
                                    >
                                        <Text style={styles.textt}>COMMENT</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.split}></View>
                        </View>

                    )}

                />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    // testDelete: {
    //     height: 40,
    //     backgroundColor: 'red',
    // },
    viewCap: {
        // borderWidth: 1,
        margin: 10,
        marginTop: 5,
    },
    textCap: {
        fontSize: 20,
        color: '#ff1ac6',
        fontStyle: 'italic',
        fontWeight: '400',
        fontFamily: 'serif',
    },
    split: {
        marginTop: 5,
        backgroundColor: 'gray',
        height: 12,
    },
    textt: {
        fontWeight: 'bold',
        color: '#00bfff',
    },
    texttD: {
        fontWeight: 'bold',
        color: 'white',
    },
    viewC: {
        width: 172,
        // borderWidth: 1,
        // borderColor: 'red',
        margin: 5,
        marginLeft: 4,
    },
    viewL: {
        width: 172,
        // borderWidth: 1,
        // borderColor: 'red',
        margin: 5,
        marginRight: 0,
    },
    viewD: {
        marginRight: 0,
        margin: 5,
        width: 172,
        // borderWidth: 1,
        // borderColor: 'red',
    },

    lico: {
        flexDirection: 'row',
    },
    commen: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#00bfff',
        height: 50,
        borderRadius: 4,
    },
    dis: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: '#00bfff',
        borderColor: '#00FFFF',
        borderWidth: 1,
        height: 50,
    },
    like: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        borderColor: '#00bfff',
        backgroundColor: 'white',
        borderWidth: 1,
        height: 50,
    },
    img: {
        color: 'red',
        // fontWeight: 'bold',
        fontSize: 13,
    },
    avatar: {
        // alignItems: 'center',
        // justifyContent: 'center',
        borderWidth: 1,
        // borderColor: '#00bfff',
        borderColor: '#10e33e',
        borderRadius: 30,
        marginLeft: 7,
        marginTop: 15,
        marginRight: 7,
        flexDirection: 'row',
        // height:53,
    },
    inNameA: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'red',
        marginTop: 4,
        // borderWidth: 1,
    },
    nameA: {
        marginLeft: 10,
        // height: 50,
        // borderWidth: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        // margin: 0,

    },
    faker: {
        borderWidth: 3,
        borderRadius: 50,
        padding: 5,
        borderColor: '#bdc3c9',
        backgroundColor: 'white'
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderRadius: 50,
        height: 47,
        width: 47,
        borderColor: '#1c70ed',
        marginLeft: 10,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        // flex: 1 / 3
    },
    image: {
        borderRadius: 4,
        marginLeft: 5,
        marginRight: 5,
        flex: 1,
        aspectRatio: 1 / 1
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

const mapDispatchProps = (dispatch) => bindActionCreators({ reload, deletePost }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Feed);