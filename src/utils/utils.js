/**
 * 一些工具类的集合
 */

//dataURL to blob,
export function dataUrlToBlob(dataURI){
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
  let byteString = atob(dataURI.split(',')[1]); //base64 解码

  let arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
  let intArray = new Uint8Array(arrayBuffer); //创建视图

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], {type: mimeString});
}

export  function format(time, format){
  var t = new Date(time);
  var tf = function(i){return (i < 10 ? '0' : '') + i};
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
    switch(a){
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}
export  function tsmDateToString(date){
  if (date) {
    var time = new Date(date);
    var y = time.getFullYear();
    var M = time.getMonth() + 1;
    var d = time.getDate();
    return y + '-' + addZero(M) + '-' + addZero(d);
  } else {
      return '';    
  }
}
function addZero(m) {
  return m < 10 ? '0' + m : m;
}
export  function dateToString(date){
  if (date) {
    var time = new Date(date);
    var y = time.getFullYear();
    var M = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
  } else {
      return '';    
  }
}
export  function getArchivesName(code){
  let arr = {
    '1': '身份证正面',
    '11': '身份证反面',
    '3': '行驶证主页',
    '10': '行驶证附页',
    '6': '车头45度照',
  }
  return arr[code] ? arr[code] : '--'
}
export function getDefaultKey(data){
  let arr;
  if(data && data.length>0){
    for(var i=0;i<data.length;i++){
      if(data[i].status=="1"){ 
        arr.push(data[i].id);
        if(data[i].children && data[i].children.length>0){
          arr=getDefaultKey(data[i].children)
        }
      }else{
        if(data[i].children && data[i].children.length>0){
          arr=getDefaultKey(data[i].children)
        }
      }
      
    }
  }
	return arr;
}

export  function getImgUrl(){
  //return "http://172.18.205.4/web/fileUpload/show/"//测试
 return "172.18.61.3:10011/web/fileUpload/show/";//生产
}