'use strict'

import { calc_pie_area } from './lars_utils.js';
import { deg2rad } from './lars_utils.js';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("txt_radius").value = "1.0";
    document.getElementById("txt_angle").value = "360";
    document.getElementById("txt_area").value = "";

    document.getElementById("txt_angle_pie").value = "60";
    draw_pie_chart(60);

    $("#txt_no_of_darts").val(42);
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
        show_error("Radius must be in [0..360] degress");
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
    const angle_deg = parseFloat(document.getElementById("txt_angle_pie").value);
    draw_pie_chart(angle_deg);
});


document.querySelector("#txt_angle_pie").addEventListener("keyup", function (event) {
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
function draw_pie_chart(angle_deg) {
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
    document.querySelector('#pie_chart').innerHTML = html;
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

$(document).on('click', '#btn_task_4', function () {
    $('#svg_darts').children('circle').remove();

    const no_of_darts = parseFloat($("#txt_no_of_darts").val());
    const pi = pi_dart(no_of_darts);

    const txt_pi = pi.toString();
    $("#txt_pi").val(txt_pi);

});
