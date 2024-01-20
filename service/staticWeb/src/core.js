/* /core.js */
/**
 * @name コア機能を集約したファイル
 * @memberof file
 */

/* local setting */
const mod = {}

const init = (setting, output, input, lib) => {
  mod.setting = setting
  mod.output = output
  mod.input = input
  mod.lib = lib
}

const handleMessageSave = async ({ accessToken, message, jsonPath }) => {
  const fileSaveResponse = await mod.output.fileSaveRequest(argNamed({
    param: { accessToken, message, jsonPath },
    xdevkitSetting: mod.setting.xdevkitSetting.getList('api.API_VERSION', 'env.API_SERVER_ORIGIN', 'env.CLIENT_ID'),
    lib: [mod.lib.postRequest],
  }))

  logger.debug('handleMessageSave', { fileSaveResponse })

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')

  const handleResult = { response: { status } }
  return handleResult
}

const handleMessageContent = async ({ accessToken, jsonPath }) => {
  const fileGetResponse = await mod.input.fileGetRequest(argNamed({
    param: { accessToken, jsonPath },
    xdevkitSetting: mod.setting.xdevkitSetting.getList('api.API_VERSION', 'env.API_SERVER_ORIGIN', 'env.CLIENT_ID'),
    lib: [mod.lib.getRequest],
  }))

  logger.debug('handleMessageContent', { fileGetResponse })

  if (!fileGetResponse || !fileGetResponse.data) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    const result = {}
    const handleResult = { response: { status, result } }
    return handleResult
  }

  const { result } = fileGetResponse.data
  const status = mod.setting.browserServerSetting.getValue('statusList.OK')
  const handleResult = { response: { status, result } }
  return handleResult
}

const handleMessageDelete = async ({ accessToken, jsonPath }) => {
  const fileDeleteResponse = await mod.output.fileDeleteRequest(argNamed({
    param: { accessToken, jsonPath },
    xdevkitSetting: mod.setting.xdevkitSetting.getList('api.API_VERSION', 'env.API_SERVER_ORIGIN', 'env.CLIENT_ID'),
    lib: [mod.lib.postRequest],
  }))

  logger.debug('handleMessageDelete', { fileDeleteResponse })

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')

  const handleResult = { response: { status } }
  return handleResult
}

const handleSplitPermissionList = async ({ splitPermissionList }) => {
  const clientId = mod.setting.xdevkitSetting.getValue('env.CLIENT_ID')
  const result = { splitPermissionList, clientId }

  const status = mod.setting.browserServerSetting.getValue('statusList.OK')

  const handleResult = { response: { status, result } }
  return handleResult
}

const createResponse = ({ req, res, handleResult }) => {
  logger.debug('createResponse', { 'req.url': req.url, handleResult })
  // req.session.auth = handleResult.session

  const ERROR_PAGE = mod.setting.xdevkitSetting.getValue('url.ERROR_PAGE')
  const { redirect } = handleResult

  if (handleResult.response) {
    const json = handleResult.response
    return mod.output.endResponse({ res, json, ERROR_PAGE })
  }

  if (req.method === 'GET') {
    if (handleResult.redirect) {
      return mod.output.endResponse({ res, redirect: handleResult.redirect, ERROR_PAGE })
    }

    return mod.output.endResponse({ res, redirect: ERROR_PAGE, ERROR_PAGE })
  }

  if (redirect) {
    const json = { redirect }
    return mod.output.endResponse({ res, json, ERROR_PAGE })
  }

  const json = { redirect: ERROR_PAGE }
  return mod.output.endResponse({ res, json, ERROR_PAGE })
}

const handleInvalidSession = ({ req, res }) => {
  if (!req.session || !req.session.auth) {
    const status = mod.setting.browserServerSetting.getValue('statusList.INVALID_SESSION')
    return res.json({ status })
  }

  return null
}

export default {
  init,

 handleMessageSave,
  handleMessageContent,
  handleMessageDelete,
  handleSplitPermissionList,

  createResponse,
  handleInvalidSession,
}

