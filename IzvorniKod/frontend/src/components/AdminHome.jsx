import {useNavigate} from 'react-router-dom';
import './AdminHome.css'
function AdminHome() {
    const navigate = useNavigate();

    return (
        <div className="admin-home-container">
            <h2>Odaberi opciju za administratora</h2>
            <div className="adminOptions">
                <button onClick={() => navigate("/")} className="backToHome">
                    POVRATAK NA POČETNU STRANICU
                </button>
                <button onClick={() => navigate('/admin-dashboard')} className="adminDashboard">
                    PANEL ZA ADMINA
                </button>
            </div>
        </div>
    );
}

export default AdminHome;
