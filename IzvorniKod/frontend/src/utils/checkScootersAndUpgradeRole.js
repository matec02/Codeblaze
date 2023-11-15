import { upgradeUserRole } from "../utils/UpgradeUserRole"

export const checkScootersAndUpgrade = async (ownerId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/scooters/owner/${ownerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const scooters = await response.json();

        if (scooters.length === 1) {
            console.log("Exactly one scooter found for the owner.");
            const newToken = await upgradeUserRole(ownerId);
            if (newToken) {
                localStorage.setItem('authToken', newToken);
                console.log('User role upgraded and token refreshed');
                return { success: true, message: 'User role upgraded and token refreshed' };
            } else {
                console.error('Failed to upgrade user role or refresh token');
                return { success: false, message: 'Failed to upgrade user role or refresh token' };
            }
        } else {
            console.log("Owner does not have exactly one scooter.");
            return { success: false, message: 'Owner does not have exactly one scooter' };
        }
    } catch (error) {
        console.error("Failed to fetch scooters or process data: ", error);
        return { success: false, message: error.message };
    }
};
