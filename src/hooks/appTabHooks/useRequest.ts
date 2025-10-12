import { RequestStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { roles } from "../../constant/data";
type RequestScreenNavigationProp = NativeStackNavigationProp<RequestStackParamList, 'Request'>;

export function useRequest() {
    const Requestnavigation = useNavigation<RequestScreenNavigationProp>();

    const [Datarole, setRole] = React.useState(roles);

    const [steps, setSteps] = React.useState(0);

    // Form Data useState
    const [formData, setFormData] = React.useState({
        role: '',
        visitorName: '',
        studentName: '',
        studentLrnNumber: '',
        studentYearLevel: '',
        studentGradeLevel: '',
        studentSection: '',
        Requestransaction: [],
    });

    // Form Data Functions

    // Handle Change -> used for changing value
    const handleChange = React.useCallback((key: string, value: any) => {
    setFormData((prev) => ({
        ...prev,
        [key]: value,
    }));
    }, []);

    const handleDebug = () => {
        console.log(formData);
    }


    return {
        Requestnavigation,
        formData,
        steps,
        Datarole,
        setFormData,
        handleChange,
        handleDebug,
        setSteps,
        setRole
    };
}

