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

const loadPermission = async () => {
  const splitPermissionListResult = await a.lib.common.input.fetchSplitPermissionList(a.setting.browserServerSetting.getValue('apiEndpoint'))
  /*
  a.output.showEditor(argNamed({
    param: { splitPermissionListResult },
  }))

  a.output.showBackupEmailAddressForm(argNamed({
    param: { splitPermissionListResult },
  }))

  a.output.showUploadForm(argNamed({
    param: { splitPermissionListResult },
  }))
  */

  a.lib.xdevkit.output.reloadXloginLoginBtn(splitPermissionListResult?.result?.clientId)
}

const setupAlpine = () => {
  const saveMessage = a.output.getSaveMessage(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('apiEndpoint'),
    lib: [a.lib.common.output.postRequest],
  }))

  Alpine.store('memo', {
    selectedIdx: -1,
    memoList: [],

    saveMemoList() {
      const { title, content } = Alpine.store('modal')
      Alpine.store('memo').memoList[Alpine.store('memo').selectedIdx].title = title
      Alpine.store('memo').memoList[Alpine.store('memo').selectedIdx].content = content

      const message = JSON.stringify(Alpine.store('memo').memoList)
      saveMessage({ message })
      console.log('memoList updated')
    },
  })

  Alpine.data('cardListData', () => {
    return {
      async loadMemoList() {
        /*
        Alpine.store('memo').memoList = [
          { title: 'その1', content: 'めもめも\nめも！' },
          { title: 'その2', content: 'これはメモです。' },
        ]
        */

        const messageResult = await a.input.fetchMessage(argNamed({
          browserServerSetting: a.setting.browserServerSetting.getList('apiEndpoint'),
          lib: [a.lib.common.input.getRequest],
        }))

        console.log({ messageResult })
        const memoList = JSON.parse(messageResult?.result?.jsonContent || '[]')
        Alpine.store('memo').memoList = memoList
      },
      showModal(memoIdx) {
        Alpine.store('memo').selectedIdx = memoIdx
        const { title, content } = Alpine.store('memo').memoList[memoIdx]

        Alpine.store('modal').customShowModal(title, content)
      },
    }
  })
}

const main = async () => {
  a.lib.xdevkit.output.switchLoading(true)
  // TODO alpinejs
  // a.lib.common.output.setOnClickNavManu()
  a.lib.monkeyPatch()

  // a.app.loadMessageContent()

  a.app.loadPermission()

  // a.app.setupAlpine()
  window.setupAlpine = a.app.setupAlpine

  setTimeout(() => {
    a.lib.xdevkit.output.switchLoading(false)
  }, 300)
}

a.app = {
  main,
  loadPermission,
  setupAlpine,
}

a.app.main()


