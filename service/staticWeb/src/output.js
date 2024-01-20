/* /output.js */

const fileSaveRequest = ({
  accessToken, message, jsonPath, CLIENT_ID, API_VERSION, API_SERVER_ORIGIN, postRequest,
}) => {
  const path = `/api/${API_VERSION}/json/update`
  const param = {
    owner: CLIENT_ID,
    jsonPath,
    content: message,
  }

  return postRequest(CLIENT_ID, accessToken, API_SERVER_ORIGIN, path, param)
}

const fileDeleteRequest = ({
  accessToken, jsonPath, CLIENT_ID, API_VERSION, API_SERVER_ORIGIN, postRequest,
}) => {
  const path = `/api/${API_VERSION}/json/delete`
  const param = {
    owner: CLIENT_ID,
    jsonPath,
  }

  return postRequest(CLIENT_ID, accessToken, API_SERVER_ORIGIN, path, param)
}

/* to http client */
const endResponse = ({
  res, json, redirect, ERROR_PAGE,
}) => {
  if (redirect) {
    return res.redirect(redirect)
  } if (json) {
    return res.json(json)
  }
  return res.redirect(ERROR_PAGE)
}

export default {
  fileSaveRequest,
  fileDeleteRequest,

  endResponse,
}

