/**
 * チャットサービス
 */
app.service("ChatService", function($rootScope, ApiUrl, LocalStorageKey, Flag, CommonService, HttpService, DateService, StorageService) {
    
    var chatService = {};
    
    var url = ApiUrl.BASE_URL + "/chat";
    var ioSocket;
    var userCode;
    
    /**
     * チャットルーム一覧取得
     */
    chatService.searchChatRoom = function($scope) {
        var shop = StorageService.getShop();
        if(!shop) return;
        
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/chats/chatRoom/" + shop.shopCode;
        var param = {
            shopPassword: shop.shopPassword
        }
        
        var response = HttpService.httpGET(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            var chatList = convertLastMessage(res.data.body.chatRoomList);
            $scope.chatList = chatList;
            checkUnread(chatList);
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
        });
    }
    
    function convertLastMessage(list) {
        angular.forEach(list, function(chat) {
            if(chat.lastMessage) {
                chat.lastMessage = chat.lastMessage.replace(new RegExp("<br/>", "g"), ' ');
                if(chat.lastMessage.length > 10) {
                    chat.lastMessage = chat.lastMessage.substring(0, 15) + "...";
                }
            }
        });
        return list;
    }
    
    function checkUnread(list) {
        $rootScope.chatUnread = false;
        for(var i in list){ 
            var chat = list[i];
            if(chat.approvalFlag == Flag.OFF || chat.readFlag == Flag.OFF) {
                $rootScope.chatUnread = true;
                break;
            }
        }
    }
    
    /**
     * チャットリクエスト詳細取得
     */
    chatService.searchChatRequestDetail = function($scope, chatRequestId) {
        var shop = StorageService.getShop();
        
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/chats/chatRequest/" + shop.shopCode + "/" + chatRequestId;
        var param = {
            shopPassword: shop.shopPassword
        }
        
        var response = HttpService.httpGET(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            $scope.request = res.data.body;
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            var message = res.data.rootResponse.errorMessage;
            ons.notification.alert({
                message: (message) ? message : "リクエストの取得に失敗しました。",
                title: "エラー",
                callback: function() {
                    chatNavi.popPage();
                }
            });
        });
    }
    
    /**
     * チャットリクエスト更新
     */
    chatService.updateChatRequest = function($scope, chatRequest) {
        var shop = StorageService.getShop();
        if(!shop) return;
        
        var url = ApiUrl.CONTEXT_URL.ITEM + "/chats/chatRequest/" + shop.shopCode + "/" + chatRequest.chatRequestId + "/update";
        chatRequest.approvalDate = DateService.getCurrentDateToString();
        chatRequest.approvalFlag = Flag.ON;
        chatRequest.shopPassword = shop.shopPassword;
        
        var response = HttpService.httpPOST(url, chatRequest);
        
        response.then(function(res) {
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
        });
        
        return response;
    }
    
    /**
     * チャットルーム登録
     */
    chatService.createChatRoom = function($scope, chatRequestId, message) {
        var shop = StorageService.getShop();
        var url = ApiUrl.CONTEXT_URL.ITEM + "/shop/chats/chatRoom/" + shop.shopCode + "/" + chatRequestId + "/create";
        var param = {
            shopPassword: shop.shopPassword
        }
        
        var response = HttpService.httpPOST(url, param);
        
        response.then(function(res) {
            console.log(JSON.stringify(res));
            ons.notification.alert({
                message: "チャットルームを作成しました。一覧から確認してください。",
                title: "完了",
                callback: function() {
                    chatNavi.popPage({refresh: true});
                }
            });
        });
        
        response.catch(function(res) {
            console.log(JSON.stringify(res));
            var message = (res.data.rootResponse) ? res.data.rootResponse.errorMessage : res.data.errorMessage;
            ons.notification.alert({
                message: (message) ? message : "チャットの開始に失敗しました。",
                title: "エラー",
            });
        })
    }
    
    chatService.disconnect = function() {
        ioSocket.disconnect();
    }
    
    /**
     * チャットルーム接続
     */
    chatService.connectChat = function($scope, chatRoomId) {
        
        ioSocket = io.connect(url, {
            path: "/chat/socket.io"
        });
        // 接続時処理
        ioSocket.on("connect", function() {
            console.log("ソケットの接続に成功しました。一覧リクエストを送信します");
            //一覧取得リクエスト
            chatService.getmessageList($scope, {
                'chatRoomId': chatRoomId,
                "postType": "02",
                'password': passphrase,
                'passphrase': passphrase,
                'siteId': siteId,
            });
        });
        
        //チャットリスト取得
        ioSocket.on("response_message_list", function(data) {
            console.log(JSON.stringify(data));
            if(data.status.status == "200") {
                $scope.talkList = data.response.chatList;
                $scope.$apply();
            } else {
                ons.notification.alert({
                    message: "チャットの取得に失敗しました",
                    title: "エラー"
                });
            }
        });
        //チャット送信完了
        ioSocket.on("response_message", function(data) {
            if(data.status.status == "200") {
                $scope.$apply(function() {
                    if(!$scope.talkList) $scope.talkList = [];
                    $scope.talkList.push(data.response);
                    $('.scroller').animate({scrollTop: $('.scroller')[0].scrollHeight}, 'fast');
                    $scope.inputMessage = "";
                });
                ioSocket.emit("request_message_read", {
                    'chatRoomId': chatRoomId,
                    'password': passphrase,
                    'passphrase': passphrase,
                    'siteId': siteId,
                    'postType': "02"
                });
            } else {
                console.log(JSON.stringify(data));
                ons.notification.alert({
                    message: "送信に失敗しました。",
                    title: "エラー"
                });
            }
        });
        ioSocket.on("disconnect", function() {
            console.log("接続が切断されました。");
        });
    }
    
    chatService.getmessageList = function($scope, request) {
        //一覧取得リクエスト
        ioSocket.emit("request_message_list", request);
    }
    
    chatService.sendMessage = function($scope, form) {
        var shop = StorageService.getShop();
        form.userCode = $scope.userCode;
        form.shopCode = shop.shopCode;
        form.siteId = siteId;
        form.passphrase = passphrase;
        form.password = passphrase;
        ioSocket.emit("request_message", form);
        
    }
    
    return chatService;
});