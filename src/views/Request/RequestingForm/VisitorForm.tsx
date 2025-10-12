import Button from '@/src/components/buttons/Button';
import StepBar from '@/src/components/layout/stepBar';
import React from 'react';
import { View } from 'react-native';
import styles from './RequestFormStyle';

type VisitorFormProps = {
    setSteps: React.Dispatch<React.SetStateAction<number>>;
    open: () => void;
    step: number;
}



export default function VisitorForm({ setSteps, open, step }: VisitorFormProps) {
    return (
        <>
            <StepBar start={step} end={3} title="Fill your information" display={true} onBack={() => setSteps(1)}/>
            <View style={styles.mainContainer}>
                <View style={styles.buttonContainer}>
                    <Button title="Cancel" backgroundColor="#AEAEAE" width={"45%"} color='#191919ff' fontSize={18} onPress={() => open()}/>
                    <Button title="Next" fontSize={18} width={"45%"} onPress={() => setSteps(3)}/>
                </View>
            </View>
        </>
    )
}

