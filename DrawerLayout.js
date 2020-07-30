/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import I18n from '../../Localizestring/Localize';
import { styles } from '../../Global/GStyles';
import {
  screenHeight,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../Global/DimensionConstant';
import {
  AppTextFieldWhite,
  BlackThemeButton,
  OverLayDialog,
  GeneralStatusBarColor,
} from '../../Components/GComponets';
import { FontFamily } from '../../Global/GFontFamily';
import { FontSize } from '../../Global/FontSize';
import COLOR from '../../Global/GColor';
import { StringConstant } from '../../Global/StringConstant';
import {
  showAlert,
  showSnackbar,
  setHomeScreen,
  cancelAlert,
  clearAllAsyncData,
  getAsyncData,
} from '../../Global/GFunction';
import {
  validEmail,
  validNumber,
  validFirstName,
} from '../../Global/GValidation';
import MultiTapHandler from '../../Global/MultiTapHandler';
import { PreviousNextView } from 'react-native-keyboard-manager';
import { Header, CheckBox, Overlay, SearchBar } from 'react-native-elements';
import moment from 'moment';
import { DrawerItem } from '@react-navigation/drawer';
import { ValidationConstant } from '../../Global/GConstant';
import { ApiManager, encryption } from '../../API /ApiManager';
import {
  ApiEndPoints,
  MethodType,
  StatusCodes,
} from '../../API /ApiConstants';
import LocationManager from '../../API /LocationManager';
import AsyncStorage from '@react-native-community/async-storage';


export default class DrawerLayout extends React.Component {

  constructor() {
    super()
    this.state = {
      profileImage: "",
      name: "",
    }
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.getDetail()

  }

  getDetail = () => {
    getAsyncData(ValidationConstant.kUserData, (data) => {
      console.warn("data  stored ", data)
      if (data != null) {
        this.setState({
          name: data.name,
          profileImage: data.profile_image
        })
      }
    })
  }

  //==================API Call ===================

  // Method Name: user/logout 
  // Method Type: Post
  // Parameter: 
  // Optional Parameter: 
  // Comment: 

  apiLogout = () => {
    let dict
    ApiManager.makeCall(MethodType.kGET, ApiEndPoints.logOut, dict, this.props.navigation, true).then(

      result => {

        switch (result.code) {
          case StatusCodes.success:
            clearAllAsyncData();
            this.props.navigation.navigate('Auth');
            console.warn("logout ", result.message)
            break;
          case StatusCodes.tokenInvalid:
            AsyncStorage.removeItem(ValidationConstant.kToken);
            AsyncStorage.removeItem(ValidationConstant.kUserData);
            AsyncStorage.removeItem(ValidationConstant.LoggedIn);
            this.props.navigation.navigate('Auth');
            break;
          default:
            showSnackbar(result.message)
            break;
        }
        console.log(result.code);
      }).catch((error) => {

        console.log("error", JSON.stringify(error))
        showSnackbar(JSON.stringify(error))
      })
  };
  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLOR.colorWhite,
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}>
          <GeneralStatusBarColor
            backgroundColor={COLOR.colorBlack}
            barStyle="light-content"
          />

          <View
            style={{
              borderBottomLeftRadius: hp(5.99),
              borderBottomRightRadius: hp(5.99),
              backgroundColor: COLOR.colorBlack,
              width: wp(100),
              flexDirection: 'column',
              height: hp(39.58),
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={MultiTapHandler(() => this.props.navigation.navigate('EditProfile'))}>
              <Image
                style={{
                  height: hp(14.99),
                  width: hp(14.99),
                  borderRadius: hp(14.99) / 2,
                  borderColor: COLOR.colorWhite,
                  borderWidth: 1,
                  marginTop: 85,
                  resizeMode: 'cover',
                  padding: 5,
                  alignSelf: 'center',
                }}
                source={{uri:this.state.profileImage}}
              />
            </TouchableOpacity>

            <Text
              style={{
                marginTop: 8,
                fontFamily: FontFamily.Inter_Bold,
                fontSize: FontSize.FontSize18,
                color: COLOR.colorWhite,
                alignSelf: 'center',
              }}>
              {this.state.name}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-start',
              position: 'absolute',
              zIndex: 0,
              top: 30,
              start: 20,
            }}
            onPress={MultiTapHandler(() => this.props.navigation.navigate('Home'))}>
            <Image
              style={{
                margin: 8,
                tintColor: COLOR.colorWhite,
              }}
              source={require('../../../Assets/Images/close_cross.png')}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <DrawerItem
              labelStyle={{
                fontSize: FontSize.FontSize18,
                color: COLOR.colorBlack,
                fontFamily: FontFamily.Inter_SemiBold,
              }}
              label={I18n.t('title_home')}
              onPress={MultiTapHandler(() => this.props.navigation.navigate('Home'))}
            />

            <DrawerItem
              labelStyle={{
                fontSize: FontSize.FontSize18,
                color: COLOR.colorBlack,
                fontFamily: FontFamily.Inter_SemiBold,
              }}
              label={I18n.t('title_myorder')}
              onPress={MultiTapHandler(() => this.props.navigation.navigate('MyOrder'))}
            />

            <DrawerItem
              labelStyle={{
                fontSize: FontSize.FontSize18,
                color: COLOR.colorBlack,
                fontFamily: FontFamily.Inter_SemiBold,
              }}
              label={I18n.t('title_repair_wheelChair')}
              onPress={MultiTapHandler(() =>
                this.props.navigation.navigate('RepairWheelChair'),
              )}
            />

            <DrawerItem
              labelStyle={{
                fontSize: FontSize.FontSize18,
                color: COLOR.colorBlack,
                fontFamily: FontFamily.Inter_SemiBold,
              }}
              onPress={MultiTapHandler(() => this.props.navigation.navigate('Notification'))}
              label={I18n.t('title_notification')}
            />

            <DrawerItem
              labelStyle={{
                fontSize: FontSize.FontSize18,
                color: COLOR.colorBlack,
                fontFamily: FontFamily.Inter_SemiBold,
              }}
              label={I18n.t('title_payment_method')}
              onPress={MultiTapHandler(() =>
                this.props.navigation.navigate('PaymentMethod'),
              )}
            />

            <DrawerItem
              labelStyle={{
                fontSize: FontSize.FontSize18,
                color: COLOR.colorBlack,
                fontFamily: FontFamily.Inter_SemiBold,
              }}
              label={I18n.t('title_settings')}
              onPress={MultiTapHandler(() => this.props.navigation.navigate('Settings'))}
            />

            <DrawerItem
              labelStyle={{
                fontSize: FontSize.FontSize18,
                color: COLOR.colorBlack,
                fontFamily: FontFamily.Inter_SemiBold,
              }}
              label={I18n.t('title_logout')}
              onPress={MultiTapHandler(() =>
                cancelAlert(StringConstant.logoutMsg, () => {
                  this.apiLogout();
                }),
              )}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
