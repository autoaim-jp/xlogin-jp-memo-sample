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

const setupAlpine = () => {
  let isModalActive = true
  Alpine.data('modalData', () => {
    return {
      isKeep: false,
      title: '',
      content: '',
      saveMemo(event) {
        setTimeout(() => {
          console.log(this.title, this.content)
        }, 750)
      },
      closeModal(event) {
        console.log('closeModal start')
        this.isKeep = false
        setTimeout(function () {
          if (this.isKeep) {
            console.log('do nothing')
          } else {
            console.log('modal closed')
            isModalActive = false
          }
        }.bind(this), 100)
      },
      keepModal(event) {
        console.log('keep')
        this.isKeep = true
      },
      isModalActive: false,
      updateModalState() {
        setInterval(() => {
          this.isModalActive = isModalActive
        }, 1 * 100)
      }
    }
  })
}

const main = async () => {
  a.lib.xdevkit.output.switchLoading(true)
  // TODO alpinejs
  // a.lib.common.output.setOnClickNavManu()
  a.lib.monkeyPatch()

  //  a.app.loadMessageContent()

  a.app.loadPermission()

  // a.app.setupAlpine()
  window.setupAlpine = a.app.setupAlpine

  setTimeout(() => {
    a.lib.xdevkit.output.switchLoading(false)
  }, 300)
}

a.app = {
  main,
  loadMessageContent,
  loadPermission,
  setupAlpine,
}

a.app.main()


