const Util = require('utils/util.js')

App({
  globalData: {
    roleType: 'worker',
    code:'',
    token: ''
  },
  onLaunch: function () {
    this.globalData.token = Util.getToken()

    wx.login({
      success: res => {
        this.globalData.code = res.code
      }
    })
  }
})