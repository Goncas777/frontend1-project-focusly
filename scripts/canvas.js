const canvas = document.getElementById("linhaCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = 10;

ctx.strokeStyle = "#2b2b2b";
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(0, 5); 
ctx.lineTo(canvas.width, 5);
ctx.stroke();