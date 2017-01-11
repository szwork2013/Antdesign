import { queryAllSizeGroup,newSizeGroup,updateSizeGroup,removeSizeGroup } from '../services/attribute';
export default {
    namespace: 'attrsizeItem',
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
    },
    effects: {
        *enter({ payload }, { call, put, select }){
        	// const currentpage = yield select(({ attrsizeItem }) => attrsizeItem.current);
        	// const pagesize = yield select(({ attrsizeItem }) => attrsizeItem.defaultPageSize);
        	// let tempobj={};
        	// tempobj.start=currentpage;
        	// tempobj.rows=pagesize;
        	let tempobj={};
        	tempobj.start=1;
        	tempobj.rows=10;
        	let strarr=JSON.stringify(tempobj);
            const {data}= yield call(queryAllSizeGroup,{jsonParam:strarr});
            if(data){
            console.log(data);
             for(let i=1;i<=data.dataList.length;i++){
                    data.dataList[i-1].num=i;
                  }
            yield put({type:'publicDate',
                      payload:{
                        dataSource:data.dataList,
                        total:data.total,
                        loading:false
                      }
                    });
            }
        },
        *querypage({ payload }, { call, put }){
            let strarr=JSON.stringify(payload);
            console.log(strarr)
            const {data}= yield call(queryAllSizeGroup,{jsonParam:strarr});
            if(data){
            console.log(data);
             for(let i=1;i<=data.dataList.length;i++){
                    data.dataList[i-1].num=i;
                  }
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
            const tabledata = yield select(({ attrsizeItem }) => attrsizeItem.dataSource);
            let strarr=JSON.stringify(payload);
            console.log(strarr);
            const {data}= yield call(newSizeGroup,{jsonParam:strarr});
            console.log(data);
            //data.code=="0"是成功时要执行的回调
            if(data.code=="0"){
                 //方案一：修改页面数据,直接在数据源上push意条数据(可以省略，再次请求数据)
                    // payload.num=tabledata.length+1;
                    // console.log(payload);
                    // const newtabledata=tabledata.push(payload);
                    // console.log(tabledata);
                //方案二：再次请求数据
                 yield put({type:'enter'});

            }
        },
        *edit({ payload }, { call, put,select }){
            const id = yield select(({ attrsizeItem }) => attrsizeItem.currentItem.id);
            const newpayload = { ...payload, id }; // 等价于payload.id=id;
            let strarr=JSON.stringify(newpayload);
            console.log(strarr);
            const {data}= yield call(updateSizeGroup,{jsonParam:strarr});
            if(data.code=="0"){
                console.log(data);
                 //方案二：再次请求数据
                 yield put({type:'enter'});
            } 
        },
        *delete({ payload }, { call, put,select }){
            console.log('payload:'+payload);
            let newId={};
            newId.id=payload;
            let strarr=JSON.stringify(newId);
            const {data}= yield call(removeSizeGroup,{jsonParam:strarr});
            if(data.code=="0"){
                console.log(data);
                //方案二：再次请求数据
                yield put({type:'enter'});
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
        if (location.pathname === '/maintainsizeitem') {
            // console.log(location.pathname);
          dispatch({type: 'enter'});
           }
         });
       }
     }

};