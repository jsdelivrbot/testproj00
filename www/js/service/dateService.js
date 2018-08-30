'use strict';

/**
 * 日付系サービス
 */
app.service('DateService',function(){
    var dateService = {
        dateSplit : null,
        toDate : null,
        toISODate : null,
        formatDate : null
    };

    // 生年月日の文字列を"/"区切りの配列で返します
    dateService.dateSplit = function(dateStr){
        if(dateStr == null) {
            return null;
        }
        var dateSprit = dateStr.split('/');
        return dateSprit;
    };

    // 日付の文字列をdate型に変更します
    dateService.toDate = function(dateStr){
        var date = (dateStr ? new Date(dateStr) : null);
        return date;
    };
    
    dateService.toJSTDate = function(dateStr, format) {
        
        var date = new Date(dateStr);
        var resultDate = date.toLocaleString();

        if(format) {
            return dateService.formatDate(new Date(resultDate), format);
        }
        return resultDate;
    };

    // Date型を文字列にフォーマットします
    dateService.formatDate = function (date, format) {
        if(!date) return null;
        if (!format) format = 'yyyy/MM/dd hh:mm:ss';
        format = format.replace(/yyyy/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        
        return format;
    };
    
    // 当日00:00:00の文字列を返します
    dateService.getCurrentDateToString = function() {
        var today = new Date();
        var result = today.getFullYear() + "/" + ("0" + (today.getMonth() + 1)).slice(-2) + "/" + ('0' + today.getDate()).slice(-2) + " 00:00:00";
        console.log(result);
        return result;
    }
    
    /**
     * 前日00:00:00を取得します
     */
    dateService.getLastDate = function() {
        var todayStr = dateService.getCurrentDateToString();
        var today = new Date(todayStr);
        today.setDate(today.getDate()-1);
        return today;
    }

    return dateService;
    
}).run(function($rootScope, DateService) {
    $rootScope.DateService = DateService;
});

