import { MdOutlineLeaderboard } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { SiReaddotcv } from "react-icons/si";
import { IoIosLogOut } from "react-icons/io";
import { GiSprint } from "react-icons/gi";
import { FaHistory } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { useDispatch } from "react-redux"
import { loginFalse } from "../../Redux/createAction"
import DashboardUser from "../DashboardUser";
import { BrowserRouter, Routes, Route, useNavigate, Navigate, Link } from "react-router-dom";
import History from "../DashboardAdmin";
import { Button, Checkbox, Form, Input, Flex, notification } from 'antd';
import Logo from "../../Assets/Logo.png"
import { Breadcrumb, Layout, Menu, theme, Image } from 'antd';
import CreateUser from "../CreateUser";
import CreateTeam from "../CreateTeam"
import CreateIncharge from "../CreateIncharge";
import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import PrivateLayoutAdmin from "../PrivateLayoutAdmin";
const { Header, Content, Footer, Sider } = Layout;

const PrivateLayoutMember = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Layout>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <>
                        <Routes>
                            <Route path="/" element={<DashboardUser />} />
                            <Route path="/dashboard" element={<DashboardUser />} />
                            <Route path="/tasktracker" element={<DashboardUser />} />
                            <Route path="/*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </>
                </Content>
            </Layout>
        </Layout>
    );
};
export default PrivateLayoutMember;