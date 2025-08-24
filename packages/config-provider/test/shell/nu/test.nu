#!/usr/bin/env nu
use '../../../assets/shell/nu/utils.nu'

def main [--silent] {
  mut total_tests = 0
  mut passed_tests = 0
  mut failed_tests = 0

  if $silent == false {
    print "--------------------------------"
    print "Testing Start..."
    print "--------------------------------"
  }

  if (['not-exists-file'] | utils any-path-exists) {
    if $silent == false {
      print $"(ansi red)Test failed: any-path-exists 'not-exists-file' is true(ansi reset)"
    }
    $failed_tests += 1
  } else {
    if $silent == false {
      print $"(ansi green)Test passed: any-path-exists 'not-exists-file' is false(ansi reset)"
    }
    $passed_tests += 1
  }
  $total_tests += 1

  if (['not-exists-file'] | utils any-path-exists-parent) {
    if $silent == false {
      print $"(ansi red)Test failed: any-path-exists-parent 'not-exists-file' is true(ansi reset)"
    }
    $failed_tests += 1
  } else {
    if $silent == false {
      print $"(ansi green)Test passed: any-path-exists-parent 'not-exists-file' is false(ansi reset)"
    }
    $passed_tests += 1
  }
  $total_tests += 1

  if (['test.nu'] | utils any-path-exists) {
    if $silent == false {
      print $"(ansi green)Test passed: any-path-exists 'test.nu' is true(ansi reset)"
    }
    $passed_tests += 1
  } else {
    if $silent == false {
      print $"(ansi red)Test failed: any-path-exists 'test.nu' is false(ansi reset)"
    }
    $failed_tests += 1
  }
  $total_tests += 1

  if (['test.nu'] | utils any-path-exists-parent) {
    if $silent == false {
        print $"(ansi green)Test passed: any-path-exists-parent 'test.nu' is true(ansi reset)"
    }
    $passed_tests += 1
  } else {
    if $silent == false {
      print $"(ansi red)Test failed: any-path-exists-parent 'test.nu' is false(ansi reset)"
    }
    $failed_tests += 1
  }
  $total_tests += 1

  if (('test.nu' | utils dirname-parent) == ('test.nu' | path expand | path dirname)) {
    if $silent == false {
        print $"(ansi green)Test passed: dirname-parent 'test.nu' is correctly resolved(ansi reset)"
    }
    $passed_tests += 1
  } else {
    if $silent == false {
      print $"(ansi red)Test failed: dirname-parent 'test.nu' is unresolved(ansi reset)"
    }
    $failed_tests += 1
  }
  $total_tests += 1

  if $silent == false {
    print "--------------------------------"
    print $"Total tests: ($total_tests)"
    print $"(ansi green)Passed tests: ($passed_tests)(ansi reset)"
    print $"(ansi red)Failed tests: ($failed_tests)(ansi reset)"
    print "--------------------------------"
  }

  if $silent == true {
    print $total_tests
    print $passed_tests
    print $failed_tests
  }
}


