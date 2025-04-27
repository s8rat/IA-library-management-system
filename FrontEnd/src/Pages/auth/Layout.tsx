import { Outlet } from "react-router";
// import Navbar from "../components/Navbar";

const AuthLayout = () => {
    return (
        <>
            {/* <Navbar /> */}
            <Outlet /> 
        </>
    );
}
 
export default AuthLayout;