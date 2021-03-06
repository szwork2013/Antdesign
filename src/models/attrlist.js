import { queryColor,newColor,updateColor,removeColor } from '../services/attribute';
import {message,Modal} from 'antd';
export default {
  //颜色属性维护
    namespace: 'attrlist',
    state: {
      title:"",
      currentItem:{},
      modalVisible:false,
      modalType: 'create',
      dataSource:[],
      visibleSure:false,
      loading:true,
      total:0,
      current:1,
      defaultPageSize:10,
      confirmLoading:false,
      Modalkey:''
    },
    effects: {
        *enter({ payload }, { call, put,select }){
           const currentpage = yield select(({ attrlist }) => attrlist.current);
           const pagesize = yield select(({ attrlist }) => attrlist.defaultPageSize);
           let tempobj={};
           tempobj.page=currentpage;
           tempobj.rows=pagesize;
           let strarr=JSON.stringify(tempobj);
            const {data}= yield call(queryColor,{jsonParam:strarr});
            if(data){
            console.log(data);
              // 开始添加页面序号
                 let long=data.dataList.length;
                  if(currentpage<2){
                    for(let i=1;i<=long;i++){
                        data.dataList[i-1].num=i;
                        data.dataList[i-1].key=i;
                      }
                    }else{
                      let size=(currentpage-1)*10;
                      for(let j=size;j<long+size;j++){
                        data.dataList[j-size].num=j+1;
                        data.dataList[j-size].key=j+1;
                      }
                    }
                    //添加页面序号结束
            yield put({type:'publicDate',
                      payload:{
                        dataSource:data.dataList,
                        total:data.total,
                        loading:false
                      }
                    });
            }
        },
        *querypage({ payload }, { call, put, select }){
          const currentpage = yield select(({ attrlist }) => attrlist.current);
          const pagesize = yield select(({ attrlist }) => attrlist.defaultPageSize);
          console.log(payload);
          //使用传递过来的参数
          // const currentpage = payload.page;
          // const pagesize = payload.rows;
            let strarr=JSON.stringify(payload);
            // console.log(strarr)
            const {data}= yield call(queryColor,{jsonParam:strarr});

            if(data){
              console.log(data);
               // 开始添加页面序号
                 let long=data.dataList.length;
                  if(currentpage<2){
                    for(let i=1;i<=long;i++){
                        data.dataList[i-1].num=i;
                        data.dataList[i-1].key=i;
                      }
                    }else{
                      let size=(currentpage-1)*10;
                      for(let j=size;j<long+size;j++){
                        data.dataList[j-size].num=j+1;
                        data.dataList[j-size].key=j+1;
                      }
                    }
                    //添加页面序号结束
            yield put({type:'publicDate',
                      payload:{
                        dataSource:data.dataList,
                        total:data.total,
                        loading:false
                      }
                    });
            }
        },
        *create({ payload }, { call, put,select }){
            const tabledata = yield select(({ attrlist }) => attrlist.dataSource);
            let strarr=JSON.stringify(payload);
            console.log(strarr);
            const {data}= yield call(newColor,{jsonParam:strarr});
            console.log(data);
            //data.code=="0"是成功时要执行的回调
            if(data.code=="0"){
               // message.success(data.msg);
                 //方案一：修改页面数据,直接在数据源上push意条数据(可以省略，再次请求数据)
                    // payload.num=tabledata.length+1;
                    // console.log(payload);
                    // const newtabledata=tabledata.push(payload);
                    // console.log(tabledata);

                  //将页码设为默认
                  yield put({type:'publicDate',
                      payload:{
                        modalVisible:false,
                         current:1,
                         loadings:true,
                         confirmLoading:false
                      }
                    });
                   //方案二：再次请求数据
                 yield put({type:'enter'});

            }else{
               yield put({type:'publicDate',
                      payload:{
                         confirmLoading:false
                      }
                    });
              Modal.error({
                title: '提示',
                content: data.msg,
              });
              //  yield put({type:'tableLoadingClose'});
               // message.warning(data.msg);
            }
        },
        *edit({ payload }, { call, put,select }){
            const id = yield select(({ attrlist }) => attrlist.currentItem.id);
            const newpayload = { ...payload, id }; // 等价于payload.id=id;
            let strarr=JSON.stringify(newpayload);
            console.log(strarr);
            const {data}= yield call(updateColor,{jsonParam:strarr});
            if(data.code=="0"){
               // message.success(data.msg);
                // console.log(data);

                 //将页码设为默认
                  yield put({type:'publicDate',
                      payload:{
                         current:1,
                         modalVisible:false,
                         loadings:true,
                         confirmLoading:false
                      }
                    });
                    //方案二：再次请求数据
                    yield put({type:'enter'});

            }else{
               yield put({type:'publicDate',
                      payload:{
                         confirmLoading:false
                      }
                    });
              Modal.error({
                title: '提示',
                content: data.msg,
              });
              //  yield put({type:'tableLoadingClose'});
               // message.warning(data.msg);
            }
        },
        *delete({ payload }, { call, put,select }){
          const currentpage = yield select(({ attrlist }) => attrlist.current);
          const dataSource = yield select(({ attrlist }) => attrlist.dataSource);
            let newId={};
            newId.id=payload;
            let strarr=JSON.stringify(newId);
            const {data}= yield call(removeColor,{jsonParam:strarr});
            console.log(data.code);
            if(data.code=="0"){
              // message.success(data.msg);
                console.log(data);
                //这里判断当页是否还有一条数据，如果还有一条数据的话，再判断页数，如果当前的页数
                // 小于2页的话不做操作，否则页数减一
                if(dataSource.length<2){
                  if(currentpage<2){
                    yield put({type:'publicDate',
                          payload:{
                             current:1,
                             loadings:true
                          }
                        });
                  }else{
                    yield put({type:'publicDate',
                         payload:{
                            current:currentpage-1,
                            loadings:true
                         }
                       });
                  }
                }
                    //方案二：再次请求数据
                    yield put({type:'enter'});
            }else{
              Modal.error({
                title: '提示',
                content: data.msg,
              });
               yield put({type:'tableLoadingClose'});
               // message.warning(data.msg);
            }
        }
    },
    reducers: {
        Changetitle(state, action) {
            return {...state,
                ...action.payload
            };
        },
         publicDate(state, action) {
            return {...state,
                ...action.payload
            };
        },
        showEditModal(state,action) {
            return {...state, ...action.payload,modalVisible:true,title:"修改" };
        },
        showAddModal(state,action) {
            return {...state,...action.payload, modalVisible:true,title:"增加" };
        },
        hideModal(state) {
            return {...state, modalVisible:false  };
        },
        tableLoading(state){
            return {...state,loading:true}
        },
        tableLoadingClose(state){
            return {...state,loading:false}
        },
        sureModalshow(state){
            return {...state,visibleSure:true}
        },
        sureModalhide(state){
            return {...state,visibleSure:false}
        }
    },
     subscriptions: {
        setup({ dispatch, history }){
         history.listen(location => {
        if (location.pathname === '/maintaincolor') {

           dispatch({
            type: 'publicDate',
            payload:{
               current:1,
               defaultPageSize:10,
               loading:true
            }
          });
            dispatch({type: 'enter'});
           }
         });
       }
     }

};
