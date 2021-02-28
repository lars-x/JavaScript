'use strict'

import { calc_pie_area } from './lars_utils.js';
import { deg2rad } from './lars_utils.js';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("txt_radius").value = "1.0";
    document.getElementById("txt_angle").value = "360";
    document.getElementById("txt_area").value = "";

    document.getElementById("txt_angle_pie_svg").value = "60";
    document.getElementById("txt_angle_pie_canvas").value = "60";
    draw_pie_chart_svg(60);
    draw_pie_chart_canvas(60);

    $("#txt_no_of_darts").val(4);

    startClock();
});

document.querySelector('#btn_task_1').addEventListener('click', function () {
    document.body.classList.toggle('dark-theme');
    const className = document.body.className;
    if (className == "light-theme") {
        this.textContent = "Dark";
    }
    else {
        this.textContent = "Light";
    }
});

function show_error(error_text) {
    const div = document.createElement("div");
    div.textContent = error_text;
    div.style.backgroundColor = 'red';
    document.getElementById("error_task_2").appendChild(div);
}

function validate_task_2(radius, angle_deg) {
    if (radius <= 0) {
        show_error("Radius must be >= 0");
    }

    if ((angle_deg < 0) || (angle_deg > 360)) {
        show_error("Angle must be in [0..360] degress");
    }
}

document.querySelector('#btn_task_2').addEventListener('click', function () {
    const radius = parseFloat(document.getElementById("txt_radius").value);
    const angle_deg = parseFloat(document.getElementById("txt_angle").value);

    validate_task_2(radius, angle_deg);

    const area = calc_pie_area(radius, angle_deg);
    const txt_area = area.toFixed(4);
    document.getElementById("txt_area").value = txt_area;
});

document.querySelector('#btn_task_3').addEventListener('click', function () {
    const angle_deg = parseFloat(document.getElementById("txt_angle_pie_svg").value);
    draw_pie_chart_svg(angle_deg);
});


document.querySelector("#txt_angle_pie_svg").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.querySelector('#btn_task_3').click();
    }
});

// Used code: https://www.smashingmagazine.com/2019/03/svg-circle-decomposition-paths/
// Template:
// <svg width="200" height="200" viewBox="-100 -100 200 200">
//   <path d="M 0 -100 A 100 100 0 0 1 0 100 z" fill="white" stroke-width="0" fill-opacity="1.0" />
//   <path d="M 0 -100 A 100 100 0 1 0 0 100 z" fill="white" stroke-width="0" fill-opacity="1.0" />
//   <path d="M 0 0 L 0 -100 A 100 100 0 0 1 100 0 z" stroke="black" fill="blue" stroke-width="2" fill-opacity="1.0" />
// </svg>
// Does not work well for angle > 180.
function draw_pie_chart_svg(angle_deg) {
    const diameter = 200; // Diameter of the pie chart in pixels
    const radius = diameter / 2; // Diameter of the pie chart in pixels
    const d = diameter.toFixed(0);
    const r = radius.toFixed(0);

    const angle = angle_deg - 90; // Change to a compass coordinate system
    const xx = radius * Math.cos(angle * deg2rad);
    const yy = radius * Math.sin(angle * deg2rad);
    const x = xx.toString();
    const y = yy.toString();

    const svg = '<svg width="' + d + '" height="' + d + '" viewBox="' + '-' + r + ' -' + r + ' ' + d + ' ' + d + '"> ';
    const half_circle_left_ = '<path d="M 0 -' + r + ' A ' + r + ' ' + r + ' 0 0 1 0 ' + r +
        ' z" fill="white" stroke-width="0" fill-opacity="1.0" />';
    const half_circle_right = '<path d="M 0 -' + r + ' A ' + r + ' ' + r + ' 0 1 0 0 ' + r +
        ' z" fill="white" stroke-width="0" fill-opacity="1.0" />';

    const largeArcFlag = angle <= 180 ? "0" : "1";
    const sweepFlag = angle <= 180 ? "1" : "0";
    const pie = '<path d="M 0 0 L 0 -' + r + ' A ' + r + ' ' + r + ' 0 ' +
        largeArcFlag + ' ' + sweepFlag + ' ' + x + ' ' + y +
        ' " stroke="black" fill="blue" stroke-width="2" fill-opacity="1.0" />';
    const svg_end = '</svg>';
    const html = svg + half_circle_left_ + half_circle_right + pie + svg_end;
    document.querySelector('#pie_chart_svg').innerHTML = html;
}

