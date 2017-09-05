function OnlineJsEditor(){ } 

function openEditor(){
	
	url= "textEditor.html";
	newwindow=window.open(url,'name','height=600,width=600');
	if (window.focus) {newwindow.focus()}
	return false;
}

$(function() {
	 // load persistent store after the DOM has loaded
	store = new Persist.Store('Pentaho_Test');
	
	OnlineJsEditor.getCode=function(){ 
			text = store.get('jsCode');
			if(text===undefined||text==null||text=="null"){
							text= 
`<!--    http://localhost:8081/pentaho/api/repos/%3Apublic%3ASteel%20Wheels%3ASales%20Performance%20(dashboard).xdash/viewer
        blank_page.html
--> 
<iframe id="demoFrame" border="0" frameborder="0" src="blank_page.html" style="width: 100%; height: 800px"> 
	Your browser does not support inline frames or is currently configured not to display inline frames. 
</iframe> `;
				store.set('jsCode',text);			
			}		
			return text;
		};

		OnlineJsEditor.setCode=function(codeStr){ 
			store.set('jsCode', codeStr);
		};
		
		OnlineJsEditor.evaluateCode=function(){
			
			$( "#demoContainer" ).html(OnlineJsEditor.getCode());
		}
		
		OnlineJsEditor.evaluateCode();
	
	
	
});


