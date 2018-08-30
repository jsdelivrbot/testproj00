"use strict";

/**
 * 画像系サービス
 */
app.service('ImageService', function($rootScope, $timeout, ApiUrl, HttpService) {

    var imageService = {};

    // 画像表示およびローカル保存
    imageService.showAndSaveImages = function($scope, imageList, readFlag) {
        
        angular.forEach(imageList, function(img) {
            var imgId = img.type + img.id;
            if (img.no) imgId = imgId + "_" + img.no;
            var extension = img.ext;
            var fileName = imgId + "." + extension;
            
            if(img.update) {
                // 更新がかかっている場合はサーバから取得（scope, img, fileName, imgId, isFirst, localSaveFlag）
                getImage($scope, img, fileName, imgId, true, true);
            } else {
                if($scope) {
                    // 更新がない場合はローカルから取得
                    imageService.readFile($scope, img, fileName, imgId);
                }
            }
        });
    }
    
    // 画像表示（保存なし）
    imageService.showImage = function($scope, img) {
        var imgId = img.type + img.id;
            if (img.no) imgId = imgId + "_" + img.no;
            var extension = img.ext;
            var fileName = imgId + "." + extension;
            
            // サーバから取得（scope, img, fileName, imgId, isFirst, localSaveFlag）
            getImage($scope, img, fileName, imgId, true, false);
    }
    
    // ローカルへファイルを保存
    // 保存後は scope の imageList に URL を格納
    imageService.writeFile = function($scope, fileName, file, id, img) {
        
        //document.addEventListener('deviceready', function() {
            var dirPath = cordova.file.dataDirectory;
            window.resolveLocalFileSystemURL(dirPath, function(fileSystem) { 
                fileSystem.getFile(fileName , {create:true, exclusive:false}, function(entry) {
                    entry.createWriter(function(writer) { 
                        
                        // ファイル書き込み正常完了時
                        writer.onwrite = function() {
//                            if($scope) {
//                                $timeout(function() {
//                                    $scope.$apply(function() {
//                                        if(!($scope.imageList)) $scope.imageList = [];
//                                        if(img && img.key) {
//                                            $scope.imageList[img.key] = entry.toURL();
//                                        } else {
//                                            $scope.imageList[id] = entry.toURL();
//                                        }
//                                    });
//                                });
//                            }
                        };
                        
                        // ファイル書き込み異常時
                        writer.onerror = function() {
                            console.log("write error");
                        }
                        
                        // 書き込み処理
                        writer.write(file);
                    } , function() { console.log("create writer error"); });
                } , function(){ console.log("get file error");  });
            }, function(error) { console.log("request file system error" + error.code); });
        //}); 
    }
    
    // ローカルからファイルを読み込みます。
    imageService.readFile = function($scope, img, fileName, id) {
        document.addEventListener('deviceready', function() {
            var dirPath = cordova.file.dataDirectory;
            window.resolveLocalFileSystemURL(dirPath, function(fileSystem) {
                fileSystem.getFile(fileName , {create:true, exclusive:false}, function(entry) {
                    // ファイルパスを格納
                    $timeout(function() {
                        $scope.$apply(function() {
                            if(!($scope.imageList)) $scope.imageList = [];
                            if(img && img.key) {
                                $scope.imageList[img.key] = entry.toURL();
                            } else { 
                                $scope.imageList[id] = entry.toURL();
                            }
                        });
                    });
                    
                    entry.file(function(file) {
                        if(file.size == 0){
                            // ローカルファイルがない場合はサーバから取得（scope, img, fileName, imgId, isFirst, localSaveFlag）
                            getImage($scope, img, fileName, id, false, true);
                        }
                    });
                    
                }, function(){  console.log("file entry error") });
            } , function(error) { console.log("file system error" + error.code); } );
        });
    }
    
    // ローカルからファイルを読み込みます。
    imageService.readDetailFile = function($scope, fileName) {
        
        //document.addEventListener('deviceready', function() {
            var dirPath = cordova.file.dataDirectory;
            window.resolveLocalFileSystemURL(dirPath, function(fileSystem) {
                fileSystem.getFile(fileName , {create:true, exclusive:false},
                function(entry) {
                    
                    // ファイルパスを格納
                    $timeout(function() {
                        $scope.$apply(function() {
                            $scope.image = entry.toURL();
                        });
                    });
                    
                    entry.file(function(file) {
                        if(file.size == 0){
                            // ローカルファイルがない場合はサーバから取得（scope, img, fileName, imgId, isFirst, localSaveFlag）
                            //getImage($scope, img, fileName, id, false, true);
                            $scope.image = " ";
                        }
                    });
                    
                }, function(){
                    console.log("file entry error");
                    $scope.image = " ";
                });
            } , function(error) { console.log("file system error" + error.code); } );
        //});
    }
    
    // ローカルファイル削除
    imageService.removeFile = function(fileName) {
        document.addEventListener('deviceready', function() {
            var dirPath = cordova.file.dataDirectory;
            window.resolveLocalFileSystemURL(dirPath, function(fileSystem) { 
                fileSystem.getFile(fileName , {create:true, exclusive:false}, function(entry) {
                    entry.remove(function(){console.log("remove success")});
                }, function(){  });
            } , function() { } );
        });
    }
   
   return imageService;
   
   // サーバから画像ファイル取得
   function getImage($scope, img, fileName, imgId, isFirst, localSaveFlag) {
       
        var imgUrl = getImageUrl(img);
        var response = HttpService.httpImgGET(imgUrl);
        
        response.then(function(res){
            var type = res.data.body.contentType;
            var image = res.data.body.image;
            if(image) {
                var blob = convertBlob(image, type);
                // ローカルに保存する場合
                if(localSaveFlag) {
                    imageService.writeFile($scope, fileName, blob, imgId, img);
                }
                
                if($scope) {
                    if(!($scope.imageList)) $scope.imageList = [];
                    $timeout(function() {
                        $scope.$apply(function() {
                                //$scope.imageList[imgId] = getBase64(image, type);
                                if(!($scope.imageList)) $scope.imageList = [];
                                if(img && img.key) {
                                    $scope.imageList[img.key] = getBase64(image, type);
                                } else {
                                    $scope.imageList[imgId] = getBase64(image, type);
                                }
                            
                        });
                    });
                }
            }
        });
        
       response.catch(function(res){
           console.log("[error] image get" + JSON.stringify(res));
           // API叩くのが1回めの場合だけ（2回目以降はローカルにファイルがない場合にサーバから取得しようとしてるから読み込みしない）
            if(isFirst) {
                imageService.readFile($scope, img, fileName, imgId);
            }
        });
    }
   
   // Base64とファイルタイプからBlobを生成します。
    function convertBlob(image, type) {
        
        var data = "data:" + type + ";base64," + image;
        var bin = atob(data.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        var blob = new Blob([buffer.buffer], {type: type});
        return blob;
    }
    
    function getBase64(image, type) {
        var data = "data:" + type + ";base64," + image;
        return data;
    }
   
   // 画像取得 API の URL 生成
   function getImageUrl(img) {
       var url = null;
       switch(img.type) {
           case "banner" :
               url = ApiUrl.CONTEXT_URL.TOP + '/contents/' + img.id + '/banner/image';
               break;
               
            case "content" :
                if(img.no) {
                    url = ApiUrl.CONTEXT_URL.TOP + '/contents/' + img.id + '/' + img.no + '/image';
                } else {
                    url = ApiUrl.CONTEXT_URL.TOP + '/contents/' + img.id + '/image';
                }
                break;
                
            case "recommend" :
                url = ApiUrl.CONTEXT_URL.TOP + '/recommends/' + img.id + '/' + img.no + '/image';
                break;
                
            case "document" :
                url = ApiUrl.CONTEXT_URL.NOTICE + "/documents/" + img.id + "/image";
                break;
                
            case "shop" : 
                url = ApiUrl.CONTEXT_URL.SHOP + "/shops/" + img.id + "/image";
                break;
            
            case "coupon" :
                url = ApiUrl.CONTEXT_URL.COUPON + "/coupons/" + img.id + "/image";
                break;
       }
       return url;
    }
   
});