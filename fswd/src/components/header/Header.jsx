import "./header.css";
import { Link } from 'react-router-dom';

export const Header = ({ isAuth, user }) => {
  return (

    <header>
        <div className="logo"> Virtual-Internship </div>


        <div className="link">

            < Link to={'/'}>Home</Link>
            <Link  to={'/courses'}>Courses</Link>
            <Link  to={'/about'}>About</Link>
            {isAuth && user?.role === "admin" && (
              <Link to={"/admin/dashboard"}>Dashboard</Link>
            )}
            {isAuth ?(

              < Link to={"/account"}>Account</Link>
            ):(

              <Link to={'/login'}>Login</Link>

            )

            }



        </div>

    </header>
  );
  
};

export default Header;


