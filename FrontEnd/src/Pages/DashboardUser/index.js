import { GiSprint } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import { Link,useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { loginFalse } from "../../Redux/createAction"
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import TaskTracker from '../TaskTracker';
import { Button, Select, Checkbox, Row, Col, Form, Input, Flex, notification, Modal, Collapse } from 'antd';
const { TextArea } = Input


const DashboardUser: React.FC = () => {
    const redirect = useNavigate();
    const [tasks, setTasks] = useState("")
    const token = useSelector(obj => obj.token)
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [memberChoice, setMemberChoice] = useState()
    const [teamChoice, setTeamChoice] = useState()
    const dispatch = useDispatch()
    const [editing, setEditing] = useState(false)
    const [userForm] = Form.useForm();
    const [teams, setTeams] = useState([])
    const [editForm] = Form.useForm();
    const [members, setMembers] = useState()
    const [open, setOpen] = useState(false);



    const showModal = () => {

        setOpen(true);
    };
    useEffect(() => {
        (async()=>{
            await (axios.get(`http://localhost:8080/member/get/allteammembers/${token.AdminName}/${token.TeamName}/${token.InchargeName}`)).then((data) => {
                setMembers(data?.data?.incharge_data?.TeamMembers);
    
            }).catch((error) => {
                notification.error({
                    message: 'Success',
                    description: `${error.data.incharge_data}`,
                });
    
            })
        })()

    }, [])
    
    const retrieve = async () => {
        (axios.get(`http://localhost:8080/member/get/allteammembers/${token.AdminName}/${token.TeamName}/${token.InchargeName}`)).then((data) => {
            setMembers(data.data.incharge_data.TeamMembers);

        }).catch((error) => {
            notification.error({
                message: 'Success',
                description: `${error.data.incharge_data}`,
            });

        })
    }

    const onSubmit = async (data) => {
        data.TeamDetails = await token;
        const response = await axios.post("http://localhost:8080/member/add/task", data)
        if (response.data.success) {
            notification.success({
                message: 'Success',
                description: `${response.data.message}`,
            });
            await redirect("/dashboard")
            await userForm.resetFields();
            await setOpen(false);
            await setConfirmLoading(false);
            
        }
        else {
            response.send("Failure");
        }

    }

    const handleCancel = () => {
        setOpen(false);
    };
    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            // setConfirmLoading(false);
        }, 2000);
    };

    useEffect(() => {
        (async () => {
            const response = await axios.get("http://localhost:8080/member/get/teammembers");
            await response.data.incharge_data.filter(async (data) => {
                if (data.AdminName === token.AdminName && data.TeamName === token.TeamName) {
                    await response.data.incharge_data.filter(async (data) => {
                        if (data.AdminName === token.AdminName && data.TeamName === token.TeamName) {
                            await setMemberChoice(data.TeamMembers);
                            const temp = (data.TeamMembers).map(tempValue => {
                                return ({ value: tempValue.Email, label: tempValue.MemberName })
                            })
                            setTeams(temp)
                        }
                    })
                }
            })
        })();
    }, [])

    return (
        <>
            <div style={{
                backgroundColor: "aliceblue",
                minHeight: "100vh"
            }}>
                <Row justify={'space-between'}>
                    <Col style={{
                        padding: "15px",
                    }}>
                        <Button style={{
                            // marginLeft: "10px",
                        }}
                            value={teams}
                            color="primary" variant="outlined" onClick={showModal}>
                            Add Sprint
                        </Button></Col>
                    <Col style={{
                        padding: "15px",
                    }}>
                        <Link to="/"><Button color="primary" size="default" variant="outlined" onClick={() => { dispatch(loginFalse()) }}><IoIosLogOut /> Logout</Button></Link></Col>
                </Row>

                {
                    members?.map(data => {
                        return <Collapse
                            size="large"
                            style={{
                                margin: "15px",
                            }}
                            items={[
                                {
                                    key: '1',
                                    label: (data.MemberName === token.MemberName) ? `${data.MemberName} (you)` : `${data.MemberName}`,
                                    children: <TaskTracker TeamDetails={token} memberData={data} />,
                                },
                            ]}
                        />
                    })
                }

                <Modal
                    title={(editing) ? "Edit Ticket" : "Add Task"}
                    open={open}
                    onOk={handleOk}
                    // confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    footer={null}
                >
                    {(editing) ? <>
                        <Form
                            name="register"
                            layout="vertical"
                            form={editForm}
                            method="post"
                            style={{
                                backgroundColor: "aliceblue",
                                padding: "5vh",
                                minHeight: "50vh"
                            }}
                            initialValues={{
                                remember: true,
                            }}

                            onFinish={(values) => onEdit(values, editing)}>
                            <Form.Item
                                name="TaskId"
                                label="Task Id"
                            >

                                <Input size='large' disabled label="Task Name" name="TaskName" placeholder="Enter Task Name" />
                            </Form.Item>
                            <Form.Item
                                name="TaskName"
                                label="Task Name"
                            >

                                <Input size='large' label="Task Name" name="TaskName" placeholder="Enter Task Name" />
                            </Form.Item>
                            <Form.Item
                                name="TaskDescription"
                                label="Task Description"
                            >

                                <TextArea rows={4} size='large' label="Task Description" name="TaskDescription" placeholder="Enter Task Description here..." />
                            </Form.Item>
                            <Col span={8}>
                                <Form.Item>
                                    <Button size="large" className="loginBtn" type="primary" block htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Form>
                    </> : <>
                        <Form
                            name="register"
                            layout="vertical"
                            form={userForm}
                            method="post"
                            style={{
                                backgroundColor: "aliceblue",
                                padding: "5vh",
                                minHeight: "50vh"
                            }}
                            initialValues={{
                                remember: true,
                            }}

                            onFinish={(values) => onSubmit(values)}>
                            <Form.Item
                                name="MemberName"
                                label="Member Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please Select Member Name!',
                                    },
                                ]}
                            >
                                <Select
                                    size="large"
                                    defaultValue="---"
                                    onChange={(e) => {
                                        setTeamChoice(e)
                                    }}
                                    options={(teams)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="TaskName"
                                label="Task Name"
                                rules={[
                                    {
                                        required: true,
                                        message: `Please input the Task Name!`,
                                    }

                                ]}
                            >

                                <Input size='large' label="Task Name" name="TaskName" placeholder="Enter Task Name" />
                            </Form.Item>
                            <Form.Item
                                name="TaskDescription"
                                label="Task Description"
                                rules={[
                                    {
                                        required: true,
                                        message: `Please input the Task Description!`,
                                    }

                                ]}
                            >

                                <TextArea rows={4} size='large' label="Task Description" name="TaskDescription" placeholder="Enter Task Description here..." />
                            </Form.Item>
                            <Col span={8}>
                                <Form.Item>
                                    <Button size="large" className="loginBtn" type="primary" block htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Form>
                    </>}
                </Modal>
            </div>
        </>
    );
};

export default DashboardUser;