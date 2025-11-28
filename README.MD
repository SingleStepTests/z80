[![](https://github.com/SingleStepTests/z80/actions/workflows/validate.yml/badge.svg)](https://github.com/SingleStepTests/z80/actions/workflows/validate.yml)

Very quick overview

Each .json file represents an instruction sequence. Each one contains 1000 tests in this format:

```json
{
    "name": "DB 0000",
    "initial": {
        "pc": 49774,
        "sp": 7765,
        "a": 227,
        "b": 173,
        "c": 249,
        "d": 142,
        "e": 238,
        "f": 140,
        "h": 21,
        "l": 190,
        "i": 62,
        "r": 0,
        "ei": 0,
        "wz": 6102,
        "ix": 29661,
        "iy": 5464,
        "af_": 27987,
        "bc_": 37392,
        "de_": 52402,
        "hl_": 41834,
        "im": 0,
        "p": 1,
        "q": 0,
        "iff1": 0,
        "iff2": 1,
        "ram": [
            [
                49774,
                219
            ],
            [
                49775,
                249
            ]
        ]
    },
    "final": {
        "a": 155,
        "b": 173,
        "c": 249,
        "d": 142,
        "e": 238,
        "f": 140,
        "h": 21,
        "l": 190,
        "i": 62,
        "r": 1,
        "af_": 27987,
        "bc_": 37392,
        "de_": 52402,
        "hl_": 41834,
        "ix": 29661,
        "iy": 5464,
        "pc": 49776,
        "sp": 7765,
        "wz": 58362,
        "iff1": 0,
        "iff2": 1,
        "im": 0,
        "ei": 0,
        "p": 0,
        "q": 0,
        "ram": [
            [
                49774,
                219
            ],
            [
                49775,
                249
            ]
        ]
    },
    "cycles": [
        [
            49774,
            null,
            "----"
        ],
        [
            49774,
            null,
            "r-m-"
        ],
        [
            15872,
            219,
            "----"
        ],
        [
            15872,
            null,
            "----"
        ],
        [
            49775,
            null,
            "----"
        ],
        [
            49775,
            null,
            "r-m-"
        ],
        [
            49775,
            249,
            "----"
        ],
        [
            58361,
            null,
            "----"
        ],
        [
            58361,
            null,
            "----"
        ],
        [
            58361,
            null,
            "r--i"
        ],
        [
            58361,
            155,
            "----"
        ]
    ],
    "ports": [
        [
            58361,
            155,
            "r"
        ]
    ]
}
```

Where "name" denotes human-readable name for discussion,

"Initial" is a structure describing the initial registers and ram configuration.

Of special note, the "wz" register may not be familiar; it's an internal register to the Z80.

Q is used to track if flags were modified for X/Y flag behavior in 2 instructions.

P tracks if "ld a,i" or "ld a,r" were executed last.

The "ram" section holds the contents of RAM.

Moving on, the "final" structure holds all the same info, but after the instruction has finished running.

"cycles" contains a list of processor bus states, sampled BETWEEN CYCLES.
We have this:

[24525, 174, "r-m-" ]

This means the Address pins are set to 24525, the Data pins set to 174, and READ and MEMORY REQUEST pins are set (r and m). There are also w for write and i for I/O REQUEST.

A null value for the address or data pins refers to when the bus is electrically disconnected from the processor internals, so the value doesn't matter. For convenience, we just use the last address generated, but this is a configurable option too.

Finally, IO instructions contains a "ports" array with a single element representing the I/O address space transaction. 
- The first value is the full 16-bit I/O space address.
- The second value is the value read or written. 
- The type is either "r" for read (e.g. IN) or "w" for write (e.g. OUT). 

-----

IMPORTANT: here are the configurable options and their default values:

(unchecked) CMOS variant

(checked) Use simplified memory access T-states. With this ON, MRQ/RD and MRQ/WR will only pulse for 1 T-state, whereas the docs have them pulse for 2. This simplifies emulator development and speeds up execution at no cost to accuracy.

(checked) Put REFRESH values on address pins during opcode fetch

(unchecked) Put "null" during wait state. On a real Z80, during "internal operations," the address pins are electrically disconnected from the processor. They may hold either the last value, or junk. If this is checked, we will use the last value; otherwise, we will use "null" to show that the address is unimportant.

---

To use these tests, it depends a lot on if you want to check cycle-by-cycle or just before and after. The general pseudocode is:

```
load test .json;
for test in test.json:
    set initial processor state from test;
    set initial RAM state from test;
    
    for cycle in test:
        cycle processor
        if we are checking cycle-by-cycle:
            compare our R/W/MRQ/IO/Address/Data pins against the current cycle;
      
    compare final RAM state to test and report any errors;
    compare final processor state to test and report any errors;
```

The middle cycle section can be simplified if your emulator is not cycle-by-cycle or you do not want to worry about bus states being the same as the tests.

Thanks and please open an issue for any errors! These tests were created by translating Ares' Z80 core, then fixing up some bugs (which I made Issues for on Ares). But they're probably not perfect. I'd like them to be, though.
