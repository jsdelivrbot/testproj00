var app = angular.module('app', ['onsen', 'ngCordova', 'angular-bind-html-compile']);

// Nifty Cloud Mobile Backend のキー（アプリごとに設定）
var application_key = "9a8144d1aedc238a50a6bbfc746f8027fdf4720c4e65b7a1ca36b8703ec243b9";
var client_key = "d60a7370be0822a5332f89019dcb01c16b47cf5fc9c990808603a7841d5f69ee";

// Google Cloud のプロジェクトID
var sender_id = "996625634375";

var siteId = "coco_dev02";
var passphrase = "fashioncoco";

var secureStorage;
    
// HTTPヘッダ情報
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['sp-site-id'] = siteId;
    $httpProvider.defaults.headers.common['sp-passphrase'] = passphrase;
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
        
    $httpProvider.defaults.transformRequest = function(data) {
        if (data === undefined) {
    		return data;
		}
		return $.param(data);
	};
}]);

