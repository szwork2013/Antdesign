import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link } from 'dva/router';

import Login from './routes/login/login';
import System from './routes/system';
import Shopinfo from './routes/shop/shopinfo';
import Basicplantform from './routes/basicplantform';
import StyleAttr from './routes/goods/styleAttr';
import MainAttrList from './routes/goods/mainattrList';
import MaintainColor from './routes/goods/MaintainColor';
import MaintainSize from './routes/goods/MaintainSize';
import Shopadd from './routes/shop/shopadd';
import Shopedit from './routes/shop/shopedit';
import Text from './routes/upload';






import AddShopinfo from './components/Storeinfo/addshopinfo';





import Shopdetail from "./routes/shop/Shopdetail.js";





const handleEnter=()=>{
	console.log('enter--IndexRoute');
}

export default function({ history }) {

  return (
    <Router history={history}>
      <Route path="/" component={System} >
     	 <IndexRoute onEnter={handleEnter} component={Basicplantform}></IndexRoute>
     	 <Route path="/basicplantform" component={Basicplantform} />

     	 <Route path="/shopinfo" component={Shopinfo} />
       <Route path="/shopinfo/shopdetail" component={Shopdetail} />
       <Route path="/shopinfo/shopadd" component={Shopadd} />
       <Route path="/shopinfo/shopedit" component={Shopedit} />

       <Route path="/mainattrlist" component={MainAttrList} />
       <Route path="/mainattrlist/styleattr" component={StyleAttr} />
       
       <Route path="/maintaincolor" component={MaintainColor} />
       <Route path="/maintainsize" component={MaintainSize} />
       <Route path="/upload" component={Text} />
       </Route>
      <Route path="/login" component={Login} />
      
    </Router>
  );
}
