(function(global){
        var db=null,
            app = global.app = global.app || {};

        apps = new kendo.mobile.Application(document.body,
                                                        {
                                                            layout:'my-layout',
                                                            skin:'flat',
                                                            transition:'slide',
                                                        }
        );
    
    
    
    
    var options = {
  "direction"      : "up", // 'left|right|up|down', default 'left' (which is like 'next')
  "duration"       :  500, // in milliseconds (ms), default 400
  "slowdownfactor" :    4, // overlap views (higher number is more) or no overlap (1), default 3
  "iosdelay"       :  100, // ms to wait for the iOS webview to update before animation kicks in, default 50
  "androiddelay"   :  150  // same as above but for Android, default 50
};
window.plugins.nativepagetransitions.slide(
  options,
  function (msg) {console.log("success: " + msg)}, // called when the animation has finished
  function (msg) {alert("error: " + msg)} // called in case you pass in weird values
);
    
    
    
    
    
    
    document.addEventListener("deviceready",function(){
        document.addEventListener("backbutton",onBackKeyDown,false);
        
         window.cameraApp = new cameraApp();
         window.cameraApp.run();
        
        window.connectionInfo = new ConnectionApp();
		window.connectionInfo.checkConnection();
        
       // database_init(); 
    },false);
    
    /*********************************************************************************************************************/
    /*Connection Event Code*/
    
    function ConnectionApp() {
	}
    
    ConnectionApp.prototype = { 	
    	checkConnection: function() {
    			if(typeof navigator.connection.type !== "undefined")
                {
                    var networkState = navigator.connection.type;
                    var states = {};
                    states[Connection.UNKNOWN] = 'Unknown connection';
                    states[Connection.ETHERNET] = 'Ethernet connection';
                    states[Connection.WIFI] = 'WiFi connection';
                    states[Connection.CELL_2G] = 'Cell 2G connection';
                    states[Connection.CELL_3G] = 'Cell 3G connection';
                    states[Connection.CELL_4G] = 'Cell 4G connection';
                    states[Connection.CELL] = 'Cell generic connection';
                    states[Connection.NONE] = 'No network connection';
                    if (states[networkState] === 'No network connection') {
                        return false;
                    }
                }
                
                return true;
    	},
        
    }
    
    /*********************************************************************************************************************/
    /*Sqlite plugins Code*/
    
   /* var database_init = function(){
       apps.openDb();
    }
    console.log(db);
    apps.openDb = function(){
       if (window.navigator.simulator === true)
        {
            // For debugin in simulator fallback to native SQL Lite
            console.log("Use built in SQL Lite");
            apps.db = window.openDatabase("Quikr", "1.0", "Quikr Demo", 200000);
        }
        else
        {
            apps.db = window.sqlitePlugin.openDatabase("Quikr");
        }
    }*/
    /*********************************************************************************************************************/
    /*Camera Event Code*/
    
    function id(element) {
    	return document.getElementById(element);
	}
    
    function cameraApp(){}
    
    
    cameraApp.prototype={
        _pictureSource: null,
        _destinationType: null,
        
        run: function(){
            var that=this;

    	    that._pictureSource = navigator.camera.PictureSourceType;
    	    that._destinationType = navigator.camera.DestinationType;
            
    	    id("capturePhotoButton").addEventListener("click", function(){
                that._capturePhoto.apply(that,arguments);
            });
            
            id("getPhotoFromAlbumButton").addEventListener("click", function(){
            	that._getPhotoFromAlbum.apply(that,arguments);
       	 });
        },
        
        _capturePhoto: function() {
            var that = this;
            
            // Take picture using device camera and retrieve image as base64-encoded string.
            navigator.camera.getPicture(function(){
                that._onPhotoDataSuccess.apply(that,arguments);
            },function(){
                that._onFail.apply(that,arguments);
            },{
                quality: 50,
                destinationType: that._destinationType.DATA_URL
            });
        },
        
        _getPhotoFromAlbum: function() {
            var that= this;
           
            // On Android devices, pictureSource.PHOTOLIBRARY and
            // pictureSource.SAVEDPHOTOALBUM display the same photo album.
            that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    	},
        
        _getPhoto: function(source) {
            var that = this;
            // Retrieve image file location from specified source.
            navigator.camera.getPicture(function(){
                that._onPhotoURISuccess.apply(that,arguments);
            }, function(){
                cameraApp._onFail.apply(that,arguments);
            }, {
                quality: 50,
                destinationType: that._destinationType.FILE_URI,
                sourceType: source
            });
   	 },
        
        _onPhotoURISuccess: function(imageURI) {
            var index = $('#imageVal').val();
            if(index === 'undefined' || index === '' || index === '0' || index === 0)
            {
                index=0;
                
            }
            var ind;
            if(index<2)
            {
                 ind = ++index;
                var smallImage = document.getElementById('smallImage'+ind);
                var picture = document.getElementById('picture'+ind);
                smallImage.style.display = 'block';
                picture.style.display = 'block';
                $("#cameraDv p").css("display","block");
                smallImage.src = imageURI;
                app.postService.viewModel.setValue(ind);
            }
            else
            {
                navigator.notification.alert("You can save only 2 times Image.",function(){},"Notification","OK");
            }
   	 },
        
        _onPhotoDataSuccess: function(imageData) {
            var index = $('#imageVal').val();
            if(index === 'undefined' || index === '' || index === '0' || index === 0)
            {
                index=0;
            }
            var ind;
            if(index<2)
            {
                ind = ++index;
                var smallImage = document.getElementById('smallImage'+ind);
                var picture = document.getElementById('picture'+ind);
                smallImage.style.display = 'block';
                picture.style.display = 'block';
                $("#cameraDv p").css("display","block");
                // Show the captured photo.
                smallImage.src = "data:image/jpeg;base64," + imageData;
                app.postService.viewModel.setValue(ind);
            }
            else
            {
               navigator.notification.alert("You can save only 2 times Image.",function(){},"Notification","OK");
            }
        },
        
        _onFail: function(message) {
            navigator.notification.alert(message);
        }
	}
    
    /*********************************************************************************************************************/
    
    
    /*********************************************************************************************************************/
    /*Backkey event code*/
    var onBackKeyDown = function(e){
        var index = apps.view()['element']['0']['id'];
        
        if(index === "home")
        {
            navigator.notification.confirm('Do you really want to exit?',function(confirmed){
                if(confirmed === true || confirmed ===1)
                {
                    navigator.app.exitApp();
                }
            },'Exit','Yes,No');
        }
        else if(index === "postad1" || index === "postAd2")
        {
             e.preventdefault();
        }
        else
        {
            //history.go(-1);
            // navigator.app.backhistory();
        }
    }
    
    /*********************************************************************************************************************/
})(window);