app.controller("ReturnController", function($scope, SharedScopes, ReturnService) {
    
    /**
     * 一覧初期処理
     */
    $scope.init = function() {
        SharedScopes.setScope("RETURN", $scope);
        ReturnService.searchReturnItem($scope);
    }
    
    /**
     * 顧客検索
     */
    $scope.search = function(condition) {
        ReturnService.searchReturnItem($scope, condition);
    }
    
    /**
     * 詳細初期処理
     */
    $scope.detailInit = function() {
        var data = returnNavi.topPage.data;
        ReturnService.searchReturnItemDetail($scope, data);
        
    }
    
    /**
     * 返品確認
     */
    $scope.confirm = function(item) {
        ons.notification.confirm({
            message: "返品を確定します。よろしいですか？",
            title: "確認",
            callback: function(index) {
                if(index == 1) {
                    ReturnService.updateReturnItem($scope, item);
                }
            }
        });
    }
});