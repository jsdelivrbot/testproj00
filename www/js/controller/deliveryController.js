app.controller("DeliveryController", function($scope, DeliveryStatus, RequestService) {
    
    /**
     * 配送詳細初期処理
     */
    $scope.detailInit = function() {
        
        var data = requestNavi.topPage.data;
        RequestService.searchDeliveryDetail($scope, data.orderId);
    }
    
    /**
     * 配送情報更新
     */
    $scope.change = function(order) {
        if(check(order)) return;
        ons.notification.confirm({
            message: "更新します。よろしいですか？",
            title: "確認",
            callback: function(index) {
                if(index == 1) {
                    RequestService.updateDelivery($scope, order);
                }
            }
        });
    }
    
    function check(order) {
        var deliveryFlag = false;
        var checkFlag = false;
        angular.forEach(order.orderDetailList, function(detail) {
            if(detail.status == DeliveryStatus.DELIVERY) {
                deliveryFlag = true;
            }
            if(detail.status == DeliveryStatus.CHECKING) {
                checkFlag = true;
            }
        });
        if(deliveryFlag && checkFlag) {
            ons.notification.alert({
                message: "ステータス変更に不備があります。",
                title: "エラー"
            });
            return true;
        }
        return false;
    }
});