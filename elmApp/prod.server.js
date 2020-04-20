var express = require('express');
var config = require('./config/index');
var port = process.env.PORT || config.build.PORT;
var app = express();
var router = express.Router();
router.get('/', function (req, res, next){
    req.url = '/index.html';
    next();
});
app.use(router);
var appData = require('./data.json')  //加载本地数据文件
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;
var apiRoutes = express.Router()    // 编写路由
apiRoutes.get('/seller', function(req, res){
  res.json({
    errno:0,
    data:seller
  });
});
apiRoutes.get('/goods', function(req, res){
  res.json({
    errno:0,
    data:goods
  });
});
apiRoutes.get('/ratings', function(req, res){
  res.json({
    errno:0,
    data:ratings
  });
});
app.use('/api', apiRoutes);
app.use(express.static('./dist'));