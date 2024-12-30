import { TOKEN, LOGINTRUE, LOGINFALSE } from "./actionType"

const userDetails = {
    token: "",
    login: false
}

export function reducer(state = userDetails, action) {
    switch (action.type) {
        case TOKEN:
            return {
                ...state, token: action.payload
            }
        case LOGINTRUE:
            return {
                ...state, login: true
            }
        case LOGINFALSE:
            return {
                ...state, login: false, token: ""
            }
        default:
            return state;

    }
}