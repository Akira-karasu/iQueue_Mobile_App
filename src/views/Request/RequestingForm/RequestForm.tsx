import OfficeButton from '@/src/components/buttons/OfficeButton'
import Card from '@/src/components/cards/Card'
import StepBar from '@/src/components/layout/stepBar'
import ViewScroller from '@/src/components/scroller/ViewScroller'
import { useRequest } from '@/src/hooks/appTabHooks/useRequest'
import React from 'react'
import { Text, View } from 'react-native'
import AccountingOfficeForm from './AccountingOfficeForm'
import RegistrarOfficeForm from './RegistrarOfficeForm'
import styles from './RequestFormStyle'
import Documents from './documents.'
import SelectedPaymentList from './selectedpaymentList'

export type RequestFormProps = {
    setSteps: React.Dispatch<React.SetStateAction<number>>
    step: number
}

function RequestForm ({setSteps, step} : RequestFormProps) {

    const {
        office,
        setOffice,
        RegistrarRequestList,
        AccountingRequestList,
        setRegistrarRequestList,
        
    } = useRequest();

    return(
        <ViewScroller
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >

        <>
            {office === '' && (
            <>
            <StepBar
                start={step}
                end={2}
                title="Request Transaction"
                display={true}
                onBack={() => setSteps(2)}
            />
            <View style={styles.mainContainer}>
            <Card padding={25}>
                <Text style={styles.TextTitle}>School Offices</Text>
                <Text style={styles.TextSubTitle}>
                    Choose offices to make a request transaction
                </Text>
            
                <OfficeButton
                    label="Registrar Office"
                    active={RegistrarRequestList.requestList.length > 0}
                    onPress={() => setOffice('Registrar Office')}
                />
                <OfficeButton
                    label="Accounting Office"
                    active={AccountingRequestList.requestList.length > 0}
                    onPress={() => setOffice('Accounting Office')}
                />
            </Card>
                {
                    RegistrarRequestList.requestList.length > 0 && (
                        <Documents
                            title="Registrar Office | Request Documents"
                            documents={RegistrarRequestList}
                            setRegistrarRequestList={setRegistrarRequestList}
                        />
                    )
                }
                {
                    AccountingRequestList.requestList.length > 0 && (
                        <SelectedPaymentList />
                    )
                }
            </View>
            </>
            )}

            {office === 'Registrar Office' && (
            <>
            <StepBar
                start={step}
                end={3}
                title="Registrar Office"
                display={true}
                onBack={() => setOffice('')}
            />
            <View style={styles.mainContainer}>
                <RegistrarOfficeForm />
            </View>
            </>
            )}

            {office === 'Accounting Office' && (
            <>
            <StepBar
                start={step}
                end={3}
                title="Accounting Office"
                display={true}
                onBack={() => setOffice('')}
            />
            <AccountingOfficeForm title='Request Payment Fees' />
            </>
            )}
        </>
        </ViewScroller>

    )
}

export default React.memo(RequestForm)