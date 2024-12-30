import { TOKEN, LOGINTRUE, LOGINFALSE } from "./actionType";
import { notification } from 'antd';


export const storeToken = (data) => {
    return {
        type: TOKEN,
        payload: data

    }
}
export const loginTrue = () => {

    return {
        type: LOGINTRUE

    }
}
export const loginFalse = () => {
    notification.success({
        message: 'Success',
        description: 'Successfully Logged Out! ',
    });

    return {
        type: LOGINFALSE,

    }
}