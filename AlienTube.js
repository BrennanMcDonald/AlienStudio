/*
*   Document Resizing
*/
	var g_id = atob("NTM5MGE0Y2MzZTFmNzRm");
	var g_s = atob("MTAxZGEzZDVjZDM3MWY5YWNiNTY1ZDMxZThkZjg5MzZhNWQ4ZmUwNQ==");
$(document).ready(function () {
    var above = ($("#TopBar").outerHeight() + $("#SubRedditTop").outerHeight());
    var navAbove = ($("#TopBar").outerHeight() + $("#SubRedditTop").outerHeight() + $("#NavBar").outerHeight());
    var center = ($("#TopBar").outerHeight() + $("#FootBar").outerHeight());



    $("#SubredditList").height($(window).outerHeight() - above);
    $("#Left").height($(window).outerHeight() - $("#TopBar").outerHeight());
    $("#SuperRight").height($(window).outerHeight() - navAbove);
    $("#Center").position.top = $("#TopBar").outerHeight();

    var x = $(window).outerHeight() - center;

    $("#Center").height(x);

    $(window).on('resize', function () {
        var above = ($("#TopBar").outerHeight() + $("#SubRedditTop").outerHeight());
        $("#SubredditList").height($(window).outerHeight() - above);
        $("#SuperRight").height($(window).outerHeight() - navAbove);
        $("#Left").height($(window).outerHeight() - $("#TopBar").outerHeight());

        var x = $(window).outerHeight() - center;
        $("#Center").height(x);
    });

    $("#NavBar").on('click', function () {
        $("#SubredditList").animate({ width: 'toggle' }, 350);
        $("#center").width($(window).outerWidth() - $("#Left").outerWidth())
        $("#center").animate({width: $(window).outerWidth() - $("#Left").outerWidth()}, 350)
    });
});

/*
*   Angular App Binding
*/

var Subreddit = function () {

};
		
var App = angular.module('alienApp', []);

var RedditPost = function (subreddit) {
	var self = this;
    self.id = subreddit.id;
    self.author = subreddit.author;
    self.name = subreddit.name;
    self.title = subreddit.title;
    self.url = subreddit.url;
    self.subreddit = subreddit.subreddit;
}

