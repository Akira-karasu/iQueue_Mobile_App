
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  StarterStepcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 30
  },

  mainContainer :{
    flexGrow: 1,
    width: '100%',
    paddingHorizontal: 25,
  },

  StarterStepText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9A9A9A',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  }
});

export default styles;