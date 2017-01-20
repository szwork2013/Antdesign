import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Wrap from '../../commonComponents/wrap/wrap';
import Searchinfo from '../../components/ModelNumber/Searchinfo';
import Stylelist from '../../components/ModelNumber/Stylelist';
import Paginations from '../../commonComponents/Pagination/Paginations';
import SureModel from '../../commonComponents/SureModal/SureModal';


var styleCode='';
var categoryCode='';
var yearCode='';
var deleteid='';
function Moudelnumber({dispatch,moudelnum}) {
	const {total,current,defaultPageSize,dataSource,styleCategory,styleYear,visibleSure,loading}=moudelnum;
	//搜索框相应的
	const searchProps={
		styleCategory,
		styleYear,
		loading,
		passdata(data){
			console.log(data);
			//分别赋值，保存状态
			//创建查询数据newarr
			styleCode=data.styleCode;
			if((data.categoryCode) && (data.yearCode)){
				var newarr={...data,
						'yearCode':data.yearCode[0],
						'categoryCode':data.categoryCode[0]
				};
			}else
			if(data.categoryCode){
				categoryCode=data.categoryCode[0];
				var newarr={...data,
						'categoryCode':data.categoryCode[0]
				};
			}else
			if(data.yearCode){
				yearCode=data.yearCode[0];
					var newarr={...data,
							'yearCode':data.yearCode[0]
					};
			}else
			{
				var newarr=data;
			}
			dispatch({type:'moudelnum/gettablelist',payload:newarr});
		}
	};
	//表格列表相应的操作
	const listProps={
		dataSource,
		loading,
		onConfig(item){
			console.log('onConfig:',item);
			dispatch({
				type:'moudelnum/publicDate',
				payload:{
				  currentid:item.id,
      			  currentsizegrop:item.sizegroupCode
				}
			});
		},
	  onEditItem(item){
	  	console.log('onEditItem:',item);
		},
	  onDeleteItem(item){
	  	console.log(item);
			deleteid=item.id;
			//显示删除弹框，并传递要删除的ID
			dispatch({
				type:'moudelnum/publicDate',
				payload:{
				visibleSure:true
				}
			});
		},
	  onDetails(item){

		},
	  onBarcode(item){

		}
	}
//页码
	const pageProps={
		total,
		current,
		defaultPageSize,
		onShowSizeChange(currentpage,pagesize){
			// console.log(currentpage,pagesize);
			 let tempobj={};
			tempobj.page=currentpage;
			tempobj.rows=pagesize;
			dispatch({type:'moudelnum/tableLoading'});
			dispatch({
				type:'moudelnum/publicDate',
				payload:{
					current:currentpage,
					defaultPageSize:pagesize
				}
			});

			 dispatch({
				type: 'moudelnum/querypage',
				payload:tempobj
			});

		},
		onPageChange(currentpage){
			// console.log('currentpage:'+currentpage);
			let tempobj={};
			tempobj.page=currentpage;
			tempobj.rows=defaultPageSize;
			dispatch({type:'moudelnum/tableLoading'});
			console.log(tempobj);
			dispatch({
				type:'moudelnum/publicDate',
				payload:{
					current:currentpage
				}
			});
		}
	};

	const modalProps={
		visibleSure,
	 makeSure(){
		 //点击确认删除后
		 dispatch({type:'moudelnum/tableLoading'});
		 //显示删除提示
		 dispatch({type:'moudelnum/sureModalhide'});
		 //执行删除操作
		 dispatch({
			 type:'moudelnum/delete',
			 payload:{
				 id:deleteid
			 }
		 });
	 },
	 handleCancel(){
		 //点击取消删除后
		 dispatch({type:'moudelnum/sureModalhide'});
	 }
	};

	
  return (
    <Wrap
     num="1"
	 last="款号维护"
	 >
		  <Searchinfo {...searchProps}/>
		  <Stylelist {...listProps}/>
		  <Paginations {...pageProps}/>
		  <SureModel {...modalProps}/>
		 
	</Wrap>

  );
}

function mapStateToProps({moudelnum}) {
  return {moudelnum};
}

export default connect(mapStateToProps)(Moudelnumber);
