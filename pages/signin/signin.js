const Util = require('../../utils/util.js')
const Api = require('../../utils/api.js')

Page({
  data: {
    counter: '获取验证码',
    counting: false,
    btnCaptchaDisabled: true
  },
  onLoad: function(options) {

  },
  onShareAppMessage: function() {},
  inputTelephone: function(e) {
    if (e.detail.value.length == 11) {
      this.setData({
        btnCaptchaDisabled: false
      })
    } else if (!this.data.btnCaptchaDisabled) {
      this.setData({
        btnCaptchaDisabled: true
      })
    }
  },
  submitForm: function(e) {
    switch (e.detail.target.dataset.method) {
      case 'getCaptcha':
        this.getCaptcha(e.detail.value.telephone)
        break
      case 'signIn':
        this.signIn(e.detail.value.telephone, e.detail.value.captcha)
        break
    }
  },
  getCaptcha: function(telephone) {
    if (!this.data.counting) {
      this.setData({
        counting: true
      }, () => {
        Api.getCaptcha(telephone, {
          success: res => {
            wx.showToast({
              title: '短信验证码已发送',
              complete: Util.counter(count => {
                const status = {}
                if (count == 0) {
                  status.counter = '获取验证码'
                  status.counting = false
                } else {
                  status.counter = count + 's'
                }
                this.setData(status)
              })
            })
          },
          error: () => {
            this.setData({
              counting: false
            })
          },
          resError: () => {
            this.setData({
              counting: false
            })
          },
          fail: () => {
            this.setData({
              counting: false
            })
          }
        })
      })
    }
  },
  signIn: function(telephone, captcha) {
    Api.signIn({
      telephone: telephone,
      captcha: captcha
    }, {
      success: res => {
        Util.setToken(res.data.token)
        Util.navigatePage('back', 1)
      }
    })
  }
})