var fsExtra = require('fs-extra');   // 操作文件模块（复制、创建、移动、写入、删除）
var formidable = require("formidable");  // 文件上传模块
var fs = require('fs');   // 文件模块
var path = require('path');  
var crypto = require('crypto');  // 加密解密模块

var resourceRoot = path.resolve(__dirname, '../containers');

// 创建文件夹
var createDir = function (dir, pathName, callback) {
    fsExtra.ensureDir(path.join(resourceRoot, pathName, dir), function (err) {
        if (err) return console.error(err);
        callback && callback();
    })
};

// 清空文件夹
var emptyDir = function (dir, callback) {
    fsExtra.emptyDir(path.join(resourceRoot, dir), function (err) {
        if (err) return console.error(err);
        callback && callback();
    })
};

// 读取文件列表
var readFileList = (path, filesList) => {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + '\\' + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + '\\' + itm + "\\", filesList)
        } else {
            var obj = {};//定义一个对象存放文件的路径和名字
            obj.path = path;//路径
            obj.filename = itm//名字
            filesList.push(obj);
        }
    }) 
}
// 获取文件夹下的所有文件
var getFileList = (path) => {
    var filesList = [];
    console.log('3-开始获取文件，路径为' + path)
    readFileList(path, filesList);
    return filesList;
}
// 通过路径获取图片
var getImageByPath = (dir, callback) => {
    console.log('2-准备读取文件，选择的文件夹为' + dir)
    var images = getFileList(path.join(resourceRoot, dir));
    callback && callback(images);
}
// 读取文件列表（包含文件夹）
var readFileListAndDir = (path, filesList, dir) => {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var obj = {};//定义一个对象存放文件的路径和名字
        obj.path = dir ? dir + '/' + itm : itm;//路径
        obj.filename = itm//名字
        filesList.push(obj);
    }) 
}
// 获取文件夹下的所有文件和文件夹
var getFileListAndDir = (path, dir) => {
    var filesList = [];
    console.log('3-开始获取文件，路径为' + path)
    readFileListAndDir(path, filesList, dir);
    return filesList;
}
// 通过路径获取图片
var getFileByPath = (dir, callback) => {
    console.log('2-准备读取文件，选择的文件夹为' + dir)
    var images = getFileListAndDir(path.join(resourceRoot, dir), dir);
    callback && callback(images);
}

// 错误处理
var setError = (err, res) => {
    'use strict'
    let date = new Date();
    let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log(time + '  ' + err)
    res.send({
        type: 'error',
        message: '操作失败',
        error: err
    })
}

