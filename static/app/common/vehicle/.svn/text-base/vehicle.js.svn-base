/**
 * @desc 车型库组件（用来初始化）
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-11-06
 */

// 内联加载
// require('./vehicle.css');

var $ = require('jquery');
var VehicleTpl = require('./vehicle.tpl');
var AutoComplete = require('widget/autocomplete/autocomplete_v2.js');
var Position = require('widget/position/position.js');
Vehicle = module.exports;

$(function () {

    var $type   = $('#vehicle-type');       // 车类型
    var $brand  = $('#vehicle-brand');      // 车品牌
    var $series = $('#vehicle-series');     // 车系列
    var $model  = $('#vehicle-model');      // 车型号

    if (!$type.length || !$brand.length || !$series.length || !$model.length) {
        throw new Error('type/brand/series/model is missing');
    }

    //--------------------------//
    //         车类型            //
    //--------------------------//

    var $type_text_input = $type.find('[type=text]');
    var $type_hidden_input = $type.find('[type=hidden]');
    var car_type = +($type_hidden_input.val() || $type_hidden_input.data('postValue'));

    $type.on('click', '[type=text]', function () {
        if (!$type.hasClass('active')) {
            $type.addClass('active');
        } else {
            $type.removeClass('active');
        }
    }).mouseleave(function () {
        if ($type.hasClass('active')) {
            $type.removeClass('active');
        }
        return false;
    }).on('click', 'li a', function (e, flag) {
        var $this = $(this);
        var value = $this.data('value');
        var text  = $this.text();

        if (value != car_type) {
            $type_text_input.val(text);
            $type_hidden_input.val(value);
            if (!flag) {
                $type.trigger('change', [value]);
            }
            car_type = value;
        }

        $type.removeClass('active');

        return false;
    });

    $type.on('change', function (e, value) {
        // reset
        $brand.trigger('reset');
    });

    //--------------------------//
    //         车品牌            //
    //--------------------------//

    var $brand_text_input = $brand.find('[type=text]');
    var $brand_hidden_input = $brand.find('[type=hidden]');
    var $brand_content = $brand.find('.vehicle-inner');
    var brand_id = +($brand_hidden_input.val() || $brand_hidden_input.data('postValue'));
    var last_car_type;

    $brand.on('focus', '[type=text]', function () {

        // 根据车类型筛选车品牌
        if (car_type == last_car_type) {
            $brand.addClass('active');
            return;
        }

        last_car_type = car_type;

        $brand.addClass('loading');
        $.ajax({
            url : 'http://data.273.cn/',
            data : {
                car_type : car_type,
                _mod : 'vehicleV2',
                _act : 'getbrand'
            },
            dataType : 'jsonp'
        }).done(function (data) {
            if (!data) return;

            var list = [];
            var anchors = Object.keys(data);
            var $list, $items, $item, scrollTop;

            $.each(anchors, function (i, v) {
                list.push({
                    text : v,
                    letter : true
                });
                list = list .concat(data[v]);
            });

            if (list.length > 0) {
                $brand_content.html(VehicleTpl({
                    tip : '请选择品牌',
                    anchors : anchors,
                    list : list
                }));

                $list = $brand_content.find('.list');
                $items = $list.find('.letter');
                $nav = $list.find('.vechicle-nav');
                if (G.util.ua.ie === 6) {
                    $('#vehicle-brand-nav').remove();
                    $nav.appendTo(document.body);
                }
                $nav.attr('id', 'vehicle-brand-nav');
                $item = $();

                $list.scroll(function () {
                    scrollTop = $list.scrollTop();
                    $items.each(function (i, el) {
                        var $el = $(el);
                        var $next = $($items[i + 1]);
                        if (scrollTop > $el.position().top && (!$next.size() || scrollTop < $next.position().top)) {

                            Position.pin({el:$nav, fixed:true, x:'top', y: 'left'},{el: $list, x:'top', y:'left'});

                            $nav.find('a').html($el.find('a').html()).end().show();
                            $item = $el;
                            return false;
                        }
                    });
                });
                $brand.removeClass('loading').addClass('active');
            }
        });

        return false;
    }).on('keyup', '[type=text]', function (e) {

        if ($brand.hasClass('active') && e.which !== 13) {
            $brand.removeClass('active');
            if (G.util.ua.ie === 6) {
                $('#vehicle-brand-nav').hide();
            }
            $series.trigger('reset');
            $brand_hidden_input.val(0);
            brand_id = 0;
        }

        if (!$brand.hasClass('active') && !$brand_text_input.val() && e.which === 8){
            $brand_text_input.focus();
        }
    }).on('change', '[type=text]', function () {


    }).on('click', '.close', function () {

        $brand.removeClass('active');
        if (G.util.ua.ie === 6) {
            $('#vehicle-brand-nav').hide();
        }
        return false;
    }).on('click', '.list a', function (e) {

        var $this = $(this);
        var value = $this.data('value');
        var text = $this.text();

        if (!value) {
            return;
        }

        if (value != brand_id) {
            $brand_text_input.val(text);
            $brand_hidden_input.val(value);
            $series.trigger('reset');
            brand_id = value;
        }
        $brand.removeClass('active');
        if (G.util.ua.ie === 6) {
            $('#vehicle-brand-nav').hide();
        }
        // 触发车系列focus
        $series.show();
        $series_text_input.focus();
        return false;
    }).on('click', '.anchors a', function () {
        var $this = $(this);
        var id = $.trim($this.text());
        var $list = $brand_content.find('.list');

        var $letter = $brand_content.find('#' + id);

        if (!$letter.length) {
            return;
        }

        $list.scrollTop($letter.position().top);
        if (G.util.ua.ie === 6) {
            $('#vehicle-brand-nav').hide();
        } else {
            $list.find('.vechicle-nav').hide();
        }
        return false;
    });


    $brand.on('reset', function (e) {
        $brand_text_input.val('请选择品牌');
        $brand_hidden_input.val(0);
        last_brand_id = brand_id = 0;
        $series.trigger('reset');
        auto_brand.clear();
    });

    //--------------------------//
    //         车系列            //
    //--------------------------//
    var $series_text_input = $series.find('[type=text]');
    var $series_hidden_input = $series.find('[type=hidden]');
    var $series_content = $series.find('.vehicle-inner');
    var series_id = +($series_hidden_input.val() || $series_hidden_input.data('postValue'));
    var last_brand_id;

    $series.on('focus', '[type=text]', function () {

        // 根据车品牌筛选车系列
        // 不同车型，可能相同品牌
        if (brand_id == last_brand_id) {
            $series.addClass('active');
            return;
        }

        last_brand_id = brand_id;

        $series.addClass('loading');
        $.ajax({
            url : 'http://data.273.cn/',
            data : {
                car_type : car_type,
                brand_id : brand_id,
                _mod : 'vehicleV2',
                _act : 'getseries'
            },
            dataType : 'jsonp'
        }).done(function (data) {
            if (!data || !data.length) return;

            var temp = {
                tip : '请选择车系',
                list : data
            }

            if (data.length > 10) {
                temp.overflow = true;
            }

            $series_content.html(VehicleTpl(temp));
            $series.removeClass('loading').addClass('active');
        });
    }).on('keyup', '[type=text]', function (e) {

        if ($series.hasClass('active') && e.which !== 13) {
            $series.removeClass('active');
            $model.trigger('reset');
            $series_hidden_input.val(0);
            series_id = 0;
        }
        if (!$series.hasClass('active') && !$series_text_input.val() && e.which === 8){
            $series_text_input.focus();
        }
    }).on('change', '[type=text]', function () {


    }).on('click', '.close', function () {

        $series.removeClass('active');
        return false;
    }).on('click', '.list a', function () {

        var $this = $(this);
        var value = $this.data('value');
        var text = $this.text();

        if (!value) {
            return;
        }

        if (value != series_id) {
            $series_text_input.val(text);
            $series_hidden_input.val(value);
            $model.trigger('reset');
            series_id = value;
        }
        $series.removeClass('active');

        // 触发车系列focus
        $model.show();
        $model_text_input.focus();
        return false;
    });


    $series.on('reset', function () {
        $series.hide();
        $series_text_input.val('请选择车系');
        $series_hidden_input.val(0);
        last_series_id = series_id = 0;
        $model.trigger('reset');
        auto_series.clear();
    });

    if (parseInt($series_hidden_input.val())) {
        $series.show();
    }

    //--------------------------//
    //         车型号            //
    //--------------------------//
    var $model_text_input = $model.find('[type=text]');
    var $model_hidden_input = $model.find('[type=hidden]');
    var $model_content = $model.find('.vehicle-inner');
    var model_id = +($series_hidden_input.val() || $series_hidden_input.data('postValue'));
    var last_series_id;

    $model.on('focus', '[type=text]', function () {

        // 根据车系列筛选车型号

        if (series_id == last_series_id) {
            $model.addClass('active');
            return;
        }

        last_series_id = series_id;
        $model.addClass('loading');
        $.ajax({
            url : 'http://data.273.cn/',
            data : {
                car_type : car_type,
                series_id : series_id,
                _act : 'getmodel',
                _mod : 'vehicleV2'
            },
            dataType : 'jsonp'
        }).done(function (data) {
            if (!data) return;

            var list = [];
            var anchors = Object.keys(data);
            var $list, $items, $item, scrollTop;

            // 降序
            anchors.sort(function(a, b){
                return  b!='#'&&(a=='#'||a<b);
            });
            $.each(anchors, function (i, v) {
                var _v = v;
                if (_v != '#') {
                    _v += '年款';
                }
                list.push({
                    text : _v,
                    letter : true
                });

                $.each(data[v], function (i, item) {
                    item.year = _v;
                });
                list = list .concat(data[v]);
            });


            var temp = {
                tip : '请选择车型，若无相符车型，请直接输入',
                list : list
            }

            if (list.length > 10) {
                temp.overflow = true;
            }

            $model_content.html(VehicleTpl(temp));
            $list = $model_content.find('.list');
            $items = $list.find('.letter');
            $nav = $list.find('.vechicle-nav');

            if (G.util.ua.ie === 6) {
                $('#vehicle-model-nav').remove();
                $nav.appendTo(document.body);
            }

            $nav.attr('id', 'vehicle-model-nav');
            $item = $();

            $list.scroll(function () {

                scrollTop = $list.scrollTop();
                $items.each(function (i, el) {
                    var $el = $(el);
                    var $next = $($items[i + 1]);
                    if (scrollTop > $el.position().top && (!$next.size() || scrollTop < $next.position().top)) {

                        Position.pin({el:$nav, fixed:true, x:'top', y: 'left'},{el: $list, x:'top', y:'left'});

                        $nav.find('a').html($el.find('a').html()).end().show();
                        $item = $el;
                        return false;
                    }
                });
            });
            $model.removeClass('loading').addClass('active');
        });
    }).on('keyup', '[type=text]', function (e) {
        if ($model.hasClass('active') && e.which !== 13) {
            $model.removeClass('active');
            if (G.util.ua.ie === 6) {
                $('#vehicle-model-nav').hide();
            }
            $model_hidden_input.val(0);
            model_id = 0;
        }
        if (!$model.hasClass('active') && !$model_text_input.val() && e.which === 8){
            $model_text_input.focus();
        }

    }).on('change', function () {

    }).on('click', '.close', function () {

        $model.removeClass('active');
        if (G.util.ua.ie === 6) {
            $('#vehicle-model-nav').hide();
        }
        return false;
    }).on('click', '.list a', function () {

        var $this = $(this), $item, type;
        var value = $this.data('value');
        var text = $this.text();

        if ($this.data('year') !== '#') {
            text = $this.data('year') + ' ' + text;
        }
        if (!value) {
            return;
        }

        if (value != model_id) {
            $model_text_input.val(text);
            $model_hidden_input.val(value);

            model_id = value;
            // 确定车类型（如果未选）
            if (!car_type && brand_id && series_id && value) {

                // brand_id + series_id + model_id => car_type

                $.ajax({
                    url : 'http://data.273.cn/',
                    data : {
                        // brand_id : brand_id,
                        // series_id : series_id,
                        model_id : model_id,
                        _mod : 'vehicleV2',
                        _act : 'gettype'
                    },
                    dataType : 'jsonp'
                }).done(function (data) {
                    if (!data || !data.value) return;

                    $item = $type.find('[data-value=' + data.value +']');

                    if ($item.length > 0) {
                        $item.trigger('click', [true]);
                    }
                });
            }
        }

        $model.removeClass('active');
        if (G.util.ua.ie === 6) {
            $('#vehicle-model-nav').hide();
        }

        $model_text_input.blur();// 触发验证
        return false;
    });

    if (parseInt($model_hidden_input.val())) {
        $model.show();
    }

    var modelDefaultValue = '请选择车型';
    // 因为还没有model autocomplete
    $model_text_input.focus(function () {
        var value = $.trim($model_text_input.val());
        if (value === modelDefaultValue) {
            $model_text_input.val('');
        }
    }).blur(function () {
        var value = $.trim($model_text_input.val());
        if (!value) {
            $model_text_input.val(modelDefaultValue);
        }
    });

    $model.on('reset', function () {
        $model.hide();
        $model_text_input.val(modelDefaultValue);
        $model_hidden_input.val(0);
        model_id = 0;

    });


    // 自动联想
    var autoTpl = '' +
        '<div class="<%= classPrefix %>" >' +
            '<ul class="<%= classPrefix %>-items" data-role="items">' +
                '<% items.forEach (function (item) {%>' +
                    '<li class="<%= classPrefix %>-item">' +
                        '<a href="javascript:;" data-role="item" data-series-id="<%= item.series_id %>" data-brand-id="<%= item.brand_id || 0 %>" data-value="<%= item.value %>"><%= item.text || item.value %></a>' +
                    '</li>' +
                '<% }); %>' +
            '</ul>' +
        '</div>';

    var auto_brand = new AutoComplete({
        el : $brand_text_input,
        placeholder : '请选择品牌',
        dataSource : 'http://data.273.cn/?_mod=vehicleComplete&_act=getbrandseries&query=<%=query%>',
        overflow : 10,
        template : autoTpl,
        focusAble : false,
        params : function () {
            return {
                car_type : $type_hidden_input.val()
            }
        },
        onItemSelect : function (data) {
            var arr;
            if (data.series_id) {
                arr = data.value.split('_');
                $brand_text_input.val(arr[0]);
                $series_text_input.val(arr[1]);
                series_id = data.series_id;
                brand_id = data.brand_id;
                $model.show();
                $model_text_input.focus();
                $series.show();
                $brand_hidden_input.val(data.brand_id);
                $series_hidden_input.val(data.series_id);
                $brand_text_input.blur();
                $series_text_input.blur();
            } else {
                $brand_text_input.val(data.value);
                brand_id = data.brand_id;
                $series.show();
                $brand_hidden_input.val(data.brand_id);
                $brand_text_input.blur();
                $series_text_input.focus();
            }
        }
    });


    var auto_series = new AutoComplete({
        el : $series_text_input,
        placeholder : '请选择车系',
        dataSource : 'http://data.273.cn/?_mod=vehicleComplete&_act=getseries&query=<%=query%>',
        overflow : 10,
        template : autoTpl,
        focusAble : false,
        params : function () {
            return {
                car_type : $type_hidden_input.val(),
                brand_id : $brand_hidden_input.val()
            }
        },
        onItemSelect : function (data) {
            $series_text_input.val(data.value);
            series_id = data.series_id;
            $model.show();
            $model_text_input.focus();
            $series_hidden_input.val(data.series_id);
            $series_text_input.blur();
        }
    });
    //--------------------------//
    //         common           //
    //--------------------------//
    $(document).on('click.vehicle', function (e) {
        if (!$.contains($brand[0], e.target)) {
            if (G.util.ua.ie === 6) {
                $('#vehicle-brand-nav').hide();
            }
            $brand.removeClass('active');
        }
        if (!$.contains($series[0], e.target)) {
            $series.removeClass('active');
        }
        if (!$.contains($model[0], e.target)) {
            if (G.util.ua.ie === 6) {
                $('#vehicle-model-nav').hide();
            }
            $model.removeClass('active');
        }
    });

    $(window).scroll(function () {
        $('#vehicle-model-nav').hide();
        $('#vehicle-brand-nav').hide();
    })

});
