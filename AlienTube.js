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
    self.urlBase = 'http://www.reddit.com';
    self.urlExtension = '.json';
    self.phones = ["asdf", "qwer", "zxcv", "hjkl", "yuio"];
    self.SubReddits = ["All", "Gaming", "Askreddit", "Programming", "TodayILearned","SubredditSimulator"];
    self.CurrentSubreddit = "All";
    self.CurrentPosts = [];
	self.cView = "sub";

    var toUTCDate = function(date){
        var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return _utc;
    };

    var millisToUTCDate = function(millis){
        return toUTCDate(new Date(millis));
    };
    
    $scope.RangeOf = function(i){
        return Array(i)
    }

    $scope.fetchSubreddits = function () {
        $scope.code = null;
        $scope.response = null;
    };
	$scope.addSubredditToList = function(s){
        self.SubReddits.push(s)
    };
    $scope.setRedditContent = function (subReddit) {
		self.cView = "sub";
		self.CurrentPosts = [];
        $http.get(self.urlBase + "/r/" + subReddit + self.urlExtension).success(function (data, status) {
            $.each(data.data.children, function (i, d) {
				console.log(d.data)
                self.CurrentPosts.push(d.data);
            });
			console.log(self.CurrentPosts)
        }).error(function (data, status) {
            self.CurrentPosts.push({author : "AlienStudio", title : "404 Subreddit Not Found", subreddit : "404"})
        });
    };
	
	$scope.setSelfPostContent = function (urlExtension) {

		self.cView = "comment";
		self.Thread = {};
		self.CurrentPosts = [];
        $http.get(self.urlBase + urlExtension + self.urlExtension).success(function (data, status) {
			console.log(data);
			setCurrentSub = data[0].data.children[0].data.subreddit;
			self.Thread = data[0];
            $.each(data[1].data.children, function (i, d) {
                self.CurrentPosts.push(d.data);
            });
        }).error(function (data, status) {
            console.log(data);
        });
    };
	
	$scope.showImageViewer = function(url) {

		if (url.indexOf("imgur.com") > -1 || url.indexOf("imgur.com") > -1 ){
			if (url.toLowerCase().indexOf("gallery") > -1){
				url = url.substring(url.toLowerCase().indexOf("http://imgur.com/gallery") + ("http://imgur.com/gallery").length+1);
				url = "https://api.imgur.com/3/gallery/" + url
				var auth = 'Client-ID ' + g_id;
				var req = {
					method: "GET",
					url: url,
					headers: {
						'Authorization' : auth,
						'Accept' : 'application/json'
					}
				};
				$http(req).success(function (data, status) {
					$("#imageViewer img").attr("src");
					$("#imageViewer img").attr("src", data.data.link);
					$("#imageViewer").draggable({});
					$("#imageViewer").show();
				}).error(function (data, status) {
                    console.log("Error")
                    console.log(data)
                    console.log(status)
				});
            } else if (url.toLowerCase().indexOf("/a/") > -1){
                url = url.substring(url.toLowerCase().indexOf("http://imgur.com/a") + ("http://imgur.com/a").length+1);
                url = "https://api.imgur.com/3/album/" + url
                console.log(url)
                var auth = 'Client-ID ' + g_id;
                var req = {
                    method: "GET",
                    url: url,
                    headers: {
                        'Authorization' : auth,
                        'Accept' : 'application/json'
                    }
                };
                $http(req).success(function (data, status) {
                    console.log(data);
                    $("#imageViewer img").attr("src");
                    $("#imageViewer img").attr("src", data.images[0].link);
                    $("#imageViewer").draggable({});
                    $("#imageViewer").show();
                }).error(function (data, status) {
                });
			} else if(url.toLowerCase().indexOf(".png") > -1 || url.toLowerCase().indexOf(".jpg") > -1) {
				$("#imageViewer img").attr("src");
				$("#imageViewer img").attr("src", url);
				$("#imageViewer").draggable({});
				$("#imageViewer").show();
			} else {
				url = url.substring(url.toLowerCase().indexOf("http://imgur.com/") + ("http://imgur.com/").length);
				url = "https://api.imgur.com/3/image/" + url
                $("#imageViewer img").attr("src");
                $("#imageViewer img").attr("src", url);
                $("#imageViewer img").width(500);
                $("#imageViewer img").height(500);
                $("#imageViewer").draggable({});
                $("#imageViewer").show();
                console.log(url)
			}
		} else {
			window.open(url, "_blank");
		
        }
	};

    $scope.navigateToPermalink = function(perma){
        console.log(perma)
        window.open("http://reddit.com" + perma, "_blank")
    }

    $scope.goToUser = function(user) {
        window.open("http://reddit.com/u/" + user, "_blank")
    };
	
    $scope.setCurrentSub = function (sub) {
        self.CurrentSubreddit = sub;

        self.setRedditContent(sub);
    }
	
	$scope.setRedditContent("All")
	
	$scope.setPreviewImage = function(htmlString){
		console.log(htmlString[0].resolutions);
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
	
App.$inject = ['$scope'];

