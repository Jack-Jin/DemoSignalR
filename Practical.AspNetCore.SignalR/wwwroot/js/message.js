"use strict"

var connection = new signalR.HubConnectionBuilder()
                        .withUrl("/messages", {
                            accessTokenFactory: () => "testing"
                        })
                        .build();

document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var div = document.createElement("div");
    div.innerHTML = `${user} say ${msg}` + "<hr />";
    document.getElementById("messages").appendChild(div);
});

connection.on("UserConnected", function (connectionId) {
    var groupElement = document.getElementById("group");
    var option = document.createElement("option");
    option.text = connectionId;
    option.value = connectionId;
    groupElement.add(option);
});

connection.on("UserDisconnected", function (connectionId) {
    var groupElement = document.getElementById("group");
    for (var i = 0; i < groupElement.length; i++) {
        if (groupElement.options[i].value == connectionId) {
            groupElement.remove(i);
        }
    }
})


connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("user").value;
    var message = document.getElementById("message").value;
    var groupElement = document.getElementById("group");
    var groupValue = groupElement.options[groupElement.selectedIndex].value;

    if (groupValue === "All" || groupValue === "Myself") {
        var method = "SendMessageToAll";
        if (groupValue === "Myself") {
            method = "SendMessageToCaller";
        }

        connection.invoke(method, user, message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    else if (groupValue === "PrivateGroup") {
        var method = "SendMessageToGroup"
        connection.invoke(method, "PrivateGroup", user, message).catch(function (err) {
            return console.error(err.toString());
        });
    }
    else {
        var method = "SendMessageToUser"
        connection.invoke(method, groupValue, user, message).catch(function (err) {
            return console.error(err.toString());
        });
    }

    event.preventDefault();
});

document.getElementById("joinGroup").addEventListener("click", function () {
    connection.invoke("JoinGroup", "PrivateGroup").catch(function (err) {
        return console.error(err.toString());
    });

    event.preventDefault();
});

