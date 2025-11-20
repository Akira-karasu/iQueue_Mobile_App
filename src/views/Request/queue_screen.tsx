import IconButton from "@/src/components/buttons/IconButton";
import { RequestStackParamList } from '@/src/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from "react-native-safe-area-context";

type QueueScreenNavigationProp = NativeStackNavigationProp<RequestStackParamList, "Queue">;

export default function QueueScreen() {
  const navigation = useNavigation<QueueScreenNavigationProp>();
  const { params } = useRoute<RouteProp<RequestStackParamList, "Queue">>();
  const { queueData } = params;

  const goBack = () => {
    navigation.goBack();
  };

  // ✅ Filter only ready-for-release documents (exclude cancelled)
  const readyForReleaseDocuments = queueData.transactions.filter(
    (transaction: any) => 
      transaction.transactionType === "Request Document" && 
      transaction.status?.toLowerCase() === "ready-for-release" &&
      transaction.status?.toLowerCase() !== "cancelled"
  );

  // ✅ Filter unpaid request documents (exclude cancelled)
  const unpaidDocuments = queueData.transactions.filter(
    (transaction: any) => 
      transaction.transactionType === "Request Document" && 
      transaction.paymentStatus?.toLowerCase() === "unpaid" &&
      transaction.status?.toLowerCase() !== "cancelled"
  );

  // ✅ Filter unpaid request payments (exclude cancelled)
  const unpaidPayments = queueData.transactions.filter(
    (transaction: any) => 
      transaction.transactionType === "Payment" && 
      transaction.paymentStatus?.toLowerCase() === "unpaid" &&
      transaction.status?.toLowerCase() !== "cancelled"
  );

  // ✅ Check if status is processing and has unpaid documents or payments
  const isProcessingWithUnpaid = 
    queueData.personalInfo.status?.toLowerCase() === "processing" && 
    (unpaidDocuments.length > 0 || unpaidPayments.length > 0);

  // ✅ Create JSON format for QR code
  const qrData = JSON.stringify({
    code: queueData.personalInfo.transactionCode
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <IconButton
              onPress={goBack}
              icon={require("../../../assets/icons/ArrowBack.png")}
            />
            <Text style={styles.headerTitle}>Queue Transaction</Text>
            <View style={{ width: 30 }} />
          </View>

          {/* QR code and Queue number */}
          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={250}
              level="H"
              includeMargin={true}
              fgColor="#19AF5B"
              bgColor="#fff"
            />
            <Text style={styles.qrValue}>{queueData.personalInfo.transactionCode}</Text>
          </View>

          {/* ✅ Show warning if processing with unpaid documents or payments */}
          {/* {isProcessingWithUnpaid && (
            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>⚠️ Payment Required</Text>
              <Text style={styles.warningText}>
                You have {unpaidDocuments.length > 0 ? `${unpaidDocuments.length} unpaid document(s)` : ''} 
                {unpaidDocuments.length > 0 && unpaidPayments.length > 0 ? ' and ' : ''}
                {unpaidPayments.length > 0 ? `${unpaidPayments.length} unpaid payment(s)` : ''}.
                Please complete the payment to proceed.
              </Text>
            </View>
          )} */}

          {/* Ready for Release Documents */}
          {readyForReleaseDocuments.length > 0 && (
            <>
              <Text style={styles.title}>Ready for Release Documents</Text>
              <FlatList
                data={readyForReleaseDocuments}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.documentCard}>
                    <Text style={styles.documentTitle}>{item.transactionDetails}</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Status:</Text>
                      <Text style={styles.status}>{item.status}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Copies:</Text>
                      <Text style={styles.value}>{item.copies}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Fee:</Text>
                      <Text style={styles.value}>₱{item.fee}</Text>
                    </View>
                    {item.purpose && (
                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Purpose:</Text>
                        <Text style={styles.value}>{item.purpose}</Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </>
          )}

          {/* Unpaid Documents */}
          {unpaidDocuments.length > 0 && (
            <>
              <Text style={[styles.title, { marginTop: 20 }]}>
                Unpaid Documents ({unpaidDocuments.length})
              </Text>
              <FlatList
                data={unpaidDocuments}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.unpaidCard]}>
                    <Text style={styles.documentTitle}>{item.transactionDetails}</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Status:</Text>
                      <Text style={styles.status}>
                        {item.paymentStatus}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Copies:</Text>
                      <Text style={styles.value}>{item.copies}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Fee:</Text>
                      <Text style={[styles.value, { fontWeight: '700' }]}>
                        ₱{item.fee}
                      </Text>
                    </View>
                    {item.purpose && (
                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Purpose:</Text>
                        <Text style={styles.value}>{item.purpose}</Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </>
          )}

          {/* Unpaid Payments */}
          {unpaidPayments.length > 0 && (
            <>
              <Text style={[styles.title, { marginTop: 20 }]}>
                Unpaid Payments ({unpaidPayments.length})
              </Text>
              <FlatList
                data={unpaidPayments}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.unpaidCard]}>
                    <Text style={styles.documentTitle}>{item.transactionDetails}</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Status:</Text>
                      <Text style={styles.status}>
                        {item.paymentStatus}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Fee:</Text>
                      <Text style={[styles.value, { fontWeight: '700' }]}>
                        ₱{item.fee}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </>
          )}

          {readyForReleaseDocuments.length === 0 && unpaidDocuments.length === 0 && unpaidPayments.length === 0 && (
            <Text style={styles.emptyText}>No documents found</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#19AF5B" },
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#19AF5B",
    flex: 1,
    textAlign: "center",
  },
  warningCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6f00',
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ff6f00',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  qrValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginTop: 15,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 15,
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#19AF5B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  unpaidCard: {
    borderLeftColor: '#19AF5B',
    backgroundColor: '#fff',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
  },
  status: {
    fontSize: 13,
    color: '#19AF5B',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
  },
});