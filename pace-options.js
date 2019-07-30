window.paceOptions = {
  // Only show the progress on regular and ajax-y page navigation,
  // not every request (false)
  restartOnRequestAfter: true,
  ajax: {
    ignoreURLs: ['lastupdate', 'switchcmd']
  },
  restartOnPushState: false
}
