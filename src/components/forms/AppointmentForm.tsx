import React from 'react';
import { View, Text, Button } from 'react-native';
import CustomRadioButton from '../CustomRadioButton';
export function ChooseRole({data, onChange, onNext}){ {
    const roles = [
  { label: 'Student', value: 'Student', image: require('../../../assets/icons/Book.png') },
  { label: 'Visitor', value: 'Visitor', image: require('../../../assets/icons/User.png') },
  { label: 'Alumni', value: 'Alumni', image: require('../../../assets/icons/StudentHat.png')  },
];

const [selected, setSelected] = React.useState('');

        return (
            <View style={{ padding: 20 }}>
                {roles.map(role => (
                    <View key={role.value} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <CustomRadioButton
                            options={[role]}
                            value={data.role}
                            onValueChange={val => {
                                setSelected(val);
                                onChange('role', val);
                            }}
                            direction="row"
                            radioColor="#1EBA60"
                            uncheckedColor="#ccc"
                            imageSource={role.image}
                            imageStyle={{ width: 100, height: 100, marginRight: 8 }}
                        />
                    </View>
                ))}
                <Button title="Next" onPress={onNext} />
            </View>
        );
}}

export function StudentForm({ onBack }){
    return (
        <View>
            <Text>
                Student Form
            </Text>
            <Button title="Back" onPress={onBack} />
        </View>
    );
}

export function VisitorForm({ onBack }){
    return (
        <View>
            <Text>
                Visitor Form
            </Text>
            <Button title="Back" onPress={onBack} />
        </View>
    );
}

export function AlumniForm({ onBack }){
    return (
        <View>
            <Text>
                Alumni Form
            </Text>
            <Button title="Back" onPress={onBack} />
        </View>
    );
}