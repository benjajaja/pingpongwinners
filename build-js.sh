#!/bin/bash

tsc -sourcemap -t ES5 -noImplicitAny src/app.ts --out app.js $1
