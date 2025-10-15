import NumberInput from '@/src/components/buttons/NumberInput';
import Card from '@/src/components/cards/Card';
import Input from '@/src/components/inputs/Input';
import { useRequestStore } from '@/src/store/requestStore';
import React from 'react';
import { Text, View } from 'react-native';
import styles from './RequestFormStyle';

export interface DocumentsProps {
  title: string;
  documents: any;
  setRegistrarRequestList: (updater: (state: any) => any) => void;
}

function Documents({ title, documents, setRegistrarRequestList }: DocumentsProps) {
  // ✅ Access store actions for re-adding document
  const { removeRegistrarRequestItem, setAvailableDocuments, availableDocuments } = useRequestStore();

  return (
    <Card padding={25}>
      <View>
        <Text style={styles.TextTitle}>{title}</Text>
      </View>
      {documents?.requestList?.length === 0 ? (
        <Text style={styles.listEmptyText}>No items in the request list.</Text>
      ) : (
        documents?.requestList?.map((item: any, index: number) => (
          <View key={index} style={styles.documentListContainer}>
            <View style={styles.documentContainer}>
              <View>
                <Text style={styles.documentName}>{item.DocumentName}</Text>
                <Text style={styles.documentPrice}>Total: ₱{item.Total}</Text>

                <Input
                  placeholder="Purpose"
                  value={item.Purpose}
                  onChangeText={(text) => {
                    setRegistrarRequestList((state: any) => ({
                      ...state,
                      requestList: state.requestList.map((doc: any) =>
                        doc.DocumentName === item.DocumentName
                          ? { ...doc, Purpose: text }
                          : doc
                      ),
                    }));
                  }}
                />
              </View>

              <NumberInput
                label="Quantity"
                value={item.Quantity}
                onChange={(newValue) => {
                  if (newValue === 0) {
                    // ✅ 1️⃣ Remove document from the request list
                    removeRegistrarRequestItem(item.DocumentName);

                    // ✅ 2️⃣ Re-add the document to dropdown list
                    setAvailableDocuments([
                      ...availableDocuments,
                      {
                        DocumentName: item.DocumentName,
                        Price: item.Price,
                        Quantity: 1,
                        Purpose: '',
                        Total: 0,
                      },
                    ]);
                    return;
                  }

                  // ✅ Normal quantity update + recalculate total + update overall cost
                  setRegistrarRequestList((state: any) => {
                    const updatedList = state.requestList.map((doc: any) =>
                      doc.DocumentName === item.DocumentName
                        ? { ...doc, Quantity: newValue, Total: doc.Price * newValue }
                        : doc
                    );

                    const totalCost = updatedList.reduce((sum: number, doc: any) => sum + doc.Total, 0);

                    return {
                      ...state,
                      requestList: updatedList,
                      totalCost,
                    };
                  });
                }}
              />
            </View>
          </View>
        ))
      )}
    </Card>
  );
}

export default React.memo(Documents);
