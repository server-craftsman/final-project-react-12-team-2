import React from 'react'
import PurchasesLog from '../../../components/admin/purchasesLog/PurchasesLog'
import SearchPurchaseLog from '../../../components/generic/search/SearchPurchaseLog'

const PurchasesLogManagement: React.FC = () => {
    return (
        <div>
            <SearchPurchaseLog />
            <PurchasesLog />
        </div>
    )
}

export default PurchasesLogManagement
