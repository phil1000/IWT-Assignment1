var sortKey = "rtitle"; // set the sortKey to a default value

function getXML(url) {
 // return a link to the XML (or XSL) file referenced by the url argument
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);
  return xhr.responseXML;
}

function displayFormattedResults(remakeTitle, remakeYear, remakeFraction, originalTitle, originalYear) {
	clearResults(); // first off clear output area of results from prior queries
	// the next function populates the filter string using data supplied in the form
	var filter = createPredicateString(remakeTitle, remakeYear, remakeFraction, originalTitle, originalYear);
	var xmlDoc = getXML("remakes.xml");
	var stylesheet = getXML("formatRemakes.xsl");
	var nsResolver = stylesheet.createNSResolver(
                   stylesheet.ownerDocument == null ?
                   stylesheet.documentElement :
                   stylesheet.ownerDocument.documentElement);
	var value = stylesheet.evaluate(
                   "//xsl:template[@match='remakes']//xsl:for-each",
                   stylesheet, nsResolver,
                   XPathResult.ANY_UNORDERED_NODE_TYPE, null);
	// now concatenate the filter to the remake e.g. if rtitle='brian' we will pass rtitle=['brian']
	value.singleNodeValue.setAttribute("select", "remake" + filter);
	var proc = new XSLTProcessor();
	proc.importStylesheet(stylesheet);
	sortCriteria();
	proc.setParameter(null, "sortBy", sortKey); //override the xsl sortBy parameter to define which field to sort by
	var resultFragment = proc.transformToFragment(xmlDoc, document); //export returned formatted output to variable resultFragment
	document.getElementById("remakesOutput").appendChild(resultFragment); //put contents of resultFragment into empty div element remakesOutput
}

function checkRemake(remakeTitle) {
	if (remakeTitle==="") {
		alert('Please enter a value into remake title before checking this box');
		document.getElementById("sameName_checkbox_id").checked=false; //uncheck the checkbox
	}
}

function sortCriteria()
{
	var radioButton = document.getElementsByName("sortByValue");
	// loop through the radio buttons to see which sort value is checked and 
	// then set the sortkey based on that value
	for (var i=0;i<radioButton.length;i++) {
		if (radioButton[i].checked) {
			sortKey=radioButton[i].value;
			break;
		}
    }
}

function formatStringCriteria(inString) {
	
	var myString="";
	if (inString.indexOf("contains") != -1) {
		//format output as [contains(.,'value')]
		myString="[contains(.,'" + inString.substring(9) + "')]";
	} else {
		//need to format the output as ='value'
		if (inString.substring(0,1)==="=") {
			myString = "='" + inString.substring(1) + "'";
		} else {
			myString = "='" + inString + "'";
		}
	}
	return myString;
}

function formatNumberCriteria(inNumber) {
	//if no =,>,< operator present then add = to the criteria, otherwise keep the operators as they were entered
	var numberCriteria="";

	if ( (inNumber.substring(0,1)!="=") && (inNumber.substring(0,1)!=">") && (inNumber.substring(0,1)!="<") ) {
		numberCriteria= "=" + inNumber;
	} else {
		numberCriteria=inNumber;
	}
	
	return numberCriteria;
}

function createPredicateString(remakeTitle, remakeYear, remakeFraction, originalTitle, originalYear) {
	// create a filter string based on supplied parameters
	// the output will look like "[rtitle='xxxxx'] if the remakeTitle parameter contained xxxxx
	var filter = "";
	
	if (remakeTitle!="") {
		filter = filter + "[rtitle" + formatStringCriteria(remakeTitle);
		if (document.getElementById("sameName_checkbox_id").checked) {
			filter = filter + "and stitle" + formatStringCriteria(remakeTitle);
		}
	}
	
	if (remakeYear!="") {
		if (filter!="") { //filter not blank so append this predicate to end
			filter = filter + "and ryear" + formatNumberCriteria(remakeYear);
		} else { //filter is blank so start predicate
			filter = filter + "[ryear" + formatNumberCriteria(remakeYear);
		}
	}
	if (remakeFraction!="") {
		if (filter!="") { //filter not blank so append this predicate to end
			filter = filter + "and fraction" + formatNumberCriteria(remakeFraction);
		} else { //filter is blank so start predicate
			filter = filter + "[fraction" + formatNumberCriteria(remakeFraction);
		}
	}
	if (originalTitle!="") {
		if (document.getElementById("sameName_checkbox_id").checked) {
			// user has provided conflicting select criteria so inform them
			alert('Original Title has been set to remake title as checkbox was checked');
		} else {
			if (filter!="") { //filter not blank so append this predicate to end
				filter = filter + "and stitle" + formatStringCriteria(originalTitle);
			} else { //filter is blank so start predicate
				filter = filter + "[stitle" + formatStringCriteria(originalTitle);
			}
		}
	}
	if (originalYear!="") {
		if (filter!="") { //filter not blank so append this predicate to end
			filter = filter + "and syear" + formatNumberCriteria(originalYear);
		} else { //filter is blank so start predicate
			filter = filter + "[syear" + formatNumberCriteria(originalYear);
		}
	}
	
	if (filter!="") filter = filter + "]";
	return filter;
}

function clearResults() {
	//removes previous results from the remakesOutput div element
	document.getElementById("remakesOutput").innerHTML = "";
}

function clearCriteria(remakeTitle, remakeYear, remakeFraction, originalTitle, originalYear) {
	//this function clears the input criteria to save use having to do it manually
	
	var elem = document.getElementById("remakeTitle");
	elem.value = "";
	elem = document.getElementById("remakeYear");
	elem.value = "";
	elem = document.getElementById("remakeFraction");
	elem.value = "";
	elem = document.getElementById("originalTitle");
	elem.value = "";
	elem = document.getElementById("originalYear");
	elem.value = "";

	document.getElementById("sameName_checkbox_id").checked=false
}
