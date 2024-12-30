import { MdOutlineLeaderboard } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { SiReaddotcv } from "react-icons/si";
import { IoIosLogOut } from "react-icons/io";
import { GiSprint } from "react-icons/gi";
import { FaHistory } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { useDispatch } from "react-redux"
import { loginFalse } from "../../Redux/createAction"
import DashboardAdmin from "../DashboardAdmin";
import { BrowserRouter, Routes, Route,useNavigate,Navigate,Link } from "react-router-dom";
import History from "../DashboardAdmin";
import React from 'react';
import { Button, Checkbox, Form, Input, Flex,notification } from 'antd';
import Logo from "../../Assets/Logo.png"
import { Breadcrumb, Layout, Menu, theme,Image } from 'antd';
import CreateUser from "../CreateUser";
import CreateTeam from "../CreateTeam"
import CreateIncharge from "../CreateIncharge";
const { Header, Content, Footer } = Layout;

export default function PrivateLayoutAdmin() {
    const redirect =useNavigate()
    const dispatch = useDispatch()
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor:"skyblue",
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <img src={Logo} className="d-flex" width={70} alt="Logo" />
                <Menu
                    mode="horizontal"
                    onClick={(value)=>{
                        redirect(value.key)
                    }}
                    defaultSelectedKeys={'/dashboard'}
                    selectedKeys={window.location.pathname}
                    items={[
                        {
                            key: '/dashboard',
                            icon: <FiGrid />,
                            label: 'Admin Dashboard',
                        },
                        {
                            key: '/create/user',
                            icon:<IoMdPersonAdd />,
                            label: 'Add Member',
                        },
                        {
                            key: '/create/team',
                            icon: <SiReaddotcv />,
                            label: 'Add Team',
                        },
                        {
                            key: '/create/incharge',
                            icon: <MdOutlineLeaderboard />,
                            label: 'Add Incharge',
                        },

                    ]}
                    style={{
                        flex: 1,
                        backgroundColor:"skyBlue",
                        minWidth: 0,
                    }}
                    
                />
                <Link to="/"><Button type="info" onClick={()=>{dispatch(loginFalse())}}><IoIosLogOut /></Button></Link>
            </Header>
            <Content>
                <div

                >
                    <>
                        <Routes>
                            <Route path="/" element={<DashboardAdmin />} />
                            <Route path="/dashboard" element={<DashboardAdmin />} />
                            <Route path="/create/user" element={<CreateUser />} />
                            <Route path="/create/team" element={<CreateTeam />} />
                            <Route path="/create/incharge" element={<CreateIncharge />} />
                            <Route path="/*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </>
                </div>
            </Content>
        </Layout>
    )
}
