export const getTransactionsByOwnerUserId = async (userId) => {
    try {
        const response = await fetch(`/api/transactions/owner/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return null; // or handle the error as needed
    }
};

export const getTransactionById = async (transactionId) => {
    try {
        const response = await fetch(`/api/transactions/get-by-id/${transactionId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching transaction:', error);
        // Handle the error appropriately in your application
        return null;
    }
};