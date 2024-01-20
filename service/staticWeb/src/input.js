/* /input.js */

const fileGetRequest = async ({
  accessToken, jsonPath, CLIENT_ID, API_VERSION, API_SERVER_ORIGIN, getRequest,
}) => {
  const origin = API_SERVER_ORIGIN
  const path = `/api/${API_VERSION}/json/content`
  const param = {
    owner: CLIENT_ID,
    jsonPath,
  }
  return getRequest(CLIENT_ID, accessToken, origin, path, param)
}

export default {
  fileGetRequest,
}

