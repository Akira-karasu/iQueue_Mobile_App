import IconButton from "@/src/components/buttons/IconButton";
import { useRequestTransaction } from "@/src/hooks/appTabHooks/useRequestTransaction";
import { RequestStackParamList } from '@/src/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from "react-native-safe-area-context";

type QueueScreenNavigationProp = NativeStackNavigationProp<RequestStackParamList, "Queue">;

export default function QueueScreen() {
  const navigation = useNavigation<QueueScreenNavigationProp>();
  const { params } = useRoute<RouteProp<RequestStackParamList, "Queue">>();
  const { queueData } = params;

  const personalInfoId = queueData.personalInfo.id;

  const {
    activeTransactions,
    queueStatus,
    socketConnected,
    personalInfoStatus,
  } = useRequestTransaction(queueData.transactions, personalInfoId);

  console.log('📋 Real-time Queue Data:', {
    socketConnected,
    queueStatus,
    activeTransactionsCount: activeTransactions.length,
    personalInfoStatus,
    timestamp: new Date().toLocaleTimeString()
  });

    // ✅ OPTION 1: Navigate to RequestTransaction screen
  const goBack = () => {
    navigation.navigate('Transaction', { transaction: queueData });
  };

  const VALID_QUEUE_STATUSES = ['waiting', 'pending', 'in-process', 'on-hold', 'called'];
  
  const hasValidQueueStatus = queueStatus && 
    Object.keys(queueStatus).length > 0 &&
    VALID_QUEUE_STATUSES.includes(queueStatus.status?.toLowerCase());

  console.log('🔍 Queue Status Check:', {
    hasQueueStatus: !!queueStatus,
    statusKeys: queueStatus ? Object.keys(queueStatus) : [],
    queueStatusValue: queueStatus?.status,
    hasValidQueueStatus,
  });

  const readyForReleaseDocuments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Request Document" && 
        transaction.status?.toLowerCase() === "ready-for-release" &&
        transaction.status?.toLowerCase() !== "cancelled"
    ),
    [activeTransactions]
  );

  const unpaidDocuments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Request Document" && 
        transaction.paymentStatus?.toLowerCase() === "unpaid" &&
        transaction.status?.toLowerCase() !== "cancelled"
    ),
    [activeTransactions]
  );

  const unpaidPayments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Payment" && 
        transaction.paymentStatus?.toLowerCase() === "unpaid" &&
        transaction.status?.toLowerCase() !== "cancelled"
    ),
    [activeTransactions]
  );

  const paidDocuments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Request Document" && 
        transaction.paymentStatus?.toLowerCase() === "paid" &&
        transaction.status?.toLowerCase() !== "cancelled"
    ),
    [activeTransactions]
  );

  const paidPayments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Payment" && 
        transaction.paymentStatus?.toLowerCase() === "paid" &&
        transaction.status?.toLowerCase() !== "cancelled"
    ),
    [activeTransactions]
  );

  const completedDocuments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Request Document" && 
        transaction.status?.toLowerCase() === "completed"
    ),
    [activeTransactions]
  );

  const completedPayments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Payment" && 
        transaction.status?.toLowerCase() === "completed"
    ),
    [activeTransactions]
  );

  const cancelledDocuments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Request Document" && 
        transaction.status?.toLowerCase() === "cancelled"
    ),
    [activeTransactions]
  );

  const cancelledPayments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Payment" && 
        transaction.status?.toLowerCase() === "cancelled"
    ),
    [activeTransactions]
  );

  const completedTransactions = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.paymentStatus?.toLowerCase() === "paid" &&
        transaction.status?.toLowerCase() === "cancelled"
    ),
    [activeTransactions]
  );

  const isAllTransactionsCompleted = useMemo(() => {
    if (activeTransactions.length === 0) return false;
    return activeTransactions.every(t => 
      t.paymentStatus?.toLowerCase() === "paid" && 
      t.status?.toLowerCase() === "cancelled"
    );
  }, [activeTransactions]);

  const isQueueStatusCompleted = useMemo(() => {
    return queueStatus && 
      queueStatus.status?.toLowerCase() === 'completed';
  }, [queueStatus]);

  const isAllTransactionsPaidOrCancelled = useMemo(() => {
    if (activeTransactions.length === 0) return false;
    return activeTransactions.every(t => 
      t.paymentStatus?.toLowerCase() === "paid" || 
      t.status?.toLowerCase() === "cancelled"
    );
  }, [activeTransactions]);

  const hasReadyForReleaseDocuments = useMemo(() => {
    return readyForReleaseDocuments.length > 0;
  }, [readyForReleaseDocuments]);

  // ✅ REMOVED: All auto-navigation logic
  // Users must manually tap the back button
  // Banners and notes will display without redirecting

  const totalUnpaid = useMemo(() => {
    const docTotal = unpaidDocuments.reduce((sum, doc) => {
      const fee = parseFloat(doc.fee) || 0;
      const copies = doc.copies || 1;
      return sum + (fee * copies);
    }, 0);

    const paymentTotal = unpaidPayments.reduce((sum, pay) => {
      return sum + (parseFloat(pay.fee) || 0);
    }, 0);

    return docTotal + paymentTotal;
  }, [unpaidDocuments, unpaidPayments]);

  const totalPaid = useMemo(() => {
    const docTotal = paidDocuments.reduce((sum, doc) => {
      const fee = parseFloat(doc.fee) || 0;
      const copies = doc.copies || 1;
      return sum + (fee * copies);
    }, 0);

    const paymentTotal = paidPayments.reduce((sum, pay) => {
      return sum + (parseFloat(pay.fee) || 0);
    }, 0);

    return docTotal + paymentTotal;
  }, [paidDocuments, paidPayments]);

  const totalCompleted = useMemo(() => {
    const docTotal = completedDocuments.reduce((sum, doc) => {
      const fee = parseFloat(doc.fee) || 0;
      const copies = doc.copies || 1;
      return sum + (fee * copies);
    }, 0);

    const paymentTotal = completedPayments.reduce((sum, pay) => {
      return sum + (parseFloat(pay.fee) || 0);
    }, 0);

    return docTotal + paymentTotal;
  }, [completedDocuments, completedPayments]);

  const totalCancelled = useMemo(() => {
    const docTotal = cancelledDocuments.reduce((sum, doc) => {
      const fee = parseFloat(doc.fee) || 0;
      const copies = doc.copies || 1;
      return sum + (fee * copies);
    }, 0);

    const paymentTotal = cancelledPayments.reduce((sum, pay) => {
      return sum + (parseFloat(pay.fee) || 0);
    }, 0);

    return docTotal + paymentTotal;
  }, [cancelledDocuments, cancelledPayments]);

  const qrData = JSON.stringify({
    code: queueData.personalInfo.transactionCode
  });

  const getStatusColor = (status: string | undefined): string => {
    if (!status) return '#666';
    switch (status.toLowerCase()) {
      case 'waiting':
        return '#FFA500';
      case 'pending':
        return '#FFD700';
      case 'in-process':
        return '#4A90E2';
      case 'called':
        return '#FF6B6B';
      case 'on-hold':
        return '#FFD700';
      case 'completed':
        return '#19AF5B';
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
          <View 
            style={[
              styles.socketIndicator, 
              { backgroundColor: socketConnected ? "#19AF5B" : "#ff6f00" }
            ]} 
            title={socketConnected ? "Connected" : "Disconnected"}
          />
        </View>

        <ScrollView contentContainerStyle={styles.content}>

          {/* ✅ NEW: Ready-for-Release Documents Banner - NO AUTO REDIRECT */}
          {hasReadyForReleaseDocuments && readyForReleaseDocuments.length > 0 && (
            <View style={styles.readyForReleaseBanner}>
              <Text style={styles.readyForReleaseIcon}>📋</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.readyForReleaseTitle}>Documents Ready for Release!</Text>
                <Text style={styles.readyForReleaseSubtitle}>
                  Your {readyForReleaseDocuments.length} document{readyForReleaseDocuments.length > 1 ? 's are' : ' is'} now ready to be picked up.
                </Text>
              </View>
            </View>
          )}


          {/* ✅ NEW: Queue Completed Banner - NO AUTO REDIRECT */}
          {isQueueStatusCompleted && !hasReadyForReleaseDocuments && (
            <View style={styles.queueCompletedBanner}>
              <Text style={styles.queueCompletedIcon}>🎉</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.queueCompletedTitle}>Queue Completed!</Text>
                <Text style={styles.queueCompletedSubtitle}>
                  Your transaction has been processed.
                </Text>
              </View>
            </View>
          )}

            {/* ✅ NEW: All Transactions Completed Banner - NO AUTO REDIRECT */}
          {isAllTransactionsPaidOrCancelled && activeTransactions.length > 0 && !hasReadyForReleaseDocuments && (
            <View style={styles.allTransactionsCompletedBanner}>
              <Text style={styles.allTransactionsCompletedIcon}>✅</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.allTransactionsCompletedTitle}>Payment Completed!</Text>
                <Text style={styles.allTransactionsCompletedSubtitle}>
                  All transactions have been paid
                </Text>
              </View>
            </View>
          )}

          {/* ✅ Transaction Completed Banner - NO AUTO REDIRECT */}
          {/* {isAllTransactionsCompleted && completedTransactions.length > 0 && !isQueueStatusCompleted && !isAllTransactionsPaidOrCancelled && !hasReadyForReleaseDocuments && (
            <View style={styles.completedBanner}>
              <Text style={styles.completedBannerIcon}>✅</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.completedBannerTitle}>Transaction Completed</Text>
                <Text style={styles.completedBannerSubtitle}>
                  All items have been paid and processed. Thank you!
                </Text>
              </View>
            </View>
          )} */}

          {!hasValidQueueStatus ? (
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
              <Text style={styles.qrSubtitle}>Transaction Code</Text>
            </View>
          ) : (
            <View style={styles.queueInfoContainer}>
              <View style={styles.queueNumberHeader}>
                <Text style={styles.queueNumberLabel}>Your Queue Number</Text>
                <Text style={styles.queueNumberValue}>{queueStatus.queueNumber || '-'}</Text>
                <Text style={styles.queueNumberLabel}>Line Status: {queueStatus.position === 1 ? 'NEXT' : queueStatus.position === 0 ? 'GO IN' : `#${queueStatus.position || '-'}`}</Text>
                <Text style={[styles.queueNumberLabel, { color: getStatusColor(queueStatus.status) }]}>{queueStatus.status?.toUpperCase() || 'UNKNOWN'}</Text>
              </View>

              <View style={styles.queueDetailsCard}>
                <View style={styles.queueDetailRow}>
                  <Text style={styles.queueDetailLabel}>📍 Office:</Text>
                  <Text style={styles.queueDetailValue}>{queueStatus.office || 'N/A'}</Text>
                </View>
                
                {queueStatus.estimatedTime && (
                  <View style={styles.queueDetailRow}>
                    <Text style={styles.queueDetailLabel}>⏱️ Est. Time:</Text>
                    <Text style={styles.queueDetailValue}>
                      {queueStatus.estimatedTime}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.statusIndicatorBanner}>
                <Text style={[styles.statusIndicatorText]}>
                  🔄 Status updates in real-time • {socketConnected ? '✅ Connected' : '⚠️ Offline'}
                </Text>
              </View>
            </View>
          )}

          {(readyForReleaseDocuments.length > 0 || unpaidDocuments.length > 0 || unpaidPayments.length > 0 || paidDocuments.length > 0 || paidPayments.length > 0 || completedDocuments.length > 0 || completedPayments.length > 0 || cancelledDocuments.length > 0 || cancelledPayments.length > 0) && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>📊 Payment Summary</Text>
              
              {(completedDocuments.length > 0 || completedPayments.length > 0) && (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>✅ Total Completed:</Text>
                    <Text style={[styles.summaryValue, { color: '#19AF5B', fontWeight: '700' }]}>
                      ₱{totalCompleted.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Completed Items:</Text>
                    <Text style={[styles.summaryValue, { color: '#19AF5B' }]}>
                      {completedDocuments.length + completedPayments.length}
                    </Text>
                  </View>
                </>
              )}

              {totalPaid > 0 && (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>✅ Total Paid:</Text>
                    <Text style={[styles.summaryValue, { color: '#19AF5B', fontWeight: '700' }]}>
                      ₱{totalPaid.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Paid Items:</Text>
                    <Text style={[styles.summaryValue, { color: '#19AF5B' }]}>
                      {paidDocuments.length + paidPayments.length}
                    </Text>
                  </View>
                </>
              )}

              {totalUnpaid > 0 && (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>❌ Total Unpaid:</Text>
                    <Text style={[styles.summaryValue, { color: '#FF6B6B', fontWeight: '700' }]}>
                      ₱{totalUnpaid.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Unpaid Items:</Text>
                    <Text style={[styles.summaryValue, { color: '#FF6B6B' }]}>
                      {unpaidDocuments.length + unpaidPayments.length}
                    </Text>
                  </View>
                </>
              )}

              {totalCancelled > 0 && (
                <>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>❌ Total Cancelled:</Text>
                    <Text style={[styles.summaryValue, { color: '#d32f2f', fontWeight: '700' }]}>
                      ₱{totalCancelled.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Cancelled Items:</Text>
                    <Text style={[styles.summaryValue, { color: '#d32f2f' }]}>
                      {cancelledDocuments.length + cancelledPayments.length}
                    </Text>
                  </View>
                </>
              )}

              {readyForReleaseDocuments.length > 0 && (
                <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.summaryLabel}>📋 Ready for Release:</Text>
                  <Text style={[styles.summaryValue, { color: '#ff8c00' }]}>
                    {readyForReleaseDocuments.length}
                  </Text>
                </View>
              )}
            </View>
          )}

          {readyForReleaseDocuments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>
                  📋 Ready for Release ({readyForReleaseDocuments.length})
                </Text>
                <View style={[styles.liveIndicator, { backgroundColor: '#ffc107' }]} />
              </View>
              <FlatList
                data={readyForReleaseDocuments}
                keyExtractor={(item) => `ready-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.readyCard]}>
                    <View style={styles.documentHeader}>
                      <Text style={styles.documentTitle}>📋 {item.transactionDetails}</Text>
                      <View style={[styles.statusBadge, styles.readyBadge]}>
                        <Text style={[styles.statusBadgeText, { color: '#fff' }]}>{item.status}</Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Copies:</Text>
                      <Text style={styles.value}>{item.copies}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Fee:</Text>
                      <Text style={[styles.value, { color: '#19AF5B', fontWeight: '700' }]}>₱{(parseFloat(item.fee) || 0).toFixed(2)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Payment:</Text>
                      <View style={[
                        styles.paymentStatusBadge,
                        { backgroundColor: item.paymentStatus?.toLowerCase() === 'paid' ? '#e8f5e9' : '#ffe3e3' }
                      ]}>
                        <Text style={[
                          styles.paymentStatusText,
                          { color: item.paymentStatus?.toLowerCase() === 'paid' ? '#19AF5B' : '#FF6B6B' }
                        ]}>
                          {item.paymentStatus?.toLowerCase() === 'paid' ? '✅ PAID' : '❌ UNPAID'}
                        </Text>
                      </View>
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

          {unpaidDocuments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>
                  📄 Unpaid Documents ({unpaidDocuments.length})
                </Text>
                <View style={styles.liveIndicator} />
              </View>
              <FlatList
                data={unpaidDocuments}
                keyExtractor={(item) => `unpaid-doc-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.unpaidCard]}>
                    <View style={styles.documentHeader}>
                      <Text style={styles.documentTitle}>💳 {item.transactionDetails}</Text>
                      <View style={[styles.statusBadge, styles.unpaidBadge]}>
                        <Text style={[styles.statusBadgeText, { color: '#fff' }]}>
                          {item.paymentStatus?.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Status:</Text>
                      <Text style={[styles.value, { color: '#ff6f00', fontWeight: '600' }]}>
                        {item.status}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Copies:</Text>
                      <Text style={styles.value}>{item.copies}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Total Amount:</Text>
                      <Text style={[styles.value, { fontWeight: '700', color: '#FF6B6B', fontSize: 14 }]}>
                        ₱{((parseFloat(item.fee) || 0) * (item.copies || 1)).toFixed(2)}
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

          {unpaidPayments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>
                  💰 Unpaid Payments ({unpaidPayments.length})
                </Text>
                <View style={styles.liveIndicator} />
              </View>
              <FlatList
                data={unpaidPayments}
                keyExtractor={(item) => `unpaid-pay-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.unpaidCard]}>
                    <View style={styles.documentHeader}>
                      <Text style={styles.documentTitle}>💳 {item.transactionDetails}</Text>
                      <View style={[styles.statusBadge, styles.unpaidBadge]}>
                        <Text style={[styles.statusBadgeText, { color: '#fff' }]}>
                          {item.paymentStatus?.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Status:</Text>
                      <Text style={[styles.value, { color: '#ff6f00', fontWeight: '600' }]}>
                        {item.status}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Amount Due:</Text>
                      <Text style={[styles.value, { fontWeight: '700', color: '#FF6B6B', fontSize: 14 }]}>
                        ₱{(parseFloat(item.fee) || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </>
          )}

          {paidDocuments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>
                  ✅ Paid Documents ({paidDocuments.length})
                </Text>
                <View style={[styles.liveIndicator, { backgroundColor: '#19AF5B' }]} />
              </View>
              <FlatList
                data={paidDocuments}
                keyExtractor={(item) => `paid-doc-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.paidCard]}>
                    <View style={styles.documentHeader}>
                      <Text style={styles.documentTitle}>✅ {item.transactionDetails}</Text>
                      <View style={[styles.statusBadge, styles.paidBadge]}>
                        <Text style={[styles.statusBadgeText, { color: '#fff' }]}>
                          PAID
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Status:</Text>
                      <Text style={[styles.value, { color: '#19AF5B', fontWeight: '600' }]}>
                        {item.status}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Copies:</Text>
                      <Text style={styles.value}>{item.copies}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Total Amount:</Text>
                      <Text style={[styles.value, { fontWeight: '700', color: '#19AF5B', fontSize: 14 }]}>
                        ₱{((parseFloat(item.fee) || 0) * (item.copies || 1)).toFixed(2)}
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

          {paidPayments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>
                  ✅ Paid Payments ({paidPayments.length})
                </Text>
                <View style={[styles.liveIndicator, { backgroundColor: '#19AF5B' }]} />
              </View>
              <FlatList
                data={paidPayments}
                keyExtractor={(item) => `paid-pay-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.paidCard]}>
                    <View style={styles.documentHeader}>
                      <Text style={styles.documentTitle}>✅ {item.transactionDetails}</Text>
                      <View style={[styles.statusBadge, styles.paidBadge]}>
                        <Text style={[styles.statusBadgeText, { color: '#fff' }]}>
                          PAID
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Status:</Text>
                      <Text style={[styles.value, { color: '#19AF5B', fontWeight: '600' }]}>
                        {item.status}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Amount Paid:</Text>
                      <Text style={[styles.value, { fontWeight: '700', color: '#19AF5B', fontSize: 14 }]}>
                        ₱{(parseFloat(item.fee) || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </>
          )}

          {completedDocuments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>
                  ✅ Completed Documents ({completedDocuments.length})
                </Text>
                <View style={[styles.liveIndicator, { backgroundColor: '#19AF5B' }]} />
              </View>
              <FlatList
                data={completedDocuments}
                keyExtractor={(item) => `completed-doc-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.completedCard]}>
                    <View style={styles.documentHeader}>
                      <Text style={styles.documentTitle}>✅ {item.transactionDetails}</Text>
                      <View style={[styles.statusBadge, styles.completedBadge]}>
                        <Text style={[styles.statusBadgeText, { color: '#fff' }]}>
                          COMPLETED
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Copies:</Text>
                      <Text style={styles.value}>{item.copies}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Total Amount:</Text>
                      <Text style={[styles.value, { fontWeight: '700', color: '#19AF5B', fontSize: 14 }]}>
                        ₱{((parseFloat(item.fee) || 0) * (item.copies || 1)).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Payment:</Text>
                      <View style={[
                        styles.paymentStatusBadge,
                        { backgroundColor: '#e8f5e9' }
                      ]}>
                        <Text style={[
                          styles.paymentStatusText,
                          { color: '#19AF5B' }
                        ]}>
                          ✅ {item.paymentStatus?.toUpperCase()}
                        </Text>
                      </View>
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

          {completedPayments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>
                  ✅ Completed Payments ({completedPayments.length})
                </Text>
                <View style={[styles.liveIndicator, { backgroundColor: '#19AF5B' }]} />
              </View>
              <FlatList
                data={completedPayments}
                keyExtractor={(item) => `completed-pay-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.completedCard]}>
                    <View style={styles.documentHeader}>
                      <Text style={styles.documentTitle}>✅ {item.transactionDetails}</Text>
                      <View style={[styles.statusBadge, styles.completedBadge]}>
                        <Text style={[styles.statusBadgeText, { color: '#fff' }]}>
                          COMPLETED
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Amount:</Text>
                      <Text style={[styles.value, { fontWeight: '700', color: '#19AF5B', fontSize: 14 }]}>
                        ₱{(parseFloat(item.fee) || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Payment:</Text>
                      <View style={[
                        styles.paymentStatusBadge,
                        { backgroundColor: '#e8f5e9' }
                      ]}>
                        <Text style={[
                          styles.paymentStatusText,
                          { color: '#19AF5B' }
                        ]}>
                          ✅ {item.paymentStatus?.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </>
          )}

          {cancelledDocuments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>
                  ❌ Cancelled Documents ({cancelledDocuments.length})
                </Text>
                <View style={[styles.liveIndicator, { backgroundColor: '#d32f2f' }]} />
              </View>
              <FlatList
                data={cancelledDocuments}
                keyExtractor={(item) => `cancelled-doc-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.cancelledCard]}>
                    <View style={styles.documentHeader}>
                      <Text style={[styles.documentTitle, { textDecorationLine: 'line-through', color: '#999' }]}>
                        ❌ {item.transactionDetails}
                      </Text>
                      <View style={[styles.statusBadge, styles.cancelledBadge]}>
                        <Text style={[styles.statusBadgeText, { color: '#fff' }]}>
                          CANCELLED
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Copies:</Text>
                      <Text style={[styles.value, { color: '#999' }]}>{item.copies}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Original Fee:</Text>
                      <Text style={[styles.value, { color: '#999', textDecorationLine: 'line-through' }]}>
                        ₱{(parseFloat(item.fee) || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Payment:</Text>
                      <View style={[
                        styles.paymentStatusBadge,
                        { backgroundColor: item.paymentStatus?.toLowerCase() === 'paid' ? '#e8f5e9' : '#ffe3e3' }
                      ]}>
                        <Text style={[
                          styles.paymentStatusText,
                          { color: item.paymentStatus?.toLowerCase() === 'paid' ? '#19AF5B' : '#FF6B6B' }
                        ]}>
                          {item.paymentStatus?.toLowerCase() === 'paid' ? '✅ PAID' : '❌ UNPAID'}
                        </Text>
                      </View>
                    </View>
                    {/* ✅ Show completed note if paid and cancelled */}
                    {item.paymentStatus?.toLowerCase() === 'paid' && item.status?.toLowerCase() === 'cancelled' && (
                      <View style={styles.completedNote}>
                        <Text style={styles.completedNoteText}>✅ Transaction Completed</Text>
                      </View>
                    )}
                    {item.purpose && (
                      <View style={styles.infoRow}>
                        <Text style={styles.label}>Purpose:</Text>
                        <Text style={[styles.value, { color: '#999' }]}>{item.purpose}</Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </>
          )}

          {cancelledPayments.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.title}>
                  ❌ Cancelled Payments ({cancelledPayments.length})
                </Text>
                <View style={[styles.liveIndicator, { backgroundColor: '#d32f2f' }]} />
              </View>
              <FlatList
                data={cancelledPayments}
                keyExtractor={(item) => `cancelled-pay-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={[styles.documentCard, styles.cancelledCard]}>
                    <View style={styles.documentHeader}>
                      <Text style={[styles.documentTitle, { textDecorationLine: 'line-through', color: '#999' }]}>
                        ❌ {item.transactionDetails}
                      </Text>
                      <View style={[styles.statusBadge, styles.cancelledBadge]}>
                        <Text style={[styles.statusBadgeText, { color: '#fff' }]}>
                          CANCELLED
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Original Amount:</Text>
                      <Text style={[styles.value, { color: '#999', textDecorationLine: 'line-through' }]}>
                        ₱{(parseFloat(item.fee) || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.label}>Payment:</Text>
                      <View style={[
                        styles.paymentStatusBadge,
                        { backgroundColor: item.paymentStatus?.toLowerCase() === 'paid' ? '#e8f5e9' : '#ffe3e3' }
                      ]}>
                        <Text style={[
                          styles.paymentStatusText,
                          { color: item.paymentStatus?.toLowerCase() === 'paid' ? '#19AF5B' : '#FF6B6B' }
                        ]}>
                          {item.paymentStatus?.toLowerCase() === 'paid' ? '✅ PAID' : '❌ UNPAID'}
                        </Text>
                      </View>
                    </View>
                    {/* ✅ Show completed note if paid and cancelled */}
                    {item.paymentStatus?.toLowerCase() === 'paid' && item.status?.toLowerCase() === 'cancelled' && (
                      <View style={styles.completedNote}>
                        <Text style={styles.completedNoteText}>✅ Transaction Completed</Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </>
          )}

          {readyForReleaseDocuments.length === 0 && unpaidDocuments.length === 0 && unpaidPayments.length === 0 && paidDocuments.length === 0 && paidPayments.length === 0 && completedDocuments.length === 0 && completedPayments.length === 0 && cancelledDocuments.length === 0 && cancelledPayments.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No documents found</Text>
              <Text style={styles.emptySubtext}>Check back later for updates</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#19AF5B",
    flex: 1,
    textAlign: "center",
  },
  socketIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },

  readyForReleaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#ffc107',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  readyForReleaseIcon: {
    fontSize: 32,
  },
  readyForReleaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff8c00',
    marginBottom: 4,
  },
  readyForReleaseSubtitle: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '500',
    marginBottom: 4,
  },
  readyForReleaseNote: {
    fontSize: 11,
    color: '#856404',
    fontWeight: '600',
    fontStyle: 'italic',
  },

  allTransactionsCompletedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#19AF5B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  allTransactionsCompletedIcon: {
    fontSize: 32,
  },
  allTransactionsCompletedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#19AF5B',
    marginBottom: 4,
  },
  allTransactionsCompletedSubtitle: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
    marginBottom: 4,
  },
  redirectingText: {
    fontSize: 11,
    color: '#19AF5B',
    fontWeight: '600',
    fontStyle: 'italic',
  },

  queueCompletedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#19AF5B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  queueCompletedIcon: {
    fontSize: 32,
  },
  queueCompletedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#19AF5B',
    marginBottom: 4,
  },
  queueCompletedSubtitle: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },

  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#19AF5B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedBannerIcon: {
    fontSize: 32,
  },
  completedBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#19AF5B',
    marginBottom: 4,
  },
  completedBannerSubtitle: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },

  completedNote: {
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#19AF5B',
  },
  completedNoteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#19AF5B',
    textAlign: 'center',
  },

  qrValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginTop: 15,
  },
  qrSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  queueInfoContainer: {
    marginBottom: 20,
    gap: 12,
  },
  
  queueNumberHeader: {
    backgroundColor: '#19AF5B',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  queueNumberLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    opacity: 0.9,
  },
  queueNumberValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
  },

  queueDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#19AF5B',
  },
  queueDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  queueDetailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  queueDetailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },

  statusIndicatorBanner: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2196f3',
  },
  statusIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginLeft: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
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
  readyCard: {
    borderLeftColor: '#ffc107',
    backgroundColor: '#fffbea',
  },
  unpaidCard: {
    borderLeftColor: '#FF6B6B',
    backgroundColor: '#fff',
  },
  paidCard: {
    borderLeftColor: '#19AF5B',
    backgroundColor: '#f0fdf4',
  },
  completedCard: {
    borderLeftColor: '#19AF5B',
    backgroundColor: '#f0fdf4',
  },
  cancelledCard: {
    borderLeftColor: '#d32f2f',
    backgroundColor: '#ffebee',
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  readyBadge: {
    backgroundColor: '#ffc107',
  },
  unpaidBadge: {
    backgroundColor: '#FF6B6B',
  },
  paidBadge: {
    backgroundColor: '#19AF5B',
  },
  completedBadge: {
    backgroundColor: '#19AF5B',
  },
  cancelledBadge: {
    backgroundColor: '#d32f2f',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#19AF5B',
    textTransform: 'capitalize',
  },

  paymentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  paymentStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 12,
    color: '#222',
    fontWeight: '500',
  },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2196f3',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 5,
  },
});