/**
 * @brief       业管表单验证构造函数
 * @author      chenhan<chenhan@273.cn>
 * @date        2013-6-14
 */
module.exports = FormValidator;
/**加载依赖模块start**/
var $ = require('jquery');
/**加载依赖模块end**/

function FormValidator(form) {
    this.form = form;
    this.errorMsgBox = null;
    this.tipMsgBox = null;
    this.count = 0;
    this.afterInput = false;
    this.isFocus = false;
    this.isBlur = false;
    this.inputName = [];
    this.validateType = [];
    this.errorMsg = [];
    this.isHaveErrorMsg = {};
    this.params = [];
    this.validatedResult = [];
    this.regExps = {};
}
//增加验证项目
FormValidator.prototype.addCheckProject = function(inputName, validateType, errorMsg, params) {
    this.inputName.push(inputName);
    this.validateType.push(validateType);
    this.errorMsg.push(errorMsg);
    this.params.push(params);
    this.count++;
}
//增加错误输出框
FormValidator.prototype.addErrorMsgBox = function(obj, params) {
    if (params) {
        if (params.afterInput) {
            this.afterInput = params.afterInput;
        }
    } else {
        this.errorMsgBox = $(obj);
    }
}
//绑定验证事件
FormValidator.prototype.checkSubmit = function() {
    //bind方法导致了validateStart里的this指向了this.form,而不是正常指向构造方法了
    this.form.bind('submit', {obj:this}, this.validateStart);
    
    var thisObj = this;
    
    //初始化正则规则
    thisObj.addRegExps();
    //取得页面中所有会被替换的tipbox
    thisObj.tipMsgBox = $('form div.m4');
    //先将isHaveErrorMsg的值变空,只在每个输入框的开头加入一个这样的事件
    $(this.form).on('focus', 'input:not([type=submit])', function() {
        thisObj.isBlur = true;
        thisObj.isHaveErrorMsg = {};
        var errorMsg = $(this).parent().find('div.m2');
        var tipMsg = $(this).parent().find('div.m4');
        if (errorMsg.length != 0) {
            errorMsg.remove();
            $(this).css('border', '1px solid #d4d4d4');
        }
        if (tipMsg.length != 0) {
            tipMsg.show();
        }
    });
    
    //先将isHaveErrorMsg的值变空,只在每个输入框的开头加入一个这样的事件
    $(this.form).on('blur', 'input:not([type=submit])', function() {
        thisObj.isBlur = true;
        thisObj.isHaveErrorMsg = {};
        var errorMsg = $(this).parent().find('div.m2');
        var tipMsg = $(this).parent().find('div.m4');
        if (errorMsg.length != 0) {
            errorMsg.remove();
            $(this).css('border', '1px solid #d4d4d4');
        }
        if (tipMsg.length != 0 && !tipMsg.hasClass('corrent')) {
            tipMsg.hide();
        }
    });
    
    for (var i = 0;i < this.count; i++) {
        if (this.params[i] && this.params[i]['bind']) {
            //闭包
            (function (i) {
                $(thisObj.form).on(thisObj.params[i].bind, 'input[name='+thisObj.inputName[i]+']', function() {
                    switch (thisObj.validateType[i]) {
                        case 'empty':
                            thisObj.validateEmpty(i);
                            break;
                        case 'equal':
                            thisObj.validateEqual(i);
                            break;
                        case 'length':
                            thisObj.validateLength(i);
                            break;
                        case 'match':
                            thisObj.validateMatch(i);
                            break;
                        case 'grep':
                            thisObj.validateGrep(i);
                            break;
                        case 'ajax':
                            thisObj.validateAjax(i);
                            break;
                    }
                    //当showCorrect存在并为true,当页面上没有显示出来的错误时,显示勾图案
                    if (thisObj.params[i] && thisObj.params[i]['showCorrect'] == true) {
                        if ($('div.msg:visible').length == 0) {
                            var inputName = null;
                            if (thisObj.params[i] && thisObj.params[i]['select']) {
                                inputName = thisObj.inputName[i][thisObj.params[i]['select'][msg]];
                            } else {
                                inputName = thisObj.inputName[i];
                            }
                            var inputParent = thisObj.form.find('input[name='+inputName+']').parent();
                            var correctMsg = null;
                            var iNode = null;
                            if (inputParent.find('div.m4').length == 0) {
                                correctMsg = $('<div>');
                                iNode = $('<i>')
                                iNode.attr('class', 'i2');
                                correctMsg.append(iNode);
                            } else {
                                correctMsg = inputParent.find('div.m4');
                            }
                            correctMsg.attr('class', 'msg m4 corrent');
                            
                            inputParent.append(correctMsg);
                        }
                    }
                });
            }) (i);
        }
    }
}
//阻止表单提交
FormValidator.prototype.stopSubmit = function() {
    return false;
}
//开始验证
FormValidator.prototype.validateStart = function(e) {
    var thisObj = e.data.obj;
    //初始化值
    var isContinue = true;
    thisObj.clearErrorMsg();
    thisObj.isBlur = false;
    thisObj.isHaveErrorMsg = {};
    thisObj.validatedResult = [];
    thisObj.isFocus = false;

    for (var i = 0;i < thisObj.count; i++) {
        //当preTrue参数为true时,要保证之前所有的验证都已通过才进行,否则直接返回false
        if (thisObj.params[i] && thisObj.params[i]['preTrue'] == true) {
            for (var item in thisObj.validatedResult) {
                if (false == thisObj.validatedResult[item]) {
                    return false;
                }
            }
        }
        switch (thisObj.validateType[i]) {
            case 'empty':
                isContinue = thisObj.validateEmpty(i);
                break;
            case 'equal':
                isContinue = thisObj.validateEqual(i);
                break;
            case 'length':
                isContinue = thisObj.validateLength(i);
                break;
            case 'match':
                isContinue = thisObj.validateMatch(i);
                break;
            case 'grep':
                isContinue = thisObj.validateGrep(i);
                break;
            case 'ajax':
                isContinue = thisObj.validateAjax(i);
                break;
        }
        thisObj.validatedResult[i] = isContinue;
        if(thisObj.params[i] && thisObj.params[i]['isStop'] == false) {
            continue;
        } else if (isContinue == false) {
            return false;
        }
    }
    for (var item in thisObj.validatedResult) {
        if (false == thisObj.validatedResult[item]) {
            return false;
        }
    }
    return true;
//    thisObj.form.submit();
    
}
//空值验证,值为空时显示错误信息
FormValidator.prototype.validateEmpty = function(i) {
    if (this.form.find('input[name='+this.inputName[i]+']').val() == '') {
        return this.showErrorMsg(i);
    };
}
//长度验证,不在长度范围内时显示错误信息
FormValidator.prototype.validateLength = function(i) {
    if (this.params[i].minLength && this.form.find('input[name='+this.inputName[i]+']').val().length < this.params[i].minLength) {
        return this.showErrorMsg(i);
    }
    if (this.params[i].maxLength && this.form.find('input[name='+this.inputName[i]+']').val().length > this.params[i].maxLength) {
        return this.showErrorMsg(i);
    }
}
//字符串类型验证,不在类型范围内时显示错误信息
FormValidator.prototype.validateMatch = function(i) {
    if (this.params[i] && this.params[i]['charMode']) {
        var modes = this.checkStrong(i);
        for (var item in this.params[i]['charMode']) {
            if ((modes & this.params[i]['charMode'][item]) == this.params[i]['charMode'][item]) {
                return true;
            }
        }
        return this.showErrorMsg(i);
    } 
}
//字符串正则验证
FormValidator.prototype.validateGrep = function(i) {
    if (this.isValidate(i) == true) {
        return;
    }
    var regExpsType = this.params[i]['grep'];
    var re = new RegExp(this.regExps[regExpsType]);
    if (re.test(this.form.find('input[name='+this.inputName[i]+']').val()) == false) {
        return this.showErrorMsg(i);
    }
}
//字符串强壮性验证,不在类型范围内时显示错误信息
FormValidator.prototype.checkStrong = function(i) {
    var Modes = 0;
    var inputValue = this.form.find('input[name='+this.inputName[i]+']').val();
    for (var j = 0; j < inputValue.length; j++){
        //测试每一个字符的类别并统计一共有多少种模式.
        Modes |= this.charMode(inputValue.charCodeAt(j));
    }
    return Modes;
}