module.exports = {
    /**
     * 获取某文件夹下所有图片（包含子文件夹）
     * @param req
     * @param res
     * @param next
     */
    getImageByPath: function(req, res, next) {
        try {
            console.log('========= 通过路径获取图片 =========')
            console.log('1-请求成功，开始解析参数..')
            getImageByPath(req.params.dirname || '', function(images) {
                console.log('4-图片读取成功')
                res.send({
                    type: 'success',
                    data: images
                })
            })
        }catch (e) {
            setError(e, res)
        }
    },

    /**
     * 获取某路径下所有文件和文件夹
     * @param req
     * @param res
     * @param next
     */
    getFileByPath: function(req, res, next) {
        try {
            console.log('========= 通过路径获取文件和文件夹 =========')
            console.log('1-请求成功，开始解析参数..')
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                var dir = fields.dirName;
                getFileByPath(dir || '', function(files) {
                    console.log('4-文件读取成功')
                    var directory = [],
                        file = [];
                    // 筛选分类文件和文件夹
                    files.forEach(function(obj, index) {
                        if (obj.filename.match(/.jpg|.png|.jpeg|.gif$/ig)) {
                            file.push(obj)
                        } else {
                            directory.push(obj)
                        }
                    })
                    res.send({
                        type: 'success',
                        data: { directory, file }
                    })
                })
            })
        }catch (e) {
            setError(e, res)
        }
    },

    /**
     * 创建文件夹
     * @param req
     * @param res
     * @param next
     */
    createDir: function (req, res, next) {
        try {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var dir = fields.dirName;
                var pathName = fields.path;
                createDir(dir, pathName, function () {
                    res.send({
                        type: 'success',
                        message: "创建成功！",
                        data: {
                            dirName: dir
                        }
                    })
                });
            })
        }catch (e) {
            setError(e, res)
        }
    },

    /**
     * 清空文件夹
     * @param req
     * @param res
     * @param next
     */
    emptyDir: function (req, res, next) {
        try {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var dir = fields.dirName;
                emptyDir(dir, function () {
                    res.send({
                        type: 'success',
                        message: "清除成功！"
                    })
                });
            })
        }catch (e) {
            setError(e, res)
        }
    },

    /**
     * 批量单个文件
     * @param req
     * @param res
     * @param next
     */
    deleteFile: function (req, res, next) {
        try {
            var dirName = req.params.dirName;
            var fileName = req.params.fileName;
            fsExtra.remove('containers/' + dirName + "/" + fileName, function (err) {
                if (err) return console.error(err)
                // res.writeHead(200, {'content-type': 'text/html'});
                res.send({
                    type: "success",
                    message: "删除成功！"
                });
            })
        }catch (e) {
            setError(e, res)
        }
    },

    /**
     * 批量删除文件
     * @param req
     * @param res
     * @param next
     */
    deleteFiles: function (req, res, next) {
        try {
            console.log('1-请求成功，开始解析数据...')
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var dir = fields.dirName;
                // var fileNames = JSON.parse(fields.files);
                var fileNames = fields.files.split(',');
                if(fileNames.length === 0) {
                    return res.send({
                        type: "success",
                        message: "删除成功！"
                    });
                }

                fileNames.forEach(function (fileName) {
                    fsExtra.remove(path.join(resourceRoot, dir, fileName), function (err) {
                        if (err) return console.error(err);
                        console.log("删除" + fileName + "成功!");
                    })
                });
                // res.writeHead(200, {'content-type': 'text/html'});
                res.send({
                    type: "success",
                    message: "删除成功！"
                });
            });
        }catch (e) {
            setError(e, res)
        }
    },

    /**
     * 重命名
     * @param req
     * @param res
     * @param next
     */
    renameFile: function (req, res, next) {
        try {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) {
                    return res.send({
                        type: "error",
                        message: "rename fail"
                    });
                }
                var newName = fields.newName;
                var oldName = fields.oldName;
                var filePath = fields.path;
                console.log('路径' + filePath)
                newName = filePath ? filePath + '/' + newName : newName
                oldName = filePath ? filePath + '/' + oldName : oldName
                
                // 获取图片后缀
                var isDirectory = oldName.match(/.jpg|.png|.jpeg|.gif$/i) ? true : false;
                var postfix = isDirectory ? '.' + oldName.split('.')[1] : '';

                fs.rename(resourceRoot + '/' + oldName, resourceRoot + '/' + newName + postfix, function (err) {
                    if (err) return console.log(err)
                    res.send({
                        type: "success",
                        message: "重命名成功！"
                    });
                })
            })
        } catch (e) {
            setError(e, res)
        }
    },

    /**
     * 上传图片
     * @param req
     * @param res
     * @param next
     */
    uploadFile: function (req, res, next) {
        try {
            var form = new formidable.IncomingForm();
            form.uploadDir = "server/containers";	 //设置上传目录
            form.keepExtensions = true;	 //保留后缀
            form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

            form.parse(req, function (err, fields, files) {
                if (err) {
                    return res.send({
                        type: "error",
                        message: "upload fail"
                    });
                }
                var dirName = fields.dirName;
                var filePath = files.file.path;

                fs.readFile(filePath, function (err, data) {
                    if (err) {
                        return res.send({
                            type: "error",
                            message: err
                        });
                    }
                    var md5 = crypto.createHash('md5');
                    var picMd5 = md5.update(data).digest('hex');
                    var fileName = picMd5 + "." + filePath.split(".").pop();
                    
                    var str = dirName ? dirName + '/' : '' 
                    fsExtra.move(filePath, "server/containers/" + str + fileName, function (err) {
                        if (err && err.code !== "EEXIST") {
                            return res.send({
                                type: "error",
                                message: err
                            });
                        }
                        res.send({
                            type: "success",
                            fileName: fileName
                        });
                    })
                });
            });
        } catch (e) {
            setError(e, res)
        }
    },

    downloadFile: function (req, res, next) {
        var dir = req.params.dirName;
        var fileName = req.params.fileName;
        var filePath = resourceRoot+ "/" + dir + "/" + fileName;
        var stats = fs.statSync(filePath);
        if (stats.isFile()) {
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=' + encodeURI(fileName),
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.end(404);
        }
    }
};