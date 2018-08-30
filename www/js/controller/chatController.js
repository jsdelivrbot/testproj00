app.controller("ChatController", function($scope, $timeout, $rootScope, SharedScopes, Flag, ChatType, CommonService, ChatService) {
    
    $scope.listInit = function() {
        SharedScopes.setScope("CHAT", $scope);
        ChatService.searchChatRoom($scope);
    }
    
    $scope.showDetail = function(chat) {
        if(chat.type == ChatType.REQUEST) {
            chatNavi.pushPage("chatMessage.html", {data: chat});
        } else if(chat.type == ChatType.ROOM) {
            chat.readFlag = Flag.ON;
            chatNavi.pushPage('chatDetail.html', {data: chat});
        }
        chat.readFlag = Flag.ON;
    }
    
    $scope.messageInit = function() {
        $rootScope.chatUnread = false;
        var data = chatNavi.topPage.data;
        ChatService.searchChatRequestDetail($scope, data.id);
    }
    
    $scope.start = function(chatRequest) {
        ons.notification.confirm({
            message: "チャットを開始しますか？",
            title: "確認",
            callback: function(index) {
                if(index == 1) {
                    var response = ChatService.updateChatRequest($scope, chatRequest);
                    response.then(function(res) {
                        console.log(JSON.stringify(res));
                        ChatService.createChatRoom($scope, chatRequest.chatRequestId);
                    });
                }
            }
        })
    }
    
    $scope.detailInit = function() {
        $rootScope.chatUnread = false;
        var data = chatNavi.topPage.data;
        $scope.chatRoomId = data.id;
        $scope.shopCode = data.shopCode;
        $scope.userCode = data.userCode;
        $scope.shopName = data.shopName;
        ChatService.connectChat($scope, data.id);
    }
    
    $scope.disconnect = function() {
        ChatService.disconnect();
    }
    
    $scope.refresh = function() {
        var request = {
            'chatRoomId': $scope.chatRoomId,
            'password': passphrase,
            'siteId': siteId
        }
        ChatService.getmessageList($scope, request);
    }
    
    $scope.showImage = function(image) {
        imageModal.show();
        $scope.modalImage = image;
    }
    
    
    $scope.submit = function() {
        var param = getSendParam($scope);
        param.message = $scope.inputMessage;
        param.dataType = "01";
        var message = angular.copy($scope.inputMessage);
        param.message = message.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
        ChatService.sendMessage($scope, param);
    }
    
//    $scope.camera = function() {
//        ons.notification.confirm({
//            message: "ファイル選択",
//            buttonLabels: ["カメラ起動", "ライブラリ選択"],
//            primaryButtonIndex: 2,
//            title: "",
//            callback: function(index) {
//                if(index == 0) {
//                    openCamera($scope);
//                } else if(index == 1) {
//                    openFilePicker($scope);
//                }
//            }
//        });
//    }
//    
    function getSendParam() {
        return {
            chatRoomId: $scope.chatRoomId,
            shopCode: $scope.shopCode,
            postType: "02",
            postDate: new Date(),
        };
    }
    
    $scope.camera = function() {
        ons.notification.confirm({
            message: "ファイル選択",
            buttonLabels: ["カメラ起動", "ライブラリ選択", "キャンセル"],
            primaryButtonIndex: 2,
            title: "",
            cancelable: true,
            callback: function(index) {
                if(index == 0) {
                    openCamera($scope);
                } else if(index == 1) {
                    openFilePicker($scope);
                }
            }
        });
    }
    
    function openCamera($scope, selection) {

        var srcType = Camera.PictureSourceType.CAMERA;
        var options = setOptions(srcType);
    
        navigator.camera.getPicture(function cameraSuccess(imageData) {
            var param = getSendParam();
            param.dataType = "02";
            param.postImage = "data:image/jpeg;base64," + imageData;
            ChatService.sendMessage($scope, param);
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
    
        }, options);
    }
    
    function openFilePicker($scope, selection) {

        var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
        var options = setOptions(srcType);
    
        navigator.camera.getPicture(function cameraSuccess(imageData) {
    
            var param = getSendParam();
            param.dataType = "02";
            param.postImage = "data:image/jpeg;base64," + imageData;
            ChatService.sendMessage($scope, param);
            
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
    
        }, options);
    } 
    
    function setOptions(srcType) {
        var options = {
            // Some common settings are 20, 50, and 100
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true,  //Corrects Android orientation quirks
            saveToPhotoAlbum: true
        }
        return options;
    }
    
    
});