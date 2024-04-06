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

  // TODO alpine
  a.lib.xdevkit.output.reloadXloginLoginBtn(splitPermissionListResult?.result?.clientId)
}

const setupAlpine = () => { 
  const saveMessage = a.output.getSaveMessage(argNamed({
    browserServerSetting: a.setting.browserServerSetting.getList('apiEndpoint'),
    lib: [a.lib.common.output.postRequest],
  }))

  const updateMemoList = () => {
    const message = JSON.stringify(Alpine.store('memo').memoList)
    saveMessage({ message })
    console.log('memoList updated')
  }

  const showModal = (memoIndex) => {
    Alpine.store('memo').multiSelectIndexList = {}
    Alpine.store('memo').editIndex = memoIndex
    const { title, content } = Alpine.store('memo').memoList[memoIndex]

    Alpine.store('modal').customShowModal(title, content)
  }

  const loadPermissionList = async () => {
    const splitPermissionListResult = await a.lib.common.input.fetchSplitPermissionList(a.setting.browserServerSetting.getValue('apiEndpoint'))
    Alpine.store('permission').clientId = splitPermissionListResult?.result?.clientId || null
    Alpine.store('permission').splitPermissionList = Object.assign({}, splitPermissionListResult?.result?.splitPermissionList || { optional: {}, required: {} })
    Alpine.store('permission').isEnoughPermission = splitPermissionListResult?.result?.splitPermissionList?.optional[`rw:${splitPermissionListResult?.result?.clientId}:json_v1`]
  }

  Alpine.store('permission', {
    clientId: null,
    splitPermissionList: { optional: {}, required: {} },
    isEnoughPermission: false,
  })

  loadPermissionList()

  Alpine.store('memo', {
    editIndex: -1,
    memoList: [],
    multiSelectIndexList: {},

    saveMemoList() {
      const { title, content } = Alpine.store('modal')
      Alpine.store('memo').memoList[Alpine.store('memo').editIndex].title = title
      Alpine.store('memo').memoList[Alpine.store('memo').editIndex].content = content

      updateMemoList()
    },
  })

  Alpine.data('cardListData', () => {
    return {
      clientId: null,
      splitPermissionList: { optional: {}, required: {} },
      isEnoughPermission: false,
      init() {
        this.loadMemoList()
      },
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
      toggleSelect(index) {
        if (Alpine.store('memo').multiSelectIndexList[index]) {
          delete Alpine.store('memo').multiSelectIndexList[index]
        } else {
          Alpine.store('memo').multiSelectIndexList[index] = true
        }
        console.log(Alpine.store('memo').multiSelectIndexList)
      },
      showModal,
    }
  })


  Alpine.data('sidemenuData', () => {
    return {
      deleteSelectedMemo() {
        if (Object.keys(Alpine.store('memo').multiSelectIndexList).length === 0) {
          return
        }
        Object.keys(Alpine.store('memo').multiSelectIndexList).forEach((index) => {
          delete Alpine.store('memo').memoList[index]
        })
        const newMemoList = Alpine.store('memo').memoList.filter((memo) => { return memo })
        Alpine.store('memo').memoList = newMemoList

        updateMemoList() 
      },
      createNewMemo() {
        Alpine.store('memo').memoList.push({ title: '', content: '' })
        showModal(Alpine.store('memo').memoList.length - 1)
      },
      moveSelectedMemo(direction) {
        if (Object.keys(Alpine.store('memo').multiSelectIndexList).length === 0 || Alpine.store('memo').memoList.length <= 1) {
          return
        }
        let param = {}
        if (direction === 'left') {
          param = { edge: 0, shibling: 1, move: -1 }
        } else {
          param = { edge: Object.keys(Alpine.store('memo').memoList).length - 1, shibling: Object.keys(Alpine.store('memo').memoList).length - 2, move: +1 }
        }
        const currentMemoList = {}
        Alpine.store('memo').memoList.forEach((memo, i) => {
          currentMemoList[i] = memo
        })
        Object.keys(Alpine.store('memo').multiSelectIndexList).forEach((_selectedIndex) => {
          const selectedIndex = parseInt(_selectedIndex)
          if (selectedIndex === param.edge) {
            return
          }
          if (selectedIndex === param.shibling && Alpine.store('memo').multiSelectIndexList[param.edge]) {
            return
          }
          const prev = Alpine.store('memo').memoList[selectedIndex + param.move]
          const current = Alpine.store('memo').memoList[selectedIndex]
          Alpine.store('memo').memoList[selectedIndex + param.move] = current
          Alpine.store('memo').memoList[selectedIndex] = prev
        })


        const newMultiSelectIndexList = {}
        Object.keys(Alpine.store('memo').multiSelectIndexList).forEach((_selectedIndex) => {
          const selectedIndex = parseInt(_selectedIndex)
          if (selectedIndex === param.edge) {
            if (Alpine.store('memo').multiSelectIndexList[param.shibling]) {
              newMultiSelectIndexList[param.shibling] = true
            } else {
              newMultiSelectIndexList[param.edge] = true
            }
            return
          }
          if (selectedIndex === param.shibling && Alpine.store('memo').multiSelectIndexList[param.edge]) {
            newMultiSelectIndexList[param.edge] = true
            return
          }
          newMultiSelectIndexList[selectedIndex + param.move] = true
        })

        Alpine.store('memo').multiSelectIndexList = newMultiSelectIndexList
        updateMemoList()
      },
    }
  })
}

const main = async () => {
  a.lib.xdevkit.output.switchLoading(true)
  a.lib.monkeyPatch()

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

