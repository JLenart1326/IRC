var express = require("express");
var EventEmitter = require("events").EventEmitter;
var messageBus = new EventEmitter();

var PORT = (process.env.PORT || 3000);
var app = express();

app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/sendMessage", (req, res) => {
    messageBus.emit("message", { user: req.body.user, message: req.body.message, color: req.body.color });
    res.end();
})

app.get("/events", (req, res) => {
    const listener = (res) => {
        messageBus.once("message", function(data) {
            res.status(200).json(data);
        });
    };
    req.on("abort", function() {
        messageBus.removeListener("message", listener);
    });

    listener(res);
});

app.use(express.static(__dirname))

app.listen(PORT, () => {
    console.log("Server started at port " + PORT + "...");
});