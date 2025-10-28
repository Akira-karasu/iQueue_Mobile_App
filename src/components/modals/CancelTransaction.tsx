import Button from '@/src/components/buttons/Button';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modals from './Modal';

export interface CancelTransactionProps {
    visible: boolean;
    onClose: () => void;
    handleResetTransaction: () => void
}

export default function CancelTransaction({ visible, onClose, handleResetTransaction } : CancelTransactionProps) {
    return (
        <Modals
            visible={visible}
            onClose={onClose}
            width={"85%"}
            title="Cancel transaction"
            message="Are you sure you want to cancel this transaction?"
        >
            <View  style={styles.buttonsContainer}>
                <Button title="No" fontSize={20}  backgroundColor='#FF0000' width={"40%"} onPress={onClose} />
                <Button title="Yes" fontSize={20} backgroundColor='#14AD59' width={"40%"} onPress={() => {handleResetTransaction();}} />
            </View>
        </Modals>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});