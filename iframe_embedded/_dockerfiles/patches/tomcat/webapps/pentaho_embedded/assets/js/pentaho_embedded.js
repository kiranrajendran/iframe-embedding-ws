/*
Pentaho - Embedding with Iframe Sample
Author: Gianluca Natali
*/

$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
}

function eventInterceptor(type, ev) {
            if (cancelClick && downElem === ev.target) {
                cancelClick = !1;
                downElem = null;
                return !1;
            }
        }


$( 
function() {
	
	var body = $('#headerwrap.initiationBckg');
	
	
	store = new Persist.Store('Pentaho_Test');
	

	var username = store.get("pentaho_userid");
	var pwd = store.get("pentaho_pwd");
	
	var pentahoSrv = new PentahoRestApis("/pentaho",username,pwd);
	var cfgFile;
	
	var config_url= getConfigFilePath();
	$.getScript(config_url, function() {
		cfgFile = portalConfig;
		whenConfigIsReady();
	});
	
	function getConfigFilePath(){
		var theme = getParameterByName("theme");
		if(theme){
			store.set("portal_theme",theme);
		}else{
			theme = store.get("portal_theme");
		}
		
		theme=theme?theme:"default";
		var path = 'assets/themes/'+theme+'/config.js';
		return path;
	}
	
	function whenConfigIsReady(){
				
		$("#homePageTitle").html(cfgFile.homePage.title);
		$("#homePageSubTitle").html(cfgFile.homePage.subTitle);
		$("#introText").html(cfgFile.homePage.introText);
		$("#demo1").html(cfgFile.homePage.demoResources.demo1.label);
		$("#demo2").html(cfgFile.homePage.demoResources.demo2.label);
		$("#demo3").html(cfgFile.homePage.demoResources.demo3.label);
		$("#demo6").html(cfgFile.homePage.demoResources.demo6.label);
		
		if(!cfgFile.showTeam){
			$("#teamSection").addClass("hide");
		}
		
		if(isAdmin(username)){
			$( ".adminFeature").addClass("show");
		}
		
		
		/*CLICK ON browse resources*/
		$( "#demo4").click(function() {
			pentahoSrv.loadFileList(getDefaultPath(".xdash"),"*.xdash","resourceSelectorDiv",_fileListHandler);
			allDemoFrames.removeClass("show");
			$( "#resourceSelectorDiv").addClass("show");
			$( "#demoFrame4").addClass("show");
		});
		

		pentahoSrv.login(afterLogin,onLoginError);
		
		
		var backgrounds = cfgFile.homePage.backgrounds;
		  
		  $(backgrounds).preload();
		var current = 0;

		function nextBackground() {
			body.css(
				'background-image','url('+
			backgrounds[current = ++current % backgrounds.length])+')';

			setTimeout(nextBackground, 7000);
		}
		setTimeout(nextBackground, 7000);
		body.css('background-image', 'url('+backgrounds[0])+')';
	}

    var dialog, form,
      name = $( "#name" ),
      password = $( "#password" ),
      allFields = $( [] ).add( name ).add( password ),
      tips = $( ".validateTips" );
 
    function updateTips( t ) {
      tips
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
    }
	
	function isAdmin(username){
		
		return (username&&username.toLowerCase()==="admin");
	}
 
   function isExistentUser(userid, pwd){
	   //return ((userid.val()==="admin" && pwd.val()==="password")||(userid.val()==="suzy" && pwd.val()==="password")||(userid.val()==="user1" && pwd.val()==="pass"));
		return true;
   }
	
	function checkUser( userid, pwd ) {
      if ( !isExistentUser(userid, pwd)) {
        userid.addClass( "ui-state-error" );
		pwd.addClass( "ui-state-error" );
        updateTips( "User Incorrect");
        return false;
      } else {
        return true;
      }
    }
 
    function addUser() {
      var valid = true;
      allFields.removeClass( "ui-state-error" );
 
      valid = valid && checkUser( name, password);
    
      if ( valid ) {
		store.set("pentaho_userid",name.val());
		store.set("pentaho_pwd",password.val());
		
		pentahoSrv.logout(function(data) {
		   dialog.dialog( "close" );
		   location.reload();
		});       
        
      }
      return valid;
    }
 
    dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        "Login": addUser,
        Cancel: function() {
          dialog.dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
        allFields.removeClass( "ui-state-error" );
      }
    });
 
    form = dialog.find( "form" ).on( "submit", function( event ) {
      event.preventDefault();
      addUser();
    });
 
    $( "#login-btn" ).button().on( "click", function() {
      dialog.dialog( "open" );
    });
 
	var allDemoFrames = $( [] ).add( $("#demoFrame1") ).add( $("#demoFrame2") ).add( $("#demoFrame3") ).add( $("#demoFrame4") ).add( $("#demoFrame5")).add( $("#demoFrame6") ).add($("#resourceSelectorDiv")).add($("#messageBox"));
    
	function setDemoLink(id,url){
		var linkId = "demo"+id;
		
		loadFrame(id,url,"view");
		$( "#"+linkId ).click(function() {
			allDemoFrames.removeClass("show");
			$( "#demoFrame"+id).addClass("show");
			/*if(id===6){
				$("#messageBox").html( "<h4>If no data is displayed: remember to load the data once, using the Link  <b>Load Floor Data</b> in the website menu.<br>Then Refresh this page</h4>" ).addClass("show");
			}*/
			
	    });
	}
	
	var allAdminFrames = $( [] ).add( $("#adminFrame1") ).add( $("#adminFrame2") ).add( $("#adminFrame3") ).add( $("#adminFrame4") ).add( $("#adminFrame5")).add($("#toolBox")).add($("#messageBoxAdmin")).add( $("#resourceSelectorDashDiv") );
    
	function setAdminLink(id,url){
		var linkId = "admin"+id;
		var defaultPath = getDefaultPath(".xanalyzer");
		
		$( "#"+linkId ).click(function() {
			voidAdminCache();
			allAdminFrames.removeClass("show");
			pentahoSrv.loadResourceInFrame(url,"create","adminFrame"+id);		
			$( "#adminFrame"+id).addClass("show");
			$( "#toolBox").addClass("show");
			enableAdminToolBar("adminFrame"+id,url);
			if (url===".xdash"){
				$("#resourceSelectorDashDiv").empty();
				pentahoSrv.loadFileList(defaultPath,"*.xanalyzer%7C*.prpti","resourceSelectorDashDiv",_fileListHandlerForDashboardRes);
				$( "#resourceSelectorDashDiv").addClass("show");
			}
			
	    });
	}
	
	function enableAdminToolBar(iFrameId, url){
		$( "#toolBox").addClass("show");
		
		var defaultPath = getDefaultPath(url);
		/*remove previous onclick events*/
		$('#save_button').unbind('click');
		$('#saveas_button').unbind('click');
		/*add new handlers*/
		$("#save_button").click(function() {
			saveFile(iFrameId,defaultPath);
		});
		$("#saveas_button").click(function() {
			saveFileAs(iFrameId,defaultPath);
		});
	}
	
	function getDefaultPath(url){
		var defaultPath = cfgFile.defaultRepoPath.basePath;
		if(url==".xdash"||url===".xanalyzer"||url===".prpti"){
			defaultPath=cfgFile.defaultRepoPath[url];
		}
		
		return defaultPath;
	}
	
	function saveFile (iFrameId,folderPath) {
	  var filename = store.get("admin_fileName");
	  if (filename === null) {
		saveFileAs(iFrameId,folderPath);
	  }
	  else {
		pentahoSrv.saveResource(iFrameId,filename,folderPath);
		
	  }
	  pentahoSrv.loadFileList(getDefaultPath(".xdash"),"*.xdash","resourceSelectorDiv",_fileListHandler);
	}
	
	function voidAdminCache(){
		store.remove("admin_fileName");
	}

	function saveFileAs(iFrameId,folderPath) {
	  var filename = prompt("Enter file name");
	  if(!(filename==null||filename=="null")){
		  store.set("admin_fileName",filename);
	  }
	  
	  saveFile(iFrameId,folderPath);
	}
	
	function loadFrame(id,path,action){
		pentahoSrv.loadResourceInFrame(path,action,"demoFrame"+id);
	}
	
	function _fileListHandler(data, textStatus, jqXHR, containerDivId, rootPath) {
	  $('#'+containerDivId).empty();
	  var sel = $('<select>').appendTo('#'+containerDivId);
	  sel.append($("<option>").attr('value',"").text("-- Select a Resource --"));
	  
	  $(data).find('file').each (function() {
		var fileTitle = $(this).find('title').text(); 
		var filePath = $(this).find('path').text();
		if (filePath != rootPath) { // ignore the root.
		  
		  //var url = pentahoSrv.generateViewContentURL(filePath,"view");
		  sel.append($("<option>").attr('value',filePath).text(fileTitle));
		  //demoFrame4;
		}
	  });
	  
		sel.change(function() {
			if(this.value==""){
				$("#demoFrame4").attr('src', "");
			}else{
				loadFrame("4",this.value,"view");

			}
			$( "#demoFrame4").addClass("show");
		});
	}
	
	function _fileListHandlerForDashboardRes(data, textStatus, jqXHR, containerDivId, rootPath) {
	  
	  var cList = $('<ul>').addClass('widgetSelector').appendTo('#'+containerDivId);
	  
	  $(data).find('file').each (function() {
		var fileTitle = $(this).find('title').text(); 
		var filePath = $(this).find('path').text();
		var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
		//var localizedFileName = ($(this).find('localePropertiesMapEntries')[0]).getElementsByTagName("properties")[0].getElementsByTagName("value")[0].innerHTML;
		localizedFileName = fileTitle;
		var solution="";
		if (filePath != rootPath) { // ignore the root.
		  
		  var li = $('<li/>')
			.addClass('widgetSelector-item')
			.text(fileTitle)
			.appendTo(cList);
				
			li.click(function(e) {
				pentahoSrv.addWidgetToDashboard("adminFrame3",solution, filePath, fileName, localizedFileName);
			});
		}
	  });
	  
	}
	
	
	
	function addScrollTo(buttonId,targetId){
		$(buttonId).click(function() {
			$('html, body').animate({
				scrollTop: $(targetId).offset().top
			}, 2000);
		});
	}
	
	
	
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function afterLogin(){
		var isDev_mode=cfgFile.isTest;
		
		addScrollTo("#link_home","#home");
		addScrollTo("#link_workshops","#workshops");
		addScrollTo("#link_features","#features");
		addScrollTo("#link_about","#about");
		addScrollTo("#link_contact","#contact");
		
		if(!isDev_mode){
			setDemoLink(1,cfgFile.homePage.demoResources.demo1.path);
			setDemoLink(2,cfgFile.homePage.demoResources.demo2.path);
			setDemoLink(3,cfgFile.homePage.demoResources.demo3.path);
			setDemoLink(6,cfgFile.homePage.demoResources.demo6.path);
			
			$(window).load(function() {
			$("#demoFrame1")[0].contentWindow.pentahoDashboardController.cdfDashboard.on('cdf cdf:preExecution', function(e) {
			//I could want to keep a count of all the times my dashboard was visited, for statistical purposes
				console.log('This javascript function is defined in the external portal. You double clicked on '+e.value)
			});
		  });
		}
			
		setAdminLink(1,".prpti");
		setAdminLink(2,".xanalyzer");
		setAdminLink(3,".xdash");
		
	}
	
	function onLoginError(){
		alert('Error on login, check your data! ');
		dialog.dialog( "open" );
	}
	
		
	
	
});

