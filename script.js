var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var colorSelection = 0xf;
var jsonObj = [];
var ega = ["#000000", "#0000aa", "#00aa00", "#00aaaa", "#aa0000", "#aa00aa", "#aa5500", "#aaaaaa", "#555555", "#5555ff", "#55ff55", "#55ffff", "#ff5555", "#ff55ff", "#ffff55", "#ffffff"];
var pallet = [];
var drawing = [];
var server;
var refreshTimer = window.setInterval(refresh, 2000);
var debug = true;
var jsonString = '[{"x":0,"y":0,"color":1,"colorBit":true},{"x":100,"y":0,"color":15,"colorBit":false},{"x":200,"y":0,"color":15,"colorBit":false},{"x":300,"y":0,"color":15,"colorBit":false},{"x":400,"y":0,"color":15,"colorBit":false},{"x":500,"y":0,"color":15,"colorBit":false},{"x":600,"y":0,"color":15,"colorBit":false},{"x":700,"y":0,"color":15,"colorBit":false},{"x":0,"y":100,"color":15,"colorBit":false},{"x":100,"y":100,"color":15,"colorBit":false},{"x":200,"y":100,"color":15,"colorBit":false},{"x":300,"y":100,"color":15,"colorBit":false},{"x":400,"y":100,"color":15,"colorBit":false},{"x":500,"y":100,"color":15,"colorBit":false},{"x":600,"y":100,"color":15,"colorBit":false},{"x":700,"y":100,"color":15,"colorBit":false},{"x":0,"y":200,"color":15,"colorBit":false},{"x":100,"y":200,"color":15,"colorBit":false},{"x":200,"y":200,"color":15,"colorBit":false},{"x":300,"y":200,"color":15,"colorBit":false},{"x":400,"y":200,"color":15,"colorBit":false},{"x":500,"y":200,"color":15,"colorBit":false},{"x":600,"y":200,"color":15,"colorBit":false},{"x":700,"y":200,"color":15,"colorBit":false},{"x":0,"y":300,"color":15,"colorBit":false},{"x":100,"y":300,"color":15,"colorBit":false},{"x":200,"y":300,"color":15,"colorBit":false},{"x":300,"y":300,"color":15,"colorBit":false},{"x":400,"y":300,"color":15,"colorBit":false},{"x":500,"y":300,"color":15,"colorBit":false},{"x":600,"y":300,"color":15,"colorBit":false},{"x":700,"y":300,"color":15,"colorBit":false},{"x":0,"y":400,"color":15,"colorBit":false},{"x":100,"y":400,"color":15,"colorBit":false},{"x":200,"y":400,"color":15,"colorBit":false},{"x":300,"y":400,"color":15,"colorBit":false},{"x":400,"y":400,"color":15,"colorBit":false},{"x":500,"y":400,"color":15,"colorBit":false},{"x":600,"y":400,"color":15,"colorBit":false},{"x":700,"y":400,"color":15,"colorBit":false},{"x":0,"y":500,"color":15,"colorBit":false},{"x":100,"y":500,"color":15,"colorBit":false},{"x":200,"y":500,"color":15,"colorBit":false},{"x":300,"y":500,"color":15,"colorBit":false},{"x":400,"y":500,"color":15,"colorBit":false},{"x":500,"y":500,"color":15,"colorBit":false},{"x":600,"y":500,"color":15,"colorBit":false},{"x":700,"y":500,"color":15,"colorBit":false},{"x":0,"y":600,"color":15,"colorBit":false},{"x":100,"y":600,"color":15,"colorBit":false},{"x":200,"y":600,"color":15,"colorBit":false},{"x":300,"y":600,"color":15,"colorBit":false},{"x":400,"y":600,"color":15,"colorBit":false},{"x":500,"y":600,"color":15,"colorBit":false},{"x":600,"y":600,"color":15,"colorBit":false},{"x":700,"y":600,"color":15,"colorBit":false},{"x":0,"y":700,"color":15,"colorBit":false},{"x":100,"y":700,"color":15,"colorBit":false},{"x":200,"y":700,"color":15,"colorBit":false},{"x":300,"y":700,"color":15,"colorBit":false},{"x":400,"y":700,"color":15,"colorBit":false},{"x":500,"y":700,"color":15,"colorBit":false},{"x":600,"y":700,"color":15,"colorBit":false},{"x":700,"y":700,"color":15,"colorBit":false}]';
var jsonServerString = '{"id":1}';

