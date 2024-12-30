import { Link } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Select, Checkbox, Radio, Row, Col, Form, Input, Flex, notification } from 'antd';
import axios from 'axios';
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { loginFalse } from '../../Redux/createAction'

export default function CreateIncharge() {
    const AdminName = useSelector((obj) => `${obj.token.FirstName} ${obj.token.LastName}`)
    const { form } = Form.useForm();
    const redirect = useNavigate()
    const onSubmit = async (values) => {
        values.AdminName = AdminName;
        const response = await axios.post("http://localhost:8080/admin/create/incharge", values)
        if (response.data.success) {
            notification.success({
                message: 'Success',
                description: `${response.data.message}`,
            });
        }
        else {
            notification.error({
                message: 'Error',
                description: `${response.data.message}`,
            });
        }

    };
    const onFinishFailed = (errorInfo) => {
        notification.error({
            message: 'Error',
            description: `${errorInfo}`,
        });
    };
    return (
        <>
            <Form
                name="register"
                layout="vertical"
                method="post"
                style={{
                    backgroundColor:"aliceblue",
                    minHeight:"88vh"
                }}
                initialValues={{
                    remember: true,
                }}

                onFinish={(values) => onSubmit(values)}>
                <Col span={24}>
                <h1 className="REGISTER">
                    Create Incharge
                </h1>
                    <Form.Item
                        name="InchargeName"
                        label="Incharge name"
                        form={form}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Incharge name!',
                            },
                            {
                                pattern: /^[a-zA-Z\s]+$/,
                                message: 'Please Enter valid Incharge Name !',
                            },

                        ]}
                    >

                        <Input size='large' label="Incharge Name" name="InchargeName" placeholder="Enter Incharge Name" />
                    </Form.Item>
                    <Col span={24}>
                        <Form.Item
                            name="Email"
                            label="Email"

                            rules={[
                                { required: true, message: 'Please Enter Incharge Email !' },
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