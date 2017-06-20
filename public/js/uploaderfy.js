'use strict';

/**
 * Uploaderfy js library
 * @description: Manages the file uploads on client side
 * @author: Lorenzo Gamboa García
 */
!function () {

    /**
     * Function to build up the uploader
     * @param  {string} idname     idname of the <div> element that will
     *                             the uploaderfy
     * @param  {object} properties optional properties to shape up the uploaderfy
     */
    function uploaderfy(idname, properties) {
        //Constructor, private variables
        var _uploadername = idname;
        var _width = properties.x || 300;
        var _height = properties.y || 200;
        var _fontfamily = properties.fontfamily || '';
        var _nelements = properties.nelements || undefined;
        var _files = {};
        var _counter = 0;

        var uploader = document.getElementById(_uploadername);
        var that = this;

        /*
          Retreives the uploaderfy object id
        */
        this.getUploaderName = function () {
            return _uploadername;
        };

        /*
          Retreives the width
        */
        this.getWidth = function () {
            return _width;
        };
        /*
          Retreives the height
        */
        this.getHeight = function () {
            return _height;
        };
        /*
          Retreives the fontfamily
        */
        this.getFontfamily = function () {
            return _fontfamily;
        };
        /*
          Retreives the file container
        */
        this.getFiles = function () {
            return _files;
        };
        /*
          Adds a single file to _files
        */
        this.setFiles = function (boxid, f) {
            _files[boxid] = f;
        };
        /*
          Adds 1/+ to _files
        */
        this.addFiles = function (f) {
            for (var i = 0; i < f.length; i++) {
                var file = f[i];
                drawFileIcon.call(that, file);
            }
            clearInfoUploader.call(this);
        };
        /*
          Removes a specific file
         */
        this.removeFile = function (f) {
            var icon_file = document.getElementById(f);
            var modal = document.getElementById('modal-activated');

            delete _files[f];
            icon_file.parentNode.removeChild(icon_file);
            modal.parentNode.removeChild(modal);
        };
        /*
           */
        this.setCounter = function () {
            _counter++;
        };
        /*
           */
        this.getCounter = function () {
            return _counter;
        };

        /*
          Sets the uploader element the 'uploader' as new class
         */
        if (uploader !== null && checkAPI()) {
            if (!uploader.className) uploader.className = "uploader";else uploader.className += " uploader";
            var draw = uploaderDrawer.bind(that);
            draw(uploader);
            uploaderListeners.call(that, uploader); //Adding event listeners
        }
    }

    /**
     * paints the uploader on the client view
     * @param  {object} uploader uploader element html instance
     */
    function uploaderDrawer(uploader) {
        //Input Element
        var input_file = document.createElement('input');
        input_file.id = "uploaderfy-inputfile";
        input_file.type = "file";
        input_file.multiple = true;
        input_file.style.display = 'none';
        input_file.name = this.getUploaderName() + 'files';
        uploader.parentNode.insertBefore(input_file, uploader.nextSibling);

        //Info panel element
        var infoElement = document.createElement('h4');
        infoElement.className = "info-uploader";
        infoElement.id = 'info-uploader';
        infoElement.appendChild(document.createTextNode("CLICK OR DROP A FILE HERE"));
        infoElement.setAttribute("style", 'font-family:' + this.getFontfamily());
        uploader.appendChild(infoElement);

        //Setting uploader dimensions
        uploader.setAttribute("style", 'width:' + this.getWidth() + 'px;min-height:' + this.getHeight() + 'px;');
    }

    /**
     * [clearInfoUploader description]
     * @return {[type]} [description]
     */
    function clearInfoUploader() {
        var inf_uploader = document.getElementById('info-uploader');
        inf_uploader.style.display = Object.keys(this.getFiles()).length > 0 ? 'none' : 'flex';
    }
    /**
     * [drawFilesIcons description]
     * @return {[type]} [description]
     */
    function drawFileIcon(file) {
        var uploader = document.getElementById(this.getUploaderName());
        var iconFile = document.createElement('img');
        var reader = new FileReader();
        var boxid = this.getCounter();
        this.setCounter();

        iconFile.className = 'box';
        iconFile.id = 'box' + boxid;
        iconFile.addEventListener('click', fileiconOnClick.bind(this));
        reader.addEventListener("load", function (event) {
            var picFile = event.target;
            iconFile.src = picFile.result;
        });

        reader.readAsDataURL(file);
        uploader.appendChild(iconFile);
        this.setFiles('box' + boxid, file);
    }

    /**
     * [eventListenerFactory description]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    function uploaderListeners(uploader) {
        var that = this;
        var inputfile = document.getElementById('uploaderfy-inputfile');
        uploader.addEventListener("mouseover", mouseover, false);
        uploader.addEventListener("mouseout", mouseout, false);
        uploader.addEventListener("dragover", dragover, false);
        uploader.addEventListener("drop", dropFiles.bind(that), false);
        uploader.addEventListener("click", uploaderOnClick.bind(that));
        inputfile.addEventListener('change', function onChange(evt) {
            var files = this.files;
            that.addFiles(files);
        }, false);
    }

    /**
     * [mouseover description]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    function mouseover(ev) {}
    //console.log("Mouse over");

    /**
     * [mouseout description]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    function mouseout(ev) {}
    //console.log("Mouse out");

    /**
     * [dragover description]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    function dragover(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        ///console.log("drag over");
    }

    /**
     * [uploaderOnclick description]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    function uploaderOnClick(ev) {
        var ifile = document.getElementById('uploaderfy-inputfile');
        ifile.click();
    }

    /**
     * [dropFiles description]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    function dropFiles(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        var files = ev.dataTransfer.files; // FileList object.
        this.addFiles(files);
    }

    /**
     * [closeModal description]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    function closeModal(ev) {
        if (ev.target === this || ev.target.className === 'close' || ev.target.className === 'close-modal') this.parentNode.removeChild(this);else return;
    }
    /**
     * [deleteButtonClick description]
     * @param  {[type]} fileid [description]
     * @param  {[type]} ev     [description]
     * @return {[type]}        [description]
     */
    function deleteButtonClick(fileid, ev) {
        this.removeFile(fileid);
    };
    /**
     * [fileiconOnClick description]
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    function fileiconOnClick(e) {
        e.stopPropagation();
        var file_clicked = this.getFiles()[e.target.id];

        var modal = document.createElement('div');
        var modal_content = document.createElement('div');
        var modal_img = document.createElement('img');
        var closeButton = document.createElement('a');
        var image_information = document.createElement('ul');
        var div_information = document.createElement('div');
        var div_options = document.createElement('div');
        var div_option_cls = document.createElement('button');
        var div_option_del = document.createElement('button');

        div_options.className = "modal-uplf-div_options";
        div_option_cls.className = "close-modal";
        div_option_cls.innerHTML = "close";
        div_option_del.innerHTML = "delete";
        div_option_del.className = "delete-modal";
        div_option_del.addEventListener('click', deleteButtonClick.bind(this, e.target.id));
        div_options.appendChild(div_option_cls);
        div_options.appendChild(div_option_del);

        image_information.style['list-style-type'] = 'none';

        modal_img.src = e.target.src;
        modal_img.className = 'model-upfl-img';
        var li_info = '<li>Name ' + file_clicked.name + '</li><li>Size ' + file_clicked.size + '</li><li>Type ' + file_clicked.type + '</li>';
        image_information.innerHTML = li_info;
        div_information.appendChild(modal_img);
        div_information.appendChild(image_information);
        modal.id = 'modal-activated';
        modal.className = 'modal-uplf';
        modal_content.className = 'modal-uplf-content';
        closeButton.className = "close";
        closeButton.innerHTML = "x";
        modal_content.appendChild(closeButton);
        modal_content.appendChild(div_information);
        modal_content.appendChild(div_options);

        modal.appendChild(modal_content);
        document.body.appendChild(modal);

        modal.addEventListener('click', closeModal);
    }

    /**
     * checks if the client web-browser has the neccesary APIs
     * @return {Boolean} wether or not its compatible
     */
    function checkAPI() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            return true;
        } else return false;
    }

    window.uploaderfy = uploaderfy;
}();
