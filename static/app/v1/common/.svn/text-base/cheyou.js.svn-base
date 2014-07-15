var cheYouModule = exports;
/*! Cheyou v1.0 gaoshikao | 273.cn/license 
 *  TMX 类型、品牌、车系、车型联动
 *  sinput 输入框点击效果
 *  ALD 省市区联动
 */
 var $ = require('jquery');
 var cookieModule = require('util/cookie.js');
 cheYouModule.TMX = function() {
 	var obj_type=typeof(arguments[0])!='string'?null:$(arguments[0]);
	var obj_make=typeof(arguments[1])!='string'?null:$(arguments[1]);
	var obj_chexi=typeof(arguments[2])!='string'?null:$(arguments[2]);
	var obj_chexing=typeof(arguments[3])!='string'?null:$(arguments[3]);
	var val_type=typeof(arguments[4])!='string'?'':arguments[4];
	var val_make=typeof(arguments[5])!='string'?'':arguments[5];
	var val_chexi=typeof(arguments[6])!='string'?'':arguments[6];
	var val_chexing=typeof(arguments[7])!='string'?'':arguments[7];
		
	var lan_type='不限类型',lan_make='不限品牌',lan_chexi='不限车系',lan_chexing='不限车型';
	if(obj_type!=null)obj_type.empty().append('<option value="" selected="selected">'+lan_type+'</option>');
	if(obj_make!=null)obj_make.empty().append('<option value="" selected="selected" _path="">'+lan_make+'</option>').attr("disabled",true);
	if(obj_chexi!=null)obj_chexi.empty().append('<option value="" selected="selected">'+lan_chexi+'</option>').attr("disabled",true);
	if(obj_chexing!=null)obj_chexing.empty().append('<option value="" selected="selected">'+lan_chexing+'</option>').attr("disabled",true);
	if(obj_make == null){
		alert("必须有品牌参数");
		return;
	}
	if(obj_type!=null){
		obj_type.append('<option value="PS">轿车</option><option value="LC">商务车/MPV</option><option value="SV">越野车/SUV</option><option value="MB">面包车</option><option value="SC">跑车</option><option value="PU">皮卡</option><option value="BS">客车</option><option value="HC">货车</option>');
		if(val_type!=''){
			obj_type.val(val_type);
			getBrands();
		}
	}else{
		getBrands();
	}
	function getBrands(){
		if(obj_make==null)return;
		var type=obj_type==null?'':obj_type.val();
		if(!type && obj_type){
			obj_chexi&&obj_chexi.val('').attr("disabled",true);
			obj_chexing&&obj_chexing.val('').attr("disabled",true);
			return obj_make.val('').attr("disabled",true);
		}
		if (type=='') {
               setBrand([{"char":"A","code":"ALFA","path":"alfaromeo","name":"\u963f\u5c14\u6cd5\u00b7\u7f57\u7c73\u6b27"},{"char":"A","code":"AQQC","path":"aqqc","name":"\u5b89\u5e86\u6c7d\u8f66"},{"char":"A","code":"ASTO","path":"astonmartin","name":"\u963f\u65af\u987f\u00b7\u9a6c\u4e01 "},{"char":"A","code":"AUDI","path":"audi","name":"\u5965\u8fea"},{"char":"A","code":"AUX","path":"aux","name":"\u5965\u514b\u65af"},{"char":"B","code":"BAOJ","path":"baojun","name":"\u5b9d\u9a8f"},{"char":"B","code":"BAOL","path":"baolong","name":"\u5b9d\u9f99"},{"char":"B","code":"BAW","path":"baw","name":"\u5317\u6c7d\u5236\u9020"},{"char":"B","code":"BENT","path":"bentley","name":"\u5bbe\u5229"},{"char":"B","code":"BMW","path":"bmw","name":"\u5b9d\u9a6c"},{"char":"B","code":"BQFT","path":"beiqifutian","name":"\u5317\u6c7d\u798f\u7530"},{"char":"B","code":"BUIC","path":"buick","name":"\u522b\u514b"},{"char":"B","code":"BYD","path":"byd","name":"\u6bd4\u4e9a\u8fea"},{"char":"B","code":"HOND","path":"honda","name":"\u672c\u7530"},{"char":"B","code":"PEUG","path":"peugeot","name":"\u6807\u81f4"},{"char":"B","code":"PORS","path":"porsche","name":"\u4fdd\u65f6\u6377"},{"char":"C","code":"CFYZ","path":"changfengyangzi","name":"\u957f\u4e30\u626c\u5b50"},{"char":"C","code":"CHAN","path":"changan","name":"\u957f\u5b89\u6c7d\u8f66"},{"char":"C","code":"CHFE","path":"changfeng","name":"\u957f\u4e30"},{"char":"C","code":"CHHE","path":"changhe","name":"\u660c\u6cb3\u6c7d\u8f66"},{"char":"C","code":"GREA","path":"greatwall","name":"\u957f\u57ce"},{"char":"C","code":"TRUM","path":"trumpchi","name":"\u4f20\u797a"},{"char":"C","code":"YEMA","path":"yema","name":"\u5ddd\u6c7d\u91ce\u9a6c"},{"char":"D","code":"DADI","path":"dadi","name":"\u5927\u8fea"},{"char":"D","code":"DAEW","path":"daewoo","name":"\u5927\u5b87"},{"char":"D","code":"DAIH","path":"daihatsu","name":"\u5927\u53d1"},{"char":"D","code":"DFFS","path":"df-aeolus","name":"\u4e1c\u98ce\u98ce\u795e"},{"char":"D","code":"DFFX","path":"df-fengxing","name":"\u4e1c\u98ce\u98ce\u884c"},{"char":"D","code":"DFMC","path":"dongfengqiche","name":"\u4e1c\u98ce\u6c7d\u8f66"},{"char":"D","code":"DFWT","path":"dfwt","name":"\u4e1c\u98ce\u4e07\u901a"},{"char":"D","code":"DFXK","path":"df-xiaokang","name":"\u4e1c\u98ce\u5c0f\u5eb7"},{"char":"D","code":"DFZZ","path":"df-zhengzhou","name":"\u4e1c\u98ce\u90d1\u5dde"},{"char":"D","code":"DML","path":"daimule","name":"\u6234\u59c6\u52d2"},{"char":"D","code":"DODG","path":"dodge","name":"\u9053\u5947"},{"char":"D","code":"EMGR","path":"emgrand","name":"\u5e1d\u8c6a"},{"char":"D","code":"MAXU","path":"maxus","name":"\u5927\u901a"},{"char":"D","code":"SOUE","path":"soueast","name":"\u4e1c\u5357"},{"char":"D","code":"VOLK","path":"volkswagen","name":"\u5927\u4f17"},{"char":"F","code":"FEID","path":"feidie","name":"\u98de\u789f\u6c7d\u8f66"},{"char":"F","code":"FERR","path":"ferrari","name":"\u6cd5\u62c9\u5229"},{"char":"F","code":"FIAT","path":"fiat","name":"\u83f2\u4e9a\u7279"},{"char":"F","code":"FORD","path":"ford","name":"\u798f\u7279"},{"char":"F","code":"FOTO","path":"foton","name":"\u798f\u7530"},{"char":"F","code":"FUDI","path":"fudi","name":"\u798f\u8fea"},{"char":"F","code":"FXFD","path":"fujianxinfuda","name":"\u798f\u5efa\u65b0\u798f\u8fbe"},{"char":"F","code":"TOYO","path":"toyota","name":"\u4e30\u7530"},{"char":"G","code":"GZYB","path":"guagnzhouyunbao","name":"\u5e7f\u5dde\u4e91\u8c79"},{"char":"H","code":"BRIJ","path":"brilliance-jinbei","name":"\u534e\u6668\u91d1\u676f"},{"char":"H","code":"BRIZ","path":"brilliance-zhonghua","name":"\u534e\u6668\u4e2d\u534e"},{"char":"H","code":"FUQI","path":"fuqi","name":"\u534e\u7fd4\u5bcc\u5947"},{"char":"H","code":"HAFE","path":"hafei","name":"\u54c8\u98de"},{"char":"H","code":"HAFI","path":"hafei","name":"\u54c8\u98de\u6c7d\u8f66"},{"char":"H","code":"HAIM","path":"haima","name":"\u6d77\u9a6c"},{"char":"H","code":"HAWT","path":"hawtai","name":"\u534e\u6cf0"},{"char":"H","code":"HEIB","path":"heibao","name":"\u9ed1\u8c79"},{"char":"H","code":"HUIZ","path":"huizhong","name":"\u6c47\u4f17"},{"char":"H","code":"HUMM","path":"hummer","name":"\u608d\u9a6c"},{"char":"H","code":"MAPL","path":"maple","name":"\u534e\u666e"},{"char":"H","code":"SHQC","path":"shuanghuan","name":"\u53cc\u73af"},{"char":"J","code":"GEEL","path":"geely","name":"\u5409\u5229"},{"char":"J","code":"GONO","path":"gonow","name":"\u5409\u5965"},{"char":"J","code":"JAC","path":"jac","name":"\u6c5f\u6dee"},{"char":"J","code":"JAGU","path":"jaguar","name":"\u6377\u8c79"},{"char":"J","code":"JEEP","path":"jeep","name":"Jeep"},{"char":"J","code":"JINC","path":"jincheng","name":"\u91d1\u7a0b"},{"char":"J","code":"JMC","path":"jmc","name":"\u6c5f\u94c3"},{"char":"J","code":"JNQC","path":"jiangnan","name":"\u6c5f\u5357"},{"char":"J","code":"KING","path":"kinglong","name":"\u91d1\u9f99\u5ba2\u8f66"},{"char":"K","code":"CADI","path":"cadillac","name":"\u51ef\u8fea\u62c9\u514b"},{"char":"K","code":"CHRY","path":"chrysler","name":"\u514b\u83b1\u65af\u52d2"},{"char":"K","code":"KARR","path":"karry","name":"\u5f00\u745e"},{"char":"L","code":"EVER","path":"everus","name":"\u7406\u5ff5"},{"char":"L","code":"LAMB","path":"lamborghini","name":"\u5170\u535a\u57fa\u5c3c"},{"char":"L","code":"LAND","path":"landrover","name":"\u8def\u864e"},{"char":"L","code":"LAWI","path":"landwind","name":"\u9646\u98ce"},{"char":"L","code":"LEXU","path":"lexus","name":"\u96f7\u514b\u8428\u65af"},{"char":"L","code":"LIFA","path":"lifan","name":"\u529b\u5e06"},{"char":"L","code":"LINC","path":"lincoln","name":"\u6797\u80af"},{"char":"L","code":"LOTU","path":"lotus","name":"\u83b2\u82b1"},{"char":"L","code":"MG","path":"mg","name":"\u7f57\u5b5a"},{"char":"L","code":"RENA","path":"renault","name":"\u96f7\u8bfa"},{"char":"L","code":"RORO","path":"rolls-royce","name":"\u52b3\u65af\u83b1\u65af"},{"char":"L","code":"SUZU","path":"suzuki","name":"\u94c3\u6728"},{"char":"M","code":"MASE","path":"maserati","name":"\u739b\u838e\u62c9\u8482"},{"char":"M","code":"MAYB","path":"maybach","name":"\u8fc8\u5df4\u8d6b"},{"char":"M","code":"MAZD","path":"mazda","name":"\u9a6c\u81ea\u8fbe"},{"char":"M","code":"MERC","path":"mercedes-benz","name":"\u6885\u8d5b\u5fb7\u65af-\u5954\u9a70"},{"char":"M","code":"MGNJ","path":"mg-nanjing","name":"\u540d\u7235"},{"char":"M","code":"MINI","path":"mini","name":"Mini"},{"char":"N","code":"NANY","path":"nanya","name":"\u5357\u4e9a"},{"char":"O","code":"ACUR","path":"acura","name":"\u8bb4\u6b4c"},{"char":"O","code":"OPEL","path":"opel","name":"\u6b27\u5b9d"},{"char":"Q","code":"CHER","path":"chery","name":"\u5947\u745e"},{"char":"Q","code":"GLEA","path":"gleagle","name":"\u5168\u7403\u9e70"},{"char":"Q","code":"KIA","path":"kia","name":"\u8d77\u4e9a"},{"char":"R","code":"NISS","path":"nissan","name":"\u65e5\u4ea7"},{"char":"R","code":"RIIC","path":"riich","name":"\u745e\u9e92"},{"char":"R","code":"ROEW","path":"roewe","name":"\u8363\u5a01"},{"char":"S","code":"MITS","path":"mitsubishi","name":"\u4e09\u83f1"},{"char":"S","code":"SAAB","path":"saab","name":"\u8428\u535a"},{"char":"S","code":"SABR","path":"sabre","name":"\u8d5b\u5b9d"},{"char":"S","code":"SHHX","path":"shuanghuanhongxing","name":"\u53cc\u73af\u7ea2\u661f"},{"char":"S","code":"SHIJ","path":"shij","name":"\u4e16\u7235"},{"char":"S","code":"SHUG","path":"shuguang","name":"\u66d9\u5149"},{"char":"S","code":"SKOD","path":"skoda","name":"\u65af\u67ef\u8fbe"},{"char":"S","code":"SMAR","path":"smart","name":"Smart"},{"char":"S","code":"SSAN","path":"ssangyong","name":"\u53cc\u9f99"},{"char":"S","code":"SUBA","path":"subaru","name":"\u65af\u5df4\u9c81"},{"char":"T","code":"TMQC","path":"tianma","name":"\u5929\u9a6c"},{"char":"T","code":"TONG","path":"tongtian","name":"\u901a\u7530"},{"char":"T","code":"TQMY","path":"tianqimeiya","name":"\u5929\u6c7d\u7f8e\u4e9a"},{"char":"T","code":"YQTJ","path":"faw-tianjin","name":"\u5929\u6d25\u4e00\u6c7d"},{"char":"W","code":"ISUZ","path":"isuzu","name":"\u4e94\u5341\u94c3"},{"char":"W","code":"RELY","path":"rely","name":"\u5a01\u9e9f"},{"char":"W","code":"VOLV","path":"volvo","name":"\u6c83\u5c14\u6c83"},{"char":"W","code":"WANF","path":"wanfeng","name":"\u4e07\u4e30"},{"char":"W","code":"WULI","path":"wuling","name":"\u4e94\u83f1"},{"char":"X","code":"CHEV","path":"chevrolet","name":"\u96ea\u4f5b\u5170"},{"char":"X","code":"CITR","path":"citroen","name":"\u96ea\u94c1\u9f99"},{"char":"X","code":"GOLD","path":"goldendragon","name":"\u53a6\u95e8\u91d1\u65c5"},{"char":"X","code":"HBXK","path":"xinkaiqiche","name":"\u65b0\u51ef\u6c7d\u8f66"},{"char":"X","code":"HYUN","path":"hyundai","name":"\u73b0\u4ee3"},{"char":"X","code":"NEWD","path":"newdadi","name":"\u65b0\u5927\u5730"},{"char":"X","code":"SOYA","path":"soyat","name":"\u65b0\u96c5\u9014"},{"char":"Y","code":"ENGL","path":"englon","name":"\u82f1\u4f26"},{"char":"Y","code":"INFI","path":"infiniti","name":"\u82f1\u83f2\u5c3c\u8fea"},{"char":"Y","code":"IVEC","path":"iveco","name":"\u4f9d\u7ef4\u67ef"},{"char":"Y","code":"SKYL","path":"skylark","name":"\u4e91\u96c0"},{"char":"Y","code":"YQBT","path":"faw-besturn","name":"\u4e00\u6c7d\u5954\u817e"},{"char":"Y","code":"YQHL","path":"faw-huali","name":"\u4e00\u6c7d\u534e\u5229"},{"char":"Y","code":"YQHQ","path":"faw-hongqi","name":"\u4e00\u6c7d\u7ea2\u65d7"},{"char":"Y","code":"YQHT","path":"faw-hongta","name":"\u4e00\u6c7d\u7ea2\u5854"},{"char":"Y","code":"YQJL","path":"faw-jilin","name":"\u4e00\u6c7d\u5409\u6797"},{"char":"Y","code":"YQLZ","path":"yqlz","name":"\u4e00\u6c7d\u67f3\u5dde"},{"char":"Z","code":"POLA","path":"polarsun","name":"\u4e2d\u987a"},{"char":"Z","code":"ZKHB","path":"zkhb","name":"\u4e2d\u5ba2\u534e\u5317"},{"char":"Z","code":"ZOTY","path":"zotye","name":"\u4f17\u6cf0"},{"char":"Z","code":"ZXQC","path":"zhongxing","name":"\u4e2d\u5174"}]);
           } else {
               $.ajax({
                   url: G.config('domain_main') +"data.php?a=brand&type="+type,
                   dataType: "jsonp",
                   jsonp: 'jsonCallback',
                   success: function (data, textStatus){
                       setBrand(data);
                   }
               });
           }
	}
	
       function setBrand(data) {
		obj_make.empty().attr("disabled",false).append('<option value="" selected="selected" _path="">'+lan_make+'</option>');
		$.each(data, function(i,val){
			  obj_make.append('<option value="'+val.code+'" _path="'+val.path+'">'+val.char+' '+val.name+'</option>');
		});
		if(val_make!=''){
			obj_make.val(val_make);
			getChexi();
		}else{
			if(obj_chexi!=null)obj_chexi.empty().append('<option value="">'+lan_chexi+'</option>').attr("disabled",true);
			if(obj_chexing!=null)obj_chexing.empty().append('<option value="">'+lan_chexing+'</option>').attr("disabled",true);
		}
       }
	function getChexi(){
		if(obj_chexi==null)return;
		var type=obj_type==null?'':obj_type.val();
		var make=obj_make.val();
		if(!make && obj_make){
			obj_chexing&&obj_chexing.val('').attr("disabled",true);
			return obj_chexi.val('').attr("disabled",true);
		}
		$.ajax({
			url: G.config('domain_main') +"data.php?a=chexi&type="+type+"&make="+make,
			dataType: "jsonp",
			jsonp: 'jsonCallback',
			success: function (data, textStatus){
				obj_chexi.empty().attr("disabled",false).append('<option value="">'+lan_chexi+'</option>');
				$.each(data, function(i,val){
					  obj_chexi.append('<option value="'+val.code+'">'+val.name+'</option>');
				});
				if(val_chexi!=''){
					obj_chexi.val(val_chexi);
					getChexing();
				}else{
					if(obj_chexing!=null)obj_chexing.empty().append('<option value="">'+lan_chexing+'</option>').attr("disabled",true);
				}
			}
		});
	}
	function getChexing(){
		if(obj_chexing==null)return;
		var make=obj_make.val();
		var chexi=obj_chexi.val();
		if(make=='' || chexi =='')return obj_chexi&&obj_chexing.val('').attr("disabled",true);
		$.ajax({
			url: G.config('domain_main') +"data.php?a=chexing&chexi="+chexi+"&make="+make,
			dataType: "jsonp",
			jsonp: 'jsonCallback',
			success: function (data, textStatus){
				if(obj_chexing!=null)obj_chexing.empty().attr("disabled",false).append('<option value="">'+lan_chexing+'</option>');
				$.each(data, function(i,val){
					  obj_chexing.append('<option value="'+val.code+'">'+val.name+'</option>');
				});
				obj_chexing.val(val_chexing);
			}
		});
	}
	if(obj_type!=null)obj_type.bind("change", getBrands);
	if(obj_make!=null)obj_make.bind("change", getChexi);
	if(obj_chexi!=null)obj_chexi.bind("change", getChexing);
};

