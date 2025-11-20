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

  // ✅ Filter only ready-for-release documents
  const readyForReleaseDocuments = queueData.transactions.filter(
    (transaction: any) => 
      transaction.transactionType === "Request Document" && 
      transaction.status === "ready-for-release"
  );

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

          <Text style={styles.title}>Ready for Release Documents</Text>
          {readyForReleaseDocuments.length > 0 ? (
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
                </View>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>No documents ready for release</Text>
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