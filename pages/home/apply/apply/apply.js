const Util = require('../../../../utils/util.js')
const Api = require('../../../../utils/api.js')

Page({
  data: {
    pic_id_preview: '../../../../images/id.png',
    pic_id_face_preview: '../../../../images/id_face.png',
    pic_id: '',
    pic_id_face: ''
  },
  onShareAppMessage: function () { },
  chooseImage: function (e) {
    const pic = e.target.id
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        console.log('选择图片成功：', res)
        const path = res.tempFilePaths[0]
        Api.uploadImage({
          path: path
        }, {
            success: res => {
              switch (pic) {
                case 'pic_id':
                  this.setData({
                    pic_id_preview: path,
                    pic_id: res.data.path
                  })
                  break
                case 'pic_id_face':
                  this.setData({
                    pic_id_face_preview: path,
                    pic_id_face: res.data.path
                  })
                  break
              }
            }
          })
      }
    })
  },
  submitApplications: function (e) {
    wx.showLoading({
      title: '申请入驻中...',
      mask: true,
      success: () => {
        Api.apply({
          username: e.detail.value.username,
          id_no: e.detail.value.id_no,
          pic_id: this.data.pic_id,
          pic_id_face: this.data.pic_id_face
        }, {
            success: res => {
              Util.navigatePage('back', 1)
            },
            complete: () => {
              wx.hideLoading()
            }
          })
      }
    })
  }
})