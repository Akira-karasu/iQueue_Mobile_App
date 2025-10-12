import { RequestStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { grades, roles, section, yearLevels } from "../../constant/data";

type RequestScreenNavigationProp = NativeStackNavigationProp<
  RequestStackParamList,
  "Request"
>;

export function useRequest() {
  const Requestnavigation = useNavigation<RequestScreenNavigationProp>();

  const [Datarole, setRole] = React.useState(roles);

  const [DataYearLevel, setYearLevel] = React.useState(yearLevels);
  const [DataGradeLevel, setGradeLevel] = React.useState(grades);
  const [DataSection, setSection] = React.useState(section);


  const [steps, setSteps] = React.useState(0);

  const [formData, setFormData] = React.useState({
    role: "",
    visitorName: "",
    studentName: "",
    studentLrnNumber: "",
    studentYearLevel: "",
    studentGradeLevel: "",
    studentSection: "",
    Requestransaction: [],
  });

  // Handle Change
const handleChange = React.useCallback((key: string, value: any) => {
  setFormData((prev) => {
    // 🧠 When role changes, reset other role-specific fields
    if (key === 'role' && prev.role !== value) {
      return {
        ...prev,
        role: value,
        // Reset everything that depends on the role
        visitorName: "",
        studentName: "",
        studentLrnNumber: "",
        studentYearLevel: "",
        studentGradeLevel: "",
        studentSection: "",
        Requestransaction: [],
      };
    }

    // ✅ Default: normal field update
    return {
      ...prev,
      [key]: value,
    };
  });
}, [setFormData]);

  const handleDebug = () => {
    console.log(formData);
  };

  // ✅ Handle Reset — clears all form data and resets step counter
  const handleResetTransaction = React.useCallback((close: () => void) => {
    setFormData({
      role: "",
      visitorName: "",
      studentName: "",
      studentLrnNumber: "",
      studentYearLevel: "",
      studentGradeLevel: "",
      studentSection: "",
      Requestransaction: [],
    });
    setSteps(0);
    close();
    // setRole(roles); // optional — resets the roles array if it’s modified
  }, []);

  return {
    Requestnavigation,
    formData,
    steps,
    Datarole,
    DataYearLevel,
    DataGradeLevel,
    DataSection,
    setFormData,
    handleChange,
    handleDebug,
    handleResetTransaction,
    setSteps,
    setRole,
    setYearLevel,
    setGradeLevel,
    setSection
  };
}
