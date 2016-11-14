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
                              draw(coords[0].x+20,coords[0].y+20);
                                // var footballObj = new Image();
                                // footballObj.onload = function() {
                                //     if (element.img == "images/tplayer4.gif")
                                //         context.drawImage(footballObj, element.x + 20, element.y + 45, footballObj.width, footballObj.height);
                                //     else
                                //         context.drawImage(footballObj, element.x - 10, element.y + 30, footballObj.width, footballObj.height);
                                // }
                                footballObj.src = "images/football.gif";
                            }
                            if (filled.length == 5) {
                                context.fillRect(targetObj.x, targetObj.y, imageObj.width, imageObj.height + 68);
                            }
                            if (element.y == target && coords.length > 5) {
                                // setTimeout(function(){drawCords()}, 40);
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
        setTimeout(drawNextLine(context, coords[i].x, coords[i].y),100000000);
        // setTimeout(function(){drawNextLine(context, coords[i].x, coords[i].y)}, 10);
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
        // saveImageData();
        console.log("imagedata");
        draw(coords[0].x,coords[0].y);
         setTimeout(moveObject(coords),30000);
    }
}
function setBackground() {
    bgcanvas = document.getElementById('footballCanvasbg');
    bgcontext = bgcanvas.getContext("2d");
    bgcanvas.setAttribute('width', screen.availWidth);
    bgcanvas.setAttribute('height', screen.availHeight);
    bgimage = new Image();
    bgimage.src = "images/footballbackground.jpg";
    bgcontext.drawImage(bgimage, 0, 0, screen.availWidth, screen.availHeight);
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
function draw(x,y){
  var fbimage = new Image();
  fbimage.src = "images/football.gif";
  ctx2.clearRect(0,0,canvas.width,canvas.height);
  ctx2.drawImage(fbimage,x,y);
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
      function linePoints(x1, y1, x2, y2, frames) {
                 var dx = x2 - x1;
                 var dy = y2 - y1;
                 var length = Math.sqrt(dx * dx + dy * dy);
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
        function moveObject(coords){
          for(i =0 ;i<coords.length-1;i++)
            (function(i) {
              setTimeout(function() {
                points = linePoints(coords[i].x,coords[i].y,coords[i+1].x,coords[i+1].y,frameCount);
                currentFrame = 0;
               coords[i].x = coords[i+1].x;
               coords[i].y = coords[i+1].y;
                animate();
              }, i*1500);
            })(i);
          }
