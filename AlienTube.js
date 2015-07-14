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
    id = subreddit.data.id;
    author = subreddit.data.author;
    name = subreddit.data.name;
    title = subreddit.data.title;
    url = subreddit.data.url;
    subreddit = subreddit.data.subreddit;

    console.log(subreddit);
}
App.controller('AlienController', ['$scope', '$http', '$templateCache', function ($scope, $http, $templateCache) {
    var self = $scope;
    self.method = 'GET';
    self.urlBase = 'http://www.reddit.com/r/';
    self.urlExtension = '.json';
    self.phones = ["asdf", "qwer", "zxcv", "hjkl", "yuio"];
    self.SubReddits = ["All", "Gaming", "Askreddit", "Programming"];
    self.CurrentSubreddit = "All";
    self.CurrentPosts = [];


    $scope.fetchSubreddits = function () {
        $scope.code = null;
        $scope.response = null;
    };
    $scope.setRedditContent = function (subReddit) {
        $http.get(self.urlBase + subReddit + self.urlExtension).success(function (data, status) {
            console.log(data);
            $.each(data.data.children, function (i, d) {
                self.CurrentPosts.push(RedditPost(d));
            });
        }).error(function (data, status) {
            console.log(data);
        });
    };
    $scope.setCurrentSub = function (sub) {
        self.CurrentSubreddit = sub;
        self.setRedditContent(sub);
    }


}]);

App.$inject = ['$scope'];

