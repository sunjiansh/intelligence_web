import request from '@/utils/request'


export function queryDeviceByMid(mid) {
  return request({
    url: 'api/dMdeviceDevice/'+ mid,
    method: 'get'
  })
}

export function queryDeviceByMidAndDeviceType(mid,deviceType) {
  return request({
    url: 'api/dMdeviceDevice/'+ mid+'/'+ deviceType,
    method: 'get'
  })
}


export function addDevice(data) {
  return request({
    url: 'api/dMdeviceDevice',
    method: 'post',
    data
  })
}

export function delDevice(ids) {
  return request({
    url: 'api/dMdeviceDevice/',
    method: 'delete',
    data: ids
  })
}

export function editDevice(data) {
  return request({
    url: 'api/dMdeviceDevice',
    method: 'put',
    data
  })
}

export default {queryDeviceByMid, addDevice, editDevice, delDevice }
