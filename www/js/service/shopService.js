"use strict";

/**
 * 店舗系のサービス
 */
app.service('ShopService',  function ($rootScope, $timeout, LocalStorageKey, ApiUrl, Flag, Prefectures, HttpService, StorageService, CommonService, ImageService) {
    var shopService = {};
    var map, detailMap;
    var markers = [];
    var prefecture;
    var maxDistance = 5000;
    var directionsDisplay;
    var directionsService;
    var rendererOptions = {
        draggable: false
    };
    
    /**
     * ローカルストレージの店舗情報更新
     */
    shopService.updateLocalShop = function() {
        
        var updateDate = StorageService.getItem(LocalStorageKey.STORES_LAST_UPDATE);
        
        var url = ApiUrl.CONTEXT_URL.SHOP + '/shops';
        var param = {
            fromCreateDate : updateDate,
            fromUpdateDate : updateDate
        };
        
        var response = HttpService.httpGET(url, param);
        
        // 通信成功時
        response.then(function(res){
            var shopList = res.data.body.shopList;
            shopService.updateLocalData(shopList);
        });
        
        // 通信失敗時
        response.catch(function(res) {
            console.log("[error] get store : " + JSON.stringify(res));
        });
    }
    
    /**
     * 差分の店舗情報更新
     */
    shopService.updateLocalData = function(shopList) {
        // ローカルデータ取得
        var localShopList = StorageService.getItem(LocalStorageKey.STORES);
        if (!localShopList) localShopList = {};
        
        // 差分がある場合
        if(shopList && shopList.length > 0) {
            // 最終更新日を更新
            var updateDate = shopList[0].updateDate;
            StorageService.setItem(LocalStorageKey.STORES_LAST_UPDATE, updateDate);
            
            angular.forEach(shopList, function(shop) {
                // 
                var prefShopList = StorageService.getItem(LocalStorageKey.STORES_PREFECTURE + shop.prefecturesCode);
                if(!prefShopList) prefShopList = {};
                
                var id = "shop" + shop.shopCode;
                
                // 削除済み店舗ならリストから削除
                if(shop.deleteFlag || shop.deleteFlag == 'true' || !isActive(shop)) {
                    delete localShopList[id];
                    delete prefShopList[id];
                }
                // そうでなければセット
                else {
                    localShopList[id] = shop;
                    prefShopList[id] = shop;
                }
                
                StorageService.setItem(LocalStorageKey.STORES_PREFECTURE + shop.prefecturesCode, prefShopList);
            });
        
        }
        // 店舗情報保存
        StorageService.setItem(LocalStorageKey.STORES, localShopList);
        
    }
    
    /**
     * 店舗のある都道府県取得
     */
    shopService.getPrefectureList = function($scope) {
        $scope.imageList = [];
        var shopList = {};
        angular.forEach(Prefectures.list, function(pref) {
            var prefShopList = StorageService.getItem(LocalStorageKey.STORES_PREFECTURE + pref.id);
            shopList[pref.id] = prefShopList;
        });
        console.log(JSON.stringify(shopList));
        $scope.prefShopList = shopList;
    }

    
    /**
     * 都道府県検索
     */
    shopService.searchByPrefecture = function($scope, prefectureCode) {
        var shopList = StorageService.getItem(LocalStorageKey.STORES_PREFECTURE + prefectureCode);
        console.log(JSON.stringify(shopList));
        $scope.shopList = CommonService.mapToList(shopList);
    }
    
    /**
     * 店舗一覧情報の取得
     */
    shopService.searchShop = function($scope, param) {

        // マーカーの削除
        removeShopMakers();
        
        var url = ApiUrl.CONTEXT_URL.SHOP + "/shops";
        
        var response = HttpService.httpGET(url, param);
        
        // 通信成功時
        response.then(function(res) {
            var shopList = res.data.body.shopList;
            $scope.shopList = shopList;
        });
        
        // 通信失敗時
        response.catch(function(res) {
            console.log("error:" + JSON.stringify(res));
        });
    };
    
    /**
     * 店舗設定用（パスワードチェック）
     */
    shopService.checkShopPassword = function($scope, shopCode, password) {
        var url = ApiUrl.CONTEXT_URL.SHOP + "/shops/" + shopCode;
        
        var response = HttpService.httpGET(url);
        
        response.then(function(res) {
            var shop = res.data.body.shop;
            if(shop.shopPassword == password) {
                StorageService.setShop(shop);
                $rootScope.shopName = shop.shopName;
                ons.notification.alert({
                    message: "設定しました。",
                    title: "設定完了",
                    callback: function() {
                        configNavi.resetToPage();
                    }
                });
            } else {
                ons.notification.alert({
                    message: "パスワードが違います。",
                    title: "エラー"
                });
            }
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            ons.notification.alert({
                message: "店舗コードが不正です。",
                title: "エラー"
            });
        });
    }
    
    return shopService;
    
    // データの表示可否判定
    function isActive(shop) {
        var today = new Date();
        if(today > new Date(Date.parse(shop.closedDate))) return false;
        return true;
    }
    
    // 店舗のリストからアプリデータ処理用のIDのリストを取得
   function getShopCodeList(list) {
        var res = [];
        angular.forEach(list, function(shop) {
            this.push("shop" + shop.shopCode);
        }, res);
        
        return res;
    } 
});