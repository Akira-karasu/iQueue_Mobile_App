import { documents, payment } from "@/src/constant/data";
import { create } from "zustand";

export interface RequestItem {
  DocumentName: string;
  Price: number;
  Quantity: number;
  Purpose: string;
  Total: number;
}

export interface AccountingItem {
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

export interface FormData {
  role: string;
  visitorName: string;
  studentName: string;
  studentLrnNumber: string;
  studentYearLevel: string;
  studentGradeLevel: string;
  studentSection: string;
  Requestransaction: any[];
  TotalCost: number;
}

interface RequestStore {
  RegistrarRequestList: RegistrarRequestList;
  AccountingRequestList: AccountingRequestList;
  availableDocuments: typeof documents;
  availablePayments: typeof payment;

  // 🧠 Global Form Data
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
  resetFormData: () => void;

  // 📄 Document handling
  setAvailableDocuments: (docs: typeof documents) => void;
  removeDocumentFromDropdown: (documentName: string) => void;
  resetDocuments: () => void;

  // 🧾 Payment handling
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

  // ✅ Default form data
  formData: {
    role: "",
    visitorName: "",
    studentName: "",
    studentLrnNumber: "",
    studentYearLevel: "",
    studentGradeLevel: "",
    studentSection: "",
    Requestransaction: [],
    TotalCost: 0,
  },

  // ✅ Update global form data
  setFormData: (updater) =>
    set((state) => ({
      formData: updater(state.formData),
    })),

  // ✅ Reset form data
  resetFormData: () =>
    set(() => ({
      formData: {
        role: "",
        visitorName: "",
        studentName: "",
        studentLrnNumber: "",
        studentYearLevel: "",
        studentGradeLevel: "",
        studentSection: "",
        Requestransaction: [],
        TotalCost: 0,
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
