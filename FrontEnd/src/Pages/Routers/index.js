import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Login";
import { useSelector } from "react-redux"
import Register from "../Register";
import Dashboard from "../CreateUser";
import PrivateLayoutAdmin from "../PrivateLayoutAdmin";
import PrivateLayoutMember from "../PrivateLayoutUser";

export default function RouterComponent() {
    const loginStatus = useSelector((data) => data.login)
    const Role = useSelector((data)=>data.token.Role)    
    return (
        <>
            <BrowserRouter>
                {
                    !loginStatus ? <>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/*" element={<Login />} />
                        </Routes>
                    </> : 
                        ((Role === "Admin") ? <PrivateLayoutAdmin/> : <PrivateLayoutMember />)
                }
            </BrowserRouter>
        </>
    )
}