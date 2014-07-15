<ul class="car_list clearfix">
    <% 
        for (var i = 0, l = car_list.length; i < l; i++) { 
            var item = car_list[i];
            var style = '';
            if ((i + 1) % 4 === 0) {style = 'last';}
    %>
    <li class="<%= style %>">
        <div class="pic">
            <%if (item['is_seven'] == 1){%>
            <a href="http://www.273.cn/static/seven.html" target="_blank">
            <span class="icons-7days-m" title="该车支持7天无理由退车服务"></span>
            </a>
            <% } else if (item['condition_id'] > 0){%>
            <span class="icons-ckb-s" title="该车辆状况已经过车况宝检测"></span>
            <% }%>
            <a title="<%= item['title']%>" href="<%= item['detail_url']%>" target="_blank" data-273-click-log="<%= item['log'] %>"><img src="<%= item['cover_photo']%>" alt="<%= item['title']%>"/></a>
            <%if (item['is_approve'] > 0){%>
            <span class="com_authen_icon" title="该车源为273审核通过的真实车源"></span>
            <% }%>
        </div>
        <p><a href="<%= item['detail_url']%>" target="_blank" data-273-click-log="<%= item['log'] %>" title="<%= item['title']%>"><%= item['title']%></a></p>
        <p><span><%= item['price']%>万</span><%= item['card_year']%>年 <%= item['kilometer']%>公里</p>
    </li>
    <% } %>
</ul>
<div class="moreline"><span><a href="<%= more_line['url']%>" target="_blank">查看更多<b><%= more_line['text']%></b>二手车<em>&nbsp;</em></a></span></div>