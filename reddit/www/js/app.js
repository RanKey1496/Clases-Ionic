(function() {
  var app = angular.module('starter', ['ionic', 'angularMoment', 'ngCordova'])

  app.controller('RedditController', function($scope, $http){
    $scope.posts = [];
    $http.get('https://www.reddit.com/r/pics/new/.json')
      .success(function(posts){
        //console.log(posts);
        angular.forEach(posts.data.children, function(post){
          $scope.posts.push(post.data);
        }); 
      });
    $scope.cargarNuevosPosts = function(){
      var params = {};
      if($scope.posts.length > 0){
        params['after'] = $scope.posts[$scope.posts.length - 1].name;
      }
      $http.get('https://www.reddit.com/r/pics/new/.json', {params: params})
      .success(function(posts){
        //console.log(posts);
        angular.forEach(posts.data.children, function(post){
          $scope.posts.push(post.data);
        });
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.refrescarNuevosPost = function(){
      if($scope.posts.length > 0){
        var params = {'before': $scope.posts[0].name};
      } else{
        return;
      }
      $http.get('https://www.reddit.com/r/pics/new/.json', {params: params})
      .success(function(posts){
        var newPost = [];

        //console.log(posts);
        angular.forEach(posts.data.children, function(post){
          newPost.push(post.data);
        });
        $scope.posts = newPost.concat($scope.posts);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.openLink = function(url){
      window.open(url, '_blank');
    };
  });

  app.controller('ImageCtrl', function ($scope, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet) {
    $scope.image = null;

    // Present Actionsheet for switch beteen Camera / Library
    $scope.loadImage = function() {
      var options = {
        title: 'Select Image Source',
        buttonLabels: ['Load from Library', 'Use Camera'],
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton : true,
      };
      $cordovaActionSheet.show(options).then(function(btnIndex) {
        var type = null;
        if (btnIndex === 1) {
          type = Camera.PictureSourceType.PHOTOLIBRARY;
        } else if (btnIndex === 2) {
          type = Camera.PictureSourceType.CAMERA;
        }
        if (type !== null) {
          $scope.selectPicture(type);
        }
      });
    };

    // Take image with the camera or from library and store it inside the app folder
    // Image will not be saved to users Library.
    $scope.selectPicture = function(sourceType) {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imagePath) {
        // Grab the file name of the photo in the temporary directory
        var currentName = imagePath.replace(/^.*[\\\/]/, '');

        //Create a new name for the photo
        var d = new Date(),
        n = d.getTime(),
        newFileName =  n + ".jpg";

        // If you are trying to load image from the gallery on Android we need special treatment!
        if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
          window.FilePath.resolveNativePath(imagePath, function(entry) {
            window.resolveLocalFileSystemURL(entry, success, fail);
            function fail(e) {
              console.error('Error: ', e);
            }

            function success(fileEntry) {
              var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
              // Only copy because of access rights
              $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                $scope.image = newFileName;
              }, function(error){
                $scope.showAlert('Error', error.exception);
              });
            };
          }
        );
        } else {
          var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          // Move the file to permanent storage
          $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
            $scope.image = newFileName;
          }, function(error){
            $scope.showAlert('Error', error.exception);
          });
        }
      },
      function(err){
        // Not always an error, maybe cancel was pressed...
      })
    };

    // Returns the local path inside the app for an image
    $scope.pathForImage = function(image) {
      if (image === null) {
        return '';
      } else {
        return cordova.file.dataDirectory + image;
      }
    };

    $scope.uploadImage = function() {
      // Destination URL
      // var url = "http://localhost:8888/upload.php";
      var url = "https://devdactic.com/downloads/upload.php";

      // File for Upload
      var targetPath = $scope.pathForImage($scope.image);

      // File name only
      var filename = $scope.image;;

      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename}
      };

      $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
        $scope.showAlert('Success', 'Image upload finished.');
      });
    }

    $scope.showAlert = function(title, msg) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg
      });
    };
});

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.cordova && window.cordova.InAppBrowser){
        window.open = window.cordova.InAppBrowser.open;
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
}());