cheYouModule.cinput = function(focusid){
	var focusblurid = $(focusid);
	var defval = focusblurid.val();
    focusblurid.css('color','#aaa');
	focusblurid.focus(function(){
		var thisval = $(this).val();
		if(thisval==defval){
			$(this).val("");
               $(this).css('color','#333');
		}
	});
};

cheYouModule.sinput = function(focusid) {
	var focusblurid = $(focusid);
	var defval = focusblurid.val();
    focusblurid.css('color','#aaa');
	focusblurid.focus(function(){
		var thisval = $(this).val();
		if(thisval==defval){
			$(this).val("");
            $(this).css('color','#333');
		}
	});
	focusblurid.blur(function(){
		var thisval = $(this).val();
		if(thisval==""){
			$(this).val(defval);
            $(this).css('color','#aaa');
		}
	});
};

cheYouModule.ALD = function(){
	var obj_province=typeof(arguments[0])!='string'?null:$(arguments[0]);
	var obj_city=typeof(arguments[1])!='string'?null:$(arguments[1]);
	var obj_district=typeof(arguments[2])!='string'?null:$(arguments[2]);
	var val_province=typeof(arguments[3])!='string'?'':arguments[3];
	var val_city=typeof(arguments[4])!='string'?'':arguments[4];
	var val_district=typeof(arguments[5])!='string'?'':arguments[5];
	var val_chain=typeof(arguments[6])!='number'?0:arguments[6];
	var lan_province='所有省份',lan_city='所有城市',lan_district='所有地区';
	if(obj_province!=null)obj_province.empty().append('<option value="">'+lan_province+'</option>');
	if(obj_city!=null)obj_city.empty().append('<option value="">'+lan_city+'</option>').attr("disabled",true);
	if(obj_district!=null)obj_district.empty().append('<option value="">'+lan_district+'</option>').attr("disabled",true);
	if(obj_city == null){
		alert("必须有城市参数");
		return;
	}
	var url_chain='&chain=';
	if(val_chain==1)url_chain+='1';
	else url_chain+='0';
	apd = [{"char":"A","id":47,"name":"\u5b89\u5fbd"},{"char":"B","id":11,"name":"\u5317\u4eac"},{"char":"C","id":43,"name":"\u91cd\u5e86"},{"char":"F","id":12,"name":"\u798f\u5efa"},{"char":"G","id":57,"name":"\u7518\u8083"},{"char":"G","id":13,"name":"\u5e7f\u4e1c"},{"char":"G","id":35,"name":"\u5e7f\u897f"},{"char":"G","id":54,"name":"\u8d35\u5dde"},{"char":"H","id":56,"name":"\u6d77\u5357"},{"char":"H","id":37,"name":"\u6cb3\u5317"},{"char":"H","id":48,"name":"\u9ed1\u9f99\u6c5f"},{"char":"H","id":38,"name":"\u6cb3\u5357"},{"char":"H","id":39,"name":"\u6e56\u5317"},{"char":"H","id":40,"name":"\u6e56\u5357"},{"char":"J","id":14,"name":"\u6c5f\u82cf"},{"char":"J","id":46,"name":"\u6c5f\u897f"},{"char":"J","id":49,"name":"\u5409\u6797"},{"char":"L","id":50,"name":"\u8fbd\u5b81"},{"char":"N","id":58,"name":"\u5185\u8499\u53e4"},{"char":"N","id":55,"name":"\u5b81\u590f"},{"char":"Q","id":61,"name":"\u9752\u6d77"},{"char":"S","id":15,"name":"\u5c71\u4e1c"},{"char":"S","id":16,"name":"\u4e0a\u6d77"},{"char":"S","id":44,"name":"\u5c71\u897f"},{"char":"S","id":45,"name":"\u9655\u897f"},{"char":"S","id":17,"name":"\u56db\u5ddd"},{"char":"T","id":52,"name":"\u5929\u6d25"},{"char":"X","id":60,"name":"\u897f\u85cf"},{"char":"X","id":59,"name":"\u65b0\u7586"},{"char":"Y","id":53,"name":"\u4e91\u5357"},{"char":"Z","id":18,"name":"\u6d59\u6c5f"}];
	function getProvince(){
		if (val_chain==1) {
               $.ajax({
                   url: G.config('domain_main') +"data.php?a=province"+url_chain,
                   dataType: "jsonp",
                   jsonp: 'jsonCallback',
                   success: function (data){
                       setProvince(data);
                   }
               });
               
           } else {
               setProvince(apd);
           }
	}
    function setProvince(data) {
        obj_province.empty().append('<option selected="selected" value="">'+ lan_province +'</option>');
		$.each(data, function(i,val){
			if(val.id == val_province) {
				obj_province.append('<option selected="selected" value="'+val.id+'">'+ val.char +' '+val.name+'</option>');
			} else {
				obj_province.append('<option value="'+val.id+'">'+ val.char +' '+val.name+'</option>');
			}
		});
		if(val_province!=''){
			if(obj_city!=null)
				getCity();
		}else{
			if(obj_city!=null)obj_city.empty().append('<option value="">'+lan_city+'</option>').attr("disabled",true);
			if(obj_district!=null)obj_district.empty().append('<option value="">'+lan_district+'</option>').attr("disabled",true);
		}
    }
	function getCity(){
		if(obj_city == null)
			return;
		var province = 0;
		if(obj_province != null) 
			province = obj_province.val();
		else 
			province = obj_province == null ? 0 : obj_province.val();
		if(!province && obj_province){
			obj_district&&obj_district.val('').attr("disabled",true);
			return obj_city.val('').attr("disabled",true);
		}
		
		$.ajax({
			url: G.config('domain_main') +"data.php?a=city&province="+province+url_chain,
			dataType: "jsonp",
			jsonp: 'jsonCallback',
			success: function (data, textStatus){
				obj_city.empty().attr("disabled",false).append('<option value="" _path="">'+lan_city+'</option>');
				$.each(data, function(i,val){
					if(val.id == val_city) {
						obj_city.append('<option selected="selected" value="'+val.id+'" _path="'+val.domain+'">'+val.name+'</option>');
					} else {
						obj_city.append('<option value="'+val.id+'" _path="'+val.domain+'">'+val.name+'</option>');
					}
				});
				if(val_city!=''){
					if(obj_district!=null)getDistrict();
				}else{
					if(obj_district!=null)obj_district.empty().append('<option value="">'+lan_district+'</option>').attr("disabled",true);
				}
			}
		});
	}
	function getDistrict(){
		if(obj_district==null)return;
		if(obj_province!=null)var province=obj_province.val();
		if(obj_city!=null)var city=obj_city.val();
		if(city=="" || city==0)return obj_city&&obj_district.val('').attr("disabled",true);
		$.ajax({
			url: G.config('domain_main') +"data.php?a=district&province="+province+"&city="+city,
			dataType: "jsonp",
			jsonp: 'jsonCallback',
			success: function (data, textStatus){
				if(obj_district!=null)obj_district.empty().attr("disabled",false).append('<option value="">'+lan_district+'</option>');
				$.each(data, function(i,val){
					  obj_district.append('<option value="'+val.id+'">'+val.name+'</option>');
				});
				obj_district.val(val_district);
			}
		});
	}
	if(obj_province!=null){
		getProvince();
		obj_province.change(getCity);
	}
	if(obj_city!=null)obj_city.bind("change", getDistrict);
};

cheYouModule.SP = function(){
		var obj_shop=typeof(arguments[0])!='string'?null:$(arguments[0]);
		var val_province=typeof(arguments[1])!='string'?'':arguments[1];
		var val_city=typeof(arguments[2])!='string'?'':arguments[2];
		if(obj_shop==null || (val_city=="" && val_province=="") ){
			alert("请选择省份或城市!");
			return;
		}
		$.ajax({
			url: G.config('domain_main') +"data.php?a=shop&province="+val_province+"&city="+val_city,
			dataType: "jsonp",
			jsonp: 'jsonCallback',
			success: function (data, textStatus){
				if(obj_shop!=null)obj_shop.empty().attr("disabled",false).append('<option value="">请选择服务网点</option>');
				$.each(data, function(i,val){
					  obj_shop.append('<option value="'+val.id+'">'+val.name+'</option>');
				});
				//obj_shop.val(val_shop);
			}
		});
	};


cheYouModule.Auth = function () {//会员认证信息
	var mt = cookieModule.get('MEMBER_TYPE');
	var mu = cookieModule.get('MEMBER_NAME');
	if (!mt || !mu || mt==0 || mu==0) {
		return false;
	}
	return {'member_type':mt,'username':mu};
};