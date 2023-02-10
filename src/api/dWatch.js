import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/dWatch',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/dWatch/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dWatch',
    method: 'put',
    data
  })
}

export function syncWatchConfigInfo(data) {
  return request({
    url: 'api/dWatch/configWatch',
    method: 'put',
    data
  })
}


export default { add, edit, del, syncWatchConfigInfo }
