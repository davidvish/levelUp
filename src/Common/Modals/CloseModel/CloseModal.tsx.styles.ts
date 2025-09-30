import { StyleSheet } from "react-native";
import { COLORS } from "../../../constants";
import { scale } from "react-native-size-matters";

const styles = StyleSheet.create({
  container: {
    width: '90%',
    paddingHorizontal: 10,
    backgroundColor: COLORS.WHITE,
    paddingVertical: 20,
    alignSelf: 'center',
    borderRadius: 12,
  },
  badgeAnimation: {
    width: scale(100),
    height: scale(100),
    alignSelf: 'center',
    marginVertical: 10,
  },
  congratsText: {
    marginTop: scale(15),
  },
  resultText: {
    marginTop: 15,
    paddingBottom: 0,
  },
  courseButtonStyle1: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 12,
    alignSelf: 'center',
    width: scale(120),
  },
});

export default styles;
