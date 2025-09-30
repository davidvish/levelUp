import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { RNButton, RNContainer, RNImage, RNText, RNTextInput } from '../../../Common';
import { onLogout } from '../../../utils/commonFunction';
import { COLORS, IMAGES, STRINGS } from '../../../constants';
import RNActionSheet, { actionSheetRef } from '../../../Common/ActionSheet/ActionSheet';
import { scale } from 'react-native-size-matters';
import RNModal from '../../../Common/Modal/Modal';
import { homeScreenSelector } from '../Home/module/reducer';
import { barChartFailAction, countinueLearningFailAction, getProfileRequestAction, getUserEntitiesFailAction, pieChartFailAction } from '../Home/module/action';
import { useDispatch } from 'react-redux';
import { accountSelector } from './module/reducer';
import { profileNameRequestAction, profilePasswordRequestAction } from './module/action';


const screenWidth = Dimensions.get('window').width;

const Profile: React.FC = (props: any) => {
  const { isLoading, getProfileData } = homeScreenSelector();
  const dispatch = useDispatch();
  const ActionSheetNameRef: any = useRef(null);
  const ActionSheetPasswordRef: any = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [conPasswordError, setConPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileNameLoading, setProfileNameLoading] = useState(false);
  useEffect(() => {
    setFirstName(getProfileData?.firstName || "");
    setLastName(getProfileData?.lastName || "")
  }, [getProfileData])

  const _onPressChangeProfileName = () => {
    setLastName(getProfileData?.lastName || "")
    setFirstName(getProfileData?.firstName || "")
    ActionSheetNameRef?.current?.show();
  };

  const _onPressChangeProfilePassword = () => {
    ActionSheetPasswordRef?.current?.show();
  };

  const logoutFunction = () => {
    setModalVisible(false);
    dispatch(barChartFailAction())
    dispatch(getUserEntitiesFailAction())
    dispatch(countinueLearningFailAction())
    dispatch(pieChartFailAction())
    onLogout();
  }

  useEffect(() => {
    getProfileFunction();
  }, [])

  const getProfileFunction = () => {
    dispatch(getProfileRequestAction());
  }

  const validatePassword = (password: any) => {
    //const minLength = 8;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

    // if (password.length < minLength) {
    //   return 'Password must be at least 8 characters long';
    // }

    if (!passwordRegex.test(password)) {
      return 'Password should be included one Capital, One special character, one numerical character and minimum 8 digits';
    }

    return ''; // Empty string means no error
  };
  const validatePasswordMatch = (password: any, confirmPassword: any) => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const profileNameUpdate = () => {
    setProfileNameLoading(true);
    let body = {
      firstName: firstName,
      lastName: lastName,
    };
    let callback = (res: any) => {
      setProfileNameLoading(false);
      if (res != 'error') {
        getProfileFunction();
        ActionSheetNameRef?.current?.hide();
      }
      else {
        ActionSheetNameRef?.current?.hide();
      }
    };
    dispatch(profileNameRequestAction({ body, callback }));
  }

  const profilePasswordUpdate = () => {
    setPasswordLoading(true)
    if (newPassword === confirmPassword) {
      setPasswordLoading(true)
      let body = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };
      let callback = (res: any) => {
        setPasswordLoading(false)
        if (res != 'error') {
          ActionSheetPasswordRef?.current?.hide();
          setConfirmPassword("");
          setCurrentPassword("");
          setNewPassword("")
        }
        else {
          ActionSheetPasswordRef?.current?.hide();
          setConfirmPassword("");
          setCurrentPassword("");
          setNewPassword("")
        }
      };
      dispatch(profilePasswordRequestAction({ body, callback }));
    }
    else {
      setPasswordLoading(false)
      setPasswordError("New Password and Confirm Password do not match!")
    }
  }

  const ProfileDetailsView = () => {
    return (
      <View style={styles.container}>
        <Pressable style={styles.profileImageContainer}>
          <RNText style={{}} textColor={COLORS.WHITE} large bold>
            {getProfileData?.firstName?.charAt(0)?.toUpperCase()} {getProfileData?.lastName?.charAt(0)?.toUpperCase()}
          </RNText>
          {/* <RNImage
            source={getProfileData?.imageUrl ? { uri: getProfileData?.imageUrl } : IMAGES.headerProfileDummyIcon}
            style={{ height: 25, width: 35, borderRadius: 35, overflow: 'hidden', }} /> */}
        </Pressable>
        <View style={[styles.profileTextContainer, { width: "80%" }]}>
          <RNText textColor={COLORS.TEXTCOLOR} medium>{getProfileData?.firstName || ""} {getProfileData?.lastName || ""}</RNText>
          <RNText textColor={COLORS.TEXTCOLOR} medium>{getProfileData?.email || ""}</RNText>
        </View>
      </View>
    );
  };

  const ProfileUpdateView = () => {
    return (
      <View style={styles.updateContainer}>
        <Pressable
          onPress={_onPressChangeProfileName}
          style={styles.updateRow}>
          <View style={{ flexDirection: "row" }}>

            <Pressable onPress={_onPressChangeProfileName}>
              <Image
                resizeMode="stretch"
                source={IMAGES.penLine}
                style={styles.smallImageStyle} />
            </Pressable>
            <RNText textColor={COLORS.TEXTCOLOR} style={styles.updateText} medium>Edit Profile Name</RNText>
          </View>
          <Pressable onPress={_onPressChangeProfileName}>
            <Image
              //onPress={_onPressChangeProfileName}
              resizeMode="stretch"
              source={IMAGES.arrowRight}
              style={styles.smallImageStyle} />
          </Pressable>

        </Pressable>

        <Pressable
          onPress={_onPressChangeProfilePassword}
          style={styles.updateRow}>
          <View style={{ flexDirection: "row" }}>
            <Pressable onPress={_onPressChangeProfilePassword}>
              <Image
                resizeMode="stretch"
                source={IMAGES.lockKeyhole}
                style={styles.smallImageStyle} />
            </Pressable>
            <RNText textColor={COLORS.TEXTCOLOR} style={styles.updateText} medium>Change Password</RNText>
          </View>

          <Pressable onPress={_onPressChangeProfilePassword}>
            <Image
              resizeMode="stretch"
              //onPress={_onPressChangeProfilePassword}
              source={IMAGES.arrowRight}
              style={styles.smallImageStyle} />
          </Pressable>
        </Pressable>

        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.updateRow}>
          <View style={{ flexDirection: "row" }}>

            <Pressable onPress={() => setModalVisible(true)}>
              <Image
                resizeMode="stretch"
                source={IMAGES.arrowRightBracket}
                style={styles.smallImageStyle} />
            </Pressable>

            <RNText textColor={COLORS.TEXTCOLOR} style={styles.updateText} medium>Logout</RNText>
          </View>
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              resizeMode="stretch"
              source={IMAGES.arrowRight}
              style={styles.smallImageStyle} />
          </Pressable>
        </Pressable>
      </View>
    );
  }

  const ActionSheetProfileNameView = () => { //ActionSheetRef?.current?.hide();
    return (
      <RNActionSheet containerStyle={{ height: "auto" }} ActionSheetRef={ActionSheetNameRef}>
        <View style={styles.actionsheet}>
          <RNText bold large>Edit Your Name</RNText>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RNTextInput
              placeholder={STRINGS.firstName}
              containerStyle={{
                width: screenWidth / 2.3,
                borderBottomWidth: 0.5, alignSelf: 'center'
              }}
              maxLength={15}
              errorStyle={{ marginLeft: "5%" }}
              value={firstName}
              onPressClearText={() => setFirstName("")}
              onChangeText={value => {
                if (!firstName && value.startsWith(' ')) {
                  return;
                }
                setFirstName(value);
              }}
            />

            <RNTextInput
              placeholder={STRINGS.lastName}
              containerStyle={{
                marginLeft: 15, width: screenWidth / 2.2,
                borderBottomWidth: 0.5, alignSelf: 'center'
              }}
              maxLength={15}
              errorStyle={{ marginLeft: "5%" }}
              value={lastName}
              onPressClearText={() => setLastName("")}
              onChangeText={value => {
                if (!lastName && value.startsWith(' ')) {
                  return;
                }
                setLastName(value);
              }}
            />
          </View>

          <RNButton
            title={STRINGS.update}
            style={{ marginTop: "6%", marginBottom: "3%" }}
            textColor={COLORS.WHITE}
            backgroundColor={COLORS.SECONDARY}
            disabled={profileNameLoading || firstName == "" || lastName == ""}
            onPress={profileNameUpdate}
          />
        </View>
      </RNActionSheet>
    )
  }

  const ActionSheetProfilePasswordView = () => {
    return (
      <RNActionSheet containerStyle={{ height: "auto" }} ActionSheetRef={ActionSheetPasswordRef}>
        <View style={styles.actionsheet}>
          <RNText bold large>Change Password</RNText>

          <RNTextInput
            textContentType={'oneTimeCode'}
            placeholder={STRINGS.currentPassword}
            errorStyle={{ marginLeft: "5%" }}
            containerStyle={{
              width: screenWidth / 1.1,
              borderBottomWidth: 0.5, alignSelf: 'center'
            }}
            value={currentPassword}
            secureTextEntry
            autoComplete="password"
            onPressClearText={() => setCurrentPassword("")}
            onChangeText={value => setCurrentPassword(value)}
          />

          <RNTextInput
            textContentType={'oneTimeCode'}
            placeholder={`${STRINGS.NewPassword}*`}
            errorStyle={{ marginLeft: "5%" }}
            containerStyle={{
              width: screenWidth / 1.1,
              borderBottomWidth: 0.5, alignSelf: 'center'
            }}
            value={newPassword}
            secureTextEntry
            autoComplete="password"
            onPressClearText={() => {
              setNewPassword("");
              setPasswordError("");
            }}
            onChangeText={value => {
              setNewPassword(value);
              if (value.trim() === "") {
                setPasswordError("");
              } else {
                const error = validatePassword(value);
                setPasswordError(error);
              }
              if (confirmPassword) {
                setConfirmPasswordError(validatePasswordMatch(value, confirmPassword));
              }
            }}
          />

          {(passwordError) && (
            <RNText textColor={COLORS.RED} small bold>{passwordError}</RNText>
          )}

          <RNTextInput
            textContentType={'oneTimeCode'}
            placeholder={STRINGS.confirmedPassword}
            errorStyle={{ marginLeft: "5%" }}
            containerStyle={{
              width: screenWidth / 1.1,
              borderBottomWidth: 0.5, alignSelf: 'center'
            }}
            value={confirmPassword}
            secureTextEntry
            autoComplete="password"
            onPressClearText={() => {
              setConfirmPassword("");
              setConfirmPasswordError("");
              setConPasswordError("")
            }}
            onChangeText={value => {
              setConfirmPassword(value);

              if (value.trim() === "") {
                setConfirmPasswordError("");
                setConPasswordError("")
              } else {
                // First validate password requirements
                const error = validatePassword(value);
                setConPasswordError(error);

                // Then validate if passwords match
                if (newPassword.trim() !== "") {
                  setConfirmPasswordError(validatePasswordMatch(newPassword, value));
                }
              }
            }}
          />

          {(confirmPasswordError && !conPasswordError) && (
            <RNText textColor={COLORS.RED} small bold>{confirmPasswordError}</RNText>
          )}

          {(conPasswordError) && (
            <RNText style={{ marginTop: confirmPasswordError ? 10 : 0 }} textColor={COLORS.RED} small bold>{conPasswordError}</RNText>
          )}

          <RNButton
            title={STRINGS.update}
            style={{ marginTop: "6%", marginBottom: "3%" }}
            textColor={COLORS.WHITE}
            backgroundColor={COLORS.SECONDARY}
            //loading={passwordLoading}
            disabled={passwordLoading || currentPassword === "" || newPassword === "" || confirmPassword === "" || passwordError !== "" || confirmPasswordError !== ""}
            onPress={profilePasswordUpdate}
          />
        </View>
      </RNActionSheet>
    )
  }


  const logOutModal = () => {
    return (
      <RNModal transparent visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={{ paddingHorizontal: 10, backgroundColor: COLORS.WHITE, paddingVertical: 20 }}>
          <RNText style={{ marginTop: 5 }} large bold>Logout</RNText>
          <RNText style={{ marginTop: 10 }} large>Are you sure you want to logout?</RNText>

          <RNButton
            onPress={logoutFunction}
            textColor={COLORS.SECONDARY}
            title={STRINGS.yes}
            minHeightButton={true}
            style={styles.courseButtonStyle1}
            backgroundColor={COLORS.WHITE}
          />

          <RNButton
            onPress={() => setModalVisible(false)}
            textColor={COLORS.WHITE}
            title={STRINGS.no}
            minHeightButton={true}
            style={styles.courseButtonStyle}
            backgroundColor={COLORS.SECONDARY}
          />
        </View>
      </RNModal>
    );
  };

  return (
    <RNContainer
      style={{ backgroundColor: COLORS.MAINBACKGROUNDCOLOR }}
      back={true}
      title={STRINGS.account}
      titleMarginRight={true}
      hideBackgroundImage Points={undefined}>
      {ProfileDetailsView()}
      {ProfileUpdateView()}
      {ActionSheetProfileNameView()}
      {ActionSheetProfilePasswordView()}
      {logOutModal()}
    </RNContainer>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BOARDERBASECOLOR
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 65,
    width: 65,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 50,
    padding: 6
  },
  profileTextContainer: {
    marginLeft: 20
  },
  updateContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  updateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 35
  },
  updateText: {
    marginLeft: 20
  },
  smallImageStyle: {
    height: 15,
    width: 15
  },
  actionsheet: {
    //height: "0%",
    padding: 20,
    justifyContent: 'space-evenly'
  },
  courseButtonStyle: {
    marginTop: scale(7),
    width: "87%"
  },

  courseButtonStyle1: {
    marginTop: scale(25),
    width: "87%",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
});
