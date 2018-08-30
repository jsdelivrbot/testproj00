/**
 * 取り置きサービス
 */
app.service("RequestService", function($rootScope, $timeout, ApiUrl, LocalStorageKey, Flag, RequestStatus, ReserveStatus, DeliveryStatus, SharedScopes, CommonService, HttpService, DateService, StorageService) {
    
    var requestService = {};
    
    /**
     * 依頼一覧取得
     */
    requestService.searchRequestItem = function($scope, param, ascFlag, dialogFlag) {
        var shop = StorageService.getShop();
        if(!shop) return;
        
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/request/" + shop.shopCode;
        
        if(!param) param = {};
        param.shopPassword = shop.shopPassword;
        param.sortOrder = (ascFlag) ? Flag.ON : Flag.OFF; // TODO
        
        var response = HttpService.httpGET(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            var requestList = setLimitFlag(res.data.body.deliveryRequestList);
            $scope.requestList = requestList;
            if(dialogFlag) {
                checkUntreated($scope, requestList);
            }
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
        });
    }
    
    function checkUntreated($scope, list) {
        console.log("check untreated")
        $rootScope.requestUntreated = false;
        $scope.deliveryNotification = false;
        $scope.fittingNotification = false;
        $scope.reserveNotification = false;
        var dialogFlag = false;
        
        var checkDate = new Date();
        angular.forEach(list, function(request) {
            if(request.status == "00" || request.status == "01") {
                $rootScope.requestUntreated = true;
                dialogFlag = true;
                if(request.type == RequestStatus.RESERVE) {
                    $scope.reserveNotification = true;
                } else if(request.type == RequestStatus.DELIVERY) {
                    $scope.deliveryNotification = true;
                }
//                var requestDate = new Date(request.requestDate);
//                if(requestDate <= checkDate) {
//                    dialogFlag = true;
//                }
            } else if(request.status == DeliveryStatus.DELIVERY && request.type == RequestStatus.DELIVERY && request.limitFlag) {
                dialogFlag = true;
                $rootScope.requestUntreated = true;
                $scope.fittingNotification = true;
            }
        });
        
        if(dialogFlag) {
            ons.notification.alert({
                messageHTML: "未処理の依頼があります。<br>確認してください。",
                title: "確認"
            });
        }
    }
    
    function setLimitFlag(requestList) {
        var checkDate = DateService.getLastDate();
        angular.forEach(requestList, function(request) {
            if(request.limitDate) {
                if(request.status == "02") {
//                if(request.type == RequestStatus.RESERVE && request.status == ReserveStatus.RESERVE) {
//                    request.limitFlag = (checkDate >= DateService.toDate(request.limitDate)) ? true : false;
//                } else if(request.type == RequestStatus.DELIVERY && request.status == DeliveryStatus.DELIVERY) {
                    request.limitFlag = (checkDate >= DateService.toDate(request.limitDate)) ? true : false;
                } else {
                    request.limitFlag = false;
                }
            } else {
                request.limitFlag = false;
            }
        });
        return requestList;
    }
    
    /**
     * 取り置き詳細取得
     */
    requestService.searchReserveDetail = function($scope, reserveId) {
        var shop = StorageService.getShop();
            console.log(JSON.stringify(shop));
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/reserves/" + shop.shopCode + "/" + reserveId;
        var param = {
            shopPassword: shop.shopPassword
        }
        
        var response = HttpService.httpGET(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            var detail = res.data.body;
            if(detail.limitDate) {
                detail.limitDate = detail.limitDate.replace(/\//g , "-" );
            }
            $scope.detail = detail;
            $scope.disabledFlag = (detail.status == ReserveStatus.PICKUP);
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            var message = (res.data.rootResponse) ? res.data.rootResponse.errorMessage : res.data.errorMessage;
            ons.notification.alert({
                message: (message) ? message : "データの取得に失敗しました。",
                title: "エラー",
                callback: function() {
                    CommonService.popPage();
                }
            });
        });
    }
    
    /**
     * 配送詳細取得
     */
    requestService.searchDeliveryDetail = function($scope, orderId) {
        var shop = StorageService.getShop();
        
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/orders/" + shop.shopCode + "/" + orderId;
        var param = {
            shopPassword: shop.shopPassword
        }
        
        var response = HttpService.httpGET(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res) + "shop: "+ shop.shopCode);
            var detail = res.data.body;
            $scope.order = detail;
            $scope.shopCode = shop.shopCode;
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            var message = (res.data.rootResponse) ? res.data.rootResponse.errorMessage : res.data.errorMessage;
            ons.notification.alert({
                message: (message) ? message : "データの取得に失敗しました。",
                title: "エラー",
                callback: function() {
                    CommonService.popPage();
                }
            });
        });
    }
    
    /**
     * ステータス更新（0 -> 1）
     */
    requestService.updateStatus = function(id, requestType) {
        var shop = StorageService.getShop();
        var url = ApiUrl.CONTEXT_URL.ITEM;
        if(requestType == RequestStatus.RESERVE) {
            url += "/shop/reserves/" + shop.shopCode + "/" + id + "/update";
        } else if(requestType == RequestStatus.DELIVERY) {
            url += "/shop/orders/" + shop.shopCode + "/" + id + "/update";
        }
        
        var param = {
            shopPassword: shop.shopPassword,
            status: "01"
        }
        
        var response = HttpService.httpPOST(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            if(requestType == RequestStatus.RESERVE) {
                requestNavi.pushPage("reserveDetail.html", {data: {reserveId: id}});
            } else if(requestType == RequestStatus.DELIVERY) {
                requestNavi.pushPage("deliveryDetail.html", {data: {orderId: id}});
            }
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
        });
        
        return response;
    }
    
    /**
     * 取り置き更新
     */
    requestService.updateReserve = function($scope, reserveDetail) {
        
        if(reserveDetail.status == ReserveStatus.RESERVE) {
            console.log(reserveDetail.limitDate);
            if(!reserveDetail.limitDate) {
                ons.notification.alert({
                    message: "取り置き期限を入力してください。",
                    title: "入力エラー"
                });
                return;
            } 
        }
        
        var shop = StorageService.getShop();
        var url =  ApiUrl.CONTEXT_URL.ITEM + "/shop/reserves/" + shop.shopCode + "/" + reserveDetail.reserveNo + "/update";
        var dateSplit = (reserveDetail.limitDate) ? String(reserveDetail.limitDate).split("-") : null;
        var param = {
            shopPassword: shop.shopPassword,
            status: reserveDetail.status,
            limitYear: (dateSplit) ? dateSplit[0] : null,
            limitMonth: (dateSplit) ? dateSplit[1] : null,
            limitDay: (dateSplit) ? dateSplit[2] : null,
            userMemo: reserveDetail.userMemo
        }
        
        var response = HttpService.httpPOST(url, param);
        
        response.then(function(res) {
            ons.notification.alert({
                message: "情報を更新しました。",
                title: "完了",
                callback: function() {
                    requestNavi.popPage({
                        callback: function() {
                            $timeout(function() {
                                var scope = SharedScopes.getScope("REQUEST");
                                requestService.searchRequestItem(scope, scope.form, scope.ascFlag, true);
                            });
                        }
                    });
                }
            });
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            var message = (res.data.rootResponse) ? res.data.rootResponse.errorMessage : res.data.errorMessage;
            ons.notification.alert({
                message: (message) ? message : "更新に失敗しました。",
                title: "エラー",
            });
        });
    }
    
    /**
     * 配送更新
     */
    requestService.updateDelivery = function($scope, order) {
        var shop = StorageService.getShop();
        
        var url =  ApiUrl.CONTEXT_URL.ITEM + "/shop/orders/" + shop.shopCode + "/" + order.orderId + "/update";
        
        var param = getUpdateParam(order.orderDetailList, false);
        param.shopPassword = shop.shopPassword;
        param.userMemo = order.userMemo;
        
        var response = HttpService.httpPOST(url, param);
        
        response.then(function(res) {
            ons.notification.alert({
                message: "情報を更新しました。",
                title: "完了",
                callback: function() {
                    requestNavi.popPage({
                        callback: function() {
                            $timeout(function() {
                                var scope = SharedScopes.getScope("REQUEST");
                                requestService.searchRequestItem(scope, scope.form, scope.ascFlag, true);
                            });
                        }
                    });
                }
            });
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            var message = (res.data.rootResponse) ? res.data.rootResponse.errorMessage : res.data.errorMessage;
            ons.notification.alert({
                message: (message) ? message : "更新に失敗しました。",
                title: "エラー",
            });
        });
    }
    
    
    /**
     * 更新パラメータ生成
     */
    function getUpdateParam(itemList, reserveFlag) {
        var param = {
            itemId: "",
            lcvSizeId: "",
            lcvColorId: "",
            status: "",
        }
        // 取り置きの更新時
        if(reserveFlag) param.reserveLimit = "";
        
        
        angular.forEach(itemList, function(item, index) {
            // （配送かつステータスが更新できないもの）以外を更新
            if(!(!reserveFlag && (item.status == DeliveryStatus.BUY || item.status == DeliveryStatus.RETURN
              || item.status == DeliveryStatus.RETURNED))) {
                param.itemId += (index == 0) ? item.itemId : "," + item.itemId;
                param.lcvSizeId += (index == 0) ? item.lcvSizeId : "," + item.lcvSizeId;
                param.lcvColorId += (index == 0) ? item.lcvColorId : "," + item.lcvColorId;
                param.status += (index == 0) ? item.status : "," + item.status;
                // 取り置きの更新時
                if(reserveFlag)
                param.reserveLimit += (index == 0) ? getLimitDate(item.limitDate) : "," + getLimitDate(item.limitDate);
              }
        });
        
        return param;
    }
    
    /**
     * 期限日取得
     */
    function getLimitDate(date) {
        if(!date) return "";
        var dateStr = DateService.formatDate(new Date(date), "yyyy-MM-dd");
        return dateStr;
    }
    
    return requestService;
});