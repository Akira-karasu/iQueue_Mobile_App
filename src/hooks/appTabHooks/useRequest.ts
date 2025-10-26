import { useRequestStore } from "@/src/store/requestStore";

import { RequestStackParamList } from "@/src/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { grades, roles, section, yearLevels } from "../../constant/data";

type RequestScreenNavigationProp = NativeStackNavigationProp<
  RequestStackParamList,
  "Request"
>;

type OfficeType = '' | 'Registrar Office' | 'Accounting Office';



export function useRequest() {

const { RegistrarRequestList, 
  addRegistrarRequestItem, 
  removeRegistrarRequestItem, 
  clearRegistrarRequestList,
  availableDocuments: DataDocuments,
  setAvailableDocuments,
  clearAccountingList,
  addAccountingItem, 
  removeAccountingItem,
  removeDocumentFromDropdown, 
  resetDocuments,
  availablePayments: payment,
  formData, 
  setFormData,
  AccountingRequestList,
  resetFormData,
  setRegistrarRequestList } =
  useRequestStore();


  const Requestnavigation = useNavigation<RequestScreenNavigationProp>();

  const RequestTransactionList = {}


  const [DocumentSelect, setDocumentSelect] = React.useState<any>(null);


 

  const [Datarole, setRole] = React.useState(roles);

  const [DataYearLevel, setYearLevel] = React.useState(yearLevels);
  const [DataGradeLevel, setGradeLevel] = React.useState(grades);
  const [DataSection, setSection] = React.useState(section);



  const [office, setOffice] = React.useState<OfficeType>('');


  const [steps, setSteps] = React.useState(0);

    // List of currently selected payments
  const selectedpayment = AccountingRequestList.requestList;

  // Total cost of selected payments
  const totalPaymentCost = AccountingRequestList.totalCost;

  // Add a payment item
  const addPayment = (item: { PaymentFees: string; Price: number }) => {
    addAccountingItem(item);
  };

  // Remove a payment item
  const removePayment = (paymentName: string) => {
    removeAccountingItem(paymentName);
  };

  // Clear all payments
  const clearPayments = () => {
    clearAccountingList();
  };

  const selectedPayments = React.useMemo(
    () => AccountingRequestList.requestList.map((item) => item.PaymentFees),
    [AccountingRequestList]
  );

  // 🧠 Checkbox options (PaymentFees + price)
  const paymentOptions = React.useMemo(
    () =>
      payment.map((item: any) => ({
        id: item.PaymentFees,
        paymentfees: item.PaymentFees,
        price: item.Price.toFixed(2),
      })),
    [payment]
  );

  // 🪄 Handle when user toggles accounting items
  const handleAccountingSelectionChange = React.useCallback(
    (selectedIds: string[]) => {
      // ✅ Add any new selections
      selectedIds.forEach((id) => {
        const exists = AccountingRequestList.requestList.some(
          (p) => p.PaymentFees === id
        );
        if (!exists) {
          const selectedItem = payment.find((p) => p.PaymentFees === id);
          if (selectedItem) addAccountingItem(selectedItem);
        }
      });

      // ❌ Remove any deselected
      AccountingRequestList.requestList.forEach((item) => {
        if (!selectedIds.includes(item.PaymentFees)) {
          removeAccountingItem(item.PaymentFees);
        }
      });

    },
    

    [AccountingRequestList, payment, addAccountingItem, removeAccountingItem]
  );



const handleSelect = React.useCallback(
  (value: string) => {
    const found = DataDocuments.find((doc) => doc.DocumentName === value);
    setDocumentSelect(found || null);
  },
  [DataDocuments, setDocumentSelect] // ✅ dependencies
);


  // Handle Change
const handleChange = React.useCallback((key: string, value: any) => {
  setFormData((prev) => {
    if (key === "role" && prev.role !== value) {
      return {
        ...prev,
        role: value,
        visitorName: "",
        studentName: "",
        studentLrnNumber: "",
        studentYearLevel: "",
        studentGradeLevel: "",
        studentSection: "",
        Requestransaction: [],
        TotalCost: 0,
      };
    }
    return { ...prev, [key]: value };
  });
}, [setFormData]);


  const handleSubmitTransaction = React.useCallback((close: () => void) => {
    if (RegistrarRequestList.requestList.length > 0){
      formData.Requestransaction.push(RegistrarRequestList);
      console.log(formData);

    }

    if (AccountingRequestList.requestList.length > 0){
      formData.Requestransaction.push(AccountingRequestList);
      console.log(formData);
      clearAccountingList();
    }

    clearRegistrarRequestList();
    clearAccountingList();

    close();
  }, [formData, RegistrarRequestList]);

  const handleDebug = React.useCallback(() => {
    console.log(formData);
  }, [formData]);

const AddToRegistrarRequestlist = React.useCallback(() => {
  if (!DocumentSelect) return;

  const itemWithTotal = {
    ...DocumentSelect,
    Total: DocumentSelect.Price * (DocumentSelect.Quantity || 1),
  };
  

  addRegistrarRequestItem(itemWithTotal);

  // 🧠 remove globally, not just locally
  removeDocumentFromDropdown(DocumentSelect.DocumentName);

  setDocumentSelect(null);

  setFormData((prev) => ({
    ...prev,
    TotalCost: prev.TotalCost + itemWithTotal.Total,
  }))

    handleDebug();

}, [DocumentSelect, addRegistrarRequestItem, removeDocumentFromDropdown, setDocumentSelect, setFormData, handleDebug]);




const handleResetTransaction = React.useCallback((close: () => void) => {
  resetFormData();         
  setSteps(0);
  setRegistrarRequestList((prev) => ({
    ...prev,
    requestList: [],
  }));
  resetDocuments();
  clearRegistrarRequestList();
  clearAccountingList();
  setDocumentSelect(null);
  close();
}, [resetFormData, setSteps, setRegistrarRequestList, resetDocuments, setDocumentSelect, clearRegistrarRequestList, clearAccountingList]);

  return {
    Requestnavigation,
    formData,
    steps,
    Datarole,
    DataYearLevel,
    DataGradeLevel,
    DataSection,
    office,
    DataDocuments,
    RequestTransactionList,
    DocumentSelect,
    RegistrarRequestList,
    AccountingRequestList,
    payment,
    setFormData,
    handleChange,
    handleDebug,
    handleResetTransaction,
    handleSubmitTransaction,
    setSteps,
    setRole,
    setYearLevel,
    setGradeLevel,
    setSection,
    setOffice,
    setDocumentSelect,
    handleSelect,
    AddToRegistrarRequestlist,
    setRegistrarRequestList,
    addAccountingItem,
    removeAccountingItem,
    clearAccountingList,
    paymentOptions,
    selectedPayments,
    handleAccountingSelectionChange,
    selectedpayment, 
    removePayment, 
    totalPaymentCost
  };
}
