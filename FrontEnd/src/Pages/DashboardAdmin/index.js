import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Button, Select, Checkbox, Radio, Row, Col, Form, Input, Flex, notification } from 'antd';
import { Divider, Table } from 'antd';

export default function DashboardAdmin() {
    const [incharges, setIncharges] = useState()
    const [teamMembers, setTeamMembers] = useState()
    const [teams, setTeams] = useState()
    const AdminName = useSelector(obj => `${obj.token.FirstName} ${obj.token.LastName}`)
    const columns = [
        {
            title: 'Team Name',
            dataIndex: 'TeamName',
            key: 'TeamName',
        },
        {
            title: 'Incharge Name',
            dataIndex: 'InchargeName',
            key: 'InchargeName',
        },
        {
            title: 'Team Members Name',
            dataIndex: 'TeamMembers',
            key: 'TeamMembers',
            render: ((_, values) => (
                <p>{
                (values.TeamMembers).map(data=>{
                    return(
                        <p>{data.MemberName}</p>
                    )
                })
                
                }</p>

            ))
        },
    ];


    useEffect(() => {
        (async () => {
            const inchargeObject = await axios.get("http://localhost:8080/admin/get/incharge")
            if (inchargeObject.data.incharge_data) {
                await setIncharges(inchargeObject.data.incharge_data.filter(data => data.AdminName === AdminName));
            }
            const teamDetails = await axios.get("http://localhost:8080/admin/get/teamdetails")
            if (teamDetails.data.incharge_data) {
                await setTeams(teamDetails.data.incharge_data.filter(data => data.AdminName === AdminName));
            }
            const tempTeamMembers = await teams?.map(data => data.TeamMembers)
            await setTeamMembers(tempTeamMembers?.flat())
        })()
    }, [])
    return (
        <div style={{
            backgroundColor: "aliceBlue",
            color: "grey",
            minHeight: "88.1vh"
        }}>
            <h3>Welcome {AdminName} ...</h3>
            <Divider>{AdminName}'s Organizational Teams </Divider>
            <Row justify="center" >
                <Table style={{
                    width: "95%",
                }} columns={columns} dataSource={teams} size="small" />
            </Row>
        </div>
    )
}