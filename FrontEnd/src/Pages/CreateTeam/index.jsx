import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import { Button, Select, Checkbox, Radio, Row, Col, Form, Input, Flex, notification } from 'antd';
import axios from 'axios';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { loginFalse } from '../../Redux/createAction'

export default function CreateTeam() {
    const [incharges, setIncharges] = useState([]);
    const AdminName = useSelector((obj) => `${obj.token.FirstName} ${obj.token.LastName}`)
    const { form } = Form.useForm();
    const redirect = useNavigate()
    const onSubmit = async (values) => {
        values.AdminName = AdminName
        const response = await axios.post("http://localhost:8080/admin/create/team", values)
        if (response.data.success) {
            notification.success({
                message: 'Success',
                description: `${response.data.message}`,
            });
        }
        else {
            notification.error({
                message: 'Error',
                description: `Team Name already in Use...`,
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
            const response = await axios.get("http://localhost:8080/admin/get/incharge")
            if (response.data.incharge_data) {
                const temp = await response.data.incharge_data.filter(tempValue => (tempValue.AdminName === AdminName))
                setIncharges([])
                const tempIncharges = await temp.map(tempValue => {
                    if (tempValue.AdminName === AdminName) {
                        return ({ value: tempValue.InchargeName, label: tempValue.InchargeName })
                    }
                })
                await setIncharges(tempIncharges);
            }
        })()
    }, []);

    return (
        <>
            
            <Form
                name="register"
                layout="vertical"
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
                CREATE TEAM
            </h1>
                    <Form.Item
                        name="TeamName"
                        label="Team Name"
                        form={form}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Team name!',
                            },
                            {
                                pattern: /^[a-zA-Z\s]+$/,
                                message: 'Please Enter valid Team Name(only albhabets) !',
                            },

                        ]}
                    >

                        <Input size='large' label="FirstName" name="FirstName" placeholder="Enter First Name" />
                    </Form.Item>
                    <Col span={24}>
                        {
                            (incharges[0]) ? <>
                                <Form.Item
                                    name="InchargeName"
                                    label="Incharge Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Select Incharge Name!',
                                        },
                                    ]}
                                >
                                    <Select
                                        size="large"
                                        defaultValue="---"
                                        options={(incharges)}
                                    />
                                </Form.Item>
                            </> : <p style={{color:"red"}}>***No Incharges Right Now. Please add Incharges to create Team***</p>
                        }
                    </Col>
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