import Button from '@/src/components/buttons/Button';
import CustomRadioButton from '@/src/components/buttons/CustomRadioButton';
import StepBar from '@/src/components/layout/stepBar';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import React from 'react';
import { View } from 'react-native';
import styles from './RequestFormStyle';

export type ChooseRoleProps = {
    setSteps: React.Dispatch<React.SetStateAction<number>>
    open: () => void
    step: number
    selectedRole: string
    handleChange: (key: string, value: any) => void
};




export default function ChooseRole({ setSteps, open, step, selectedRole, handleChange }: ChooseRoleProps) {

    const {
        Datarole
    } = useRequest();


    return (
        <>
            <StepBar start={step} end={3} title="Choose your role" display={false}/>

            <View style={styles.mainContainer}>
                {Datarole.map(role => (
                    <View key={role.value} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <CustomRadioButton
                            options={[role]}
                            value={selectedRole}
                            onValueChange={val => handleChange('role', val)}
                            direction="row"
                            radioColor="#1EBA60"
                            uncheckedColor="#ccc"
                            imageSource={role.image}
                            imageStyle={{ width: 70, height: 70, marginRight: 8 }}
                        />
                    </View>
                ))}
                <View style={styles.buttonContainer}>
                    <Button title="Cancel" backgroundColor="#AEAEAE" width={"45%"} color='#191919ff' fontSize={18} onPress={() => open()}/>
                    <Button title="Next" fontSize={18} width={"45%"} onPress={() => setSteps(2)} disabled={selectedRole === ''}/>
                </View>

            </View>
            
        </>
    )
}
