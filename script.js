let wheelButton = document.querySelector("#wheelButton")
let Wheel = document.querySelector("#WheelButtonPage")
let HomePageButton = document.querySelector("#HomePage")
Wheel.style.display = "none"
let logButton = document.querySelector('#log')
let userInfo= document.querySelectorAll('.userContainer')
let database = firebase.database().ref();
userInfo[0].style.display= "none"
let SavedAmountElement = document.querySelector('#SavedAmount')
let DateElement = document.querySelector('#Date')
let Submit = document.querySelector('#submitButton')
let Logo = document.querySelector("#logo")
let allMessages = document.querySelector(".allMessages");
let FinalButton = document.querySelector("#final")
FinalButton.style.display = "none"


var options = ["$100", "$10", "$25", "$50", "$30", "$25", "$1", "$20", "$45", "$50", "$5", "$20", "$75", "$30", "$3", "$100", "$15", "$99"];
var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;
var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;
document.getElementById("spin").addEventListener("click", spin);
function byte2Hex(n) {
  var nybHexString = "0123456789ABCDEF";
  return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}
function RGB2Color(r,g,b) {
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}
function getColor(item, maxitem) {
  var phase = 0;
  var center = 128;
  var width = 127;
  var frequency = Math.PI*2/maxitem;
  red   = Math.sin(frequency*item+2+phase) * width + center;
  green = Math.sin(frequency*item+0+phase) * width + center;
  blue  = Math.sin(frequency*item+4+phase) * width + center;
  return RGB2Color(red,green,blue);
}
function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;
    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = 'bold 12px Helvetica, Arial';
    for(var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i, options.length);
      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();
      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur    = 0;
      ctx.shadowColor   = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                    250 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = options[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    } 
    //Arrow
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }
}
function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}
function rotateWheel() {
  spinTime += 30;
  if(spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}
function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  ctx.font = 'bold 35px Helvetica, Arial';
  var text = options[index]
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}
function easeOut(t, b, c, d) {
  var ts = (t/=d)*t;
  var tc = ts*t;
  return b+c*(tc + -3*ts + 3*t);
}
drawRouletteWheel();
wheelButton.onclick = function(event){
  event.preventDefault(); 
  Wheel.style.display= "block";
  FinalButton.style.display = "block";
  userInfo[0].style.display= "none";
  Logo.style.display = "none";
  allMessages.style.display = "none";
  
  }
HomePageButton.onclick = function(event) {
  event.preventDefault();
  Wheel.style.display = "none";
  userInfo[0].style.display="none";
  Logo.style.display = "block";
  allMessages.style.display = "none";
  FinalButton.style.display = "none";
}
logButton.onclick = function(event) {
  event.preventDefault();
  userInfo[0].style.display= "block";
  Wheel.style.display= "none";
  Logo.style.display = "none";
  FinalButton.style.display = "none";
}
Submit.onclick = function updateDB(event){
  event.preventDefault(); //stop refreshing
  let amountSaved        = SavedAmountElement.value;
  let date         =  DateElement.value;
  SavedAmountElement.value = "";
  DateElement.value  = "";
  console.log(amountSaved + " : " + date);
  // Update database here
  let value = {
      AMOUNTSAVED: amountSaved, 
      DATE: date,
  }
  database.push(value);
  allMessages.style.display = "block";
}
  let totalP = document.createElement("p");
let total = 0;
let board = document.querySelector(".allMessages");
database.on("child_added", addToLog);
function addToLog(rowData){
  let row = rowData.val(); // returns an object just like the value we pushed
  
  let message = document.createElement("p");
  message.innerHTML = "Amount Saved: $" + row.AMOUNTSAVED +"<br>" + "Date:" + row.DATE;
  total += parseFloat(row.AMOUNTSAVED);
  board.appendChild(message);
  SavedAmountElement.value= "";
  DateElement.value = ""; 
  console.log(total)

  totalP.innerHTML = "Total Saved so Far: " + total;

}

board.appendChild(totalP);

