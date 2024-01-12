function handleReviewPopUp(userId) {
    console.log("handleReviewPopUp");
}

function TransactionCard({transaction}) {
    const formatttedPaymentTime = transaction.paymentTime instanceof Date
            ? transaction.paymentTime.toLocaleString()
            : transaction.paymentTime;

    return (
        <div className={"transaction-card"} onClick={() => transaction.status === "UNSEEN" && handleReviewPopUp(transaction.client.userId)}>
            {/*unseen se moze kliknuti, otvara se obrazac za napisati review o transaction.client-u*/}
            <div className="transaction-details">
                <p><strong>Vlasnik:</strong> {transaction.owner.nickname} </p>
                <p><strong>Klijent:</strong> {transaction.client.nickname} </p>
                <p><strong>Iznos:</strong> {transaction.totalPrice} </p>
                <p><strong>Datum:</strong> {formatttedPaymentTime.split('T')[0]} </p>
            </div>
        </div>
    );
}
export default TransactionCard;
