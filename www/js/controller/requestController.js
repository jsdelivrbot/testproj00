app.filter('requestFilter', [function() {
  return function (data, query) {
    var typeList = [];
    var results = [];
    console.log(query.type);
    switch(query.type) {
        // 取り置き
        case "01" :
            angular.forEach(data, function(val) {
                if(val.type == query.type) {
                    switch(query.status) {
                        // 未処理
                        case "00":
                            // 取り置き依頼、在庫確認中、キャンセル、期限切れ
                            if(val.status == "00" || val.status == "01" || val.status == "09" || val.limitFlag) {
                                results.push(val);
                            }
                            break;
                        // 取置中    
                        case "01":
                            if(val.status == "02" && !val.limitFlag) {
                                results.push(val);
                            }
                            break;
                        // 処理済み
                        case "02":
                            if(val.status == "03" || val.status == "04") {
                                results.push(val);
                            }
                            break;
                        // ALL
                        case "99":
                            results.push(val);
                            break;
                    }
                }
            });
            break;
        // 配送
        case "02":
            angular.forEach(data, function(val) {
                if(val.type == query.type) {
                    switch(query.status) {
                        // 未処理
                        case "00":
                            if(val.status == "00" || val.status == "01") {
                                results.push(val);
                            }
                            break;
                        // 処理済み
                        case "01":
                            if(val.status == "02" || val.status == "04" || val.status == "07") {
                                results.push(val);
                            }
                            break;
                        // ALL
                        case "99":
                            results.push(val);
                            break;
                    }
                }
            });
            break;
        // 試着
        case "03": 
            angular.forEach(data, function(val) {
                if(val.type == "02" && val.status == "02") {
                    if((val.paymentFlag == "01" && !val.visibleLimitFlag) || val.paymentFlag == "02" && val.paid == "0") {
                        switch(query.status) {
                            // 試着中
                            case "00":
                                if(!val.limitFlag) {
                                    results.push(val);
                                }
                                break;
                            // 期限切れ
                            case "01":
                                if(val.limitFlag) {
                                    results.push(val);
                                }
                                break;
                            // ALL
                            case "99":
                                results.push(val);
                                break;
                        }
                    }
                }
            });
            break;
    }
    
    return results;
  }
}]);

app.controller("RequestController", function($scope, SharedScopes, Flag, RequestStatus, ReserveStatus, DeliveryStatus, SharedScopes, SearchCondition, RequestService) {
    
    /**
     * 一覧初期処理
     */
    $scope.listInit = function() {
        SharedScopes.setScope("REQUEST", $scope);
        $scope.requestType = RequestStatus.RESERVE;
        $scope.filterStatus = ReserveStatus.REQUEST;
        $scope.limitFlag = false;
        $scope.ascFlag = true;
        RequestService.searchRequestItem($scope, null, $scope.ascFlag, true);
    }
    
    $scope.changeFilter = function(status, limitFlag) {
        $scope.filterStatus = status;
        $scope.limitFlag = limitFlag;
    }
    
    $scope.changeRequest = function(requestType) {
        $scope.requestType = requestType;
        $scope.filterStatus = "00";
    }
    
    $scope.sort = function() {
        $scope.ascFlag = !($scope.ascFlag);
        RequestService.searchRequestItem($scope, $scope.form, $scope.ascFlag, false);
    }
    
    /**
     * タブ切り替え
     */
    $scope.changeTab = function(index) {
        $scope.request = index;
    }
    
    /**
     * ステータス適用クラス判定
     */
    $scope.getStatusColor = function(status) {
        var style = {};
        switch(status) {
            case ReserveStatus.REQUEST:
            case ReserveStatus.CHECKING:
                style.color = "#FA5882";
                break;
            case ReserveStatus.RESERVE:
            case ReserveStatus.PICKUP:
                style.color = "#FD9904";
                break;
            case ReserveStatus.NO_STOCK:
            case ReserveStatus.CANCEL:
                style.color = "#81BEF7";
                break;
        }
        return style;
    }
    
    /**
     * 顧客検索
     */
    $scope.search = function(condition) {
        RequestService.searchRequestItem($scope, condition, $scope.ascFlag);
    }
    
    /**
     * 詳細遷移
     */
    $scope.showDetail = function(item) {
        SharedScopes.setScope("REQUEST", $scope);
        if(item.status == "00") {
            RequestService.updateStatus(item.requestId, item.type);
        } else {
            if(item.type == RequestStatus.RESERVE) {
                requestNavi.pushPage("reserveDetail.html", {data: {reserveId: item.requestId}});
            } else if(item.type == RequestStatus.DELIVERY) {
                requestNavi.pushPage("deliveryDetail.html", {data: {orderId: item.requestId}});
            }
        }
    }
    
    /**
     * 詳細初期処理
     */
    $scope.reserveDetailInit = function() {
        var data = requestNavi.topPage.data;
        $scope.reserveId = data.reserveId;
        RequestService.searchReserveDetail($scope, data.reserveId);
    }
    
    /**
     * 更新
     */
    $scope.change = function(reserveDetail) {
        ons.notification.confirm({
            message: "更新します。よろしいですか？",
            title: "確認",
            callback: function(index) {
                if(index == 1) {
                    RequestService.updateReserve($scope, reserveDetail);
                }
            }
        });
    }
    
});