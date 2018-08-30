app.controller("ReserveController", function($scope, ReserveStatus, RequestService, DateService) {
    
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
        if(validate(reserveDetail)) {
            return;
        }
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
    
    function validate(detail) {
        var errorMessage = "";
        var errorFlag = false;
        if(detail.status == ReserveStatus.RESERVE) {
            if(!detail.limitDate) {
                errorMessage += "期限を設定してください。<br/>";
                errorFlag = true;
            } else if(DateService.toDate(detail.limitDate) <= new Date(DateService.getCurrentDateToString())) {
                errorMessage += "期限は明日以降で設定してください";
                errorFlag = true;
            }
        }
        
        if(errorFlag) {
            ons.notification.alert({
                messageHTML: errorMessage,
                title: "エラー"
            });
        }
        
        return errorFlag;
    }
    
});