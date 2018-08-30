app.controller("AppController", function($scope, $interval, $rootScope, LocalStorageKey, SharedScopes, StorageService, ShopService, CommonService) {
    
    $scope.init = function() {
        ShopService.updateLocalShop();
        var shop = StorageService.getItem(LocalStorageKey.MASTER_SHOP);
        if(!shop) {
            ons.notification.alert({
                message: "「設定」メニューより店舗を設定してください。",
                title: "",
                callback: function() {
                    menuTab.setActiveTab(4);
                }
            });
        } else {
            $rootScope.shopName = shop.shopName;
        }
        
        // 1時間おきに更新
        $interval(function() {
            CommonService.updateAppData();
        }, 3600000);
    }
    
});