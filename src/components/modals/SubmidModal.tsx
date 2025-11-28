import Button from '@/src/components/buttons/Button';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Modals from './Modal';

export interface SubmitTransactionProps {
    visible: boolean;
    onClose: () => void;
    handleSubmitTransaction: (close: () => void) => Promise<void>;  // ✅ Updated signature
    loading?: boolean;
}

export default function SubmitTransaction({ 
    visible, 
    onClose, 
    handleSubmitTransaction,
}: SubmitTransactionProps) {
    const [loading, setLoading] = useState(false);

    // ✅ Handle submit with loading state and close callback
    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log('📤 Submitting transaction...');
            await handleSubmitTransaction(onClose);  // ✅ Pass close function
            console.log('✅ Transaction submitted successfully');
            setLoading(false);
        } catch (error) {
            console.error('❌ Submit error:', error);
            setLoading(false);
        }
    };

    return (
        <Modals
            visible={visible}
            onClose={onClose}
            width={"85%"}
            title="Submit transaction"
            message="Are you sure you want to submit this transaction?"
        >
            {/* ✅ Show loading spinner while submitting */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#14AD59" />
                </View>
            ) : (
                <View style={styles.buttonsContainer}>
                    <Button 
                        title="No" 
                        fontSize={20}  
                        backgroundColor='#FF0000' 
                        width={"40%"} 
                        onPress={onClose}
                        disabled={loading}
                    />
                    <Button 
                        title="Yes" 
                        fontSize={20} 
                        backgroundColor='#14AD59' 
                        width={"40%"} 
                        onPress={handleSubmit}
                        disabled={loading}
                    />
                </View>
            )}
        </Modals>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    // ✅ Loading container
    loadingContainer: {
        paddingVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});