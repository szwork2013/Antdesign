import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {  Spin ,message} from 'antd';
import Wrap from '../../components/wrap/wrap';
import PicturesWall from '../../components/Storeinfo/uploadimg';
import EditShopinfo from '../../components/Storeinfo/editshopinfo';



//将json对象中为undefined的值转化为空字符串
function setProp(obj) {
    for (var p in obj) {
        switch (typeof (obj[p])) {
            case 'object':
                setProp(obj[p]);
                break;
            case 'undefined':
                obj[p] = '';
                break;
        }
    }
    return obj;
}

function Shopedit({dispatch,shopinfo}){
const {   previewVisible,
		  previewImage,
		  fileList,
		  fileListlength,
		  oFile,
		  options,
		  region,
		  types,
		  currentItem,
		  modalType,
		  behavier,
		  updating,
		  deleteImg,
		  editloading,
	}=shopinfo;

	const editInfoProps={
		 oFile,
		 options,
		  region,
		  types,
		  behavier,
		  deleteImg,
		  editloading,
		  item:modalType==='create'?{}:currentItem,
		getadddata(data){
	// 		setInterval(function(){
		// data.fullName=num++;
		// data.shortName=numm++;
		// console.log(data);
		 let upinfo=JSON.stringify(setProp(data)); 
		 // console.log(upinfo);
		 // console.log( oFile);
		 //创建form对象
		  var oMyForm = new FormData();
		  oMyForm.append("jsonparam", upinfo);
		  for (var i=0;i<oFile.length;i++) {
		    oMyForm.append("userfile"+i, oFile[i]);
		  }
		  //将form表单发送出去
		  // var oReq = new XMLHttpRequest();
		  // oReq.open("POST", "http://192.168.43.29:8084/fmss/shopController/newShop");
		  // oReq.send(oMyForm);
		   dispatch({
              type: 'shopinfo/update',
              payload:oMyForm
            });
			dispatch({
		          type: 'shopinfo/publicdate',
		          payload:{
		              updating:true
		           }  
		        });
// },50);
		
        
	}

}

	const uploadProps={
		  previewVisible,
		  previewImage,
		  fileList,
		  fileListlength,
		  oFile,
		handleCancel(){
			dispatch({
              type: 'shopinfo/HidePreview'
            });
		},

		handlePreview (file) {
		   
		    dispatch({
              type: 'shopinfo/PreviewImage',
              payload:{
              	 previewImage: file.url || file.thumbUrl
              }
            });

		     
		     dispatch({
              type: 'shopinfo/ShowPreview'
            });
		  },

		 handleChange ( {fileList,file} ) {
		 	let filelength=fileList.length;
		 	// console.log(filelength);
		    file.status = 'done';//选择图片后，让图片显示出来
		     dispatch({
              type: 'shopinfo/FileListlength',
              payload:{
              	fileListlength:filelength
              }
            });
		      dispatch({
              type: 'shopinfo/FileList',
              payload:{
              	fileList:fileList
              }
            });

		},

		customRequest(file){

		  oFile.push(file.file);
		  // console.log(oFile);
		  // var oMyForm = new FormData();
		  // oMyForm.append("username", "Groucho");
		  // oMyForm.append("accountnum", 123456); // 数字123456被立即转换成字符串"123456"
		   
		  // // fileInputElement中已经包含了用户所选择的文件

		  // for (var i=0;i<oFile.length;i++) {
		  //   console.log(oFile[i]);
		  //   oMyForm.append("userfile", oFile[i]);
		  // }
		  // //var oFile = document.getElementById("uploadImage").files[0]
		  // //oMyForm.append("userfile", oFile);
		   
		  // var oFileBody = '<a id="a"><b id="b">hey!</b></a>'; // Blob对象包含的文件内容
		  // var oBlob = new Blob([oFileBody], { type: "text/xml"});
		  // oMyForm.append("webmasterfile", oBlob);
		  // var oReq = new XMLHttpRequest();
		  // oReq.open("POST", "/upload.do");
		  // oReq.send(oMyForm);

		},
		onRemove(file){
			//遍历oFile，将取消上传的图片从上传数据中删除
			if(file.name){
				for (let i = 0; i < fileListlength; i++) {
				if(oFile[i].name==file.name){
					oFile.splice(i,1);
					}
				}
			}
			
			// console.log(file);
			//首先组装filelist对象，如果页面进入修改页面，则需要从onremove中读取要删除的文件，保存到新对象中
			if(file.imageName){
				let delimg={};
				delimg.imageName=file.imageName;
				deleteImg.push(delimg);
				//打印要删除的对象
				// console.log(deleteImg);
			}
		}
	};

	return(
	<Spin size="large" tip="修改信息中，请稍后..." spinning={updating}>
		<Wrap
		   last="店仓维护"
		   next="修改店仓"
		   >
		  
		  <EditShopinfo {...editInfoProps}>
		  <PicturesWall  {...uploadProps}/>
		  </EditShopinfo>
		  
		   </Wrap>
	</Spin>
		);
}


Shopedit.propTypes = {
  shopinfo: PropTypes.object,
  uploadProps: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps({ shopinfo }) {
  return { shopinfo };
}
export default connect(mapStateToProps)(Shopedit);