FormValidator.prototype.charMode = function(char) {
    if (char >= 48 && char <= 57) { //数字
        return 1;
    } else if (char >= 65 && char <= 90) {//大写字母
        return 2;
    } else if (char >= 97 && char <= 122) {//小写
        return 4;
    } else { 
        return 8; //特殊字符 
    }
}
//两值不相等时显示错误信息
FormValidator.prototype.validateEqual = function(i) {
    var inputValue = this.form.find('input[name='+this.inputName[i]+']').val();
    var compareValue = this.params[i]['compareNum'];
    var symbol = '!=';
    if (this.params[i]) {
        if (this.params[i]['isNeedMd5']) {
            inputValue = hex_md5(inputValue);
        }
        if (this.params[i]['isformCookie']) {
            compareValue = this.getCookie(compareValue);
        } else {
            compareValue = this.form.find('input[name='+compareValue+']').val();
        }
        if (this.params[i]['notEqual']) {
            symbol = '==';
        }
    }
    //
    if (eval('(inputValue'+ symbol +'compareValue)')) {
        return this.showErrorMsg(i);
    };
}
//ajax验证
FormValidator.prototype.validateAjax = function(i) {
    var data = {};
    for (var item = 0; item <= this.inputName[i].length; item++) {
        data[this.inputName[i][item]] = this.form.find('input[name='+this.inputName[i][item]+']').val();
    }
    
    data = JSON.stringify(data);
    var thisObj = this;
    var flag = true;
    $.ajax({
        url:thisObj.params[i]['url'],
        type:'POST',
        data:({json:data}),
        async:false,
        success:function(msg) {
            if(thisObj.params[i].callback) {
                var value = thisObj.form.find('input[name='+thisObj.params[i].callback.params+']').val();
                var callbackValue = thisObj.params[i].callback.fn(value);
                var inputObj = null;
                if (thisObj.form.find('input.flag').length == 0) {
                    inputObj = $('<input />');
                    inputObj.attr('type', 'hidden');
                    inputObj.attr('class', 'flag');
                    inputObj.attr('name', 'isNeedReset');
                } else {
                    inputObj = thisObj.form.find('input.flag');
                }
                inputObj.attr('value', callbackValue);
                thisObj.form.append(inputObj);
            }
            if(msg) {
                flag = false;
                thisObj.showErrorMsg(i, msg);
            }
        }
    });
    return flag;
}
//验证错误时的提示
FormValidator.prototype.showErrorMsg = function(i, msg) {
    //位于input后的错误提示框
    if(this.afterInput) {
        var inputName = null;
        var selectInput = null;
        if (this.params[i] && this.params[i]['select']) {
            inputName = this.inputName[i][this.params[i]['select'][msg]];
        } else {
            inputName = this.inputName[i];
        }
        if(!this.isHaveErrorMsg[inputName]) {
            var inputParent = this.form.find('input[name='+inputName+']').parent();
            //有错误时去掉勾图案
            var $correntMsg = inputParent.find('div.corrent');
            if ($correntMsg.length != 0) {
                $correntMsg.remove();
            }
            var errorMsg = null;
            var iNode = null;
            if (inputParent.find('div.m2').length == 0) {
                errorMsg = $('<div>');
                iNode = $('<i>')
                iNode.attr('class', 'i3');
                errorMsg.append(iNode);
            } else {
                errorMsg = inputParent.find('div.m2');
            }
            errorMsg.attr('class', 'msg m2');
            
            if (msg) {
                errorMsg.append(this.errorMsg[i][msg]);
            } else {
                errorMsg.append(this.errorMsg[i]);
            }
            inputParent.append(errorMsg);
            //表示已经有错误信息
            this.isHaveErrorMsg[inputName] = true;
            if (this.params[i] && this.params[i]['select']) {
                var selectInputName = this.params[i]['select'][msg];
                selectInput = this.form.find('input[name='+this.inputName[i][selectInputName]+']');
            } else {
                selectInput = this.form.find('input[name='+this.inputName[i]+']');
            }
            selectInput.css('border', '1px solid red');
            if (!this.isFocus && !this.isBlur) {
//                selectInput.focus().select();
                this.isFocus = true;
            }
        }
        //单一错误提示框
    } else if (this.errorMsgBox) {
        if (msg) {
            this.errorMsgBox.html(this.errorMsg[i][msg]);
        } else {
            this.errorMsgBox.html(this.errorMsg[i]);
        }
        if (this.params[i] && this.params[i]['select']) {
            var selectInput = this.params[i]['select'][msg];
            this.form.find('input[name='+this.inputName[i][selectInput]+']').css('border', '1px solid red').focus().select();
        } else {
            this.form.find('input[name='+this.inputName[i]+']').css('border', '1px solid red').focus().select();
        }
      //弹出错误提示框
    } else {
        if (msg) {
            alert(this.errorMsg[i][msg]);
        } else {
            alert(this.errorMsg[i]);
        }
    }
    return false;
}

