const axios = require('axios');

const AJAX = ({
  FCODE,
}) => (new Promise((resolve, reject) => {
  axios({
    method: 'get',
    url: 'https://fundmobapi.eastmoney.com/FundMApi/FundVarietieValuationDetail.ashx',
    params: {
      FCODE,
      deviceid: 123,
      plat: 'Iphone',
      AppType: 'Iphone',
      product: 'EFund',
      version: '6.2.5',
    },
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'utf-8',
      'Accept-Language': 'zh-CN,zh;q=0.8',
      'Host': 'fundmobapi.eastmoney.com',
      'Origin': 'fundmobapi.eastmoney.com',
      'Referer': 'https://h5.1234567.com.cn/',
      'Connection': 'keep-alive',
      'Cookie': "",
    },
  }).then(res => {
    resolve(res)
  }).catch(err => {
    reject(err)
  })
}))
module.exports = AJAX