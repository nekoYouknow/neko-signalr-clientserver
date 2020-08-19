'use strict';

//var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
//var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44354/testHub").build();

//token : https://stackoverflow.com/questions/50177099/get-signalrr-connectionid-on-clientside-angular-app
//token-server : https://docs.microsoft.com/ko-kr/aspnet/core/signalr/authn-and-authz?view=aspnetcore-3.1
//https://stackoverflow.com/questions/21260384/signalr-authenticating-with-access-token
//const token = "[your jwt token";
//var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44354/testHub", {accessTokenFactory: () => token}).build();

//연결개체
var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:44354/testHub").build();

//init
document.getElementById('btnPing').disabled = true;
document.getElementById('btnEchoMe').disabled = true;

//시작(연결)
connection.start().then(function () {
    document.getElementById("btnPing").disabled = false;
    document.getElementById("btnEchoMe").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

//-----------------------------------------------
//ping : all client
//-----------------------------------------------
document.getElementById("btnPing").addEventListener("click", function (event) {
    connection.invoke("ping").catch(function(err) {
        return console.log(err.toString());
    });
    event.preventDefault();
});
connection.on('PingReceive', function (msg) {
    alert(msg);
});

//-----------------------------------------------
//echo me : this client only
//-----------------------------------------------
document.getElementById("btnEchoMe").addEventListener("click", function(event) {
    connection.invoke("EchoMe").catch(function(err) {
        return console.log(err.toString());
    });
    event.preventDefault();
});
connection.on("EchoMeReceive", function(msg) {
    alert(msg);
})

//-----------------------------------------------
//progress (stream): this client only
//-----------------------------------------------
//https://www.youtube.com/watch?v=Y6kDHytWa70
//https://docs.microsoft.com/ko-kr/aspnet/core/signalr/streaming?view=aspnetcore-3.1
document.getElementById("btnProgress").addEventListener("click", function(event) {
    var p = document.getElementById("percentage");

    connection.stream("Progress")
        .subscribe({
            next: (i) => {
                p.innerHTML = i + '%';
            }, 
            complete: () => {
                alert("complete");
            }, 
            error: (err) => {
                console.log("error=", err);
            }
        })
    event.preventDefault();
})

//-----------------------------------------------
//progress.. return json : this client only
//-----------------------------------------------
document.getElementById("btnProgDynamic").addEventListener("click", function(event) {
    connection.stream("ProgDynamic")
        .subscribe({
            next: item => {
                console.log("next=", item)
            }, 
            complete: () => {
                alert("complete");
            }, 
            error: (err) => {
                console.log("error=", err);
            }
        })
    event.preventDefault();
})

