import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/sGeography',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sGeography/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sGeography',
    method: 'put',
    data
  })
}


export function getAddressByLatLng(lat,lng) {
  var data={'lat':lat,'lng':lng}
  return request({
    url: 'api/sGeography/address',
    method: 'post',
    data
  })
}


export function getLatLngByAddress(address) {
  var data = {'address': address }
  return request({
    url: 'api/sGeography/latLng',
    method: 'post',
    data
  })
}


export default { add, edit, del ,getAddressByLatLng, getLatLngByAddress}
