import {Navigate, useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {getTransactionById} from "../utils/TransactionUtils";
import {getNicknameFromToken} from "./MyProfile";

const ProtectReview = ({ children }) => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const [isAllowed, setIsAllowed] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const currentNickname = await getNicknameFromToken();
                const transaction = await getTransactionById(transactionId);
                if (transaction && transaction.client.nickname === currentNickname) {
                    setIsAllowed(false);
                }

                const response = await fetch(`/api/reviews/review-exists-for-transaction/${transactionId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const reviewExists = await response.json();

                if (reviewExists) {
                    setIsAllowed(false);
                }
            } catch (error) {
                console.error("Error", error);
            }
        };
        checkAccess();
    }, [transactionId, navigate]);

    useEffect(() => {
        if (!isAllowed) {
            navigate('/not-allowed-review');
        }
    }, [isAllowed, navigate]);

    if (!isAllowed) {
        return <div className="spinner"></div>;
    }

    return children;
};

export default ProtectReview;