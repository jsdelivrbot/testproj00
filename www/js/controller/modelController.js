/**
 * モデル情報コントローラー
 */
app.controller("ModelController", function($scope, StylingService) {
    var form = {};
    
    /**
     * 初期処理
     */
    $scope.init = function() {
        $scope.form = {};
        StylingService.searchModel($scope);
    }
    
    /**
     * モデル登録
     */
    $scope.create = function(form) {
        console.log(JSON.stringify(form));
        ons.notification.confirm({
            message: "登録しますか？",
            title: "確認",
            callback: function(index) {
                if(index == 1) {
                    StylingService.createModel($scope, form);
                }
            }
        });
    }
    
    /**
     * モデル削除
     */
    $scope.delete = function(modelId) {
        ons.notification.confirm({
            message: "削除しますか？",
            title: "確認",
            callback: function(index) {
                if(index == 1) {
                    StylingService.deleteModel($scope, modelId);
                }
            }
        });
    }
});