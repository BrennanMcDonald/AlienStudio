/*
*   Document Resizing
*/

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
    self.SubReddits = ["All", "Gaming", "Askreddit", "Programming"];
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

    $scope.fetchSubreddits = function () {
        $scope.code = null;
        $scope.response = null;
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
            console.log(data);
        });
    };
	
	$scope.setSelfPostContent = function (urlExtension) {
		self.cView = "comment";
		self.CurrentPosts = [];
        $http.get(self.urlBase + urlExtension + self.urlExtension).success(function (data, status) {
			console.log(data);
            $.each(data[1].data.children, function (i, d) {
				console.log(d.data)
                self.CurrentPosts.push(d.data);
            });
			console.log(self.CurrentPosts)
        }).error(function (data, status) {
            console.log(data);
        });
    };
	
	$scope.hidePostById = function(id) {
		$("#" + id).hide();
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

