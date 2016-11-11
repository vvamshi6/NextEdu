var canvas = document.getElementById('footballCanvas');
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
                    context.strokeStyle = '#f00'; // some color/style
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
                                var footballObj = new Image();
                                footballObj.onload = function() {
                                    if (element.img == "images/tplayer4.gif")
                                        context.drawImage(footballObj, element.x + 20, element.y + 45, footballObj.width, footballObj.height);
                                    else
                                        context.drawImage(footballObj, element.x - 10, element.y + 30, footballObj.width, footballObj.height);
                                }
                                footballObj.src = "images/football.gif";
                            }
                            if (filled.length == 5) {
                                context.fillRect(targetObj.x, targetObj.y, imageObj.width, imageObj.height + 68);
                            }
                            if (element.y == target && coords.length > 5) {
                                drawCords();
                            }
                        }
                    })
                });
            }
        });
    });
}

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
        ctx.strokeStyle = "#FFFF00";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        needFirstPoint = false;
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    if (y == target) {
        console.log(target);
        ctx.closePath();
        ctx.globalCompositeOperation = "destination-over";
        ctx.setLineDash([5, 15]);
        // ctx.strokeStyle = 'black';
        ctx.stroke();
    }
}
