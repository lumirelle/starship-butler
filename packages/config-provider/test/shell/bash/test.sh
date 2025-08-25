#!/usr/bin/env bash
source ../../../assets/shell/bash/.bash_profile > /dev/null 2>&1

total_tests=0
passed_tests=0
failed_tests=0
silent=false

if [ "$1" == "--silent" ]; then
  silent=true
fi

if [ "$silent" == false ]; then
  echo "--------------------------------"
  echo "Testing Start..."
  echo "--------------------------------"
fi

ls -all

# Change to the script directory
script_dirname=$(cd "$(dirname "$0")" && pwd -P)
cd "$script_dirname"

if any-path-exists 'not-exists-file'; then
  if [ "$silent" == false ]; then
    echo "Test failed: any-path-exists 'not-exists-file' is true"
  fi
  failed_tests=$((failed_tests + 1))
else
  if [ "$silent" == false ]; then
    echo "Test passed: any-path-exists 'not-exists-file' is false"
  fi
  passed_tests=$((passed_tests + 1))
fi
total_tests=$((total_tests + 1))

if any-path-exists-parent 'not-exists-file'; then
  if [ "$silent" == false ]; then
    echo "Test failed: any-path-exists-parent 'not-exists-file' is true"
  fi
  failed_tests=$((failed_tests + 1))
else
  if [ "$silent" == false ]; then
    echo "Test passed: any-path-exists-parent 'not-exists-file' is false"
  fi
  passed_tests=$((passed_tests + 1))
fi
total_tests=$((total_tests + 1))

if any-path-exists 'bash.test.ts'; then
  if [ "$silent" == false ]; then
    echo "Test passed: any-path-exists 'bash.test.ts' is true"
  fi
  passed_tests=$((passed_tests + 1))
else
  if [ "$silent" == false ]; then
    echo "Test failed: any-path-exists 'bash.test.ts' is false"
  fi
  failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

if any-path-exists-parent 'bash.test.ts'; then
  if [ "$silent" == false ]; then
    echo "Test passed: any-path-exists-parent 'bash.test.ts' is true"
  fi
  passed_tests=$((passed_tests + 1))
else
  if [ "$silent" == false ]; then
    echo "Test failed: any-path-exists-parent 'bash.test.ts' is false"
  fi
  failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

abs=$(realpath 'bash.test.ts')
if [ "$(dirname-parent 'bash.test.ts' && echo "$dirname")" == "$(echo "$abs" | tr '/' '\n' | head -n "$(echo "$abs" | tr '/' '\n' | wc -l | awk '{print $1 - 1}')" | tr '\n' '/' | sed 's:/$::')" ]; then
  if [ "$silent" == false ]; then
    echo "Test passed: dirname-parent 'bash.test.ts' is correctly resolved"
  fi
  passed_tests=$((passed_tests + 1))
else
  if [ "$silent" == false ]; then
    echo "Test failed: dirname-parent 'bash.test.ts' is unresolved"
  fi
  failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

if [ "$silent" == false ]; then
  echo "--------------------------------"
  echo "Total tests: $total_tests"
  echo "Passed tests: $passed_tests"
  echo "Failed tests: $failed_tests"
  echo "--------------------------------"
fi

if [ "$silent" == true ]; then
  echo $total_tests
  echo $passed_tests
  echo $failed_tests
fi
