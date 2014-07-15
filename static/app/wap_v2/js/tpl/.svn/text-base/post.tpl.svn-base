<% for (var i = 0, l = post_list.length; i < l; i++)  { %>
<li>
    <a href="<%= post_list[i]['detail_url'] %>" data-273-click-log="<%= post_list[i]['log_str'] %>">
        <div class="pic" >
        <% if(post_list[i]['cover_photo']){ %>
            <img alt="<%= post_list[i]['title'] %>" src="http://sta.273.com.cn/app/wap_v2/theme/small-default.png" datasrc="<%= post_list[i]['cover_photo'] %>" width="100" height="76"/>
        <% } else { %>
            <img  src="http://sta.273.com.cn/app/wap_v2/theme/small-default.png" width="100" height="76"/>
        <% } %>
        </div>
        <div class="text">
            <h3><%= post_list[i]['title'] %></h3>
            <p class="tags row clearfix">
                <span class="price">￥<%= post_list[i]['price'] %>万</span>
                <%= post_list[i]['icon_html'] %>
            </p>
            <p class="color-999 clearfix"><%= post_list[i]['create_time_text'] %>发布<span class="mileage"><%= post_list[i]['kilometer'] %>万公里</span></p>
        </div>
    </a>
</li>
<% } %>