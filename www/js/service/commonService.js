'use strict';

/**
 * 全画面共通サービス
 */
app.service('CommonService', function($rootScope, StorageService, SharedScopes) {
    var commonService = {};
    var barcodeOption = {
        barWidth: 2,
        barHeight: 60,
        fontSize: 0,
    }
    
    commonService.updateAppData = function() {
//        var requestScope = SharedScopes.getScope("REQUEST");
//        requestScope.listInit();
//        var returnScope = SharedScopes.getScope("RETURN");
//        returnScope.init();
//        var chatScope = SharedScopes.getScope("CHAT");
//        chatScope.listInit();
        commonService.resetToPage(0);
        commonService.resetToPage(1);
        commonService.resetToPage(3);
    }
    /**
     * デバイスタイプ（ios/android）取得
     */
    commonService.getDeviceType = function() {
        if(monaca.isAndroid) {
            return "android";
        }else if(monaca.isIOS) {
            return "ios";
        }
    };
    
    /**
     * 内部ブラウザ表示
     */
    commonService.openUrl = function(url) {
        window.open(encodeURI(url), '_blank', 'location=no,closebuttoncaption=閉じる,enableViewportScale=yes');
    }
    
    /**
     * 外部ブラウザ表示
     */
    commonService.openExternalBrowser = function(url) {
        window.open(encodeURI(url), '_system');
    }
    
    commonService.getNavigator = function() {
        var activeTab = menuTab.getActiveTabIndex();
        switch(activeTab) {
            case 0:
                return requestNavi;
                break;
            case 1:
                return chatNavi;
                break;
            case 2:
                break;
            
            case 1:
                return chatNavi;
                break;
            case 2:
                return configNavi;
                break;
        }
    }
    
    /**
     * 共通用プッシュページ
     */
    commonService.pushPage = function(pageName, data) {
        var activeTab = menuTab.getActiveTabIndex();
        switch(activeTab) {
            case 0:
                requestNavi.pushPage(pageName, data);
                break;
            case 1:
                returnNavi.pushPage(pageName, data);
                break;
            case 2:
                break;
            case 3:
                chatNavi.pushPage(pageName, data);
                break;
            case 4:
                configNavi.pushPage(pageName, data);
                break;
        }
    }
    
    /**
     * 共通用ポップページ
     */
    commonService.popPage = function(options) {
        var activeTab = menuTab.getActiveTabIndex();
        switch(activeTab) {
            case 0:
                requestNavi.popPage(options);
                break;
            case 1:
                returnNavi.popPage(options);
                break;
            case 2:
                break;
            case 3:
                chatNavi.popPage(options);
                break;
            case 4:
                configNavi.popPage(options);
                break;
        }
    }
    
    /**
     * 共通用リプレースページ
     */
    commonService.replacePage = function(pageName) {
        var activeTab = menuTab.getActiveTabIndex();
        switch(activeTab) {
            case 0:
                requestNavi.replacePage(pageName);
                break;
            case 1:
                returnNavi.replacePage(pageName);
                break;
            case 2:
                break;
            case 3:
                chatNavi.replacePage(pageName);
                break;
            case 4:
                configNavi.replacePage(pageName);
                break;
        }
    }
    
    /**
     * ナビゲーターのリセット
     */
    commonService.resetToPage = function(activeTab) {
        if(!activeTab) activeTab = menuTab.getActiveTabIndex();
        switch(activeTab) {
            case 0:
                requestNavi.resetToPage();
                break;
            case 1:
                returnNavi.resetToPage();
                break;
            case 2:
                vmdNavi.resetToPage();
                break;
            case 3:
                chatNavi.resetToPage();
                break;
            case 4:
                configNavi.resetToPage();
                break;
        }
    }
    
    /**
     * マップ形式のデータを配列に変換
     */
    commonService.mapToList = function(mapList) {
        var resultList = [];
        // データを配列に詰め替え
        angular.forEach(mapList, function(item) {
          this.push(item);
        }, resultList);
        return resultList;
    }
    return commonService;
   
}).run(function($rootScope, CommonService) {
    $rootScope.CommonService = CommonService;
  }
);