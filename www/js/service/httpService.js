"use strict";

/**
 * HTTP 通信系サービス
 */
app.service('HttpService', function ($http, ApiUrl) {
    
    var httpService = {};
    
    // GET 通信
    httpService.httpGET = function(url, params){
        return $http({
            url : ApiUrl.BASE_URL + url,
            timeout : 3000,
            method : 'GET',
            params : params
        });
    };
    
    // GET 通信（画像用）
    httpService.httpImgGET = function(url){
        return $http({
            url : ApiUrl.BASE_URL + url,
            timeout : 10000,
            method : 'GET',
            headers : {
                responseType: 'arraybuffer'
            }
        });
    };
    
    // バージョン取得
    httpService.getVersionJSON = function () {
        return $http.get(ApiUrl.VERSION_URL);
    }
    
    // POST 通信
    httpService.httpPOST = function(url, data){
        var httpUrl = ApiUrl.BASE_URL + url;
        return $http({
            url : ApiUrl.BASE_URL + url,
            timeout : 3000,
            method : 'POST',
            data : data
        });
    };
    
    httpService.httpImgPOST = function(url, formData) {
        var httpUrl = ApiUrl.BASE_URL + url;
        return $http({
            url: httpUrl,
            timeout: 5000,
            method: "POST",
            transformRequest: null,
            data: formData,
            headers: {'Content-type':undefined },
        });
    }
    
    //formの変数名をキーにMultiPart送信用のデータを作ります
    httpService.createFormData = function (form) {
        var formData = new FormData();
        angular.forEach(form, function(data, key) {
            if(key != "model") {
                if(data) {
                    formData.append(key, data);
                }
            }
        });
        
        return formData;
    }

    return httpService;
});