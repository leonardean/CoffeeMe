/**
 * Created by leonardean on 14/08/2017.
 */
import React from 'react';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import Slider from 'react-native-slider';
import Global from '../../Global';
import CommentListItem from './CommentListItem';

import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    ActivityIndicator,
    TextInput
} from 'react-native';

export default class CommentsTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
        console.log(this.props)
    }

    componentWillMount () {
        this.setState({
            isLoading: true
        }, () => {
            fetch('https://api-jp.kii.com/api/apps/' + Global.appID + '/buckets/COMMENTS/query', {
                method: 'POST',
                headers: {
                    'Authorization': Global.basicAccessToken,
                    'Content-Type': 'application/vnd.kii.QueryRequest+json',
                },
                body: JSON.stringify({
                    "bucketQuery": {
                        "clause": {
                            "type": "eq",
                            "field": "shop.id",
                            "value": this.props.shop._id
                        },
                        "orderBy": "_created"
                    },
                    "bestEffortLimit": 10
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson)
                    this.setState({
                        isLoading: false,
                        commentList: responseJson.results.map(comment => {
                            return {
                                key: comment['_id'],
                                comment: comment
                            }
                        })
                    })
                })
                .catch((error) => {
                    console.error(error);
                });
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }
        console.log(this.state)
        let comments = this.state.commentList.map((comment) => {
            return (
                <CommentListItem key={comment.key} comment={comment.comment}/>
            )
        })
        return (
            <View style={styles.container}>
                <ScrollView>
                    {comments}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    }
});