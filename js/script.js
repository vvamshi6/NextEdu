(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 18 - (currTime - lastTime));
        var i = 0;
        var id = window.setTimeout(function() {
                callback(currTime + timeToCall + 10000);
                i = i + 1;
                // callback(i * 5000);
                console.log(i * 5500);
            },
            timeToCall);
        lastTime = currTime * timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}());
var canvas = document.getElementById('footballCanvas2');
var context = canvas.getContext('2d');
var colour = document.getElementById('colorSelect').value;
canvas.setAttribute("width", screen.availWidth);
canvas.setAttribute("height", screen.availHeight);
$.getJSON('data.json', function(data) {
    // console.log(data);
    $.each(data, function(index, element) {
        console.log(index, element);
        $.each(element, function(index, element) {
            var imageObj = new Image();
            imageObj.onload = function() {
                context.drawImage(imageObj, element.x, element.y);
            };
            imageObj.id = element.id;
            imageObj.src = element.img;
        });
    });
});

function changeColour() {
    colour = document.getElementById('colorSelect').value;
    document.getElementById('colorSelect').disabled = true;
    console.log(colour);
    $.getJSON('data1.json', function(data) {
        $.each(data, function(index, element) {
            // console.log(index, element);
            if (index == colour) {
                console.log(colour);
                $.each(element, function(index, element) {
                    console.log(element);
                    var imageObj = new Image();
                    imageObj.onload = function() {
                        context.drawImage(imageObj, element.x, element.y, imageObj.width, imageObj.height);
                        context.strokeRect(element.x, element.y, imageObj.width, imageObj.height);
                    };
                    imageObj.id = element.id;
                    imageObj.src = element.img;
                    if (element.id == "target") {
                        targetObj = element;
                        target = element.y;
                        console.log(target);
                    }
                    console.log(imageObj.width, imageObj.height);
                    context.globalAlpha = 0.5;
                    context.lineWidth = 5;
                    context.linecap = "round";
                    context.strokeStyle = 'yellow'; // some color/style
                    context.lineWidth = 2; // thickness
                    context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
                    canvas.addEventListener('click', function(event) {
                        var x = event.pageX - canvas.offsetLeft,
                            y = event.pageY - canvas.offsetTop;
                        y = y - 30;
                        if (y > element.y && y < element.y + (imageObj.height) && x > element.x && x < element.x + (imageObj.width)) {
                            context.fillStyle = 'yellow';
                            console.log(filled.indexOf(element.x));
                            if (filled.indexOf(element.x) == -1) {
                                if (element.y != target)
                                    context.fillRect(element.x, element.y, imageObj.width, imageObj.height);
                                storeFilledPositon(element.x, filled);
                                if ((filled.length == 1) && (element.x == targetObj.x)) {
                                    filled.shift();
                                }
                                var index;
                                if ((filled.length < 6) && filled.indexOf(targetObj.x) != -1) {
                                    // alert('target is there');
                                    // alert(filled.indexOf(targetObj.x));
                                    var index = filled.indexOf(targetObj.x);
                                    filled.splice(index, 1);
                                    console.log(filled);
                                }
                                storeCoordinate(element.x, element.y, coords);
                                if (index) {
                                    // alert(count);
                                    if (coords[index].x == targetObj.x)
                                        coords.splice(index, 1);
                                    count = count + 1;
                                }
                                if ((coords.length == 1) && (element.x == targetObj.x)) {
                                    coords.shift();
                                }
                            }
                            if (coords.length == 1 && count == 0) {
                                // var footballObj = new Image();
                                // footballObj.onload = function() {
                                if (element.img == "images/tplayer4.gif")
                                    draw(coords[0].x + 20, coords[0].y + 20);
                                else
                                    draw(coords[0].x - 20, coords[0].y + 20);
                                // }
                                // footballObj.src = "images/football.gif";
                            }
                            if (filled.length == 5) {
                                context.fillRect(targetObj.x, targetObj.y, imageObj.width, imageObj.height + 68);
                            }
                            if (element.y == target && coords.length > 5) {
                                // setTimeout(function(){drawCords()}, 40);
                                console.log(coords);
                                points1 = calcWaypoints(coords);
                                console.log(points1);
                                input = document.getElementById("timer");

                                function start() {
                                    add = setInterval("input.value++", 1000);
                                }
                                start();
                                animateline(points1);
                                // context.closePath();
                                // clearInterval(add);
                                drawCords();
                            }
                        }
                    })
                });
            }
        });
    });
}
var waypoints;

function drawCords() {
    for (i in coords) {
        console.log(coords[i]);
        drawNextLine(context, coords[i].x, coords[i].y);
    }
}
console.log(colour);
// console.log(coords);
var target;
var count = 0;
var needFirstPoint = true;
console.log(target);
function storeCoordinate(xVal, yVal, array) {
    array.push({
        x: xVal,
        y: yVal
    });
    if (array.length == 2 && array[1].x == targetObj.x) {
        array.splice(1, 1);
        console.log(array);
    }
}
var coords = [];
console.log(coords);
var count = 0;

function storeFilledPositon(xVal, array) {
    array.push(xVal);
}
var filled = []
console.log(filled);

