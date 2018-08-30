app.controller("ConfigController", function($scope, LocalStorageKey, StorageService, ShopService) {
    
    $scope.init = function() {
        //ShopService.updateLocalShop();
        var shop = StorageService.getItem(LocalStorageKey.MASTER_SHOP);
        var staff = StorageService.getItem(LocalStorageKey.MASTER_STAFF);
        if(shop) $scope.shop = shop;
        if(staff) $scope.staffCode = staff.code;
    }
    
    $scope.prefInit = function() {
        ShopService.getPrefectureList($scope);
    }
    
    $scope.shopListInit = function() {
        // 前ページからのデータ取得
        var data = configNavi.topPage.data;
        var prefectureCode = data.prefectureCode;
        
        $scope.prefCode = prefectureCode;
        ShopService.searchByPrefecture($scope, prefectureCode);
    }
    
    $scope.changeShop = function(shop) {
        ons.notification.prompt({
            message: shop.shopName + "を設定します。",
            title: "確認",
            inputType: "password",
            placeholder: "パスワードを入力",
            callback: function(password) {
                console.log(password);
                ShopService.checkShopPassword($scope, shop.shopCode, password);
            }
        });
    }
    
});