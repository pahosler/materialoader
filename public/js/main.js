/**
 * ajax processes to handle the file loaded in memory
 */
!(function() {
  var btn_submit = document.getElementById('btn-submit');
  btn_submit.addEventListener('click', function(ev) {
    var data = new FormData();
    var files = uploader.getFiles();
    for (var property in files) {
      if (files.hasOwnProperty(property)) {
        data.append('files', files[property]);

      }
    }

    let xhr = new XMLHttpRequest();

    let onProgress = function(e) {
      if (e.lengthComputable) {
        let percentComplete = (e.loaded / e.total) * 100;
      }
    };

    let onReady = function(e) {
      // ready state
    };

    let onError = function(err) {
      console.log(err);
    };

    xhr.open('POST', '/upload', true);
    xhr.addEventListener('error', onError, false);
    xhr.addEventListener('progress', onProgress, false);
    xhr.send(data);
  });

}());
