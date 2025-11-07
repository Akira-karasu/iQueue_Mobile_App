
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  StarterStepcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 30
  },

  radioButtonContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20
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
  },

  TextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#19AF5B',
    marginBottom: 10
  },

  TextSubTitle: {
    fontSize: 16,
    fontWeight: 'regular',
    color: '#9A9A9A',
    marginBottom: 10
  },

  TextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10

  },

  documentListContainer: {
    marginTop: 10
  },

  documentContainer: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 5,
    padding: 10
  },

  documentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#19AF5B',
  },

  documentPrice: {
    fontSize: 16,
    fontWeight: 'regular',
    color: '#ccc',
    marginBottom: 10
  },

  listEmptyText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 40
  },

  selectedComponent: {
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 10
  },

  SelectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b5b5b5ff',
  },

  priceText: {
    fontSize: 16,
    color: '#b5b5b5ff',
    fontWeight: 'medium',
  },

  removeButton: {
    backgroundColor: '#e92121ff',
    borderRadius: 5,
    padding: 10,
  },

  minusText: {
    fontSize: 15,
    fontWeight: 'regular',
    color: '#fff',
  },
  

});

export default styles;