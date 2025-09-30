import { StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { COLORS } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(10),
    backgroundColor: COLORS.WHITE,
    paddingVertical: scale(10),
    width: scale(250),
  },
  closeIcon: {
    width: 15,
    height: 15,

  },
  title: {
    // paddingBottom: scale(5),
    fontSize:20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(10),
    color: '#9398A4',
  },
  row: {
    flexDirection: 'row',
    marginTop: scale(30),
  },
  rowSmall: {
    flexDirection: 'row',
    marginTop: scale(5),
  },
  label: {
    fontSize: 11.5,
  },
  value: {
    left: scale(7),
    fontSize: 11.5,
    fontWeight: '600',
  },
  valueSmall: {
    left: scale(5),
    fontSize: 11.5,
    fontWeight: '600',
  },
  timeLimit: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  
  },
  instruction: {
    marginTop: scale(20),
    fontSize: 12,
    color: '#667085',
    textAlign: 'left',
  },
  tipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulbIcon: {
    width: 15,
    height: 15,
  },
  tipsTitle: {
    left: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(10),
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#5E5E5ECC',
  },
  tipText: {
    fontSize: 12,
    left: 5,
    color: '#5E5E5ECC',
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    marginTop: scale(30),
    justifyContent: 'space-between',
  },
  doItLaterBtn: {
    width: scale(120),
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F7F7FA',
    right: 5,
    borderRadius: 8,
    shadowColor: 'transparent',
  },
  doItLaterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9398A4',
  },
  startBtn: {
    width: scale(120),
    left: 5,
    backgroundColor: '#4284F3',
    borderRadius: 8,
    shadowColor: '#4284F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  startText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  detailsContainer:{
    marginTop: scale(10),
    backgroundColor: '#F9FAFB',
    padding: scale(8),
    borderRadius: 4
  },
  timeContainer:{
        marginTop: scale(20),

  backgroundColor: '#F9FAFB',
  padding: scale(8),
  borderRadius: 4,
  }
    
});

export default styles;
