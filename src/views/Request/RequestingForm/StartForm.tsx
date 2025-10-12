import Button from '@/src/components/buttons/Button';
import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from './RequestFormStyle';

export type StartFormProps = {
    setSteps: React.Dispatch<React.SetStateAction<number>>
};

export default function StartForm({ setSteps }: StartFormProps) { {
    return (
        <View style={styles.StarterStepcontainer}>
            <Image source={require('../../../../assets/icons/requirement.png')} style={{ width: 150, height: 150 }}/>
            <Text style={styles.StarterStepText}>Go ahead and start your requesting</Text>
            <Button title="Start Request" fontSize={15} onPress={() => setSteps(1)}/>
        </View>
    );}
}