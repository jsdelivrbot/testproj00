app.service("StorageService", function($rootScope, LocalStorageKey) {
    
    var storageService = {};
    
    /**
     * 設定店舗の店舗コード取得
     */
    storageService.getShop = function() {
        return storageService.getItem(LocalStorageKey.MASTER_SHOP);
    }
    
    /**
     * 店舗設定
     */
    storageService.setShop = function(shop) {
        console.log(JSON.stringify(shop));
        storageService.setItem(LocalStorageKey.MASTER_SHOP, shop);
    }
    
    /**
     * 
    
    /**
     * ログイン情報取得
     */
    storageService.getLoginInfo = function() {
        
        var item = localStorage.getItem(LocalStorageKey.LOGIN_INFO);
        return (item ? JSON.parse(item) : null);
    }
    
    /**
     * ログイン情報のローカル保存
     */
    storageService.saveLoginInfo = function(loginId, password) {
        
        var loginInfo = {
            loginId: loginId,
            password: password
        }
        localStorage.setItem(LocalStorageKey.LOGIN_INFO, JSON.stringify(loginInfo));
        $rootScope.loginInfo = loginInfo;
    }

    /**
     * ログイン情報削除
     */
    storageService.removeLoginInfo = function() {
        storageService.removeItem(LocalStorageKey.LOGIN_INFO);
        storageService.removeItem(LocalStorageKey.COUPON);
        storageService.removeItem(LocalStorageKey.COUPON_LAST_UPDATE);
        couponNavi.resetToPage();
        $rootScope.loginInfo = null;
    }
    
    // 端末ID取得
    storageService.getDeviceId = function() {
       // ローカルから端末ID取得
       
        var deviceId = null;
        try{
            deviceId = storageService.getItem(LocalStorageKey.DEVICE_ID);
        } catch(e) {
            console.log(e);
            deviceId = localStorage.getItem(LocalStorageKey.DEVICE_ID);
        }
       
       // ローカルに無ければダミーを取得
        if(!deviceId) {
            deviceId = storageService.getDummyDeviceId();
            storageService.setItem(LocalStorageKey.DEVICE_ID, deviceId);
        }
    
       return deviceId;
    }
   
    // ダミー端末ID取得
    storageService.getDummyDeviceId = function() {
        return "dummy_" + device.uuid;
    }
    
    /**
     * ローカルストレージから取得
     */
    storageService.getItem = function(key) {
        var item = localStorage.getItem(key);
        return (item ? JSON.parse(item) : null);
    }
    
    storageService.setItem = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    storageService.removeItem = function(key) {
        localStorage.removeItem(key);
    }
    
    return storageService;
    
       
    function success(value) {
        console.log('Success ' + value);
    }
    
    function error(error) {
      console.log('Error ' + error);
    }
    
});