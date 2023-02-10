import request from '@/utils/request'

export function addUser(data) {
  return request({
    url: 'api/dMdeviceUser',
    method: 'post',
    data
  })
}

export function delUser(ids) {
  return request({
    url: 'api/dMdeviceUser/',
    method: 'delete',
    data: ids
  })
}

export function editUser(data) {
  return request({
    url: 'api/dMdeviceUser',
    method: 'put',
    data
  })
}

export function queryUserByMid(mid) {
  return request({
    url: 'api/dMdeviceUser/'+ mid,
    method: 'get'
  })
}


export default {queryUserByMid, addUser, editUser, delUser }
