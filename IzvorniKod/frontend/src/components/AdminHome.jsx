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
        /*napraviti admin-dashboard, na njemu omoguciti prikaz svih prijava i izmjena slika
        napraviti u controlleru,restu i serviceu da se prikazu svi koji su pending,
        klikom na gumb nestaje sa tablice i tjt
        prouci za sta je rest, service razlika i tak to
        dodi do zakljucka kako se odreduje prvi admin jel to sam prvi lik koji se prijavi il ne
        onda preurediti usercontroller u vezi s tim
        vjv hardkod -  treba uvijek ostat u bazi
        zas se u h2 ne mijenja kad se u controlleru prijavi???
        takoder on moze usere koji su approveani staviti na admine
         */
    );
}

export default AdminHome;
