
export  function initMap () {
  const AK = "QA6BZ-Z5KLX-S2544-T6SQ7-S2HDV-AWBTA"
  const TMap_URL = "https://map.qq.com/api/gljs?v=1.exp&libraries=tools,service&key="+ AK +"&callback=onMapCallback"
  return new Promise((resolve, reject) => {
    // 如果已加载直接返回
    if(typeof TMap !== "undefined") {
      resolve(TMap)
      return true
    }
    // 地图异步加载回调处理
    window.onMapCallback = function () {
      resolve(TMap)
    }

    // 插入script脚本
    let scriptNode = document.createElement("script");
    scriptNode.setAttribute("type", "text/javascript")
    scriptNode.setAttribute("src", TMap_URL)
    document.body.appendChild(scriptNode)
  })
}



export default {initMap}
