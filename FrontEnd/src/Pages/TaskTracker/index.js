import { GiSprint } from "react-icons/gi";
import { Select, Checkbox, Row, Col, Form, Input, Flex, notification, Modal } from 'antd';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
import { Box, Card, CardContent, Typography, Button, Grid, Paper, styled, IconButton, Chip } from "@mui/material";
import { FaEdit, FaTrash, FaArrowRight, FaCheck } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const { TextArea } = Input

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    height: "100%",
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(1)
}));

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows[2]
    }
}));

const TaskTracker = (props) => {
    const [editing, setEditing] = useState(false)
    const token = props.memberData
    const TeamDetails = props.TeamDetails
    const [open, setOpen] = useState(false);
    const [teamChoice, setTeamChoice] = useState()
    const [memberChoice, setMemberChoice] = useState()
    const [teams, setTeams] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [userForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [modalText, setModalText] = useState('Content of the modal');

    const onSubmit = async (data) => {        
        if (editing) {
            let status
            if (data.status === "Completed") {
                status = "completed"
            }
            else if (data.status === "In Progress") {
                status = "inProgress"
            }
            else if (data.status === "New") {
                status = "backlog"
            }
            tasks.TeamDetails = TeamDetails
            tasks.UpdatedUser =data.MemberName
            tasks.AssignedUser = token.Email
            const updated = tasks[status]
            const finalEdit = updated.map(value => {
                if (value.id === data.id) {
                    tasks.EditedTask = data
                    return data
                }
                return value
            })
            tasks[status] = finalEdit
            
          if(tasks.AssignedUser === tasks.UpdatedUser){
            console.log("inisde");
            
            const response = await axios.post("http://localhost:8080/member/update/task", tasks)
            if (!response.data.success) {
                notification.error({
                    message: 'Error',
                    description: `${response.data.message}`,
                });
            }
          }
            await editForm.resetFields();
            await setOpen(false);
            await setConfirmLoading(false);
            await retrieve()
        }
        else {
            data.TeamDetails = await token;
            const response = await axios.post("http://localhost:8080/member/add/task", data)
            if (response.data.success) {
                notification.success({
                    message: 'Success',
                    description: `${response.data.message}`,
                });
                userForm.resetFields();
                setOpen(false);
                setConfirmLoading(false);
                retrieve()
            }
            else {
                response.send("Failure");

            }
        }

    }

    const showModal = () => {

        setOpen(true);
    };
    const [tasks, setTasks] = useState("")

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceSection = source.droppableId;
        const destSection = destination.droppableId;

        if (sourceSection === destSection) {
            const items = Array.from(tasks[sourceSection]);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);

            setTasks({
                ...tasks,
                [sourceSection]: items
            });
        } else {
            const sourceItems = Array.from(tasks[sourceSection]);
            const destItems = Array.from(tasks[destSection]);
            const [movedItem] = sourceItems.splice(source.index, 1);
            const updatedItem = {
                ...movedItem,
                status: destSection === "inProgress" ? "In Progress" : destSection === "completed" ? "Completed" : "New"
            };

            destItems.splice(destination.index, 0, updatedItem);

            setTasks({
                ...tasks,
                [sourceSection]: sourceItems,
                [destSection]: destItems
            });
        }
    };


    const moveTask = (taskId, fromSection, toSection) => {
        setTasks(prev => {
            const task = prev[fromSection].find(t => t.id === taskId);
            const updatedTask = {
                ...task,
                status: toSection === "inProgress" ? "In Progress" : "Completed"
            };

            return {
                ...prev,
                [fromSection]: prev[fromSection].filter(t => t.id !== taskId),
                [toSection]: [...prev[toSection], updatedTask]
            };
        });
    };

    const deleteTask = (taskId, section) => {

        setTasks(prev => ({
            ...prev,
            [section]: prev[section].filter(t => t.id !== taskId)
        }));
    };
    const editTask = (task, section) => {
        editForm.setFieldsValue({
            TaskId: task.id,
            MemberName : (teams.find(data => (data.value === token.Email))).value,
            TaskName: task.TaskName,
            TaskDescription: task.TaskDescription
        })
        setEditing(task)
        showModal(true)
    }
    const retrieve = async () => {
        const response = await axios.get("http://localhost:8080/member/get/teammembers");
        const filteredTeam = await response.data.incharge_data.find(data => (data.AdminName === token.AdminName && data.TeamName === token.TeamName && data.InchargeName === token.InchargeName))
        const filteredMember = await filteredTeam.TeamMembers.find(data => (data.MemberName === token.MemberName))
        const tempTasks = await filteredMember.task;
        let backlogCnt = 0, inProgressCnt = 0, completedCnt = 0
        if (token) {
            await setTasks({
                ...tasks, backlog: tempTasks.backlog.map((data, index) => {
                    backlogCnt = index + 1
                    if (index === 0) {
                        return {
                            id: index,
                            TaskName: data.TaskName,
                            TaskDescription: data.TaskDescription,
                            status: "New"
                        }
                    }
                    else {
                        return {
                            id: index + 1,
                            TaskName: data.TaskName,
                            TaskDescription: data.TaskDescription,
                            status: "New"
                        }
                    }
                }), inProgress: tempTasks.inProgress.map((data, index) => {
                    if (index === 0) {
                        inProgressCnt = backlogCnt + 1;
                        return {
                            id: backlogCnt + 1,
                            TaskName: data.TaskName,
                            TaskDescription: data.TaskDescription,
                            status: "In Progress"
                        }

                    }
                    else {
                        let temp = inProgressCnt + 1
                        inProgressCnt += 1
                        return {
                            id: temp,
                            TaskName: data.TaskName,
                            TaskDescription: data.TaskDescription,
                            status: "In Progress"
                        }
                    }
                }), completed: tempTasks.completed.map((data, index) => {
                    if (index === 0) {
                        completedCnt = inProgressCnt + 1;
                        return {
                            id: inProgressCnt + 1,
                            TaskName: data.TaskName,
                            TaskDescription: data.TaskDescription,
                            status: "Completed"
                        }

                    }
                    else {
                        let temp = completedCnt + 1
                        completedCnt += 1
                        return {
                            id: temp,
                            TaskName: data.TaskName,
                            TaskDescription: data.TaskDescription,
                            status: "Completed"
                        }
                    }
                }), TeamDetails: token
            })
        }

    }


    useEffect(() => {
        retrieve()
    }, [])

    useEffect(() => {
        (async () => {
            if (tasks !== "" && token) {
                const response = await axios.post("http://localhost:8080/member/update/task", tasks)
                if (!response.data.success) {
                    notification.error({
                        message: 'Error',
                        description: `${response.data.message}`,
                    });
                }
            }
        })()

    }, [tasks])

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

    const TaskCard = ({ task, section, index }) => (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <StyledCard>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h6" component="h3">
                                    {task.TaskName}
                                </Typography>
                                <Box>
                                    <Chip
                                        label={task.status}
                                        color={
                                            task.status === "New"
                                                ? "primary"
                                                : task.status === "In Progress"
                                                    ? "warning"
                                                    : "success"
                                        }
                                        size="small"
                                    />
                                </Box>
                            </Box>
                            <Typography color="textSecondary" paragraph>
                                {task.TaskDescription}
                            </Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <IconButton size="small" onClick={() => editTask(task, section)} color="primary" aria-label="edit task">
                                        <FaEdit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => deleteTask(task.id, section)}
                                        aria-label="delete task"
                                    >
                                        <FaTrash />
                                    </IconButton>
                                </Box>
                                {section !== "completed" && (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        endIcon={section === "backlog" ? <FaArrowRight /> : <FaCheck />}
                                        onClick={() =>
                                            moveTask(
                                                task.id,
                                                section,
                                                section === "backlog" ? "inProgress" : "completed"
                                            )
                                        }
                                    >
                                        {section === "backlog" ? "Start" : "Complete"}
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </StyledCard>
                </div>
            )}
        </Draggable>
    );

    const TaskSection = ({ title, tasks, section }) => (
        <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
                <Typography variant="h5" component="h2" gutterBottom>
                    {title}
                </Typography>
                <Droppable droppableId={section}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {tasks?.map((task, index) => (
                                <TaskCard key={task.id} task={task} section={section} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </StyledPaper>
        </Grid>
    );
    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const onEdit = async (data, editObj) => {
        const values = await {
            id: editObj.id,
            MemberName : data.MemberName,
            TaskName: (data.TaskName) ? data.TaskName : editObj.TaskName,
            TaskDescription: (data.TaskDescription) ? data.TaskDescription : editObj.TaskDescription,
            status: editObj.status
        }
        
        await onSubmit(values);
        await setEditing(false)
    }

    useEffect(() => {
        if (!open) {
            setEditing(false)
        }
    }, [open])

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
                minHeight: "80vh",

                backgroundColor: "aliceblue"
            }}>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Box sx={{ flexGrow: 1, p: 15, backgroundColor: "transparent", minHeight: "80vh" }}>
                        <Grid container spacing={3}>
                            <TaskSection title="Backlog" tasks={tasks?.backlog} section="backlog" />
                            <TaskSection
                                title="In Progress"
                                tasks={tasks?.inProgress}
                                section="inProgress"
                            />
                            <TaskSection title="Completed" tasks={tasks?.completed} section="completed" />
                        </Grid>
                    </Box>
                </DragDropContext>
            </div>
            <Modal
                title={(editing) ? "Edit Ticket" : "Add Task"}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
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
        </>
    );
};

export default TaskTracker;