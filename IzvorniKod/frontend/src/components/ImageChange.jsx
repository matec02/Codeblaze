import React, {useCallback, useEffect, useState} from "react";
import ImageNotFound from "../assets/ImageNotFound.png";
import {Link} from "react-router-dom";
import {handleImagePathChange} from "./ScooterCard";

export const fetchRequests = async (url, setState) => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
            setState([]); // Explicitly handle no content scenario
            return; // Exit the function early
        }

        if (!response.ok) {
            throw new Error(`Error in AdminDashboard: ${response.status}`);
        }
        const data = await response.json();
        setState(data); // Setting the state with the fetched data

    } catch (error) {
        console.error("Failed to fetch requests: ", error);
    }
};

function ImageChange(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageSrc, setCurrentImageSrc] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);

    const openModal = useCallback((imageSrc) => {
        setCurrentImageSrc(imageSrc);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);




    useEffect(() => {
        fetchRequests("api/imageChangeRequest/pendingRequests", setPendingRequests);
        fetchRequests("api/imageChangeRequest/approvedRequests", setApprovedRequests);
        fetchRequests("api/imageChangeRequest/rejectedRequests", setRejectedRequests);
    }, []);

    const ImageModal = ({ isOpen, onClose, imageSrc, altText }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="image-container">
                        <img src={imageSrc} alt={altText} />
                    </div>
                    <div className="modal-close-btn-container">
                        <button className="modal-close-button" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    const ReasonModal = ({ isOpen, onClose, onSubmit }) => {
        const [reason, setReason] = useState('');

        const handleSubmit = () => {
            onSubmit(reason); // Pass the reason back to the caller
            onClose(); // Close the modal
        };

        return (
            isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '80%', padding: '20px', margin: 'auto' }}>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter the reason for your decision"
                        style={{ width: '90%', height: '200px', fontSize: '16px', padding: '10px' }}
                    />
                        <div className="action-buttons">
                        <button className="approve" onClick={handleSubmit}>Submit</button>
                        <button className="reject" onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            )
        );
    };


    const handleAdminDecision = async (requestId, reason, requestStatus, oldImageUrl) => {
        try {
            const formDataAdminDecision = new FormData();
            const currentDateTime = new Date();
            const dateTimeString = currentDateTime.toISOString();

            formDataAdminDecision.append('decisionTime', dateTimeString);
            formDataAdminDecision.append('reason', new Blob([JSON.stringify(reason)], { type: "application/json" }));
            formDataAdminDecision.append('newStatus', new Blob([JSON.stringify(requestStatus)], { type: "application/json" }));
            formDataAdminDecision.append('requestId', new Blob([JSON.stringify(requestId)], { type: "application/json" }));

            const response = await fetch (`api/imageChangeRequest/adminDecision`, {
                method: 'PUT',
                body: formDataAdminDecision
            });

            if (!response.ok) {
                throw new Error('Failed to put admin decision')
            }

            if (requestStatus==='REJECTED') {
                //TODO kad se dobije listingId preko njega dobavati scooterId i staviti umjesto 1
                await handleImagePathChange(1, oldImageUrl);
                await fetchRequests("api/imageChangeRequest/rejectedRequests", setRejectedRequests);
                await fetchRequests("api/imageChangeRequest/pendingRequests", setPendingRequests);
            } else if (requestStatus==='APPROVED') {
                await fetchRequests("api/imageChangeRequest/approvedRequests", setApprovedRequests);
                await fetchRequests("api/imageChangeRequest/pendingRequests", setPendingRequests);
            }

        } catch (error) {
            console.error("Failed to get admin decision: ", error)
        }
    }



    const handleRequestAction = (requestId, requestStatus, oldImageUrl) => {
        console.log("Opening Reason Modal");
        setIsReasonModalOpen(true);
        setCurrentRequest({ requestId, requestStatus, oldImageUrl });  // Save the request details
    };

    const handleReasonSubmit = (reason) => {
        if (currentRequest) { // Make sure currentRequest isn't null
            handleAdminDecision(currentRequest.requestId, reason, currentRequest.requestStatus, currentRequest.oldImageUrl);
            setIsReasonModalOpen(false); // Close the modal after submission
        } else {
            // Handle the error or unexpected case where currentRequest isn't set
        }
    };

    const RequestTable = ({requests, category, renderActions, id}) => {
        return (
            <div id={id}>
                <h3>{category}</h3>
                {requests.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Listing ID</th>
                            <th>Complaint Time</th>
                            {(category === "Prihvaćeni zahtjevi za zamjenu slike") && <th>Approval Time</th>}
                            {(category === "Odbijeni zahtjevi za zamjenu slike") && <th>Rejection Time</th>}
                            <th>Old photo</th>
                            <th>New photo</th>
                            <th>Requester Nickname</th>
                            <th>Additional Comments</th>
                            {(renderActions && category === "Zahtjevi za zamjenu slike na čekanju") && <th>Actions</th>}
                            {(category === "Prihvaćeni zahtjevi za zamjenu slike" || category === "Odbijeni zahtjevi za zamjenu slike")
                                && <th>Decision Comment</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {[...requests].reverse().map((request) => {
                            // Convert the complaint time to a Date object
                            const complaintDate = new Date(request.complaintTime);
                            const options = {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false // Use a 24-hour clock
                            };
                            const complaintTimeString = complaintDate.toLocaleString('en-GB', options);
                            let decisionTimeString = '';
                            if (request.approvalTime){
                                const decisionDate = new Date(request.approvalTime);
                                decisionTimeString = decisionDate.toLocaleString('en-GB', options);
                            }
                            return (
                                <tr key={request.imageId}>
                                    <td>{request.listingId}</td>
                                    <td>{complaintTimeString}</td>
                                    {(category === "Prihvaćeni zahtjevi za zamjenu slike") && <td>{decisionTimeString}</td>}
                                    {(category === "Odbijeni zahtjevi za zamjenu slike") && <td>{decisionTimeString}</td>}
                                    <td className="user-table-action-buttons">
                                        <button className="user-table-button" onClick={() => openModal(request.oldImageUrl || ImageNotFound)}>Show Old Image</button>
                                    </td>
                                    <td className="user-table-action-buttons">
                                        <button className="user-table-button" onClick={() => openModal(request.newImageUrl || ImageNotFound)}>Show New Image</button>
                                    </td>
                                    <td>{request.user.nickname}</td>
                                    <td>{request.additionalComments}</td>
                                    {(renderActions && category === "Zahtjevi za zamjenu slike na čekanju") &&
                                    <td className="action-buttons">{renderActions && renderActions(request)}
                                    </td>}
                                    {(category === "Prihvaćeni zahtjevi za zamjenu slike" || category === "Odbijeni zahtjevi za zamjenu slike")
                                        && <td>{request.rejectionReason}</td>}

                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                ) : (
                    <p>Nema {category.toLowerCase()}.</p>
                )}
            </div>
        );
    };

    const renderPendingRequests = (request) => (
        <>
            <button className="approve" onClick={() => handleRequestAction(request.imageId, 'APPROVED', request.oldImageUrl)}>Prihvati</button>
            <button className="reject" onClick={() => handleRequestAction(request.imageId, 'REJECTED', request.oldImageUrl)}>Odbij</button>
        </>
    );


    return (
        <div>
            <h1>PANEL ZA ADMINA - ZAHTJEVI ZA ZAMJENU SLIKE</h1>
            <div className="adminNavBar">
                <a href="#pendingRequests">Zahtjevi na čekanju ({pendingRequests.length})</a>
                <a href="#acceptedRequests">Prihvaćeni zahtejvi</a>
                <a href="#rejectedRequests">Odbijeni zahtjevi</a>
                <Link to="/admin-dashboard">Povratak na admin dashboard</Link>
            </div>
            <>
                <RequestTable requests={pendingRequests} category="Zahtjevi za zamjenu slike na čekanju" renderActions={renderPendingRequests} id="pendingRequests"/>
                <RequestTable requests={approvedRequests} category="Prihvaćeni zahtjevi za zamjenu slike" id="acceptedRequests"/>
                <RequestTable requests={rejectedRequests} category="Odbijeni zahtjevi za zamjenu slike" id="rejectedRequests"/>
            </>
            <ImageModal
                isOpen={isModalOpen}
                onClose={closeModal}
                imageSrc={currentImageSrc}
                altText="Document Image"
            />
            <ReasonModal
                isOpen={isReasonModalOpen}
                onClose={() => setIsReasonModalOpen(false)}
                onSubmit={handleReasonSubmit}
            />
        </div>
    );

}

export default ImageChange;