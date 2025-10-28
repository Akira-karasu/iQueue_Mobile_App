import Button from '@/src/components/buttons/Button';
import Dropdown from '@/src/components/buttons/Dropdown';
import NumberInput from '@/src/components/buttons/NumberInput';
import Card from '@/src/components/cards/Card';
import Input from '@/src/components/inputs/Input';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import React from 'react';
import { Text, View } from 'react-native';
import styles from './RequestFormStyle';
import Documents from './documents.';

function RegistrarOfficeForm() {
  const {
    DataDocuments,
    DocumentSelect,
    setDocumentSelect,
    handleSelect,
    AddToRegistrarRequestlist,
    setRegistrarRequestList,
    RegistrarRequestList
  } = useRequest();
  

  return (
    <View>
      <Card padding={25}>
        {/* Header */}
        <View style={styles.TextContainer}>
          <Text style={styles.TextTitle}>Request Documents</Text>

          {/* 💰 Always rendered, only value is conditional */}
          <Text style={styles.TextSubTitle}>
            Price: ₱{' '}
            {DocumentSelect && typeof DocumentSelect.Price === 'number'
              ? (DocumentSelect.Price * DocumentSelect.Quantity ).toFixed(2)
              : '0.00'}
          </Text>
        </View>



        <Dropdown
          title="Documents"
          label="Select a document"
          selectedValue={DocumentSelect?.DocumentName || ''}
          data={DataDocuments.map((doc) => ({
            label: doc.DocumentName,
            value: doc.DocumentName,
          }))}
          onSelect={handleSelect}
          required
        />
            
        <NumberInput
        value={DocumentSelect?.Quantity || 0}
        onChange={(value) =>
            setDocumentSelect((prev: any) => {
            const quantity = value || 0;
            const price = prev?.Price || 0;
            return {
                ...prev,
                Quantity: quantity,
                Total: quantity * price,
            };
            })
        }
        />


        {/* Details + Input - always shown, just fallback values */}

          <Input
            label="Purpose of requesting"
            value={DocumentSelect?.Purpose || ''}
            placeholder="Enter purpose of requesting"
            onChangeText={(value) =>
              setDocumentSelect((prev: any) =>
                prev ? { ...prev, Purpose: value } : { Purpose: value }
              )
            }
            editable = {
              DocumentSelect?.DocumentName ? true : false
            }
          />
        
        <Button
        title="Add to list"
        fontSize={20}
        width={"100%"}
        onPress={() => {
            AddToRegistrarRequestlist();
        }}
        style={{ marginTop: 10 }}
        disabled={
            !DocumentSelect ||               
            !DocumentSelect.DocumentName ||  
            DocumentSelect.Quantity === 0   
        }
        />

      </Card>

      <Documents title="Request Document List" documents={RegistrarRequestList}   setRegistrarRequestList={setRegistrarRequestList} />


    </View>
  );
}

export default React.memo(RegistrarOfficeForm);
