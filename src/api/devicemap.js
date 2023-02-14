import request from '@/utils/request'


export function getDeviceLocationList() {
  return request({
    url: 'api/sGeography/getDeviceLocationList',
    method: 'get'
  })
}

export function getUserInfoByImei(imei) {
  return request({
    url: 'api/sGeography/getUserInfoByImei/'+imei,
    method: 'get'
  })
}



export default {getDeviceLocationList,getUserInfoByImei}
