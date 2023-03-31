import { useMediaQuery } from 'react-responsive'

// Defines redux reducers

const setDisplay = (state = true, action) => {
    switch(action.type) {
        case "DISPLAY":
            return !state

        default:
            return state
    }
}

const mediaquery = (state = window.innerWidth, action) => {
    switch(action.type) {
        case "MEDIA-QUERY":
            return state
        default:
            return state
    }
}

export { setDisplay, mediaquery };
