<ul class="clearfix">
    <% 
        for (var i = 0, l = car_list.length; i < l; i++) { 
            var item = car_list[i];
            var style = '';
            if ((i + 1) % 5 == 0) {style = 'last';}
    %>
    <li class="<%= style %>">
        <div class="pic lazy_load">
            <a title="<%= item['title']%>" href="<%= item['detail_url']%>" target="_blank" data-eqselog="/indexcar@etype=click@brand=<%= more_line['text']%>@place=<%= i+1 %>@img=1"><img class="js_scroll" data-url="<%= item['cover_photo']%>" src="" alt="<%= item['title']%>"/></a>
        </div>
        <h4>
            <a title="<%= item['title']%>" href="<%= item['detail_url']%>" target="_blank" data-eqselog="/indexcar@etype=click@brand=<%= more_line['text']%>@place=<%= i+1 %>"><%= item['title']%></a>
            <% if (item['order_status'] >= 300) { %>
            <i></i>
            <% } %>
        </h4>
        <div class="price clearfix">
            <div class="l"><strong><%= item['price']%></strong>万</div>
            <%= item['icon_html']%>
        </div>
        <div class="other clearfix"><div class="l"><label>上牌：</label><%= item['card_time']%></div><div class="r"><label>里程：</label><%= item['kilometer']%>万公里</div></div>
    </li>
    <% } %>
</ul>
<% if (car_list.length >= 10) { %>
<div class="more"><a href="/<%= more_line['url']%>/" target="_blank" data-eqselog="/indexcar@etype=click@brand=<%= more_line['text']%>@place=more">查看更多<strong><%= more_line['text']%></strong>汽车<i></i></a></div>
<% } %>
