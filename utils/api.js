/* 工具类 */
const util = require('util.js')

/* API 域名 */
const baseurl = 'https://api.yunzhongkeji.info/api/'

/**
 * 上传图片
 */
const uploadImage = (data, callbacks) => {
  const app = getApp()
  callbacks = callbackHandler('上传图片', callbacks)
  wx.showLoading({
    title: '图片上传',
    mask: true,
    success: () => {
      wx.uploadFile({
        url: baseurl + 'upload-file',
        filePath: data.path,
        name: 'file',
        formData: {
          'dir': 'images'
        },
        header: {
          'X-AUTH-TOKEN': app.globalData.token
        },
        success: callbacks.success,
        fail: callbacks.fail,
        complete: () => {
          wx.hideLoading()
          callbacks.complete()
        }
      })
    }
  })
}

/**
 * 获得短信验证码
 */
const getCaptcha = (telephone, callbacks) => {
  callbacks = callbackHandler('请求短信验证码', callbacks)
  wx.showNavigationBarLoading({
    complete: () => {
      wx.request({
        url: baseurl + 'sms/login-request',
        method: 'POST',
        data: {
          telephone: telephone
        },
        success: callbacks.success,
        fail: callbacks.fail,
        complete: () => {
          wx.hideNavigationBarLoading()
          callbacks.complete()
        }
      })
    }
  })
}

/**
 * 登录/注册 
 */
const signIn = (data, callbacks) => {
  const app = getApp()
  callbacks = callbackHandler('登录/注册', callbacks)
  wx.showLoading({
    title: '登录中...',
    mask: true,
    success: () => {
      wx.request({
        url: baseurl + 'user/login',
        method: 'POST',
        data: {
          telephone: data.telephone,
          captcha: data.captcha,
          role_type: app.globalData.roleType,
          code: app.globalData.code
        },
        success: callbacks.success,
        fail: callbacks.fail,
        complete: () => {
          wx.hideLoading()
          callbacks.complete()
        }
      })
    }
  })
}

/**
 * 获得用户详情 
 */
const getUserDetail = callbacks => {
  const app = getApp()
  callbacks = callbackHandler('查询用户详情', callbacks)
  wx.request({
    url: baseurl + 'user-detail',
    header: {
      'X-AUTH-TOKEN': app.globalData.token
    },
    success: callbacks.success,
    fail: callbacks.fail,
    complete: callbacks.complete
  })
}

/**
 * 申请入驻
 */
const apply = (data, callbacks) => {
  const app = getApp()
  callbacks = callbackHandler('劳工申请入驻', callbacks)
  wx.request({
    url: baseurl + 'worker/auth',
    method: 'POST',
    header: {
      'X-AUTH-TOKEN': app.globalData.token
    },
    data: {
      username: data.username,
      id_no: data.id_no,
      pic_id: data.pic_id,
      pic_id_face: data.pic_id_face
    },
    success: callbacks.success,
    fail: callbacks.fail,
    complete: callbacks.complete
  })
}

/**
 * 查询申请详情
 */
const getApplicationDetail = callbacks => {
  const app = getApp()
  callbacks = callbackHandler('查询劳工申请详情', callbacks)
  wx.request({
    url: baseurl + 'worker/detail',
    header: {
      'X-AUTH-TOKEN': app.globalData.token
    },
    success: callbacks.success,
    fail: callbacks.fail,
    complete: callbacks.complete
  })
}

/**
 * 请求错误提示
 */
const showErrorMessage = (index, message) => {
  const titles = ['响应错误提示', '错误提示']
  const contents = ['响应错误码：', '']
  wx.showModal({
    title: titles[index],
    content: contents[index] + message,
    showCancel: false
  })
}

/**
 * 请求错误处理
 */
const errorHandler = (error, callbacks) => {
  if (error.error_code == 'E_UNAUTHORIZED') {
    callbacks.unAuth && callbacks.unAuth()
  } else {
    showErrorMessage(1, error.error_message)
  }
}

/**
 * 请求回调函数处理
 */
const callbackHandler = (title, callbacks = {}) => {
  return {
    success: res => {
      if (res.statusCode == 200) {
        const data = typeof(res.data) == 'string' ? JSON.parse(res.data) : res.data
        if (data.error_code == '0000') {
          console.log(title + '成功：', data)
          callbacks.success && callbacks.success(data)
        } else {
          console.error(title + '错误：', data)
          callbacks.error ? callbacks.error(data) : errorHandler(data, {
            unAuth: () => {
              Util.removeToken()

            }
          })
        }
      } else {
        console.error(title + '响应错误：', res)
        callbacks.resError ? callbacks.resError(res) : showErrorMessage(0, res.statusCode)
      }
    },
    fail: res => {
      console.error(title + '请求失败：', res)
      if (callbacks.fail) {
        callbacks.fail(res)
      } else if (res.errMsg == 'request:fail ') {
        wx.showToast({
          title: '请求失败,请检查网络状态！',
          icon: 'none',
          duration: 2000
        })
      }
    },
    complete: () => {
      // console.log(title + '完成：')
      if (callbacks.complete) {
        callbacks.complete()
      }
    }
  }
}

module.exports = {
  errorHandler: errorHandler,
  uploadImage: uploadImage,
  getCaptcha: getCaptcha,
  signIn: signIn,
  getUserDetail: getUserDetail,
  apply: apply,
  getApplicationDetail: getApplicationDetail
}