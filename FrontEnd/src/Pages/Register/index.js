import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Select, Checkbox, Form, Input, Flex } from 'antd';
import { Row, Col, notification } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Register() {
  const { form } = useForm();
  const redirect = useNavigate()
  const onSubmit = async (values) => {
    const response = await axios.post("http://localhost:8080/register", values)
    if (response.data.success) {
      notification.success({
        message: 'Success',
        description: 'Registered Successfully.',
      });
      setTimeout(() => { redirect("/") }, 300);
    }
    else {
      notification.error({
        message: 'Error',
        description:`Email is used by someone else.`,
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
      <Row className="registerRow" justify="center" align="middle">
        <Col span={24}>
          <Row justify="center" className="registerBody">
            <Col span={20} className="register">
              <Row justify="center">
                <Col span={14}>
                  <h1 className="REGISTER">
                    ADMIN REGISTER (for Admin users only)
                  </h1>
                  <Form
                    name="register"
                    layout="vertical"
                    method="post"
                    initialValues={{
                      remember: true,
                    }}

                    onFinish={(values) => onSubmit(values)}>
                    <Col span={24}>
                      <Form.Item
                        name="FirstName"
                        label="Firstname"
                        form={form}
                        rules={[
                          {
                            required: true,
                            message: 'Please input your First name!',
                          },
                          {
                            pattern: /^[a-zA-Z\s]+$/,
                            message: 'Please Enter valid First Name !',
                          },

                        ]}
                      >

                        <Input size='large' label="FirstName" name="FirstName" placeholder="Enter First Name" />
                      </Form.Item>
                      <Col span={24}>
                        <Form.Item
                          name="LastName"
                          label="Lastname"
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter your Last name!',
                            },
                            {
                              pattern: /^[a-zA-Z\s]+$/,
                              message: 'Please Enter valid last Name !',
                            },
                          ]}
                        >
                          <Input size='large' label="LastName" placeholder="Enter Lastname" />
                        </Form.Item>
                      </Col>

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
                        <Form.Item
                          name="Confirm Password"
                          label="Confirm Password"
                          rules={[{ required: true, message: 'Please verify your password' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('Password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                          }),
                          ]}>
                          <Input.Password size="large"
                            placeholder="Enter Confirm password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          name="Role"
                          label="Role"
                          rules={[
                            {
                              required: true,
                              message: 'Please Enter Your Role!',
                            },
                          ]}
                          style={{
                            width: 300
                          }}
                        >
                          <Select
                            size="large"
                            style={{ width: 280 }}
                            defaultValue="---"
                            options={[
                              { value: 'Admin', label: 'Admin' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item>
                          <Button size="large" className="loginBtn" type="primary" block htmlType="submit">
                            Submit
                          </Button>

                        </Form.Item>
                        <p className="alreadyHaveAccount">Already have an account? <Link to="/">sign in</Link></p>

                      </Col>
                    </Col>

                  </Form>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}