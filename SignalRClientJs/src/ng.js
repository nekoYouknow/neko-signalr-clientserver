angular.module('ngApp', []).controller('ngCtrl', function($scope, $http) {
    console.log("ngCtrl");

    //커넥션
    $scope.connection =  new signalR.HubConnectionBuilder().withUrl("https://localhost:44354/testHub").build();
    $scope.connection.start().then(function() { 
        console.log("connection ok");
    }).catch(function(err) {
        return console.error(err.toString());
    });


    //------------------------------
    //EchoMe
    //------------------------------
    //send
    $scope.btnEchoMe_click = function() {
        $scope.connection.invoke("EchoMe").catch(function(err) {
            return console.log(err.toString());
        });
    }

    //receive
    $scope.connection.on("EchoMeReceive", function(msg) {
        alert(msg);
    });

    //------------------------------
    //progress
    //------------------------------
    $scope.btnProgress_click = function() {
        console.log("prog");
        $scope.percentage = "0%";

        $scope.connection.stream("Progress")
        .subscribe({
            next: (i) => {
                $scope.percentage = i + '%';
                $scope.$apply();    //중요!!!
            }, 
            complete: () => {
                alert("complete");
            }, 
            error: (err) => {
                console.log("error=", err);
            }
        });
    }

});