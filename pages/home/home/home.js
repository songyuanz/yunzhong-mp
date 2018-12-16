const Util = require('../../../utils/util.js')
const Api = require('../../../utils/api.js')

Page({
  data: {
    pageStatus: 1,
    userDetail: {}
  },
  onLoad: function(options) {},
  onShow: function() {
    switch (this.data.pageStatus) {
      case 1:
        this.setData({
          pageStatus: 2
        }, () => {
          wx.showLoading({
            title: '页面加载',
            mask: true,
            success: () => {
              Api.getUserDetail({
                success: res => {
                  this.setData({
                    pageStatus: 3,
                    userDetail: res.data
                  })
                },
                error: res => {
                  Api.errorHandler(res, {
                    unAuth: () => {
                      this.setData({
                        pageStatus: 1
                      })
                    }
                  })
                },
                complete: () => {
                  wx.hideLoading()
                }
              })
            }
          })
        })
        break
      case 3:
        wx.showNavigationBarLoading({
          success: () => {
            Api.getUserDetail({
              success: res => {
                this.setData({
                  userDetail: res.data
                })
              },
              error: res => {
                Api.errorHandler(res, {
                  unAuth: () => {
                    this.setData({
                      pageStatus: 1
                    })
                  }
                })
              },
              complete: () => {
                wx.hideNavigationBarLoading()
              }
            })
          }
        })
    }
  },
  onShareAppMessage: function() {},
  navigatePage: function(e) {
    if (!Util.checkSignIn()) {
      Util.navigatePage('to', 'signin')
    }
    if (e.currentTarget.dataset.page == 'apply') {
      if (this.data.userDetail.status == -1 || this.data.userDetail.status == 2) {
        Util.navigatePage('to', e.currentTarget.dataset.page)
      }
      if (this.data.userDetail.status == 0 || this.data.userDetail.status == 1) {
        Util.navigatePage('to', e.currentTarget.dataset.page + '_show')
      }
    } else {
      Util.navigatePage('to', e.currentTarget.dataset.page)
    }
  }
})