function pi_dart(no_of_darts) {
    // const no_of_darts = 30000;
    let hits = 0;
    for (let k = 0; k < no_of_darts; k++) {
        let x = Math.random();
        let y = Math.random();

        const xx = 100 * x;
        const yy = -100 * y; // y is in the negative direction
        let color = "red";
        if (x * x + y * y < 1) {
            hits += 1;
            color = "yellow";
        }
        const circle = '<circle cx="' + xx + '" cy="' + yy + '" r="2" fill="' + color + '" />';
        $('#svg_darts').append(circle);
    }

    $("#div_svg_darts").html($("#div_svg_darts").html()); // We need to refresch all inside this div, that is the svg.
    const res = 4 * hits / no_of_darts;
    return res;
}

$('#btn_task_4_simple').click(function () {
    const ms = 2000;
    $('#fader').fadeOut(ms).fadeIn(ms).fadeOut(ms).fadeIn(ms);
    $('#hider').hide(ms).show(ms).hide(ms).show(ms);
    $('#slider').slideUp(ms).slideDown(ms).slideUp(ms).slideDown(ms);
});

$('#btn_task_4_custom').click(function () {
    const ms = 2000;

    $("#custom").animate({
        "font-size": "200px"
    }, {
        duration: ms,
        complete: function () {
            $("#custom").text("Heja Gais!");
            $("#custom").css("font-size", "20px");
        }
    });
});


$('#btn_task_4_svg').click(function () {
    $('#svg_darts').children('circle').remove();

    const no_of_darts = parseFloat($("#txt_no_of_darts").val());
    const pi = pi_dart(no_of_darts);

    const txt_pi = pi.toString();
    $("#txt_pi").val(txt_pi);
});

let timerFunction = null;
function startAnimation() {
    const circles = $("#svg_darts > circle")

    clearInterval(timerFunction);
    timerFunction = setInterval(frame, 2);

    let k = 0;
    let circle = $(circles[k]);
    function frame() {
        const x = circle.attr("cx");
        const y = circle.attr("cy");
        const newX = parseInt(x) - 2;
        const newY = parseInt(y) + 2;
        circle.attr("cx", newX);
        circle.attr("cy", newY);

        if (newX < -10 || newY < -110) {
            k = k + 1;
            if (k >= circles.length) {
                clearInterval(timerFunction);
                return;
            }
            circle = $(circles[k]);
        }
    }
}

$('#btn_task_4_svg_anim_start').click(function () {
    startAnimation();
});

$('#btn_task_4_svg_anim_stop').click(function () {
    clearInterval(timerFunction);
});

function draw_pie_chart_canvas(angle_deg) {
    const canvas = document.getElementById("canvas_pie");
    const ctx = canvas.getContext("2d");
    const r = canvas.height / 2; // radius
    const startangle_deg = 0;
    const endangle_deg = angle_deg;
    const startangle = (startangle_deg - 90) * deg2rad;
    const endangle = (endangle_deg - 90) * deg2rad;

    // Not used right now
    // Remap the (0,0) position (of the drawing object) to the center of the canva
    // ctx.translate(r, r);

    ctx.arc(r, r, r, 0, 360 * deg2rad);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.lineTo(r, r);
    ctx.lineTo(r, 0);
    ctx.arc(r, r, r, startangle, endangle);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.stroke();
}

document.querySelector("#txt_angle_pie_canvas").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.querySelector('#btn_task_5').click();
    }
});

document.querySelector("#txt_angle_pie_canvas").addEventListener("change", function () {
    document.querySelector('#btn_task_5').click();
});

$('#btn_task_5').click(function () {
    const angle_deg = parseFloat(document.getElementById("txt_angle_pie_canvas").value);
    draw_pie_chart_canvas(angle_deg);
});

// Code from: https://www.w3schools.com/graphics/canvas_clock_start.asp
function startClock() {
    const canvas = document.getElementById("canvas_clock");
    const ctx = canvas.getContext("2d");
    let radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90;
    setInterval(drawClock, 1000);

    function drawClock() {
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius);
    }

    function drawFace(ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        const grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }

    function drawNumbers(ctx, radius) {
        ctx.font = radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (let num = 1; num < 13; num++) {
            let ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    }

    function drawTime(ctx, radius) {
        const now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        //hour
        hour = hour % 12;
        hour = (hour * Math.PI / 6) +
            (minute * Math.PI / (6 * 60)) +
            (second * Math.PI / (360 * 60));
        drawHand(ctx, hour, radius * 0.5, radius * 0.07);
        //minute
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        drawHand(ctx, minute, radius * 0.8, radius * 0.07);
        // second
        second = (second * Math.PI / 30);
        drawHand(ctx, second, radius * 0.9, radius * 0.02);
    }

    function drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }
}