function drawNextLine(ctx, x, y) {
    console.log('path');
    var start, end;
    if (needFirstPoint) {
        // ctx.strokeStyle = "#FFFF00";
        // ctx.lineWidth = 3;
        // ctx.beginPath();
        // ctx.moveTo(x, y);
        needFirstPoint = false;
    } else {
        // ctx.lineTo(x, y);
        // ctx.stroke();
    }
    if (y == target) {
        console.log(target);
        // context.closePath();
        // ctx.globalCompositeOperation = "destination-over";
        // ctx.setLineDash([5, 15]);
        // ctx.strokeStyle = 'black';
        // ctx.stroke();
        // saveImageData();
        console.log("imagedata");
        // draw(coords[0].x,coords[0].y);
        //  setTimeout(moveObject(coords),30000);
        // displaySeconds();
        moveObject(coords);
    }
}

function setBackground() {
    bgcanvas = document.getElementById('footballCanvasbg');
    bgcontext = bgcanvas.getContext("2d");
    bgcanvas.setAttribute('width', screen.availWidth);
    bgcanvas.setAttribute('height', screen.availHeight);
    bgimage = new Image();
    bgimage.src = "images/background.svg";
    // bgimage.src = "images/footballbackground.jpg";
    bgcontext.drawImage(bgimage, 0, 0, screen.availWidth-15, screen.availHeight-100);
}
setBackground();

// function saveImageData() {
//     var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.putImageData(imgData, 0, 0);
// }
document.getElementById('footballCanvas').setAttribute("width", screen.availWidth);
document.getElementById('footballCanvas').setAttribute("height", screen.availHeight);
var ctx2 = document.getElementById('footballCanvas').getContext('2d');
document.getElementById('footballCanvas').setAttribute("width", screen.availWidth);
document.getElementById('footballCanvas').setAttribute("height", screen.availHeight);

function draw(x, y) {
    var fbimage = new Image();
    fbimage.src = "images/football.gif";
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.drawImage(fbimage, x, y);
}
// animation variables
var currentX = 10;
var currentY = 10;
var frameCount = 60;
var timer;
var points;
var currentFrame;

function animate() {
    var point = points[currentFrame++];
    draw(point.x, point.y);
    // refire the timer until out-of-points
    if (currentFrame < points.length) {
        timer = setTimeout(animate, 1000 / 60);
    }
}

var totaldistance = 0;
function linePoints(x1, y1, x2, y2, frames) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var length = Math.sqrt(dx * dx + dy * dy);
    totaldistance = totaldistance + length;
    document.getElementById("distance").value = totaldistance;
    var incrementX = dx / frames;
    var incrementY = dy / frames;
    var a = new Array();
    a.push({
        x: x1,
        y: y1
    });
    for (var frame = 0; frame < frames - 1; frame++) {
        a.push({
            x: x1 + (incrementX * frame),
            y: y1 + (incrementY * frame)
        });
    }
    a.push({
        x: x2,
        y: y2
    });
    return (a);
}
function moveObject(coords) {
    for (i = 0; i < coords.length - 1; i++) {
        (function(i) {
            setTimeout(function() {
                points = linePoints(coords[i].x, coords[i].y, coords[i + 1].x, coords[i + 1].y, frameCount);
                currentFrame = 0;
                coords[i].x = coords[i + 1].x;
                coords[i].y = coords[i + 1].y;
                animate();
            }, i * 1500);
        })(i);
    }
    // stopTime();
}
var t = 2;

function calcWaypoints(vertices) {
    // vertices[length] = vertices[0];
    var waypoints = [];
    for (var i = 1; i < vertices.length; i++) {
        var pt0 = vertices[i - 1];
        var pt1 = vertices[i];
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        for (var j = 0; j < 100; j++) {
            var x = pt0.x + dx * j / 100;
            var y = pt0.y + dy * j / 100;
            waypoints.push({
                x: x,
                y: y
            });
        }
    }
    return (waypoints);
}
// context.lineWidth = 5;
// context.strokeStyle = "blue";
var add;
var points1 = [];

function animateline() {
    if (t < points1.length - 1) {
        requestAnimationFrame(animateline);
    }
    // draw a line segment from the last waypoint
    // to the current waypoint
    context.moveTo(points1[t - 1].x, points1[t - 1].y);
    context.lineTo(points1[t].x, points1[t].y);
    // var x1 = points1[t].x;
    // var x2 = points1[t-1].x;
    // var y1 = points1[t].x;
    // var y2 = points2[t-1].y
    // Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
    context.stroke();
    // increment "t" to get the next waypoint
    // t++;
    t = t + 1;
    if (t == points1.length) {
        clearInterval(add);
        closePath(points1);
        finddisplacement(points1);
    }
}
function closePath(points1) {
    context.beginPath();
    context.moveTo(points1[points1.length - 1].x, points1[points1.length - 1].y)
    context.lineTo(points1[0].x, points1[0].y);
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    context.setLineDash([13, 15]);
    context.stroke();
}
var secondstimer = null;
function displaySeconds() {
    var sec = 0;
    var secondstimer = setInterval(function() {
        document.getElementById("timer").value = (++sec);
    }, 1000)
    setTimeout(function() {
        clearInterval(secondstimer);
    }, 15000);
}
function pad(val) {
    return val > 9 ? val : "0" + val;
}
function stopTime() {
    var value = document.getElementById("timer").value;
    clearInterval(secondstimer);
}
function finddisplacement(points1){
  var x1 = points1[0].x;
  var x2 = points1[points1.length - 1].x;
  var y1 = points1[0].x;
  var y2 = points1[points1.length - 1].y;
  var dy = y2-y1;
  var dx = x2-x1;
  var displacement = Math.sqrt(dx*dx + dy*dy);
  alert(displacement);
}
