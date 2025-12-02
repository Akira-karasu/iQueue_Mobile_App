import { useRequestStore } from "@/src/store/requestStore";
import { AppTabsParamList, RequestStackParamList } from "@/src/types/navigation";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { grades, roles, section, yearLevels } from "../../constant/data";
import { submitRequestTransaction } from "../../services/OfficeService";


type RequestScreenNavigationProp = NativeStackNavigationProp<
  RequestStackParamList,
  "Request"
>;

type HomeTabNavigationProp = BottomTabNavigationProp<AppTabsParamList, "HomeStack">;

type OfficeType = "" | "Registrar Office" | "Accounting Office";

export function useRequest() {
  const {
    RegistrarRequestList,
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
    setRegistrarRequestList,
    refetchRemoteData
  } = useRequestStore();


  const Requestnavigation = useNavigation<RequestScreenNavigationProp>();

  const TabNavigation = useNavigation<HomeTabNavigationProp>();

  const GoToRequestTransaction = React.useCallback(() => {
    Requestnavigation.replace("Transaction");
  }, [Requestnavigation]);

  const GoToHomeStack = React.useCallback(() => {
    TabNavigation.navigate("HomeStack");
  }, [TabNavigation]);

  const [error, setError] = React.useState<string>("");
  
  const RequestTransactionList = {};

  const [DocumentSelect, setDocumentSelect] = React.useState<any>(null);
  const [selectedOption, setSelectedOption] = React.useState<
    string | number | boolean | null
  >(false);

  const [Datarole, setRole] = React.useState(roles);
  const [DataYearLevel, setYearLevel] = React.useState(yearLevels);
  const [DataGradeLevel, setGradeLevel] = React.useState(grades);
  const [DataSection, setSection] = React.useState(section);

  const [office, setOffice] = React.useState<OfficeType>("");
  const [steps, setSteps] = React.useState(0);

  // 💵 Accounting selections
  const selectedpayment = AccountingRequestList.requestList;
  const totalPaymentCost = AccountingRequestList.totalCost;

  const addPayment = (item: { PaymentFees: string; Price: number }) => {
    addAccountingItem(item);
  };

const removePayment = (paymentName: string) => {
    removeAccountingItem(paymentName);
  };

  const clearPayments = () => {
    clearAccountingList();
  };

  const selectedPayments = React.useMemo(
    () => AccountingRequestList.requestList.map((item) => item.PaymentFees),
    [AccountingRequestList]
  );

  const paymentOptions = React.useMemo(
    () =>
      payment.map((item: any) => ({
        id: item.PaymentFees,
        paymentfees: item.PaymentFees,
        price: item.Price.toFixed(2),
      })),
    [payment]
  );

  const handleAccountingSelectionChange = React.useCallback(
    (selectedIds: string[]) => {
      // ✅ Add new selections
      selectedIds.forEach((id) => {
        const exists = AccountingRequestList.requestList.some(
          (p) => p.PaymentFees === id
        );
        if (!exists) {
          const selectedItem = payment.find((p) => p.PaymentFees === id);
          if (selectedItem) addAccountingItem(selectedItem);
        }
      });

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
    [DataDocuments, setDocumentSelect]
  );

  // 🧠 Handle form change (for updated formData structure)
  const handleChange = React.useCallback(
    (key: keyof typeof formData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFormData]
  );  

const handleSubmitTransaction = React.useCallback(
  async (close: () => void) => {
    try {
      console.log("🚀 Starting transaction submission...");

      const updatedTransactions = {};

      if (RegistrarRequestList.requestList.length > 0) {
        updatedTransactions.RegistrarOffice = RegistrarRequestList;
      }

      if (AccountingRequestList.requestList.length > 0) {
        updatedTransactions.AccountingOffice = AccountingRequestList;
      }

      // ❗ Create a fresh complete payload
      const finalPayload = {
        ...formData,
        RequestTransaction: updatedTransactions,
      };

      // ❗ Save to store (not needed for payload)
      setFormData(finalPayload);

      console.log("📤 SENDING PAYLOAD:", finalPayload);

      const response = await submitRequestTransaction(finalPayload, updatedTransactions);
      console.log("✅ Submitted:", response);

      await refetchRemoteData();

      GoToHomeStack();

      clearRegistrarRequestList();
      clearAccountingList();
      handleResetTransaction(close);

    } catch (error) {
      console.error("❌ Transaction submission failed:", error);
    }
  },
  [
    formData,
    RegistrarRequestList,
    AccountingRequestList,
    clearRegistrarRequestList,
    clearAccountingList,
    GoToHomeStack,
    setFormData,
  ]
);


const handleDebug = React.useCallback(() => {
  console.log(
    "🧾 Form Data Debug:",
    "\nEmail:", formData.email,
    "\nLrn:", formData.Lrn,
    "\nFirstname:", formData.FirstName,
    "\nMiddleInitial:", formData.MiddleInitial,
    "\nLastname:", formData.LastName,
    "\nSection:", formData.studentSection,
    "\nYear Level:", formData.studentYearLevel,
    "\nGrade Level:", formData.studentGradeLevel,
    "\nIs Alumni:", formData.isAlumni,
    "\nPicture:", formData.pictureID,
    "\nIs Visitor:", formData.isVisitor,
    "\nVisitor Name:", formData.visitorName
  );

  console.log("📄 Registrar Request List:", RegistrarRequestList);
  console.log("💰 Accounting Request List:", AccountingRequestList);

}, [formData]);

  const AddToRegistrarRequestlist = React.useCallback(() => {
    if (!DocumentSelect) return;

    const itemWithTotal = {
      id: DocumentSelect.id, 
      ...DocumentSelect,
      Total: DocumentSelect.Price * (DocumentSelect.Quantity || 1),
    };

    addRegistrarRequestItem(itemWithTotal);
    removeDocumentFromDropdown(DocumentSelect.DocumentName);
    setDocumentSelect(null);

    handleDebug();
  }, [
    DocumentSelect,
    addRegistrarRequestItem,
    removeDocumentFromDropdown,
    setDocumentSelect,
    handleDebug,
  ]);

  const handleResetTransaction = React.useCallback(
    (close: () => void) => {
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
      refetchRemoteData();
      close();
    },
    [
      resetFormData,
      setSteps,
      setRegistrarRequestList,
      resetDocuments,
      refetchRemoteData,
      clearRegistrarRequestList,
      clearAccountingList,
      setDocumentSelect,
    ]
  );

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
    totalPaymentCost,
    selectedOption,
    setSelectedOption,
    error, setError
  };
}