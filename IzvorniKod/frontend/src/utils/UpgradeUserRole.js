export const upgradeUserRole = async (userId) => {
    try {
        const upgradeResponse = await fetch(`/api/users/upgrade-role/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
        });

        if (upgradeResponse.ok) {
            return await upgradeResponse.json();
        } else {
            console.error('Failed to upgrade user role:', upgradeResponse.statusText);
            return null;
        }
    } catch (error) {
        console.error('An error occurred while upgrading user role:', error);
        return null;
    }
};
