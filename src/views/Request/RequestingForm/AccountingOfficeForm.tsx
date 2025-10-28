import CheckBox from '@/src/components/buttons/CheckBox';
import Card from '@/src/components/cards/Card';
import { useRequest } from '@/src/hooks/appTabHooks/useRequest';
import React from 'react';
import { Text, View } from 'react-native';
import styles from './RequestFormStyle';

export type AccountingOfficeFormType = {
    title: string;
}

function AccountingOfficeForm({title}: AccountingOfficeFormType) {
  const {
    paymentOptions,
    selectedPayments,
    handleAccountingSelectionChange,
  } = useRequest();

  return (
    <View style={styles.mainContainer}>
      <Card padding={25}>
        <Text style={styles.TextTitle}>{title}</Text>
        <Text style={styles.TextSubTitle}>Select request payment fee’s</Text>

        <CheckBox
          options={paymentOptions}
          selected={selectedPayments}
          onChange={handleAccountingSelectionChange}
        />
      </Card>
    </View>
  );
}

export default React.memo(AccountingOfficeForm);
