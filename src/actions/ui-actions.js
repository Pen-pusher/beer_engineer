export const SETLOADER = '_SET_LOADER'
const SET_NOTIFICATION = '_SET_NOTIFICATION'
const REMOVE_NOTIFICATION = '_REMOVE_NOTIFICATION'

export const setLoader = (isLoading, feature) => ({
    type: `${feature}${SETLOADER}`,
    payload: isLoading,
    meta: {
        feature
    }
})

export const setNotification = (message, feature) => ({
    type: `${feature}${SET_NOTIFICATION}`,
    payload: message,
    meta: {
        feature
    }
})

export const removeNotification = (id, feature) => ({
    type: `${feature}${REMOVE_NOTIFICATION}`,
    payload: id,
    meta: {
        feature
    }
})