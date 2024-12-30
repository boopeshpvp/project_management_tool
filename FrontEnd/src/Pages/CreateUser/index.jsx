import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Select, Checkbox, Radio, Row, Col, Form, Input, Flex, notification } from 'antd';
import axios from 'axios';
import { useState, useEffect } from "react"
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { loginFalse } from '../../Redux/createAction'

export default function CreateUser() {
    const [incharges, setIncharges] = useState([])
    const [teams, setTeams] = useState([])
    const [availableTeams,setAvailableTeams] = useState()
    const [teamChoice, setTeamChoice] = useState("")
    const AdminName = useSelector(obj => `${obj.token.FirstName} ${obj.token.LastName}`)
    const [userForm] = Form.useForm();
    const redirect = useNavigate()
    const onSubmit = async (values) => {
        values.AdminName = AdminName
        values.task ={
            backlog : [],
            inProgress : [],
            completed : []
        }
        const response = await axios.patch("http://localhost:8080/admin/create/member", values)
        if(response.data.success){
            notification.success({
                message: 'Success',
                description: `${response.data.message}`,
            });
        }
        else if(response.data.message === "Member is already a Member in Another Team"){
            notification.error({
                message: 'Error',
                description: `${response.data.message}`,
            });
        }
        else{            
            notification.error({
                message: 'Error',
                description: `Email ID already in use...`,
            });
        }
        

    };
    const onFinishFailed = (errorInfo) => {
       notification.error({
                message: 'Error',
                description: `${errorInfo}`,
            });
    };

    useEffect(() => {
        (async () => {
            const teamDetails = await axios.get("http://localhost:8080/admin/get/teamdetails")
            if (teamDetails.data.incharge_data) {
                const temp = await teamDetails.data.incharge_data.filter(tempValue => (tempValue.AdminName === AdminName))
                setAvailableTeams(teamDetails.data.incharge_data)
                setTeams([])
                const tempIncharges = await temp.map(tempValue => {
                    if (tempValue.AdminName === AdminName) {
                        return ({ value: tempValue.TeamName, label: tempValue.TeamName })
                    }
                })
                await setTeams(tempIncharges);

            }

        })()
    }, []);
    useEffect(() => {
        (async () => {
            const response = await axios.get("http://localhost:8080/admin/get/incharge")
            if (response.data.incharge_data) {
                const temp = await response.data.incharge_data.filter(tempValue => (tempValue.AdminName === AdminName))
                setIncharges([])   
                if(teamChoice!==""){
                const teamVerify  = availableTeams?.filter(data => (data.TeamName === teamChoice))
                const tempIncharges = await temp?.filter(tempValue => (tempValue?.AdminName === AdminName && tempValue?.InchargeName === teamVerify[0]?.InchargeName))
                await setIncharges(tempIncharges[0]?.InchargeName);
                }
            }
        })()

    }, [teamChoice])
    useEffect(() => {
        (async () => {
            userForm.setFieldsValue({
                InchargeName: incharges
            })
        })()

    }, [incharges])
   
    return (
        <>
            
            <Form
                name="register"
                layout="vertical"
                form={userForm}
                method="post"
                style={{
                    backgroundColor:"aliceblue",
                    minHeight:"82vh"
                }}
                initialValues={{
                    remember: true,
                }}

                onFinish={(values) => onSubmit(values)}>
                <Col span={24}>
                <h1 className="REGISTER">
                ADD MEMBER
            </h1>
                    <Form.Item
                        name="MemberName"
                        label="Member Name"
                        rules={[
                            {
                                required: true,
                                message: `Please input Member's name!`,
                            },
                            {
                                pattern: /^[a-zA-Z\s]+$/,
                                message: `Please Enter valid Team Member Name !`,
                            },

                        ]}
                    >

                        <Input size='large' label="Member Name" name="MemberName" placeholder="Enter Member's Name" />
                    </Form.Item>
                    <Col span={24}>
                        <Form.Item
                            name="Email"
                            label="Email"

                            rules={[
                                { required: true, message: 'Please Enter Your Email !' },
                                {
                                    pattern: /^[a-zA-Z0-9.{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                    message: 'Email is invalid'
                                },
                            ]}>
                            <Input size='large' label="Email" placeholder="Enter Email" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="Password"
                            label="Password"
                            rules={[{ required: true, message: 'Please add a password' },
                            {
                                min: 8, message: 'Password must have a minimum length of 8.Password should contain at least one lowercase letter, uppercase letter, number, and special character',
                                pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@!#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]).{8,}$/,

                            }]}
                        >
                            <Input.Password size="large"
                                placeholder="Enter Password"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        {
                            (teams[0]) ? <>
                                <Form.Item
                                    name="TeamName"
                                    label="Team Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Select Team Name!',
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        defaultValue="---"
                                        onChange={(e) => setTeamChoice(e)}
                                        options={(teams)}
                                    />
                                </Form.Item>
                            </> : <p style={{ color: "red" }}>***No Teams Right Now. Please add Teams to create Team***</p>
                        }
                    </Col>
                    <Form.Item
                        name="InchargeName"
                        label="Incharge Name"
                    >
                        <Select
                            size="large"
                            name="InchargeName"
                            label="Incharge Name"
                            defaultValue="---"
                            disabled
                        />
                    </Form.Item>
                    <Col span={2}>
                        <Form.Item>
                            <Button size="large" className="loginBtn" type="primary" block htmlType="submit">
                                Submit
                            </Button>

                        </Form.Item>
                    </Col>
                </Col>
            </Form>
        </>
    )
}