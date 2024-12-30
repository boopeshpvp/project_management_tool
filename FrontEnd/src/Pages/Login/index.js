import { AiOutlineTeam } from "react-icons/ai";
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";
import { loginTrue, storeToken } from '../../Redux/createAction';
import { Button, Checkbox, Form, Input, Flex, notification } from 'antd';
import axios from 'axios';

export default function Login() {
  const [role, setRole] = useState("Admin");
  const dispatch = useDispatch()
  const onFinish = async (values) => {
    if (values.Role === "Admin") {
      const url = `http://localhost:8080/login/admin`
      axios
        .post(url, values)
        .then((response) => {
          notification.success({
            message: 'Success',
            description: 'Logged In Successfully.',
          });
          dispatch(loginTrue())
          dispatch(storeToken(response.data))
        })
        .catch((error) => {
          console.error(error)
          notification.error({
            message: 'Error',
            description: 'Invalid Credentials.',
          });
        });
    }
    else {
      const response = await axios.post("http://localhost:8080/login/Member", values).then((response) => {
        if (response.data.success) {
          notification.success({
            message: 'Success',
            description: 'Logged In Successfully.',
          });
          dispatch(loginTrue())
          dispatch(storeToken(response.data.data))
        }
        else {
          notification.error({
            message: 'Error',
            description: `Invalid Details`,
          });
        }
      }).catch((error) => {
        console.error(error)
        notification.error({
          message: 'Error',
          description: 'Invalid Credentials.',
        });
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
      <div className="loginContainer">
        <Form className="form"
          layout="vertical"
          name="login"
          initialValues={{
            remember: true,
          }}
          style={{
            maxWidth: 360,
          }}
          onFinish={onFinish}
        >
          <h1>LOGIN</h1>
          {
            (role === "Admin") ? <>
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
                <Input size='large' prefix={<UserOutlined />} label="Email" placeholder="Enter Email" />
              </Form.Item>
              <Form.Item
                name="Password"
                label="Password"
                rules={[{ required: true, message: 'Please add a password' },
                {
                  min: 8, message: 'Password must have a minimum length of 8.Password should contain at least one lowercase letter, uppercase letter, number, and special character',
                  pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@!#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]).{8,}$/,

                }]}
              >
                <Input.Password prefix={<LockOutlined />} size="large"
                  placeholder="Enter Password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </> : <>
              <Form.Item
                name="TeamName"
                label="Team Name"

                rules={[
                  { required: true, message: 'Please Enter Your Team Name !' },
                ]}>
                <Input size='large' prefix={<UserOutlined />} label="Team Name" placeholder="Enter Team Name" />
              </Form.Item>
              <Form.Item
                name="AdminName"
                label="Admin Name"

                rules={[
                  { required: true, message: 'Please Enter Your Team Name !' },
                ]}>
                <Input size='large' prefix={<AiOutlineTeam />} label="Team Name" placeholder="Enter Team Name" />
              </Form.Item>

              <Form.Item
                name="Password"
                label="Your Password"
                rules={[{ required: true, message: 'Please Enter your password' },
                {
                  min: 8, message: 'Password must have a minimum length of 8.Password should contain at least one lowercase letter, uppercase letter, number, and special character',
                  pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@!#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]).{8,}$/,

                }]}
              >
                <Input.Password prefix={<LockOutlined />} size="large"
                  placeholder="Enter Password"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </>
          }



          <Form.Item
            name="Role"
            label="Role"
            rules={[{ required: true, message: 'Please select your role' }]}
          >
            <Radio.Group onChange={(e) => setRole(e.target.value)} value={role}>
              <Radio value={"Admin"}>Admin</Radio>
              <Radio value={"User"}>Team Incharge/Team Member</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Go
            </Button>
            or <a href="/register">Register now!</a>
          </Form.Item>
        </Form>
      </div ></>
  )
}