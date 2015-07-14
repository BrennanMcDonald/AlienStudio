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

var App = angular.module('alienApp', []);

App.controller('AlienController', function ($scope) {
    var self = $scope;
    self.phones = ["asdf", "qwer", "zxcv", "hjkl", "yuio"];
});

App.$inject = ['$scope'];

App.directive('rComment', ['$http', function ($http) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            info: "="
        },
        controller: function ($scope) {
            $scope.url = "http://www.reddit.com/.json";
            console.log($scope.info);

            $http({ method: 'GET', url: $scope.url }).then(function (result) {
                $scope.data = result.data.data.children;
                console.log(result.data.data)
                return result.data[0];
            }, function (result) {
                alert("Error: No data returned");
            });
        }
    }
}]);