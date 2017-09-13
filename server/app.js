var fs = require('fs');
var express = require('express');
var http = require('http');
var path = require('path');
var fsExtra = require('fs-extra')
var formidable = require("formidable");

var fileModel = require("./server/file.model");

var app = express.Router();

// 网站API
app.get('/', function (req, res, next) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<h1>This is fileserver</h1>' +
        '<h3>API:</h3>' +
        '<div>add DIR (get) : /containers/:dirName</div>' +                           // 添加文件夹
        '<div>empty DIR (get) : /containers/emptyDir/:dirName</div>' +                // 清空文件夹
        '<div>download FILE (get) : /containers/download/:dirName/:fileName</div>' +  // 下载文件
        '<div>upload FILE : <a href="/upload/file">upload</a></div>' +                // 上传文件
        '<div>delete FILE (get) : /containers/delete/:dirName/:fileName</div>' +      // 删除文件（单个）
        '<div>delete FILES (post) : /containers/delete</div>' +                       // 删掉文件（多个）
        '<div>upload FILE (post) : /containers/upload</div>'                          // 上传文件
    );
})

//添加dir
app.post('/containers/createDir', fileModel.createDir);

//清空dir
app.post('/containers/emptyDir', fileModel.emptyDir);

//文件下载
app.get('/containers/download/:dirName/:fileName', fileModel.downloadFile);

//删除单个文件
app.get('/containers/delete/:dirName/:fileName', fileModel.deleteFile);

//批量删除图片
app.post('/containers/delete', fileModel.deleteFiles);

//重命名
app.post('/containers/rename', fileModel.renameFile);

//文件上传
app.post('/containers/upload', fileModel.uploadFile);

// 获取图片
app.post('/containers/getImages', fileModel.getImageByPath);

// 获取所有文件和文件夹
app.post('/containers/getFilesAndDir', fileModel.getFileByPath);

// //上传图片
// app.get('/upload/file', function (req, res, next) {
//     // show a file upload form
//     res.writeHead(200, {'content-type': 'text/html;charset=utf-8'});
//     res.end(
//         '<form action="/containers/upload" enctype="multipart/form-data" method="post">' +
//         '上传文件dir：<input type="text" name="dirName"><br>' +
//         '文件：<input type="file" name="upload"><br>' +
//         '<input type="submit" value="上传">' +
//         '</form>'
//     );
// });

module.exports = app