/*
 * Embedding Pentaho using iFrames
 * 
 *
 * Copyright (C) 2002-2017 by Pentaho : http://www.pentaho.com
 *
 *******************************************************************************
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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


