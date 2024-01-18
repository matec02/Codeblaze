export const getTransactionsByOwnerUserId = async (userId) => {
    try {
        const response = await fetch(`/api/transactions/owner/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return null;
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

        return null;
    }
};