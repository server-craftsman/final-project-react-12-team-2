import React, { useState } from 'react'

interface RequestPurchasesProps {
  onRequestComplete: () => void;
}

const RequestPurchases: React.FC<RequestPurchasesProps> = ({ onRequestComplete }) => {
    const [isRequesting, setIsRequesting] = useState(false)
    
    const handleRequestPurchases = async () => {
        setIsRequesting(true)
        try {
            // Simulating an API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Add your actual API call here
            onRequestComplete()
        } catch (error) {
            console.error('Error requesting purchases:', error)
        } finally {
            setIsRequesting(false)
        }
    }

    return (
        <button 
            className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 my-2 rounded-md' 
            onClick={handleRequestPurchases}
            disabled={isRequesting}
        >
            {isRequesting ? 'Requesting...' : 'Request Purchases'}
        </button>
    )
}

export default RequestPurchases
