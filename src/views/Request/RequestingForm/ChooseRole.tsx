import Button from '@/src/components/buttons/Button';
import React from 'react';

export type ChooseRoleProps = {
    setSteps: React.Dispatch<React.SetStateAction<number>>
};


export default function ChooseRole({ setSteps }: ChooseRoleProps) {
    return (
        <>
            <Button title="Cancel" backgroundColor="#AEAEAE" color='#191919ff' fontSize={15} onPress={() => setSteps(0)}/>
            <Button title="Next" fontSize={15} onPress={() => setSteps(2)}/>
        </>
    )
}
