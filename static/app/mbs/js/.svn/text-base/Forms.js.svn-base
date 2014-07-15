$F = function(o){
	var rVal = "";
	if($("[name="+o+"]")[0].tagName.toLowerCase() == "select"){
		$("[name="+o+"]").children().each(function(i){if(this.selected)rVal += $(this).val()+",";});
		(rVal = rVal.split(",")).pop();
	}
	else if($("[name="+o+"]").attr("type") == "checkbox" || $("[name="+o+"]").attr("type") == "radio"){
		$("input[name="+o+"]:checked").each(function(){rVal += this.value+","});
		(rVal = rVal.split(",")).pop();
	}
	else{
		rVal = $("[name="+o+"]").val();
	}
	return rVal;
};
$.getForms = function(frm) {
	var objForm;
	var submitDisabledElements = false;
	if (arguments.length > 1 && arguments[1] == true)
		submitDisabledElements = true;
	var prefix="";
	if(arguments.length > 2)
		prefix = arguments[2];
	
	if (typeof(frm) == "string")
		objForm = document.getElementById(frm);
	else
		objForm = frm;
	var resultStr = "";
	if (objForm && objForm.tagName == 'FORM') {
		var formElements = objForm.elements;
		for( var i=0; i < formElements.length; i++) {
			if (!formElements[i].name)
				continue;
			if (formElements[i].name.substring(0, prefix.length) != prefix)
				continue;
			if (formElements[i].type && (formElements[i].type == 'radio' || formElements[i].type == 'checkbox') && formElements[i].checked == false)
				continue;
			if (formElements[i].disabled && formElements[i].disabled == true && submitDisabledElements == false)
				continue;
			var name = formElements[i].name;
			if (name) {
				if (resultStr != '')
					resultStr += '&';
				if(formElements[i].type=='select-multiple') {
					for (var j = 0; j < formElements[i].length; j++) {
						if (formElements[i].options[j].selected == true)
							resultStr += name+"="+encodeURIComponent(formElements[i].options[j].value)+"&";
					}
				} else {
					resultStr += name+"="+encodeURIComponent(formElements[i].value);
				}
			} 
		}
	}
	return resultStr;
}
ifcheck = true;
function checkAll(form) {
	for (var i=0;i<form.elements.length;i++) {
		var e = form.elements[i];
		e.checked = ifcheck;
	}
	ifcheck = ifcheck == true ? false : true;
}
function getIds(form) {
	var ids = 0;
	var a = new Array();
	for (var i=0;i<form.elements.length;i++) {
		var e = form.elements[i];
		if (e.checked==true && e.type=='checkbox' && e.name) {
			a.push(e.value);
		}
	}
	ids = a.join(',');
	return ids;	
}