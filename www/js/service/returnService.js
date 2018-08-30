/**
 * 返品サービス
 */
app.service("ReturnService", function($rootScope, ApiUrl, LocalStorageKey, Flag, CommonService, HttpService, DateService, StorageService) {
    
    var returnService = {};
    
    /**
     * 返品一覧取得
     */
    returnService.searchReturnItem = function($scope, param) {
        var shop = StorageService.getShop();
        if(!shop) return;
        
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/returns/" + shop.shopCode;
        if(!param) param = {};
        param.shopPassword = shop.shopPassword;
        
        var response = HttpService.httpGET(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            var returnItemList = res.data.body.returnedItemList;
            $scope.returnItemList = returnItemList;
            checkUntreated(returnItemList);
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
        });
    }
    
    function checkUntreated(list) {
        $rootScope.returnUntreated = false;
        var dialogFlag = false;
        var checkDate = new Date();
        checkDate.setDate(checkDate.getDate()-3);
        angular.forEach(list, function(returnItem) {
            if(returnItem.status == "01") {
                $rootScope.returnUntreated = true;
                var requestDate = new Date(returnItem.returnRequestDate);
                if(requestDate <= checkDate) {
                    dialogFlag = true;
                }
            }
        });
        
        if(dialogFlag) {
            ons.notification.alert({
                messageHTML: "未処理の返品依頼があります。<br>至急確認してください。",
                title: "確認"
            });
        }
    }
    
    /**
     * 返品詳細取得
     */
    returnService.searchReturnItemDetail = function($scope, returnItem) {
        var shop = StorageService.getShop();
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/returns/" + shop.shopCode + "/" + returnItem.returnedId;
        
        var param = {
            shopPassword: shop.shopPassword,
            itemId: returnItem.itemId,
            lcvSizeId: returnItem.lcvSizeId,
            lcvColorId: returnItem.lcvColorId
        };
        
        var response = HttpService.httpGET(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            $scope.detail = res.data.body;
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
        });
    }
    
    /**
     * 返品処理
     */
    returnService.updateReturnItem = function($scope, returnItem) {
        var shop = StorageService.getShop();
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/returns/" + shop.shopCode + "/" + returnItem.returnedId + "/update";
        var param = {
            shopPassword: shop.shopPassword,
            itemId: returnItem.itemId,
            lcvSizeId: returnItem.lcvSizeId,
            lcvColorId: returnItem.lcvColorId
        };
        
        var response = HttpService.httpPOST(url, param);
        
        response.then(function(res) {
            ons.notification.alert({
                message: "更新しました。",
                title: "完了",
                callback: function() {
                    returnNavi.resetToPage();
                }
            });
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            var message = (res.data.rootResponse) ? res.data.rootResponse.errorMessage : res.data.errorMessage;
            ons.notification.alert({
                message: (message) ? message : "更新に失敗しました。",
                title: "エラー"
            });
        });
    }
    
    return returnService;
}); 