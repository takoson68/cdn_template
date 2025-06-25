#!/bin/bash

componentName=$(osascript -e 'Tell application "System Events" to display dialog "請輸入元件名稱" default answer ""' -e 'text returned of result' 2>/dev/null)
if [ -n "$componentName" ]; then
  node design-pattern-lab/scripts/create-component.js "$componentName"
else
  echo "取消或未輸入"
fi
