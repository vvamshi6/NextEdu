var canvas = document.getElementById('myCanvas');
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
                        // var targetImg=document.createElement("img");
                        // targetImg.setAttribute('src', element.img);
                        // targetImg.setAttribute('alt', 'Target');
                        // targetImg.style.position = 'absolute';
                        // targetImg.style.left = element.x;
                        // targetImg.style.top = element.y;
                        // targetImg.setAttribute('left', element.x);
                        // targetImg.setAttribute('top', element.y);
                        // targetImg.setAttribute('position','absolute');
                        // document.body.appendChild(targetImg);
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
                                // "rgba(0,255,0,0.1)";
                                console.log(filled.indexOf(element.x));
                                if (filled.indexOf(element.x) == -1) {
                                    context.fillRect(element.x, element.y, imageObj.width, imageObj.height);
                                    storeFilledPositon(element.x, filled);
                                    storeCoordinate(element.x, element.y, coords);
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
}
var coords = [];
console.log(coords);

function storeFilledPositon(xVal, array) {
    array.push(xVal);
}
var filled = []
console.log(filled);

function drawNextLine(ctx, x, y) {
    console.log('path');
    ctx.lineTo(x, y);
    ctx.stroke();
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
        ctx.stroke();
    }
}