//
FormValidator.prototype.isValidate = function(i) {
    if (this.params[i] && this.params[i]['isValidateNull'] == false && this.form.find('input[name='+this.inputName[i]+']').val() == '') {
        return true;
    }
}
//清空单个在Input后的提示框
FormValidator.prototype.clearErrorMsgAfterInput = function(i) {
    if(this.afterInput) {
        var inputParent = this.form.find('input[name='+this.inputName[i]+']').parent();
        var errorMsgs = inputParent.find('div.m2');
        errorMsgs.remove();
    }
    //清除红框
    inputParent.find('input').css('border', '1px solid #d4d4d4');
}
//清空提示框
FormValidator.prototype.clearErrorMsg = function() {
    if(this.afterInput) {
        var errorMsgs = this.form.find('div.m2');
        errorMsgs.remove();
    }
    $('form div.m4').hide();
    this.tipMsgBox.hide();
    //清除红框
    this.form.find('input:not([type=submit])').css('border', '1px solid #d4d4d4');
}

FormValidator.prototype.addRegExps = function() {
    this.regExps.isNumber = /^[-\+]?\d+(\.\d+)?$/;
    this.regExps.isEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
    this.regExps.isPhone = /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-?)?[1-9]\d{6,7}(\-\d{1,4})?$/;
    this.regExps.isMobile = /^(13|15|18|14)\d{9}$/;
    this.regExps.isIdCard = /(^\d{15}$)|(^\d{17}[0-9Xx]$)/;
    this.regExps.isMoney = /^\d+(\.\d+)?$/;
    this.regExps.isZip = /^[1-9]\d{5}$/;
    this.regExps.isQQ = /^[1-9]\d{4,10}$/;
    this.regExps.isInt = /^[-\+]?\d+$/;
    this.regExps.isEnglish = /^[A-Za-z]+$/;
    this.regExps.isChinese =  /^[\u0391-\uFFE5]+$/;
    this.regExps.isUrl = /^http[s]?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    this.regExps.isDate = /^\d{4}-\d{1,2}-\d{1,2}$/;
    this.regExps.isTime = /^\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}$/;
    this.regExps.isSale = /^S\d{12}$/;
    this.regExps.isBuy = /^B\d{12}$/;
    this.regExps.isProtocolId = /^\d{18}$/;
    this.regExps.isNotBlank = /^[^\s'　']*$/;
}

FormValidator.prototype.getCookie = function(cookieName) {
    var arg = cookieName + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    var j = 0;
    while(i < clen) {
        j = i + alen;
        if(document.cookie.substring(i, j) == arg)
            return this.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if(i == 0)
            break;
    }
    return null;
}

FormValidator.prototype.getCookieVal = function(offset) {
    var endstr = document.cookie.indexOf (";", offset);
    if(endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
}


//md5
var hexcase = 0;  
var b64pad  = ""; 
var chrsz   = 8;  
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function calcMD5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}

function core_md5(x, len)
{

  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);
  
}

function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++) 
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}