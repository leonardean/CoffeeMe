import React from 'react';
import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    TextInput,
    Image
} from 'react-native';
import StarRating from 'react-native-star-rating';

export default class CommentListItem extends React.Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <View>
                        <Image
                            style={{width: 50, height: 50, resizeMode: 'contain', borderRadius: 25}}
                            source={{uri: this.props.comment.user.avatar_url}}
                        />
                    </View>
                    <View style={styles.commentContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.props.comment.user.display_name}</Text>
                            <Text style={{fontSize: 12, color: '#a2a2a2'}}>{new Date(this.props.comment._created).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.starContainer}>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                rating={this.props.comment.shop.star}
                                emptyStar={'ios-star-outline'}
                                fullStar={'ios-star'}
                                halfStar={'ios-star-half'}
                                iconSet={'Ionicons'}
                                starSize={10}
                            />
                        </View>
                    </View>
                </View>
                <View style={{marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: '#f0f0f0'}}>
                    <Text>{this.props.comment.shop.comment}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        borderTopColor: '#f0f0f0',
        borderTopWidth: 0.5,
        marginTop: 10
    },
    commentContainer: {
        marginLeft: 10,
        flex: 1,
        justifyContent: 'space-around'
    },
    starContainer: {
        width: 70,
    },
})