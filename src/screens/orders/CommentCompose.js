/**
 * Created by leonardean on 17/08/2017.
 */
import React from 'react';
import { Text, View, ScrollView, Image, StyleSheet, TextInput, Alert } from 'react-native';
import StarRating from 'react-native-star-rating';
import Global from '../../Global';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';

export default class CommentCompose extends React.Component {
   constructor (props) {
       super (props)
       this.state = {
           shopStarCount: 0,
           driverStarCount: 0,
           shopComment: '',
           driverComment: '',
           postingComponent: false
       };
       this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
   }

   static navigatorButtons = {
       rightButtons: [
           {
               title: 'Submit',
               id: 'submit'
           }
       ]
   }

   onNavigatorEvent(event) {
       if (event.type === 'NavBarButtonPress') {
           if (event.id === 'submit') {
               this.submitComment()
           }
       }
   }

   submitComment = () => {
       this.setState({
           postingComponent: true
       }, () => {
           fetch('https://api-jp.kii.com/api/apps/2c1pzz9jg5dd/users/'
               + Global.userID, {
               method: 'GET',
               headers: {
                   'Authorization': 'Bearer ' + Global.userAccessToken
               }
           })
               .then((response) => response.json())
               .then((responseJson) => {
                   fetch('https://api-jp.kii.com/api/apps/2c1pzz9jg5dd/buckets/COMMENTS/objects', {
                       method: 'POST',
                       headers: {
                           'Authorization': 'Bearer '+ Global.userAccessToken,
                           'Content-Type': 'application/json',
                       },
                       body: JSON.stringify({
                           user: {
                               id: Global.userID,
                               avatar_url: responseJson.avatar_url,
                               display_name: Global.username
                           },
                           shop: {
                               id: this.props.shopInfo.id,
                               avatar_url: this.props.shopInfo.avatar_url,
                               name: this.props.shopInfo.name,
                               star: this.state.shopStarCount,
                               comment: this.state.shopComment
                           },
                           driver: {
                               id: this.props.driverInfo.id,
                               avatar_url: this.props.driverInfo.avatar_url,
                               display_name: this.props.driverInfo.display_name,
                               star: this.state.driverStarCount,
                               comment: this.state.driverComment
                           }
                       })
                   })
                       .then((response) => {
                           if (response.status === 201)
                               this.setState({
                                   postingComponent: false
                               }, () => {
                                   this.props.navigator.push({
                                       screen: 'CommentSuccess',
                                       title: 'Comment Success',
                                       animated: true,
                                       animationType: 'slide-horizontal',
                                       backButtonHidden: true,
                                       navigatorStyle: {
                                           tabBarHidden: true
                                       }
                                   })
                               })
                       })
                       .catch((error) => {
                           console.error(error);
                       });
               })
               .catch((error) => {
                   console.error(error);
               });
       })
   }

   onShopStarRatingPress = (rating) => {
       this.setState({
           shopStarCount: rating
       })
   }

   onDriverStarRatingPress = (rating) => {
       this.setState({
           driverStarCount: rating
       })
   }

   render () {
       return (
           <ScrollView style={styles.container}>
               <Spinner visible={this.state.postingComponent} size="small" textContent={"Posting Comments..."}
                        textStyle={{color: '#FFF', marginTop: -30, fontSize: 14}} />
               <View style={styles.shopTitle}>
                   <View style={styles.avatarContainer}>
                       <Image
                           style={{height: 40, width: 40, resizeMode: 'contain'}}
                           source={{uri: this.props.shopInfo.avatar_url}}
                       />
                   </View>
                   <Text style={{alignSelf: 'center', flex: 1, fontSize: 14}}> {this.props.shopInfo.name} </Text>
               </View>
               <View style={styles.shopComment}>
                   <Text style={{fontSize: 12, fontWeight: 'bold'}}>Comment on Shop</Text>
                   <View style={{alignItems: 'center', borderBottomColor: '#f0f0f0', borderBottomWidth: 0.5,
                       borderTopColor: '#f0f0f0', borderTopWidth: 0.5, marginVertical: 5, paddingVertical: 5,
                       flexDirection: 'row', justifyContent: 'space-between'}}>
                       <View style={{flex: 1}} >
                           <Text>Rating: </Text>
                       </View>
                       <StarRating
                           emptyStar={'ios-star-outline'}
                           fullStar={'ios-star'}
                           halfStar={'ios-star-half'}
                           iconSet={'Ionicons'}
                           starSize={30}
                           disabled={false}
                           maxStars={5}
                           buttonStyle={{marginRight: 5}}
                           starColor={'#0c64ff'}
                           rating={this.state.shopStarCount}
                           selectedStar={(rating) => this.onShopStarRatingPress(rating)}
                       />
                       <View style={{flex: 1}} />
                   </View>
                   <TextInput
                       style={styles.input}
                       multiline={true}
                       autoCorrect={false}
                       placeholderTextColor="#a2a2a2"
                       placeholder="Please leave a comment about this shop."
                       autoFocus={false}
                       onChangeText={(shopComment) => this.setState({shopComment})}
                       value={this.state.shopComment} >
                   </TextInput>
               </View>
               <View style={styles.driverComment}>
                   <Text style={{fontSize: 12, fontWeight: 'bold'}}>Comment on Driver</Text>
                   <View style={{alignItems: 'center', borderBottomColor: '#f0f0f0', borderBottomWidth: 0.5,
                       borderTopColor: '#f0f0f0', borderTopWidth: 0.5, marginVertical: 5, paddingVertical: 5,
                       flexDirection: 'row', justifyContent: 'space-between'}}>
                       <View style={{flex: 1}} >
                           <Text>Rating: </Text>
                       </View>
                       <StarRating
                           emptyStar={'ios-star-outline'}
                           fullStar={'ios-star'}
                           halfStar={'ios-star-half'}
                           iconSet={'Ionicons'}
                           starSize={30}
                           disabled={false}
                           maxStars={5}
                           buttonStyle={{marginRight: 5}}
                           starColor={'#0c64ff'}
                           rating={this.state.driverStarCount}
                           selectedStar={(rating) => this.onDriverStarRatingPress(rating)}
                       />
                       <View style={{flex: 1}} />
                   </View>
                   <TextInput
                       style={styles.input}
                       multiline={true}
                       autoCorrect={false}
                       placeholderTextColor="#a2a2a2"
                       placeholder="Please leave a comment about this driver."
                       autoFocus={false}
                       onChangeText={(driverComment) => this.setState({driverComment})}
                       value={this.state.driverComment} >
                   </TextInput>
               </View>
           </ScrollView>
       )
   }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
        flex: 1
    },
    shopTitle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginBottom: 10
    },
    avatarContainer: {
        margin: 5
    },
    shopComment: {
        backgroundColor: 'white',
        padding: 5,
        marginBottom: 10
    },
    input: {
        height: 150,
        fontSize: 14
    },
    driverComment: {
        backgroundColor: 'white',
        padding: 5
    },

})