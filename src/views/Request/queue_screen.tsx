import IconButton from "@/src/components/buttons/IconButton";
import CurrentTransactionModal from "@/src/components/modals/CurrentTransactionModal.";
import { useRequestTransaction } from "@/src/hooks/appTabHooks/useRequestTransaction";
import { RequestStackParamList } from '@/src/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from "react-native-safe-area-context";

type QueueScreenNavigationProp = NativeStackNavigationProp<RequestStackParamList, "Queue">;

export default function QueueScreen() {
  const navigation = useNavigation<QueueScreenNavigationProp>();
  const { params } = useRoute<RouteProp<RequestStackParamList, "Queue">>();
  const { queueData } = params;

  const personalInfoId = queueData.personalInfo.id;
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [showCurrentTransactionModal, setShowCurrentTransactionModal] = useState(false);

  // ✅ Get real-time data from socket
  const {
    activeTransactions,
    queueStatus,
    socketConnected,
    personalInfoStatus,
  } = useRequestTransaction(queueData.transactions, personalInfoId);

  // ✅ MONITOR QUEUE STATUS CHANGES - Real-time updates
  useEffect(() => {
    if (queueStatus) {
      console.log('📡 Queue Status Changed:', {
        queueNumber: queueStatus.queueNumber,
        status: queueStatus.status,
        position: queueStatus.position,
        office: queueStatus.office,
        timestamp: new Date().toLocaleTimeString()
      });
      
      setIsUpdating(true);
      setLastUpdate(new Date().toLocaleTimeString());
      setIsLoadingQueue(false);
      
      // Show update indicator for 1 second
      const timer = setTimeout(() => setIsUpdating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [queueStatus]);

  // ✅ TIMEOUT - If no queue status after 8 seconds, stop loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!queueStatus) {
        setIsLoadingQueue(false);
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [queueStatus]);

  // ✅ CALLBACK: Navigate back with updated data
  const goBack = useCallback(() => {
    console.log('🔄 Navigating back to Transaction screen');
    navigation.navigate('Transaction', { 
      transaction: {
        ...queueData,
        transactions: activeTransactions,
        personalInfo: {
          ...queueData.personalInfo,
          status: personalInfoStatus || queueData.personalInfo.status
        }
      }
    });
  }, [navigation, queueData, activeTransactions, personalInfoStatus]);



  // ✅ Monitor for called status with position 1
useEffect(() => {
  if (
    queueStatus?.status?.toLowerCase() === 'called' && 
    queueStatus?.position === 1
  ) {
    console.log('🎯 CALLED! Position is 1 - Showing modal');
    setShowCurrentTransactionModal(true);
  }
}, [queueStatus?.status, queueStatus?.position]);

useEffect(() => {
  const status = queueStatus?.status?.toLowerCase();
  if (status === 'in-process' || status === 'completed') {
    console.log('✅ Queue status changed to', status, '- Hiding modal');
    setShowCurrentTransactionModal(false);
  }
}, [queueStatus?.status]);

  // ✅ Handle modal close
  const handleModalClose = useCallback(() => {
    console.log('✅ Modal closed');
    setShowCurrentTransactionModal(false);
  }, []);

  // ✅ LOGIC: Check if we have valid queue status
  const hasValidQueueStatus = useMemo(() => 
    queueStatus && 
    Object.keys(queueStatus).length > 0 &&
    queueStatus.queueNumber &&
    queueStatus.status,
    [queueStatus]
  );

  const VALID_QUEUE_STATUSES = ['waiting', 'pending', 'in-process', 'on-hold', 'called'];
  const isValidStatus = useMemo(() =>
    queueStatus?.status && 
    VALID_QUEUE_STATUSES.includes(queueStatus.status.toLowerCase()),
    [queueStatus]
  );

  // ✅ LOGIC: Filter transactions by status and type
  const readyForReleaseDocuments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Request Document" && 
        transaction.status?.toLowerCase() === "ready-for-release" &&
        transaction.status?.toLowerCase() !== "cancelled"
    ),
    [activeTransactions]
  );


  const claimedDocuments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Request Document" && 
        transaction.status?.toLowerCase() === "completed"
    ),
    [activeTransactions]
  );

  const hasStatusBasedDocuments = useMemo(() =>
    readyForReleaseDocuments.length > 0 || claimedDocuments.length > 0,
    [readyForReleaseDocuments, claimedDocuments]
  );

  const unpaidDocuments = useMemo(() =>
    activeTransactions.filter(
      (transaction: any) => 
        transaction.transactionType === "Request Document" && 
        transaction.paymentStatus?.toLowerCase() === "unpaid" &&
        transaction.status?.toLowerCase() !== "cancelled" &&
        transaction.status?.toLowerCase() !== "ready-for-release" &&
        transaction.status?.toLowerCase() !== "completed"
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
        transaction.status?.toLowerCase() !== "cancelled" &&
        transaction.status?.toLowerCase() !== "ready-for-release" &&
        transaction.status?.toLowerCase() !== "completed"
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

  

  // ✅ LOGIC: Calculate totals
  const calculateTotal = (documents: any[], payments: any[]) => {
    const docTotal = documents.reduce((sum, doc) => {
      const fee = parseFloat(doc.fee) || 0;
      const copies = doc.copies || 1;
      return sum + (fee * copies);
    }, 0);

    const paymentTotal = payments.reduce((sum, pay) => {
      return sum + (parseFloat(pay.fee) || 0);
    }, 0);

    return docTotal + paymentTotal;
  };

  const totalUnpaid = useMemo(() => calculateTotal(unpaidDocuments, unpaidPayments), [unpaidDocuments, unpaidPayments]);
  const totalPaid = useMemo(() => calculateTotal(paidDocuments, paidPayments), [paidDocuments, paidPayments]);
  const totalCompleted = useMemo(() => calculateTotal(completedDocuments, completedPayments), [completedDocuments, completedPayments]);
  const totalCancelled = useMemo(() => calculateTotal(cancelledDocuments, cancelledPayments), [cancelledDocuments, cancelledPayments]);

  const hasReadyForReleaseDocuments = readyForReleaseDocuments.length > 0;
  const hasClaimedDocuments = claimedDocuments.length > 0;
  const isQueueStatusCompleted = queueStatus?.status?.toLowerCase() === 'completed';
  const isAllTransactionsPaidOrCancelled = activeTransactions.length > 0 && 
    activeTransactions.every(t => 
      t.paymentStatus?.toLowerCase() === "paid" || 
      t.status?.toLowerCase() === "cancelled"
    );

  const qrData = JSON.stringify({
    code: queueData.personalInfo.transactionCode
  });

  // ✅ NEW: Auto-navigate back when queue status is completed
  useEffect(() => {
    if (
      queueStatus?.status?.toLowerCase() === 'completed' && 
      !hasReadyForReleaseDocuments
    ) {
      console.log('✅ Queue Completed! Auto-navigating back in 2 seconds...');
      
      const autoBackTimer = setTimeout(() => {
        goBack();
      }, 2000);
      
      return () => clearTimeout(autoBackTimer);
    }
  }, [queueStatus?.status, hasReadyForReleaseDocuments, goBack]);

  // ✅ LOGIC: Get status color
  const getStatusColor = (status: string | undefined): string => {
    if (!status) return '#666';
    const statusMap: Record<string, string> = {
      'waiting': '#FFA500',
      'pending': '#FFD700',
      'in-process': '#4A90E2',
      'called': '#FF6B6B',
      'on-hold': '#FFD700',
      'completed': '#19AF5B',
    };
    return statusMap[status.toLowerCase()] || '#666';
  };

  // ✅ LOGIC: Get position display text
  const getPositionDisplay = (position: number | undefined, queueStatus: any): string => {
    if (queueStatus?.status?.toLowerCase() === 'completed') {
      return '✅ COMPLETED';
    }
    
    if (!position && position !== 0) return '-';
    if (position === 0) return '🟢 ON GOING';
    if (position === 1) return '🔴 NEXT';
    
    return `#${position}`;
  };

  const getTransactionCount = (...arrays: any[][]): number => 
    arrays.reduce((sum, arr) => sum + arr.length, 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <IconButton
            onPress={goBack}
            icon={require("../../../assets/icons/ArrowBack.png")}
          />
          <Text style={styles.headerTitle}>Queue Transaction</Text>
          
          <View style={[
            styles.socketIndicator, 
            { backgroundColor: socketConnected ? "#19AF5B" : "#ff6f00" }
          ]} />
          
          {isUpdating && (
            <ActivityIndicator 
              size="small" 
              color="#19AF5B" 
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.content}>

          {/* ✅ AUTO-NAVIGATE BANNER - Show when completed */}
          {isQueueStatusCompleted && !hasReadyForReleaseDocuments && (
            <View style={styles.autoNavigateBanner}>
              <ActivityIndicator size="small" color="#19AF5B" style={{ marginRight: 8 }} />
              <Text style={styles.autoNavigateText}>
                ✅ Transaction completed! Returning to transaction details...
              </Text>
            </View>
          )}

          {/* ✅ LOADING SCREEN - Waiting for queue status */}
          {isLoadingQueue && !hasValidQueueStatus ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingContent}>
                <View style={styles.loadingSpinner}>
                  <ActivityIndicator 
                    size="large" 
                    color="#19AF5B" 
                  />
                </View>

                <Text style={styles.loadingTitle}>Getting Your Queue</Text>
                <Text style={styles.loadingSubtitle}>
                  Please wait while we assign you a queue number...
                </Text>

                <View style={styles.statusIndicatorContainer}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: socketConnected ? '#19AF5B' : '#ff6f00' }
                  ]} />
                  <Text style={[
                    styles.statusText,
                    { color: socketConnected ? '#19AF5B' : '#ff6f00' }
                  ]}>
                    {socketConnected ? 'Connected' : 'Connecting...'}
                  </Text>
                </View>

                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>Your Transaction Code</Text>
                  <Text style={styles.code}>{queueData.personalInfo.transactionCode}</Text>
                </View>

                <View style={styles.tipContainer}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>
                    Keep this screen open to receive your queue number
                  </Text>
                </View>
              </View>
            </View>
          ) : queueStatus?.status?.toLowerCase() === 'temporary' || (queueStatus?.status?.toLowerCase() === 'completed' && hasReadyForReleaseDocuments) ? (
            <View style={styles.qrContainer}>
              <View style={styles.qrContent}>
                <QRCode
                  value={qrData}
                  size={220}
                  level="H"
                  includeMargin={true}
                  fgColor="#19AF5B"
                  bgColor="#fff"
                />
                <Text style={styles.qrCode}>{queueData.personalInfo.transactionCode}</Text>
                <Text style={styles.qrCodeLabel}>Transaction Code</Text>
              </View>
            </View>
          ) : (
            <>
              {/* QUEUE NUMBER CARD */}
              <View style={[
                styles.queueNumberCard,
                { opacity: isUpdating ? 0.9 : 1 }
              ]}>
                <View style={styles.queueNumberContent}>
                  <Text style={styles.queueLabel}>Your Queue Number</Text>
                  <Text style={styles.queueNumber}>{queueStatus?.queueNumber}</Text>
                  
                  <View style={styles.queueInfoRow}>
                    <View style={styles.queueInfoItem}>
                      <Text style={styles.queueInfoLabel}>Position</Text>
                      <Text style={styles.queueInfoValue}>
                        {getPositionDisplay(queueStatus?.position, queueStatus)}
                      </Text>
                    </View>
                    
                    <View style={styles.queueStatusItem}>
                      <Text style={styles.queueInfoLabel}>Status</Text>
                      <View style={[
                        styles.statusPill,
                        { backgroundColor: getStatusColor(queueStatus?.status) }
                      ]}>
                        <Text style={styles.statusPillText}>
                          {queueStatus?.status?.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* QUEUE DETAILS CARD */}
              <View style={styles.queueDetailsCard}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Text style={styles.icon}>🏢</Text>
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Office</Text>
                    <Text style={styles.detailValue}>{queueStatus?.office || 'N/A'}</Text>
                  </View>
                </View>

                {queueStatus?.estimatedTime && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Text style={styles.icon}>⏱️</Text>
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Estimated Time</Text>
                      <Text style={styles.detailValue}>{queueStatus.estimatedTime}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* STATUS INDICATOR */}
              <View style={styles.statusIndicator}>
                <Text style={styles.statusIndicatorText}>
                  {isUpdating ? '🔄 Syncing...' : '✅ Live'} • {socketConnected ? '🟢 Connected' : '🔴 Offline'}
                </Text>
              </View>
            </>
          )}

          {/* ✅ ALERT BANNERS */}

          {hasClaimedDocuments && (
            <View style={styles.alertBanner}>
              <View style={[styles.alertBannerContent, { backgroundColor: '#e8f5e9', borderLeftColor: '#19AF5B' }]}>
                <Text style={styles.alertIcon}>✅</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.alertTitle}>Documents Claimed!</Text>
                  <Text style={styles.alertSubtitle}>
                    {claimedDocuments.length} document{claimedDocuments.length > 1 ? 's have' : ' has'} been claimed
                  </Text>
                </View>
              </View>
            </View>
          )}
          
          {hasReadyForReleaseDocuments && (
            <View style={styles.alertBanner}>
              <View style={[styles.alertBannerContent, { backgroundColor: '#fff3cd', borderLeftColor: '#ffc107' }]}>
                <Text style={styles.alertIcon}>📋</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.alertTitle}>Documents Ready!</Text>
                  <Text style={styles.alertSubtitle}>
                    {readyForReleaseDocuments.length} document{readyForReleaseDocuments.length > 1 ? 's are' : ' is'} ready for pickup
                  </Text>
                </View>
              </View>
            </View>
          )}

          {isQueueStatusCompleted && !hasReadyForReleaseDocuments && !hasClaimedDocuments && (
            <View style={styles.alertBanner}>
              <View style={[styles.alertBannerContent, { backgroundColor: '#e8f5e9', borderLeftColor: '#19AF5B' }]}>
                <Text style={styles.alertIcon}>🎉</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.alertTitle}>Queue Completed!</Text>
                  <Text style={styles.alertSubtitle}>Your transaction has been processed</Text>
                </View>
              </View>
            </View>
          )}

          {isAllTransactionsPaidOrCancelled && activeTransactions.length > 0 && !hasReadyForReleaseDocuments && !hasClaimedDocuments && (
            <View style={styles.alertBanner}>
              <View style={[styles.alertBannerContent, { backgroundColor: '#e8f5e9', borderLeftColor: '#19AF5B' }]}>
                <Text style={styles.alertIcon}>✅</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.alertTitle}>Payment Complete!</Text>
                  <Text style={styles.alertSubtitle}>All transactions have been settled</Text>
                </View>
              </View>
            </View>
          )}

          {/* ✅ SUMMARY SECTION */}
          {!hasStatusBasedDocuments && (completedDocuments.length > 0 || completedPayments.length > 0 || unpaidDocuments.length > 0 || unpaidPayments.length > 0 || paidDocuments.length > 0 || paidPayments.length > 0 || cancelledDocuments.length > 0 || cancelledPayments.length > 0) && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>📊 Payment Summary</Text>

              {(completedDocuments.length > 0 || completedPayments.length > 0) && (
                <View style={styles.summaryItem}>
                  <View style={styles.summaryItemHeader}>
                    <Text style={styles.summaryItemLabel}>✅ Completed</Text>
                    <Text style={[styles.summaryItemValue, { color: '#19AF5B' }]}>
                      ₱{totalCompleted.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.summaryItemCount}>
                    {getTransactionCount(completedDocuments, completedPayments)} items
                  </Text>
                </View>
              )}

              {totalPaid > 0 && (
                <View style={styles.summaryItem}>
                  <View style={styles.summaryItemHeader}>
                    <Text style={styles.summaryItemLabel}>✅ Paid</Text>
                    <Text style={[styles.summaryItemValue, { color: '#19AF5B' }]}>
                      ₱{totalPaid.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.summaryItemCount}>
                    {getTransactionCount(paidDocuments, paidPayments)} items
                  </Text>
                </View>
              )}

              {totalUnpaid > 0 && (
                <View style={styles.summaryItem}>
                  <View style={styles.summaryItemHeader}>
                    <Text style={styles.summaryItemLabel}>❌ Unpaid</Text>
                    <Text style={[styles.summaryItemValue, { color: '#FF6B6B' }]}>
                      ₱{totalUnpaid.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.summaryItemCount}>
                    {getTransactionCount(unpaidDocuments, unpaidPayments)} items
                  </Text>
                </View>
              )}

              {totalCancelled > 0 && (
                <View style={[styles.summaryItem, { borderBottomWidth: 0 }]}>
                  <View style={styles.summaryItemHeader}>
                    <Text style={styles.summaryItemLabel}>❌ Cancelled</Text>
                    <Text style={[styles.summaryItemValue, { color: '#d32f2f' }]}>
                      ₱{totalCancelled.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.summaryItemCount}>
                    {getTransactionCount(cancelledDocuments, cancelledPayments)} items
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* CLAIMED DOCUMENTS LIST */}
          {hasClaimedDocuments && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>✅ Claimed Documents</Text>
                <View style={[styles.badge, { backgroundColor: '#19AF5B' }]}>
                  <Text style={styles.badgeText}>{claimedDocuments.length}</Text>
                </View>
              </View>
              <FlatList
                data={claimedDocuments}
                keyExtractor={(item) => `claimed-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <DocumentCard document={item} status="claimed" />
                )}
              />
            </View>
          )}

          {/* READY FOR RELEASE DOCUMENTS LIST */}
          {hasReadyForReleaseDocuments && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📋 Ready for Release</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{readyForReleaseDocuments.length}</Text>
                </View>
              </View>
              <FlatList
                data={readyForReleaseDocuments}
                keyExtractor={(item) => `ready-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <DocumentCard document={item} status="ready" />
                )}
              />
            </View>
          )}

          {/* UNPAID DOCUMENTS LIST */}
          {!hasStatusBasedDocuments && unpaidDocuments.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📄 Pending Payment</Text>
                <View style={[styles.badge, { backgroundColor: '#FF6B6B' }]}>
                  <Text style={styles.badgeText}>{unpaidDocuments.length}</Text>
                </View>
              </View>
              <FlatList
                data={unpaidDocuments}
                keyExtractor={(item) => `unpaid-doc-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <DocumentCard document={item} status="unpaid" />
                )}
              />
            </View>
          )}

          {/* UNPAID PAYMENTS LIST */}
          {!hasStatusBasedDocuments && unpaidPayments.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>💰 Pending Payment</Text>
                <View style={[styles.badge, { backgroundColor: '#FF6B6B' }]}>
                  <Text style={styles.badgeText}>{unpaidPayments.length}</Text>
                </View>
              </View>
              <FlatList
                data={unpaidPayments}
                keyExtractor={(item) => `unpaid-pay-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <PaymentCard payment={item} status="unpaid" />
                )}
              />
            </View>
          )}

          {/* PAID DOCUMENTS LIST */}
          {!hasStatusBasedDocuments && paidDocuments.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📄 Paid Documents</Text>
                <View style={[styles.badge, { backgroundColor: '#19AF5B' }]}>
                  <Text style={styles.badgeText}>{paidDocuments.length}</Text>
                </View>
              </View>
              <FlatList
                data={paidDocuments}
                keyExtractor={(item) => `paid-doc-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <DocumentCard document={item} status="paid" />
                )}
              />
            </View>
          )}

          {/* PAID PAYMENTS LIST */}
          {!hasStatusBasedDocuments && paidPayments.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>💰 Paid Payments</Text>
                <View style={[styles.badge, { backgroundColor: '#19AF5B' }]}>
                  <Text style={styles.badgeText}>{paidPayments.length}</Text>
                </View>
              </View>
              <FlatList
                data={paidPayments}
                keyExtractor={(item) => `paid-pay-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <PaymentCard payment={item} status="paid" />
                )}
              />
            </View>
          )}

          {/* CANCELLED DOCUMENTS LIST */}
          {!hasStatusBasedDocuments && cancelledDocuments.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>❌ Cancelled Documents</Text>
                <View style={[styles.badge, { backgroundColor: '#d32f2f' }]}>
                  <Text style={styles.badgeText}>{cancelledDocuments.length}</Text>
                </View>
              </View>
              <FlatList
                data={cancelledDocuments}
                keyExtractor={(item) => `cancelled-doc-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <DocumentCard document={item} status="cancelled" />
                )}
              />
            </View>
          )}

          {/* CANCELLED PAYMENTS LIST */}
          {!hasStatusBasedDocuments && cancelledPayments.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>❌ Cancelled Payments</Text>
                <View style={[styles.badge, { backgroundColor: '#d32f2f' }]}>
                  <Text style={styles.badgeText}>{cancelledPayments.length}</Text>
                </View>
              </View>
              <FlatList
                data={cancelledPayments}
                keyExtractor={(item) => `cancelled-pay-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <PaymentCard payment={item} status="cancelled" />
                )}
              />
            </View>
          )}

          {/* Empty State */}
          {activeTransactions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📭</Text>
              <Text style={styles.emptyStateTitle}>No Transactions</Text>
              <Text style={styles.emptyStateSubtitle}>Check back later for updates</Text>
            </View>
          )}
        </ScrollView>

        {/* ✅ Current Transaction Modal */}
        <CurrentTransactionModal
          visible={showCurrentTransactionModal}
          onClose={handleModalClose}
          queueNumber={queueStatus?.queueNumber}
        />
      </View>
    </SafeAreaView>
  );
}

