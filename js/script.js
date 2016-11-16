window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 3000 / 60);
        };
})();
var canvas = document.getElementById('footballCanvas2');
var context = canvas.getContext('2d');
var colour = document.getElementById('colorSelect').value;
canvas.setAttribute("width", screen.availWidth);
canvas.setAttribute("height", screen.availHeight);

function readJson() {
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
}
readJson();
setBackground();
var colour;

function changeColour() {
    colour = document.getElementById('colorSelect').value;
    console.log(colour);
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
                                animateball();
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
        // drawNextLine(context, coords[i].x, coords[i].y);
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

function setBackground() {
    bgcanvas = document.getElementById('footballCanvasbg');
    bgcontext = bgcanvas.getContext("2d");
    bgcanvas.setAttribute('width', screen.availWidth);
    bgcanvas.setAttribute('height', screen.availHeight);
    bgimage = new Image();
    bgimage.src = "images/background.svg";
    // bgimage.src = "images/footballbackground.jpg";
    bgcontext.drawImage(bgimage, 0, 0, screen.availWidth - 15, screen.availHeight - 100);
}
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
// var points;

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
var add;
var points1 = [];
var totaldistance = 0;

function animateline() {
    if (t < points1.length - 1) {
        requestAnimFrame(animateline);
    }
    // draw a line segment from the last waypoint
    // to the current waypoint
    context.moveTo(points1[t - 1].x, points1[t - 1].y);
    context.lineTo(points1[t].x, points1[t].y);
    var x1 = points1[t].x;
    var x2 = points1[t - 1].x;
    var y1 = points1[t].y;
    var y2 = points1[t - 1].y
    var distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    totaldistance = distance + totaldistance;
    document.getElementById('distance').value = totaldistance;
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
var fbimage = new Image();
fbimage.src = "images/football.gif";

function animateball() {
    if (t < points1.length - 1) {
        requestAnimFrame(animateball);
    }
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.drawImage(fbimage, points1[t - 1].x, points1[t - 1].y);

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

function finddisplacement(points1) {
    var x1 = points1[0].x;
    var x2 = points1[points1.length - 1].x;
    var y1 = points1[0].x;
    var y2 = points1[points1.length - 1].y;
    var dy = y2 - y1;
    var dx = x2 - x1;
    var displacement = Math.sqrt(dx * dx + dy * dy);
    drawLabel(context, displacement, points1[0], points1[points1.length - 1], 'center', 10);
    // alert(displacement);
    document.getElementById('Questionbox').style.display = 'block';
}

function drawLabel(ctx, text, p1, p2, alignment, padding) {
    if (!alignment) alignment = 'center';
    if (!padding) padding = 0;
    if (colour == 'red') {
        var x = p1;
        p1 = p2;
        p2 = x;
    }
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var p, pad;
    if (alignment == 'center') {
        p = p1;
        pad = 1 / 2;
    } else {
        var left = alignment == 'left';
        p = left ? p1 : p2;
        pad = padding / Math.sqrt(dx * dx + dy * dy) * (left ? 1 : -1);
    }
    ctx.save();
    ctx.font = 'italic 20pt Calibri';
    ctx.textAlign = alignment;
    ctx.translate(p.x + dx * pad, p.y + dy * pad);
    ctx.rotate(Math.atan2(dy, dx));
    ctx.fillText(text, 0, 0);
    ctx.restore();
}
