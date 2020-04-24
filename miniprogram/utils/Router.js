class Router {
  constructor(options) {
    this.routes = []
  }
  switchTab({
    url = '',
    success = '',
    fail = function() {},
    complete = function() {}
  }) {}
  reLaunch({
    url = '',
    success = '',
    fail = function() {},
    complete = function() {}
  }) {}
  redirectTo({
    url = '',
    success = '',
    fail = function() {},
    complete = function() {}
  }) {}
  navigateTo({
    url = '',
    success = '',
    fail = function() {},
    complete = function() {}
  }) {}
  navigateBack({
    url = '',
    success = '',
    fail = function() {},
    complete = function() {}
  }) {}
}