import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  LinearGradient: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },

  FormContainer: {
    paddingHorizontal: 20,
    gap: 5
  },

  ValidationContainer: {
    gap: 3,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  ActiveContainer: {
    gap: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  InputContainer: {
    gap: 3,
  },

  ValidationText: {
    color: 'red',
  },

  TermsContainer: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }



});

export default styles;
