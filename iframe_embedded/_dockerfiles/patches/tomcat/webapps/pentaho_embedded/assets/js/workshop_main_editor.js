$(function() {
	$( ".editorLink" ).click(function() {
		openEditor();
	});
	
	eval(OnlineJsEditor.getCode());
	
	
	
	$( "#linkLoadSolution" ).click(function() {
		$.get( "assets/js/workshop_main_end.js", function( data ) {
		  OnlineJsEditor.setCode( data );
		  reloadEditor();
		});
	});
});