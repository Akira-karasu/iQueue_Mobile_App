import { documents, payment } from "@/src/constant/data";
import { create } from "zustand";
import { getDocuments, getPayments } from "../services/OfficeService";

export interface RequestItem {
  id: number;
  type: "Request Document";
  DocumentName: string;
  Price: number;
  Quantity: number;
  Purpose: string;
  Total: number;
}

export interface AccountingItem {
  id: number;
  type: "Payment";
  PaymentFees: string;
  Price: number;
}

export interface AccountingRequestList {
  officeName: string;
  requestList: AccountingItem[];
  totalCost: number;
}

export interface RegistrarRequestList {
  officeName: string;
  requestList: RequestItem[];
  totalCost: number;
}

// ✅ Updated FormData type
export interface FormData {
  email: string;
  Lrn: string;
  FirstName: string;
  MiddleInitial: string;
  LastName: String;
  isAlumni: boolean | null;
  studentYearLevel: string;
  studentGradeLevel: string;
  studentSection: string;
}

interface RequestStore {
  RegistrarRequestList: RegistrarRequestList;
  AccountingRequestList: AccountingRequestList;
  availableDocuments: typeof documents;
  availablePayments: typeof payment;

  setEmailFromToken: (email: string) => void;

  // 🧠 Global Form Data
  formData: FormData;
  setFormData: (updater: ((prev: FormData) => FormData) | Partial<FormData>) => void;
  resetFormData: () => void;

  // 📄 Document handling
  setAvailableDocuments: (docs: typeof documents) => void;
  removeDocumentFromDropdown: (documentName: string) => void;
  resetDocuments: () => void;

  // 💵 Payment handling
  setAvailablePayments: (docs: typeof payment) => void;

  // 🏛 Registrar list management
  setRegistrarRequestList: (
    updater: (state: RegistrarRequestList) => Partial<RegistrarRequestList>
  ) => void;
  addRegistrarRequestItem: (item: RequestItem) => void;
  removeRegistrarRequestItem: (documentName: string) => void;
  clearRegistrarRequestList: () => void;

  // 💵 Accounting list management
  addAccountingItem: (item: AccountingItem) => void;
  removeAccountingItem: (paymentName: string) => void;
  clearAccountingList: () => void;
  
}

export const useRequestStore = create<RequestStore>((set) => ({

  setEmailFromToken: (email: string) =>
  set((state) => ({
    formData: { ...state.formData, email },
  })),


  RegistrarRequestList: {
    officeName: "Registrar Office",
    requestList: [],
    totalCost: 0,
  },

  AccountingRequestList: {
    officeName: "Accounting Office",
    requestList: [],
    totalCost: 0,
  },

  availableDocuments: documents,
  availablePayments: payment,

  // ✅ Default form data (simplified)
  formData: {
    email: "",
    Lrn: "",
    FirstName: "",
    MiddleInitial: "",
    LastName: "",
    isAlumni: null,
    studentYearLevel: "",
    studentGradeLevel: "",
    studentSection: "",
  },

  // ✅ Update global form data
  setFormData: (updater) =>
    set((state) => ({
      formData: typeof updater === 'function' 
        ? updater(state.formData)
        : { ...state.formData, ...updater }
    })),


  // ✅ Reset form data
  resetFormData: () =>
    set((state) => ({
      formData: {
        email: state.formData.email, // keep current email
        Lrn: "",
        FirstName: "",
        MiddleInitial: "",
        LastName: "",
        isAlumni: null,
        studentYearLevel: "",
        studentGradeLevel: "",
        studentSection: "",
      },
    })),


  // 📄 Document controls
  setAvailableDocuments: (docs) => set({ availableDocuments: docs }),
  removeDocumentFromDropdown: (documentName) =>
    set((state) => ({
      availableDocuments: state.availableDocuments.filter(
        (doc) => doc.DocumentName !== documentName
      ),
    })),
  resetDocuments: () => set({ availableDocuments: documents }),

  // 💵 Payment controls
  setAvailablePayments: (docs) => set({ availablePayments: docs }),

  // 🏛 Registrar request list logic
  setRegistrarRequestList: (updater) =>
    set((state) => ({
      RegistrarRequestList: {
        ...state.RegistrarRequestList,
        ...updater(state.RegistrarRequestList),
      },
    })),

  addRegistrarRequestItem: (item) =>
    set((state) => {
      const updatedList = [item, ...state.RegistrarRequestList.requestList];
      const totalCost = updatedList.reduce((sum, doc) => sum + doc.Total, 0);
      return {
        RegistrarRequestList: {
          ...state.RegistrarRequestList,
          requestList: updatedList,
          totalCost,
        },
      };
    }),

  removeRegistrarRequestItem: (documentName) =>
    set((state) => {
      const updatedList = state.RegistrarRequestList.requestList.filter(
        (doc) => doc.DocumentName !== documentName
      );
      const totalCost = updatedList.reduce((sum, doc) => sum + doc.Total, 0);
      return {
        RegistrarRequestList: {
          ...state.RegistrarRequestList,
          requestList: updatedList,
          totalCost,
        },
      };
    }),

  clearRegistrarRequestList: () =>
    set(() => ({
      RegistrarRequestList: {
        officeName: "Registrar Office",
        requestList: [],
        totalCost: 0,
      },
    })),

  // 💵 Accounting request list logic
  addAccountingItem: (item) =>
    set((state) => {
      const updatedList = [item, ...state.AccountingRequestList.requestList];
      const totalCost = updatedList.reduce((sum, pay) => sum + pay.Price, 0);
      return {
        AccountingRequestList: {
          ...state.AccountingRequestList,
          requestList: updatedList,
          totalCost,
        },
      };
    }),

  removeAccountingItem: (paymentName) =>
    set((state) => {
      const updatedList = state.AccountingRequestList.requestList.filter(
        (pay) => pay.PaymentFees !== paymentName
      );
      const totalCost = updatedList.reduce((sum, pay) => sum + pay.Price, 0);
      return {
        AccountingRequestList: {
          ...state.AccountingRequestList,
          requestList: updatedList,
          totalCost,
        },
      };
    }),

  clearAccountingList: () =>
    set(() => ({
      AccountingRequestList: {
        officeName: "Accounting Office",
        requestList: [],
        totalCost: 0,
      },
    })),
}));

// 🔄 Fetch remote data
(async function fetchAndSetRemoteData() {
  try {
    const docsResp = await getDocuments();
    const docs =
      Array.isArray(docsResp) ? docsResp :
      Array.isArray((docsResp as any).data) ? (docsResp as any).data :
      Array.isArray((docsResp as any).documents) ? (docsResp as any).documents :
      documents;
    useRequestStore.setState({ availableDocuments: docs });
    console.log("Fetched documents:", docs);
  } catch (err: any) {
    console.warn("getDocuments failed, using local documents:", err?.message || err);
    useRequestStore.setState({ availableDocuments: documents });
  }

  try {
    const paysResp = await getPayments();
    const pays =
      Array.isArray(paysResp) ? paysResp :
      Array.isArray((paysResp as any).data) ? (paysResp as any).data :
      Array.isArray((paysResp as any).payments) ? (paysResp as any).payments :
      payment;
    useRequestStore.setState({ availablePayments: pays });
    console.log("Fetched payments:", pays);
  } catch (err: any) {
    console.warn("getPayments failed, using local payments:", err?.message || err);
    useRequestStore.setState({ availablePayments: payment });
  }
})();