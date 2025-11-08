import { useRequestStore } from "@/src/store/requestStore";
import { AppTabsParamList, RequestStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React from "react";
import { grades, roles, section, yearLevels } from "../../constant/data";
import { submitRequestTransaction } from "../../services/OfficeService";

type RequestScreenNavigationProp = NativeStackNavigationProp<RequestStackParamList, "Request">;
type HomeTabNavigationProp = BottomTabNavigationProp<AppTabsParamList, "HomeStack">;
type OfficeType = "" | "Registrar Office" | "Accounting Office";

export function useRequest() {
  const {
    RegistrarRequestList,
    AccountingRequestList,
    addRegistrarRequestItem,
    removeRegistrarRequestItem,
    clearRegistrarRequestList,
    addAccountingItem,
    removeAccountingItem,
    clearAccountingList,
    availableDocuments,
    removeDocumentFromDropdown,
    resetDocuments,
    availablePayments,
    formData,
    setFormData,
    resetFormData,
    setRegistrarRequestList,
  } = useRequestStore();

  const requestNav = useNavigation<RequestScreenNavigationProp>();
  const tabNav = useNavigation<HomeTabNavigationProp>();

  const goToTransaction = React.useCallback(() => requestNav.replace("Transaction"), [requestNav]);
  const goToHome = React.useCallback(() => tabNav.navigate("HomeStack"), [tabNav]);

  // Local UI state
  const [DocumentSelect, setDocumentSelect] = React.useState<any>(null);
  const [selectedOption, setSelectedOption] = React.useState<string | number | boolean | null>(false);
  const [office, setOffice] = React.useState<OfficeType>("");
  const [steps, setSteps] = React.useState(0);

  const [Datarole, setRole] = React.useState(roles);
  const [DataYearLevel, setYearLevel] = React.useState(yearLevels);
  const [DataGradeLevel, setGradeLevel] = React.useState(grades);
  const [DataSection, setSection] = React.useState(section);

  // Accounting selections
  const selectedPayments = React.useMemo(() => AccountingRequestList.requestList.map((item) => item.PaymentFees), [AccountingRequestList]);
  const totalPaymentCost = AccountingRequestList.totalCost;

  const paymentOptions = React.useMemo(
    () => availablePayments.map((item) => ({ id: item.PaymentFees, paymentfees: item.PaymentFees, price: item.Price.toFixed(2) })),
    [availablePayments]
  );

  const handleAccountingSelectionChange = React.useCallback(
    (selectedIds: string[]) => {
      selectedIds.forEach((id) => {
        if (!AccountingRequestList.requestList.some((p) => p.PaymentFees === id)) {
          const selectedItem = availablePayments.find((p) => p.PaymentFees === id);
          if (selectedItem) addAccountingItem(selectedItem);
        }
      });
      AccountingRequestList.requestList.forEach((item) => {
        if (!selectedIds.includes(item.PaymentFees)) removeAccountingItem(item.PaymentFees);
      });
    },
    [AccountingRequestList, availablePayments, addAccountingItem, removeAccountingItem]
  );

  const handleSelectDocument = React.useCallback(
    (value: string) => {
      const found = availableDocuments.find((doc) => doc.DocumentName === value);
      setDocumentSelect(found || null);
    },
    [availableDocuments]
  );

  const handleChange = React.useCallback(
    <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [setFormData]
  );

  const addToRegistrarRequestList = React.useCallback(() => {
    if (!DocumentSelect) return;
    const itemWithTotal = { ...DocumentSelect, Total: DocumentSelect.Price * (DocumentSelect.Quantity || 1) };
    addRegistrarRequestItem(itemWithTotal);
    removeDocumentFromDropdown(DocumentSelect.DocumentName);
    setDocumentSelect(null);
  }, [DocumentSelect, addRegistrarRequestItem, removeDocumentFromDropdown]);

  const handleSubmitTransaction = React.useCallback(
    (close: () => void) => {
      const transactions: Record<string, any> = {};
      if (RegistrarRequestList.requestList.length > 0) transactions.RegistrarOffice = RegistrarRequestList;
      if (AccountingRequestList.requestList.length > 0) transactions.AccountingOffice = AccountingRequestList;

      submitRequestTransaction(formData, transactions);

      // Reset state
      resetFormData();
      clearRegistrarRequestList();
      clearAccountingList();
      resetDocuments();
      setSteps(0);
      setDocumentSelect(null);
      goToHome();
      close();
    },
    [formData, RegistrarRequestList, AccountingRequestList, resetFormData, clearRegistrarRequestList, clearAccountingList, resetDocuments, goToHome]
  );

  const handleResetTransaction = React.useCallback(
    (close: () => void) => {
      resetFormData();
      setSteps(0);
      setRegistrarRequestList((prev) => ({ ...prev, requestList: [] }));
      resetDocuments();
      clearRegistrarRequestList();
      clearAccountingList();
      setDocumentSelect(null);
      close();
    },
    [resetFormData, setRegistrarRequestList, resetDocuments, clearRegistrarRequestList, clearAccountingList]
  );

  const handleDebug = React.useCallback(() => {
    console.log("🧾 Form Data Debug:", formData);
  }, [formData]);

  return {
    formData,
    steps,
    office,
    DocumentSelect,
    Datarole,
    DataYearLevel,
    DataGradeLevel,
    DataSection,
    RegistrarRequestList,
    AccountingRequestList,
    availablePayments,
    selectedPayments,
    totalPaymentCost,
    paymentOptions,
    selectedOption,
    setSelectedOption,
    setSteps,
    setRole,
    setYearLevel,
    setGradeLevel,
    setSection,
    setOffice,
    setDocumentSelect,
    handleSelectDocument,
    handleChange,
    addToRegistrarRequestList,
    handleSubmitTransaction,
    handleResetTransaction,
    handleDebug,
    addAccountingItem,
    removeAccountingItem,
    clearAccountingList,
    removeRegistrarRequestItem,
  };
}
