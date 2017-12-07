function OnlineJsEditor(){ } 

var newwindow;

function openEditor(){
	//debugger;
	if(!newwindow||newwindow.closed){
		url= "textEditor.html";
		newwindow=window.open(url,'name','height=600,width=600');
	}
	
	if (window.focus) {newwindow.focus()}
	return false;
}

function reloadEditor(){
	//debugger;
	if(newwindow&&!newwindow.closed){
		newwindow.close();
	}
	return openEditor();
}

$(function() {
	var storeId = 'jsCodeP';
	 // load persistent store after the DOM has loaded
	store = new Persist.Store('Pentaho_Test');
	
	OnlineJsEditor.getCode=function(){ 
			text = store.get(storeId);
			if(text===undefined||text==null||text=="null"){
							text= 
`<!--    INSERT HERE YOUR CODE--> 
 `;
				store.set(storeId,text);			
			}		
			return text;
		};

		OnlineJsEditor.setCode=function(codeStr){ 
			store.set(storeId, codeStr);
		};
		
		/*CODE IS EVALUATED IN workshop_main_editor
		OnlineJsEditor.evaluateCode=function(){
			
			$( "#demoContainer" ).html(OnlineJsEditor.getCode());
		}
		
		OnlineJsEditor.evaluateCode();*/
	
	
	
});