App.controller('AlienController', ['$scope', '$http', '$templateCache', function ($scope, $http, $templateCache) {
    var self = $scope;
    self.method = 'GET';
    self.urlBase = 'https://www.reddit.com';
    self.urlExtension = '.json';
    self.phones = ["asdf", "qwer", "zxcv", "hjkl", "yuio"];
    self.SubReddits = ["All", "Gaming", "Askreddit", "Programming", "TodayILearned","SubredditSimulator"];
    self.CurrentSubreddit = "All";
    self.CurrentPosts = [];
	self.cView = "sub";
    self.PatchNotes = [];

    var toUTCDate = function(date){
        var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return _utc;
    };

    var millisToUTCDate = function(millis){
        return toUTCDate(new Date(millis));
    };

    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    }

    $scope.RangeOf = function(i){
        return Array(i)
    }

    $scope.GetRecentPatchNotes = function(){
        url = "https://api.github.com/repos/brennanmcdonald/alienstudio/commits"
        $http.get(url).success(function (data, status) {
            $.each(data, function (i, d) {
                console.log(d)
                self.PatchNotes.push(d);
            });
        }).error(function (data, status) {
        });
    }

    $scope.fetchSubreddits = function () {
        $scope.code = null;
        $scope.response = null;
    };

	$scope.addSubredditToList = function(s){
        if (!containsObject(s,self.SubReddits)){
            self.SubReddits.push(s)
        }
    };

    $scope.setRedditContent = function (subReddit) {
		self.cView = "sub";
		self.CurrentPosts = [];
        $http.get(self.urlBase + "/r/" + subReddit + self.urlExtension).success(function (data, status) {
            $.each(data.data.children, function (i, d) {
                self.CurrentPosts.push(d.data);
            });
        }).error(function (data, status) {
            self.CurrentPosts.push({author : "AlienStudio", title : "404 Subreddit Not Found", subreddit : "404"})
        });
    };
	
	$scope.setSelfPostContent = function (urlExtension) {

		self.cView = "comment";
		self.Thread = {};
		self.CurrentPosts = [];
        $http.get(self.urlBase + urlExtension + self.urlExtension).success(function (data, status) {
			setCurrentSub = data[0].data.children[0].data.subreddit;
			self.Thread = data[0];
            $.each(data[1].data.children, function (i, d) {
                self.CurrentPosts.push(d.data);
            });
        }).error(function (data, status) {
            console.log(data);
        });
    };
	
    showVideoViewer = function(video_id){
        var ampersandPosition = video_id.indexOf("?v=");
        if(ampersandPosition != -1) {
          video_id = video_id.substring(ampersandPosition+3);
        }
        console.log(video_id)
        $("#VideoViewer iframe").attr("src");
        $("#VideoViewer iframe").attr("src", "https://www.youtube.com/embed/" + video_id);
        $("#VideoViewer").draggable({});
        $("#VideoViewer").show();
    }
    showImageViewer = function(url){
        $("#ImageViewer img").attr("src");
        $("#ImageViewer img").attr("src", url);
        $("#ImageViewer img").css('height','500px')
        $("#ImageViewer img").css('width','auto')
        $("#ImageViewer").draggable({});
        $("#ImageViewer").show();
    }
	$scope.showImageViewer = function(url) {
        var auth = 'Client-ID ' + g_id;
        if (url.indexOf("youtube.com/") > -1){
            showVideoViewer(url)
        }
        else if (url.indexOf("imgur.com") > -1 || url.indexOf("imgur.com") > -1 ){
            if (url.lastIndexOf("/")+1 < url.lastIndexOf(".")){
                url = url.substring(url.lastIndexOf("/")+1,url.lastIndexOf("."));
            } else {
                url = url.substring(url.lastIndexOf("/")+1)
            }
            url = "https://api.imgur.com/3/image/" + url
            var req = {
                method: "GET",
                url: url,
                headers: {
                    'Authorization' : auth,
                    'Accept' : 'application/json'
                }
            };
            $http(req).success(function (response, status) {
                showImageViewer(response.data.link);
            }).error(function (data, status) {
                if (status == 404){
                    if (url.lastIndexOf("/")+1 < url.lastIndexOf(".")){
                        url = url.substring(url.lastIndexOf("/")+1,url.lastIndexOf("."));
                    } else {
                        url = url.substring(url.lastIndexOf("/")+1)
                    }
                    url = "https://api.imgur.com/3/gallery/" + url
                    req.url = url;
                    $http(req).success(function (response, status) {
                        showImageViewer(response.data.images[0].link);
                    }).error(function (data, status) {
                        console.error("Error Status code: " + status)
                    });
                }
                console.error("Error Status code: " + status)
            });
		} else if(url.toLowerCase().indexOf(".png") > -1 || url.toLowerCase().indexOf(".jpg") > -1) {
                console.log("Handling Generic Image Link")
                $("#ImageViewer img").attr("src");
                $("#ImageViewer img").attr("src", url);
                $("#ImageViewer img").css('height','500px')
                $("#ImageViewer img").css('width','auto')
                $("#ImageViewer").show();
        } else {
			window.open(url, "_blank");
		
        }
	};

    $scope.navigateToPermalink = function(perma){
        window.open("https://reddit.com" + perma, "_blank")
    }

    $scope.goToUser = function(user) {
        window.open("https://reddit.com/u/" + user, "_blank")
    };
	
    $scope.setCurrentSub = function (sub) {
        self.CurrentSubreddit = sub;
        $scope.addSubredditToList(sub);
        self.setRedditContent(sub);
    }
	
	$scope.setRedditContent("All")
	$scope.GetRecentPatchNotes()
	$scope.setPreviewImage = function(htmlString){
		var imageLink = htmlString[0].resolutions[htmlString[0].resolutions.length - 1].url
		$("#LeftBarPreview").html("<img src='"+imageLink+"' />");
	}


}]);

App.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

App.filter('first', function(){
        return function(value, i){
            return value.substr(0,i);
        }
    })
	
App.$inject = ['$scope'];

