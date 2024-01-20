/* /action.js */
const getHandlerMessageSave = ({ handleMessageSave, createResponse }) => {
  return async (req, res) => {
    const { accessToken } = req.session.auth
    const { message, jsonPath } = req.body

    const handleResult = await handleMessageSave({ accessToken, message, jsonPath })

    createResponse({ req, res, handleResult })
  }
}

const getHandlerMessageContent = ({ handleMessageContent, createResponse }) => {
  return async (req, res) => {
    const { accessToken } = req.session.auth
    const { jsonPath } = req.query

    const handleResult = await handleMessageContent({ accessToken, jsonPath })

    createResponse({ req, res, handleResult })
  }
}

const getHandlerMessageDelete = ({ handleMessageDelete, createResponse }) => {
  return async (req, res) => {
    const { accessToken } = req.session.auth

    const handleResult = await handleMessageDelete({ accessToken })

    createResponse({ req, res, handleResult })
  }
}

const getHandlerSplitPermissionList = ({ handleInvalidSession, handleSplitPermissionList, createResponse }) => {
  return async (req, res) => {
    if (handleInvalidSession({ req, res })) {
      return
    }

    const { splitPermissionList } = req.session.auth

    const handleResult = await handleSplitPermissionList({ splitPermissionList })

    createResponse({ req, res, handleResult })
  }
}

export default {
  getHandlerMessageSave,
  getHandlerMessageContent,
  getHandlerMessageDelete,

  getHandlerSplitPermissionList,
}

