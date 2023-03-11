import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/sVipSosRecord',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sVipSosRecord/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sVipSosRecord',
    method: 'put',
    data
  })
}


export function getAllHealthData(uid,day) {
  return request({
    url: 'api/sVipSosRecord/getAllHealthDataByDay',
    method: 'post',
    data: {
      uid:uid,
      day:day
    }
  })
}



export default { add, edit, del,getAllHealthData }