class Bit {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.colorBit = false;// boolean
    addEventListener('mousedown', (e) => {
      var box = canvas.getBoundingClientRect();
      var mouseX = e.clientX - box.left;
      var mouseY = e.clientY - box.top;
      if (mouseX > this.x && mouseX < this.x + 100 && mouseY > this.y && mouseY < this.y + 100) {
        if (this.colorBit) {
          colorSelection = this.color;
        } else {
          this.color = colorSelection;
          writeJson();
          this.draw(context);
        }
      }
    })
  }
  draw(context) {
    context.beginPath();
    context.fillStyle = ega[this.color];
    context.rect(this.x, this.y, 100, 100);
    context.stroke();
    context.fill();
    context.closePath();
  }
}

class Server {
  constructor(id) {
    this.id = id;
  }
  draw(context) {
    context.beginPath();
    context.font = "30px Verdana";
    context.fillStyle = 'blue';
    context.fillText("Player " + this.id,10,50);
    context.closePath();
  }
}

function init() {
  for (var i = 0; i < 0x10; i++) {
    var numOnRow = 2;
    var bitWidth = 100;
    var x = 800 + (i % numOnRow) * bitWidth;
    var y = Math.floor(i / numOnRow) * bitWidth;
    var bit = new Bit(x, y, i);
    bit.colorBit = true;
    bit.draw(context);
    pallet.push(bit);
  }

  console.log(pallet)

  for (i = 0; i < 64; i++) {
    var numOnRow = 8;
    var bitWidth = 100;
    var x = (i % numOnRow) * bitWidth;
    var y = Math.floor(i / numOnRow) * bitWidth;
    var bit = new Bit(x, y, 0xf);
    bit.draw(context);
	  drawing[i] = bit;
  }
  console.log(drawing);

  server = new Server(-1);
}

function readJson(jsonString) {
  jsonObj = JSON.parse(jsonString);
  for (i = 0; i < 64; i++) {
    drawing[i].x = jsonObj[i].x;
    drawing[i].y = jsonObj[i].y;
    drawing[i].color = jsonObj[i].color;
    drawing[i].draw(context);
  }
  loop();
}

function writeJson() {
  var drawingExport = JSON.stringify(drawing);
  if (debug) console.log("Drawing export: " + drawingExport);
  ajax("writeJson", drawingExport);
}

function writeServerJson() {
  server.id++;
  var serverExport = JSON.stringify(server);
  server.id--;
  if (debug) console.log("Server export: " + serverExport);
  ajax("writeServerJson", serverExport);
}

function refresh() {
  ajax("getJson");
  if (server.id == -1) ajax("getServerJson");
}

function preload() {
  jsonObj = JSON.parse(jsonString);
  var drawingExport = JSON.stringify(jsonObj);
  ajax("writeJson", drawingExport);
}

function resetServer() {
  jsonObj = JSON.parse(jsonServerString);
  var serverExport = JSON.stringify(jsonObj);
  ajax("writeServerJson", serverExport);
}

function readServerJson(jsonString) {
    jsonObj = JSON.parse(jsonString);
    if (debug) console.log(jsonObj);
    server.id = jsonObj.id;
    if (debug) console.log("id: " + server.id);
    writeServerJson();
}

function loop() {
  context.clearRect(0, 0, 1000, 800);

  for (var i = 0; i < 0x10; i++) {
    pallet[i].draw(context);
  }

  for (i = 0; i < 64; i++) {
    drawing[i].draw(context);
  }

  server.draw(context);
}

init();

setInterval(loop, 100);