// ✅ DOCUMENT CARD COMPONENT
function DocumentCard({ document, status }: { document: any; status: string }) {
  const statusColors = {
    ready: { bg: '#fffbea', border: '#ffc107', text: '#ff8c00' },
    claimed: { bg: '#e8f5e9', border: '#19AF5B', text: '#19AF5B' },
    unpaid: { bg: '#fff', border: '#FF6B6B', text: '#FF6B6B' },
    paid: { bg: '#f0fdf4', border: '#19AF5B', text: '#19AF5B' },
    cancelled: { bg: '#ffebee', border: '#d32f2f', text: '#d32f2f' },
  };

  const colors = statusColors[status as keyof typeof statusColors] || statusColors.paid;
  const showPaymentStatus = status !== 'ready' && status !== 'claimed';

  return (
    <View style={[styles.card, { borderLeftColor: colors.border, backgroundColor: colors.bg }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>📋 {document.transactionDetails}</Text>
          <Text style={styles.cardSubtitle}>{document.purpose || 'No purpose specified'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: colors.border }]}>
          <Text style={styles.statusBadgeText}>
            {status === 'claimed' ? 'Claimed' : status === 'ready' ? 'Ready' : document.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Copies</Text>
          <Text style={styles.gridValue}>{document.copies}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Fee</Text>
          <Text style={[styles.gridValue, { color: colors.text, fontWeight: '700' }]}>
            ₱{(parseFloat(document.fee) || 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Total</Text>
          <Text style={[styles.gridValue, { color: colors.text, fontWeight: '700' }]}>
            ₱{((parseFloat(document.fee) || 0) * (document.copies || 1)).toFixed(2)}
          </Text>
        </View>
      </View>

      {showPaymentStatus && (
        <View style={styles.cardFooter}>
          <Text style={styles.paymentLabel}>Payment Status:</Text>
          <View style={[
            styles.paymentStatusBadge,
            { backgroundColor: document.paymentStatus?.toLowerCase() === 'paid' ? '#e8f5e9' : '#ffe3e3' }
          ]}>
            <Text style={[
              styles.paymentStatusText,
              { color: document.paymentStatus?.toLowerCase() === 'paid' ? '#19AF5B' : '#FF6B6B' }
            ]}>
              {document.paymentStatus?.toLowerCase() === 'paid' ? '✅ PAID' : '❌ UNPAID'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ✅ PAYMENT CARD COMPONENT
function PaymentCard({ payment, status }: { payment: any; status: string }) {
  const statusColors = {
    unpaid: { bg: '#fff', border: '#FF6B6B', text: '#FF6B6B' },
    paid: { bg: '#f0fdf4', border: '#19AF5B', text: '#19AF5B' },
    cancelled: { bg: '#ffebee', border: '#d32f2f', text: '#d32f2f' },
  };

  const colors = statusColors[status as keyof typeof statusColors] || statusColors.paid;
  const showPaymentStatus = status !== 'ready' && status !== 'claimed';

  return (
    <View style={[styles.card, { borderLeftColor: colors.border, backgroundColor: colors.bg }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>💰 {payment.transactionDetails || payment.PaymentFees || 'Payment'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: colors.border }]}>
          <Text style={styles.statusBadgeText}>{payment.status}</Text>
        </View>
      </View>

      <View style={styles.cardGrid}>
        <View style={[styles.gridItem, { flex: 1 }]}>
          <Text style={styles.gridLabel}>Amount</Text>
          <Text style={[styles.gridValue, { color: colors.text, fontWeight: '700' }]}>
            ₱{(parseFloat(payment.fee || payment.Price) || 0).toFixed(2)}
          </Text>
        </View>
      </View>

      {showPaymentStatus && (
        <View style={styles.cardFooter}>
          <Text style={styles.paymentLabel}>Payment Status:</Text>
          <View style={[
            styles.paymentStatusBadge,
            { backgroundColor: payment.paymentStatus?.toLowerCase() === 'paid' ? '#e8f5e9' : '#ffe3e3' }
          ]}>
            <Text style={[
              styles.paymentStatusText,
              { color: payment.paymentStatus?.toLowerCase() === 'paid' ? '#19AF5B' : '#FF6B6B' }
            ]}>
              {payment.paymentStatus?.toLowerCase() === 'paid' ? '✅ PAID' : '❌ UNPAID'}
            </Text>
          </View>
        </View>
      )}
    </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  },

  // ✅ AUTO-NAVIGATE BANNER
  autoNavigateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#19AF5B',
  },
  autoNavigateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#19AF5B',
    flex: 1,
  },

  qrContainer: {
    marginBottom: 24,
  },
  qrContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  qrStatusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19AF5B',
    marginBottom: 16,
  },
  qrCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginTop: 16,
  },
  qrCodeLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  qrStatus: {
    fontSize: 12,
    color: '#19AF5B',
    marginTop: 12,
    fontWeight: '600',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 600,
  },
  loadingContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  loadingSpinner: {
    marginBottom: 24,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 40,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  statusIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  codeContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#19AF5B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  code: {
    fontSize: 18,
    fontWeight: '700',
    color: '#19AF5B',
    letterSpacing: 1,
  },
  tipContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbea',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    lineHeight: 18,
  },

  queueNumberCard: {
    backgroundColor: '#19AF5B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  queueNumberContent: {
    alignItems: 'center',
  },
  queueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  queueNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff',
    marginVertical: 8,
    letterSpacing: 2,
  },
  queueInfoRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
    width: '100%',
  },
  queueInfoItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  queueStatusItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  queueInfoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  queueInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  queueDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#19AF5B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },

  statusIndicator: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#2196f3',
  },
  statusIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
    textAlign: 'center',
  },

  alertBanner: {
    marginBottom: 16,
  },
  alertBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
  },
  alertIcon: {
    fontSize: 28,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 12,
    color: '#666',
  },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2196f3',
    marginBottom: 12,
  },
  summaryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryItemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  summaryItemValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryItemCount: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },

  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  badge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'capitalize',
  },

  cardGrid: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  paymentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  paymentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  paymentStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#999',
  },
});