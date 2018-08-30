app.controller("VmdController", function($scope, $timeout, $cordovaFile, StylingService, ImageService) {
    
    $scope.init = function() {
        $scope.form = {};
        if(monaca.isIOS) {
            $('.text-input').on('touchstart',function(e) {
                e.preventDefault();
            });
        }
        StylingService.searchModel($scope);
    }
    
    $scope.camera = function() {
        ons.notification.confirm({
            message: "ファイル選択",
            buttonLabels: ["カメラ起動", "ライブラリ選択", "キャンセル"],
            primaryButtonIndex: 2,
            title: "",
            callback: function(index) {
                if(index == 0) {
                    openCamera($scope);
                } else if(index == 1) {
                    openFilePicker($scope);
                }
            }
        });
    }
    
    $scope.create = function() {
        ons.notification.confirm({
            message: "登録してよろしいですか？",
            title: "確認",
            cancelable: true,
            callback: function(index) {
                if(index == 1) {
                    StylingService.createStyling($scope, $scope.form);
                }
            }
        });
    }
    
    function openCamera($scope, selection) {

        var srcType = Camera.PictureSourceType.CAMERA;
        var options = setOptions(srcType);
    
        navigator.camera.getPicture(function cameraSuccess(imageUri) {
            console.log(imageUri);
            $timeout(function() {
                $scope.$apply(function() {
                    $scope.form.image = imageUri;
                });
            });
            //var data = "data:image/jpeg;base64," + imageData;
            //displayImage(imageUri);
            // You may choose to copy the picture, save it somewhere, or upload.
            //createNewFileEntry($scope, data);
    
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
    
        }, options);
    }
    
    function openFilePicker($scope, selection) {

        var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
        var options = setOptions(srcType);
    
        navigator.camera.getPicture(function cameraSuccess(imageUri) {
            if(monaca.isAndroid) {
                console.log(imageUri);
                downloadFile($scope, imageUri);
                //createNewFileEntry($scope, imageUri);
            } else {
            $timeout(function() {
                $scope.$apply(function() {
                    $scope.form.image = imageUri;
                });
            });
            }
        }, function cameraError(error) {
            console.debug("Unable to obtain picture: " + error, "app");
    
        }, options);
    } 
    
    function downloadFile($scope, imageUrl) {
        var directory = imageUrl.substring(0, imageUrl.lastIndexOf('/'));
        console.log( imageUrl.indexOf('?'));
        var fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.indexOf('?'));
        console.log("directory : " + directory + ", fileName : " + fileName);
        $cordovaFile.copyFile(directory, fileName, cordova.file.cacheDirectory, fileName).then(function(success) {
            console.log(success.toURL());
            if(!$scope.form) $scope.form = {};
            $timeout(function() {
                $scope.$apply(function() {
                    $scope.form.image = success.toURL();
                });
            });
            
        }, function(error) { 
            console.log("error" + JSON.stringify(error));
        });
    }
    
    function getFileEntry($scope, imgUri) {

        window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
    
            // Do something with the FileEntry object, like write to it, upload it, etc.
            writeFile($scope, fileEntry, imgUri);
            console.log("got file: " + fileEntry.fullPath);
            // displayFileData(fileEntry.nativeURL, "Native URL");
    
        }, function () {
          // If don't get the FileEntry (which may happen when testing
          // on some emulators), copy to a new FileEntry.
            createNewFileEntry($scope, imgUri);
        });
    }

    function createNewFileEntry($scope, data) {
        window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {
            var fileName = data.substr(data.lastIndexOf('/')+1);;
            // JPEG file
            dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
    
                // Do something with it, like write to it, upload it, etc.
                writeFile($scope, fileEntry, data);
                console.log("got file: " + fileEntry.fullPath);
                // displayFileData(fileEntry.fullPath, "File copied to");
    
            }, function(){ console.log("create file entry error")});
    
        }, function() { console.log("create resolveLocalFileSystemURL error"); });
    }
    
    function writeFile($scope, fileEntry, dataObj) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {
            
            fileWriter.onwrite = function () {
                console.log("Successful file write..." + JSON.stringify(fileWriter));
                
                //upload($scope, fileEntry);
                if(!$scope.form) $scope.form = {};
                console.log(fileEntry.toURL());
                $timeout(function() {
                    $scope.$apply(function() {
                        $scope.form.image = fileEntry.toURL();
                    });
                });
            };
    
            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };
            
            // 書き込み処理
            fileWriter.write(dataObj);
        });
    }
    
    function upload($scope, fileEntry) {
        // !! Assumes variable fileURL contains a valid URL to a text file on the device,
        var fileURL = fileEntry.toURL();
    
        var success = function (r) {
            console.log("Successful upload...");
            console.log("Code = " + r.responseCode);
            displayFileData(fileEntry.fullPath + " (content uploaded to server)");
        }
    
        var fail = function (error) {
            console.log("An error has occurred: Code = " + error.code);
            console.log(fileURL)
            if($scope) {
                $timeout(function() {
                    $scope.$apply(function() {
                        $scope.talkList.push({
                            name: "お客様",
                            division: 2,
                            image: fileEntry.toURL()
                        });
                    });
                    
                    $('.scroller').animate({scrollTop: $('.scroller')[0].scrollHeight}, 'fast');
                });
            }
        }
    
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";
    
        var params = {};
        params.value1 = "test";
        params.value2 = "param";
    
        options.params = params;
    
        var ft = new FileTransfer();
        // SERVER must be a URL that can handle the request, like
        // http://some.server.com/upload.php
        ft.upload(fileURL, encodeURI("http://192.168.1.225/"), success, fail, options);
    };
    
    
    function setOptions(srcType) {
        var options = {
            // Some common settings are 20, 50, and 100
            quality: 100,
            destinationType: Camera.DestinationType.IMAGE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            //allowEdit: true,
            correctOrientation: true,  //Corrects Android orientation quirks
            saveToPhotoAlbum: true
        }
        return options;
    }
});