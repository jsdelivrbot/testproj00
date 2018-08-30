/**
 * スタイリングサービス
 */
app.service("StylingService", function($cordovaFile, ApiUrl, LocalStorageKey, Flag, CommonService, HttpService, DateService, StorageService) {
    
    var stylingService = {};
    
    /**
     * モデル一覧取得
     */
    stylingService.searchModel = function($scope) {
        var shop = StorageService.getShop();
        
        if(!shop) {
            if(menuTab.getActiveTabIndex() == 4) {
                ons.notification.alert({
                    message: "店舗設定を行ってください。",
                    title: "",
                    callback: function() {
                        configNavi.popPage();
                    }
                });
            }
            return;
        }
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/models/" + shop.shopCode;
        var param = {
            shopPassword: shop.shopPassword
        }
        
        var response = HttpService.httpGET(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            $scope.modelList = res.data.body.modelList;
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
        });
    }
    
    /**
     * モデル登録
     */
    stylingService.createModel = function($scope, param) {
        var shop = StorageService.getShop();
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/models/" + shop.shopCode + "/create";
        param.shopPassword = shop.shopPassword;
        
        var response = HttpService.httpPOST(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            $scope.form = {
                nickname: "",
                tall: "",
                modelContents: ""
            };
            stylingService.searchModel($scope);
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            ons.notification.alert({
                message: "モデルの登録に失敗しました。",
                title: "エラー"
            });
        })
    }
    /**
     * モデル情報削除
     */
    stylingService.deleteModel = function($scope, modelId) {
        var shop = StorageService.getShop();
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/models/" + shop.shopCode + "/" + modelId + "/delete";
        var param = {
            shopPassword: shop.shopPassword
        }
        
        var response = HttpService.httpPOST(url, param);
        
        response.then(function(res) {
            stylingService.searchModel($scope);
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            ons.notification.alert({
                message: "モデルの削除に失敗しました。",
                title: "エラー"
            });
        })
    }
    
    /**
     * スタイリング登録
     */
    stylingService.createStyling = function($scope, form) {
        var shop = StorageService.getShop();
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/stylings/" + shop.shopCode + "/create";
        form.itemList = getItemList(form);
        form.shopPassword = shop.shopPassword;
        form = setModel(form);
        
        var response;
        
        if(form.image) {
            var fileUrl = form.image;
            var directory = fileUrl.substr(0, fileUrl.lastIndexOf('/'));
            var fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
            var formData = HttpService.createFormData(form);
            
            upload(directory, fileName, url, formData);
        } else {
            var response = HttpService.httpPOST(url, form);
            
            response.then(createSuccess);
            
            response.catch(createError);
        }
    }
    
    function upload(directory, fileName, url, formData) {
        window.resolveLocalFileSystemURL(directory, function(fileSystem) {
            fileSystem.getFile(fileName , {create:true, exclusive:false}, function(entry) {
                entry.file(function (file) {
                    var reader = new FileReader();
            
                    reader.onloadend = function() {
            
                        var imgBlob = new Blob([new Uint8Array(this.result)], { type: "image/jpeg" } );
                        formData.append("image", imgBlob);
                        response = HttpService.httpImgPOST(url, formData);
                        
                        response.then(createSuccess);
                        
                        response.catch(createError);
                    };
                    
                    reader.onerror = function() {
                        ons.notification.alert({
                            message: "ファイルの送信に失敗しました。",
                            title: "エラー"
                        });
                    }
            
                    reader.readAsArrayBuffer(file);
                
                }, function(error) {
                    ons.notification.alert({
                        message: "ファイルの送信に失敗しました。",
                        title: "エラー"
                    });
                });
            });
        });
    }
//    
//    function upload(directory, fileName, url, formData) {
//        console.log(directory);
//        var checkFile = $cordovaFile.checkFile(directory, fileName);
//        checkFile.then(function(entry) {
//            entry.file(function(entryfile) {
//                
//                var fr = new FileReader();
//                fr.onloadend = function () {
//                    var imgBlob = new Blob([new Uint8Array(this.result)], { type: "image/jpeg" } );
//                    formData.append("image", imgBlob);
//                    response = HttpService.httpImgPOST(url, formData);
//                    
//                    response.then(createSuccess);
//                    
//                    response.catch(createError);
//                }
//                
//                fr.onerror = function() {
//                    ons.notification.alert({
//                        message: "ファイルの送信に失敗しました。",
//                        title: "エラー"
//                    });
//                }
//                
//                fr.readAsArrayBuffer(entryfile);
//            })
//        });
//        
//        checkFile.catch(function(res) {
//            console.log("check file error: " + JSON.stringify(res));
//        });
//    }
//    
    /**
     * 商品情報取得
     */
    function getItemList(form) {
        var itemList = null;
        if(form.itemCode1) {
            itemList = (itemList) ? (itemList + "," + form.itemCode1) : form.itemCode1;
        }
        if(form.itemCode2) {
            itemList = (itemList) ? (itemList + "," + form.itemCode2) : form.itemCode2;
        }
        if(form.itemCode3) {
            itemList = (itemList) ? (itemList + "," + form.itemCode3) : form.itemCode3;
        }
        if(form.itemCode4) {
            itemList = (itemList) ? (itemList + "," + form.itemCode4) : form.itemCode4;
        }
        if(form.itemCode5) {
            itemList = (itemList) ? (itemList + "," + form.itemCode5) : form.itemCode5;
        }
        if(form.itemCode6) {
            itemList = (itemList) ? (itemList + "," + form.itemCode6) : form.itemCode6;
        }
        if(form.itemCode7) {
            itemList = (itemList) ? (itemList + "," + form.itemCode7) : form.itemCode7;
        }
        if(form.itemCode8) {
            itemList = (itemList) ? (itemList + "," + form.itemCode8) : form.itemCode8;
        }
        if(form.itemCode9) {
            itemList = (itemList) ? (itemList + "," + form.itemCode9) : form.itemCode9;
        }
        if(form.itemCode10) {
            itemList = (itemList) ? (itemList + "," + form.itemCode10) : form.itemCode10;
        }
        return itemList;
    }
    
    /**
     * モデル情報set
     */
    function setModel(param) {
        var model = param.model;
        if(!model) return param;
        
        param.modelName = model.nickname;
        param.modelHeight = model.tall;
        param.modelText = model.modelContents;
        return param;
    }
    
    function createSuccess() {
        ons.notification.alert({
            message: "登録しました。管理画面から情報を編集してください。",
            title: "完了",
            callback: function() {
                vmdNavi.resetToPage();
            }
        });
    }
    
    function createError(res) {
        console.log(JSON.stringify(res));
        var message = (res.data.rootResponse) ? res.data.rootResponse.errorMessage : res.data.errorMessage;
        ons.notification.alert({
            message: (message) ? message : "スタイリングの登録に失敗しました。",
            title: "エラー"
        });
    }
    
    return stylingService;
});