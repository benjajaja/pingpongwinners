#!/bin/bash

tsc -sourcemap -t ES5 -noImplicitAny src/app.ts --out dist/app.js $1
