var portalConfig = {
	"isTest":false,
	"showTeam":true,
	"homePage": {
		"title":"Steel Wheels",
		"subTitle":"Partners Portal",
		"introText":"WELCOME TO <bold>STEEL WHEELS</bold> PORTAL.<br/>ANALYZE YOUR DATA TO GET USEFUL INSIGHT",
		"demoResources": {
			"demo1": {
				"type":"pentahoResource",
				"path":"/public/Steel Wheels/Sales Performance (dashboard).xdash",
				"label":"SALES PERFORMANCE",
				"url":""
			},
			"demo2": {
				"type":"pentahoResource",
				"path":"/public/Steel Wheels/Regional Product Mix (dashboard).xdash",
				"label":"REGIONAL PRODUCT MIX",
				"url":""
			},
			"demo3": {
				"type":"pentahoResource",
				"path":"/public/Steel Wheels/Top Customers (report).prpt",
				"label":"OPERATIONAL REPORT",
				"url":""
			},
			"demo6": {
				"type":"pentahoResource",
				"path":"/public/Steel Wheels/Territory Sales Analysis.xdash",
				"label":"TERRITORY SALES ANALYSIS",
				"url":""
			}
		},
		"backgrounds": [
		  '/pentaho_embedded/assets/img/bckgd_1.jpg',
		  '/pentaho_embedded/assets/img/bckgd_2.jpg',
		  '/pentaho_embedded/assets/img/bckgd_3.jpg',
		  '/pentaho_embedded/assets/img/bckgd_4.jpg'
		 ]
		
	},
	"defaultRepoPath": {
		"basePath":"/public/Steel Wheels",
		".xdash":"/public/Steel Wheels",
		".xanalyzer":"/public/Steel Wheels/Widget Library",
		".prpti":"/public/Steel Wheels/Widget Library"
	}
};