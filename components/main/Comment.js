import React, { useState, useEffect } from 'react'
import { View, Text, RefreshControl, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')
import { fetchUsersData } from '../../redux/actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { reload } from '../../redux/actions/index';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

function Comment(props) {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false)
        });
    }, []);
    useEffect(() => {

        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === comments[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }
    }, [props.route.params.postId, props.users])


    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            });

        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .get()
            .then((snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setComments(comments)
            });
    }

    return (
        <View style={styles.container}>
            < View style={styles.inline} >
                <View style={styles.input}>
                    <TextInput
                        style={{ marginLeft: 10 }}
                        placeholder='Write your comments'
                        onChangeText={(text) => setText(text)} />
                </View>

                <TouchableOpacity
                    style={styles.send}
                    onPress={() => {
                        onCommentSend()
                        props.reload()
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>SEND</Text>
                </TouchableOpacity>
            </View >
            <FlatList
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        {item.user !== undefined ?
                            <View style={styles.circle}>
                                <Text style={styles.img}>
                                    {item.user.name}
                                </Text>
                            </View>

                            :

                            null}

                        <View style={styles.show}>
                            <Text>{item.text}</Text>
                        </View>

                    </View>
                )} />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor:'white',
    },
    show: {
        justifyContent: 'center',
        marginLeft: 20,
    },
    row: {
        borderStartWidth: 0,
        borderWidth: 1,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        borderRadius: 50,
        borderColor: 'green',
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 50,
        padding: 9,
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: 'red',
    },
    img: {
        color: 'green',
        fontWeight: 'bold',
    },
    inline: {
        flexDirection: 'row',
    },
    input: {
        marginTop: 10,
        marginLeft: 10,
        // alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#00bfff',
        height: 50,
        borderRadius: 40,
        width: 266,
    },
    send: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00bfff',
        borderWidth: 1,
        borderColor: '#00bfff',
        height: 50,
        borderRadius: 70,
        // width: 50,
        paddingLeft: 15,
        paddingRight: 15,
        marginLeft: 5,
    },
});

const mapStateToProps = (store) => ({
    users: store.usersState.users,
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})
const mapDispatchProps = (dispatch) => bindActionCreators({ reload, fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);
