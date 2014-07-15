<div class="title_style">
    <h3><strong class="current">你可能喜欢</strong></h3>
    <span class="link_icon icoBox">
        <% for(var i=0; i<iconNum; i++){ %>
            <a href="javascript:void(0)" <% if(i===0){ %>class="current"<% }%> rel="<%= i+1 %>"></a>
        <% } %>
    </span>
</div>

<div id="guess_like" class="right_content_style" data-icon-num="<%= iconNum %>">
    <div id="guess_box" >
        <% for(var i=0; i<car_list.length, i<15; i++){ var item = car_list[i]; %>
        <% if((i % 5) == 0) {%><ul class="car_list clearfix"><% }%>
            <li <% if(i > 0 && ((i + 1) % 5) == 0) {%>class="last"<% }%>>
                <div class="pic">
                    <a href="<%= item['detail_url'] %>" target="_blank">
                        <img alt="<%= item['title']%>" src="<%= item['cover_photo']%>" width="160" height="120"/>
                    </a>
                    <% if(item['is_approve']){%>
                        <span class="com_authen_icon"></span>
                    <% }%>
                </div>
                <p><a href="<%= item['detail_url']%>" target="_blank"><%= item['title']%></a></p>
                <p><span><%= item['price'] %>万
                </span><%= item['card_year'] %>年 <%= item['kilometer'] %>万公里
                </p>
            </li>
        <% if(i > 0 && ((i + 1) % 5) == 0) { %></ul><% }%>
        <% }%>
    </div>
</div>