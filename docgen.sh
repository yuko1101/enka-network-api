#!/bin/sh
workDir=$(cd "$0/.." && pwd)
templateDir="$USERPROFILE/AppData/Roaming/npm/node_modules/docdash" # from global

cd "${workDir}"

jsdoc "${workDir}/src" -r -t "${templateDir}" -d "docs" --debug

read -p "Press [Enter] key to resume."