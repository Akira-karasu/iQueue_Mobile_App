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
  const { queueData, queueStatus } = params;

  console.log('📋 Queue Status:', queueStatus || null);

  // ✅ UPDATED: Include 'waiting', 'pending', 'in-process' instead of just valid ones
  const VALID_QUEUE_STATUSES = ['waiting', 'pending', 'in-process', 'on-hold', 'called'];
  
  // ✅ Check if queueStatus has data AND status is in valid list
  const hasValidQueueStatus = queueStatus && 
    Object.keys(queueStatus).length > 0 &&
    VALID_QUEUE_STATUSES.includes(queueStatus.status?.toLowerCase());

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

  // ✅ Create JSON format for QR code
  const qrData = JSON.stringify({
    code: queueData.personalInfo.transactionCode
  });

  // ✅ Get status color based on queue status (updated colors)
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'waiting':
        return '#FFA500'; // Orange
      case 'pending':
        return '#FFD700'; // Gold
      case 'in-process':
        return '#4A90E2'; // Blue
      case 'called':
        return '#FF6B6B'; // Red
      case 'on-hold':
        return '#FFD700'; // Gold
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            onPress={goBack}
            icon={require("../../../assets/icons/ArrowBack.png")}
          />
          <Text style={styles.headerTitle}>Queue Transaction</Text>
          <View style={{ width: 30 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>

          {/* ✅ CONDITIONAL RENDER: Show queue info if valid status, otherwise show QR */}
          {!hasValidQueueStatus ? (
            // No valid queue status - show QR code only
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
          ) : (
            // ✅ Show queue info card when valid status (waiting, pending, in-process)
            <View style={styles.queueInfoContainer}>
              {/* Queue Status Card */}
              <View style={styles.queueStatusCard}>
                {/* Office */}
                <View style={styles.queueStatusRow}>
                  <Text style={styles.queueLabel}>Office:</Text>
                  <Text style={styles.queueOfficeText}>{queueStatus.office}</Text>
                </View>
                
                {/* Queue Number */}
                <View style={styles.queueStatusRow}>
                  <Text style={styles.queueLabel}>Queue Number:</Text>
                  <Text style={styles.queueNumber}>{queueStatus.queueNumber}</Text>
                </View>
                
                {/* Position */}
                <View style={styles.queueStatusRow}>
                  <Text style={styles.queueLabel}>Position:</Text>
                  <Text style={styles.queuePositionText}>
                    {queueStatus.position === 0 ? 'NEXT' : `#${queueStatus.position}`}
                  </Text>
                </View>
                
                {/* Status */}
                <View style={[styles.queueStatusRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.queueLabel}>Status:</Text>
                  <Text style={[
                    styles.queueStatusText,
                    { color: getStatusColor(queueStatus.status) }
                  ]}>
                    {queueStatus.status?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          )}

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
                      <Text style={styles.label}>Payment Status:</Text>
                      <Text style={[styles.status, { color: '#FF6B6B' }]}>
                        {item.paymentStatus?.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Copies:</Text>
                      <Text style={styles.value}>{item.copies}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Fee:</Text>
                      <Text style={[styles.value, { fontWeight: '700', color: '#FF6B6B' }]}>
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
                      <Text style={styles.label}>Payment Status:</Text>
                      <Text style={[styles.status, { color: '#FF6B6B' }]}>
                        {item.paymentStatus?.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Amount:</Text>
                      <Text style={[styles.value, { fontWeight: '700', color: '#FF6B6B' }]}>
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

// ...existing styles...

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#19AF5B" 
  },
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
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#ffffffff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#19AF5B",
    flex: 1,
    textAlign: "center",
  },

  // ✅ QR Code Styles
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
    elevation: 3,
  },

  // ✅ Queue Info Styles
  queueInfoContainer: {
    marginBottom: 20,
  },
  queueStatusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#19AF5B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  queueStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  queueLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  queueNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#19AF5B',
  },
  queueStatusText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  queuePositionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  queueOfficeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },

  // ✅ Document Styles
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
    borderLeftColor: '#FF6B6B',
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
    marginBottom: 8,
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