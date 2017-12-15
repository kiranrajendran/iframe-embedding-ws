/*
Pentaho - Embedding with Iframe Sample
Author: Gianluca Natali
*/
function PentahoRestApis(serverUrl, pentaho_user, pentaho_pwd) {
    var serverUrl = serverUrl ? serverUrl : "http://localhost:8080/pentaho",
        defaultFrameId = "defaultFrame",
        defaultSavePath = "/public/Steel Wheels",
        pentaho_user = pentaho_user ? pentaho_user : "suzy",
        pentaho_pwd = pentaho_pwd ? pentaho_pwd : "password";

    function getLoginToken() {
        var username = pentaho_user;
        var pwd = pentaho_pwd;

        return "userid=" + username + "&password=" + pwd;
    }

    /*define Rest Patterns*/
    var restPatterns = {
        "view": {
            //".prpt" : "/api/repos/<PATH>/generatedContent",
            ".prpt": "/api/repos/<PATH>/viewer",
            ".xanalyzer": "/api/repos/<PATH>/viewer",
            ".xdash": "/api/repos/<PATH>/viewer",
            ".prpti": "/api/repos/<PATH>/prpti.view",
			".wcdf": "/api/repos/<PATH>/generatedContent"
        },
        "edit": {
            ".prpt": "/api/repos/<PATH>/viewer",
            ".xanalyzer": "/api/repos/<PATH>/editor",
            ".xdash": "/api/repos/<PATH>/editor",
            ".prpti": "/api/repos/<PATH>/prpti.edit",
			".wcdf": "/api/repos/<PATH>/wcdf.edit"
        },
        "create": {
            //".prpt" : "/api/repos/<PATH>/generatedContent",
            ".xanalyzer": "/api/repos/xanalyzer/service/selectSchema",
            ".xdash": "/api/repos/dashboards/editor",
            ".prpti": "/api/repos/pentaho-interactive-reporting/prpti.new",
			".wcdf": "/api/repos/wcdf/new"
        },
        "repository": {
            "file_list": "/api/repo/files/<PATH>/tree"
        }
    };
    /*restPatterns[".prpt"]      = "/api/repos/<PATH>/generatedContent";
    restPatterns[".xanalyzer"]      = "/api/repos/<PATH>/viewer";
    restPatterns[".xdash"]      = "/api/repos/<PATH>/viewer";
    restPatterns[".prpti"]      = "/api/repos/<PATH>/prpti.view";*/

    function generateViewContentURL(filePath, action) {

        var extension = filePath.substring(filePath.lastIndexOf("."));

        var url = _generateUrl(action, extension, filePath);
        return url;
    }

    function generateCreateContentURL(action, extension) {

        var url = _generateUrl(action, extension);
        return url;
    }

    function _generateUrl(action, extension, filePath) {
        //replace / in path with :
        filePath = filePath.replace(/\//g, ':');
        pattern = restPatterns[action][extension];
        if (!pattern) {
            return "";
        }
        var url = serverUrl + pattern.replace("<PATH>", filePath);
        //url=url+"?"+getLoginToken();
        return url;
    }

    function _setIframeSrc(url, iFrameId) {
        var iframeId = iFrameId ? iFrameId : defaultFrameId;
        $("#" + iFrameId).attr('src', url);
    }

    function _defaultFileListHandler(data, textStatus, jqXHR, containerDivId, rootPath) {

        var newHTML = "<ul>";

        $(data).find('file').each(function() {
            var fileTitle = $(this).find('title').text();
            var filePath = $(this).find('path').text();
            if (filePath != rootPath) { // ignore the root.

                var url = generateViewContentURL(filePath, "view");

                var liHTML = "<li>" +
                    "<a href='" + url + "' target='_blank'>" +
                    //"<a href='javascript:void' onclick='setIframeSrc(\"" + url + "\");'>" +
                    fileTitle +
                    "</a>" +
                    "</li>";
                newHTML = newHTML + liHTML;
            }
        });

        newHTML = newHTML + "</ul>";

        $("#" + containerDivId).html(newHTML);
    }

    /*
    Filter to be applied for search. The filter can be broken down into 3 parts; File types, Child Node Filter, and Member Filters. Each part is separated with a pipe (|) character.

    File Types are represented by a word phrase. This phrase is recognized as a file type phrase and processed accordingly. Valid File Type word phrases include "FILES", "FOLDERS", and "FILES_FOLDERS" and denote whether to return files, folders, or both files and folders, respectively.

    The Child Node Filter is a list of allowed names of files separated by the pipe (|) character. Each file name in the filter may be a full name or a partial name with one or more wildcard characters ("*"). The filter does not apply to root node.

    The Member Filter portion of the filter parameter allows the caller to specify which properties of the metadata to return. Member Filters start with "includeMembers=" or "excludeMembers=" followed by a list of comma separated field names that are to be included in, or, excluded from, the list. Valid field names can be found in org.pentaho.platform.repository2.unified.webservices#RepositoryFileAdapter. Omission of a member filter will return all members. It is invalid to both and includeMembers= and an excludeMembers= clause in the same service call.
    */
    function _getFileList(path, filter, containerDivId, resultHandler) {
        // NOTE - must enable the requestParameterProcessingFilter for this to work.
        var url = _generateUrl("repository", "file_list", path) + "?filter=" + filter;

        $.ajax({
            type: 'GET',
            url: url,
            success: function(json_data, textStatus, jqXHR) {
                handlerFn = resultHandler ? resultHandler : _defaultFileListHandler;
                handlerFn(json_data, textStatus, jqXHR, containerDivId, path);
            },
            dataType: 'xml'
        });
    }

    function newAnalysis(iFrameId) {
        var url = _generateUrl("create", ".xanalyzer");
        _setIframeSrc(url, iFrameId);
    }

    function newInteractiveReport(iFrameId) {
        var url = _generateUrl("create", ".prpti");
        _setIframeSrc(url, iFrameId);

    }

    function newDashboard(iFrameId) {
        fileName = null;
        var url = _generateUrl("create", ".xdash");
        _setIframeSrc(url, iFrameId);

    }

    function saveResource(iFrameId, fileName, folderPath) {
        folderPath = folderPath ? folderPath : defaultSavePath;
        $("#" + iFrameId)[0].contentWindow.handle_puc_save(folderPath, fileName);
    }

    function addWidgetToDashboard(iFrameId, solution, path, fileName, localizedFileName) {
        $("#" + iFrameId)[0].contentWindow.SolutionBrowserHelper.createComponentForFile(solution, path, fileName, localizedFileName);
    }


    /*--------- PUBLIC FUNCTIONS --------------*/

    this.login = function(functionThen, functionErr) {
        var loginUrl = serverUrl + "/Home?" + getLoginToken();
        if (!functionErr) {
            functionErr = function(data) {
                alert('Error on login, check your data! ');
            };
        }
        $.ajax({
            url: loginUrl,
        }).error(function(data) {
            functionErr(data);
        }).then(function(data) {
            functionThen(data);
        });
    };

    this.logout = function(functionThen) {
        $.ajax({
            url: serverUrl + "/Logout"
        }).error(function(data) {
            //
        }).then(function(data) {
            functionThen(data);
        });
    };

    this.addWidgetToDashboard = function(iFrameId, solution, path, name, localizedFileName) {
        addWidgetToDashboard(iFrameId, solution, path, name, localizedFileName);
    };

    this.saveResource = function(iFrameId, fileName, folderPath) {
        saveResource(iFrameId, fileName, folderPath);
    };

    this.loadFileList = function(path, filter, containerDivId, resultHandler) {
        _getFileList(path, filter, containerDivId, resultHandler);
    };

    this.generateViewContentURL = function(filePath, action) {
        return generateViewContentURL(filePath, action);
    };

    this.loadResourceInFrame = function(filePath, action, iFrameId) {
        action = action ? action : "view";
        var url = generateViewContentURL(filePath, action);
        _setIframeSrc(url, iFrameId);
    };

    this.loadResourceInDiv = function(filePath, action, divId) {
        $("#" + divId).html("");
        $('<iframe>', {
            src: '',
            id: divId + '_iframe',
            frameborder: 0,
            border: 0,
            style: 'width:100%;height:100%'
        }).appendTo("#" + divId);
        this.loadResourceInFrame(filePath, action, divId + '_iframe');
    };

    this.setServerUrl = function(url) {
        serverUrl = url;
    };

    this.getServerUrl = function() {
        return serverUrl;
    };

    this.defaultSavePath = function(defaultSavePath) {
        defaultSavePath = defaultSavePath;
    };

    this.setCredentials = function(pentaho_user, pentaho_pwd) {
        pentaho_user = pentaho_user;
        pentaho_pwd = pentaho_pwd;
    };

    //Useful if you have just one frame where all actions happen. So you can simplify the code
    this.setDefaultFrame = function(defaultFrameId) {
        defaultFrameId = defaultFrameId;
    };


}