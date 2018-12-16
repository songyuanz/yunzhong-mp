/**
 * 页面跳转
 *  method string 跳转方法
 *  page   string 页面名称
 *  query  object
 */
const navigatePage = (method, page, query) => {
  const pages = {
    'signin': '/pages/signin/signin',
    'home': '/pages/home/home/home',
    'setting': '/pages/home/setting/setting',
    'apply': '/pages/home/apply/apply/apply',
    'apply_show': '/pages/home/apply/show/show'
  }
  const str = query ? '?' + toQueryString(query) : ''
  const url = pages[page] + str
  switch (method) {
    case 'to':
      wx.navigateTo({
        url: url,
        complete: res => {
          console.log('页面跳转：', res.errMsg, method, url)
        }
      })
      break
    case 'reLaunch':
      wx.reLaunch({
        url: url,
        complete: res => {
          console.log('页面重启：', res.errMsg, method, url)
        }
      })
      break
    case 'redirect':
      wx.redirectTo({
        url: url,
        complete: res => {
          console.log('页面重定向：', res.errMsg, method, url)
        }
      })
      break
    case 'back':
      wx.navigateBack({
        delta: page,
        complete: res => {
          console.log('页面返回：', res.errMsg, method, page)
        }
      })
      break
    case 'tab':
      wx.switchTab({
        url: url,
        complete: res => {
          console.log('Tabbar页面跳转：', res.errMsg, method, url)
        }
      })
      break
  }
}

/**
 * 序列化对象为查询字符串
 */
const toQueryString = obj => {
  const str = []
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(p + "=" + obj[p])
    }
  return str.join("&")
}

/**
 * 设置Token：
 */
const setToken = token => {
  const app = getApp()
  setSession({
    token: token
  })
  app.globalData.token = token
}

/**
 * 获得Token
 */
const getToken = () => {
  const session = getSession()
  return session.token
}

/**
 * 删除Token
 */
const removeToken = () => {
  const app = getApp()
  const session = getSession()
  app.globalData.token = ''
  session.token = ''
  setSession(session)
}

/**
 * 获得Session 
 */
const getSession = () => {
  return wx.getStorageSync('session') || {}
}

/**
 * 设置Session
 */
const setSession = data => {
  const session = getSession()
  for (let key in data) {
    session[key] = data[key]
  }
  wx.setStorageSync('session', session)
}

/**
 * 设置全局数据
 */
const setAppData = obj => {
  const app = getApp()
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      app.globalData[p] = obj[p]
    }
  }
}

/**
 * 获得全局数据
 */
const getAppData = key => {
  const app = getApp()
  return key ? app.globalData[key] : app.globalData
}


/**
 * 计时器
 */
const counter = (callback, count = 60) => {
  const id = setInterval(() => {
    callback(count)
    count--
    if (count < 0) {
      clearInterval(id)
    }
  }, 1000)
}

/**
 * 检查是否登录
 */
const checkSignIn = () => {
  const app = getApp()
  return app.globalData.token ? true : false
}

module.exports = {
  counter: counter,
  navigatePage: navigatePage,
  checkSignIn: checkSignIn,
  getSession: getSession,
  setSession: setSession,
  setToken: setToken,
  getToken: getToken,
  removeToken: removeToken,
  setAppData: setAppData,
  getAppData: getAppData
}