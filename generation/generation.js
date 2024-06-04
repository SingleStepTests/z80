"use strict";

var seed_input, numtests_input;
window.onload = function() {
    seed_input = document.getElementById('seed');
    dconsole = new dct();
    seed_input.value = "apples and oranges";
    numtests_input = document.getElementById('numtests');
    numtests_input.value = '1000';
}

class dct {
    constructor() {
        this.el = document.getElementById('statushere');
    }

    addl(order, what) {
        console.log('LOG:', what);
        this.el.innerHTML = what;
    }
}
var dconsole;

function click_generate_z80_tests() {
    let seed = seed_input.value;
    if (seed.length < 1) {
        alert('Please use a seed!');
        return;
    }
    let CMOS = document.getElementById('Z80cmos').checked;
    let simplified_mem = document.getElementById('Z80simplmem').checked;
    let refresh = document.getElementById('Z80refresh').checked;
    let nullwaits = document.getElementById("Z80nullwait").checked;
    let numtests = parseInt(numtests_input.value);
    if (!numtests) {
        alert('Please enter a valid number of tests to generate per opcode');
        return;
    }

    Z80_DO_FULL_MEMCYCLES = !simplified_mem;
    Z80_DO_MEM_REFRESHES = refresh; // Put I/R on address bus
    Z80_NULL_WAIT_STATES = nullwaits;
    generate_Z80_tests(seed, CMOS);
}