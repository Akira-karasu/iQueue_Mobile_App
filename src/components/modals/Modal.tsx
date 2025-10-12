import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

type ModalsProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  children?: React.ReactNode;
  buttonText?: string;
  modalStyle?: object;
  titleStyle?: object;
  messageStyle?: object;
  height?: number | string;
  width?: number | string;
};

const Modals: React.FC<ModalsProps> = ({
  visible,
  title,
  message,
  onClose,
  children,
  modalStyle,
  titleStyle,
  messageStyle,
  height="auto",
  width="auto",
}) => {

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, modalStyle, { height, width }]}>
          {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
          {message ? <Text style={[styles.message, messageStyle]}>{message}</Text> : null}
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  }
  
});

export default Modals;