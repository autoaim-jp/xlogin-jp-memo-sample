/* mypage/app.js */
import setting from '../_setting/index.js'
import * as lib from '../_lib/index.js'

import * as core from './core.js'
import * as input from './input.js'
import * as action from './action.js'
import * as output from './output.js'

const asocial = {}
asocial.setting = setting
asocial.output = output
asocial.core = core
asocial.input = input
asocial.action = action
asocial.lib = lib

/* a is an alias of asocial */
const a = asocial

const loadMessageContent = async () => {
  const messageResult = await a.input.fetchMessage(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('apiEndpoint'),
    lib: [a.lib.common.input.getRequest],
  }))

  a.output.showMessage(argNamed({
    param: { messageResult },
  }))
}

const loadPermission = async () => {
  const splitPermissionListResult = await a.lib.common.input.fetchSplitPermissionList(a.setting.browserServerSetting.getValue('apiEndpoint'))
  a.output.showEditor(argNamed({
    param: { splitPermissionListResult },
  }))

  a.output.showBackupEmailAddressForm(argNamed({
    param: { splitPermissionListResult },
  }))

  a.output.showUploadForm(argNamed({
    param: { splitPermissionListResult },
  }))

  a.lib.xdevkit.output.reloadXloginLoginBtn(splitPermissionListResult?.result?.clientId)
}

const main = async () => {
  a.lib.xdevkit.output.switchLoading(true)
  // TODO alpinejs
  // a.lib.common.output.setOnClickNavManu()
  a.lib.monkeyPatch()

//  a.app.loadMessageContent()

  a.app.loadPermission()

  setTimeout(() => {
    a.lib.xdevkit.output.switchLoading(false)
  }, 300)
}

a.app = {
  main,
  loadMessageContent,
  loadPermission,
}

a.app.main()

