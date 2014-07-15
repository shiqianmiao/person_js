<% if (pic_news.length > 0) { %>
<div class="details">
    <% 
    for (var i = 0, l = pic_news.length; i < l; i++) { 
        var newsItem = pic_news[i];
    %>
    <div class="part clearfix">
        <div class="pic"><a href="<%=  newsItem['detail_path'] %>" target="_blank" data-eqselog="/indexnews@etype=click@<%= log_key %>=m<%= i+1 %>@pos=img"><img src="<%= newsItem['image_path'] %>" /></a></div>
        <div class="font">
            <h4><a href="<%= newsItem['detail_path'] %>" target="_blank" data-eqselog="/indexnews@etype=click@<%= log_key %>=m<%= i+1 %>@pos=title"><%= newsItem['title'] %></a></h4>
            <p><a class="con" href="<%= newsItem['detail_path'] %>" target="_blank" data-eqselog="/indexnews@etype=click@<%= log_key %>=m<%= i+1 %>@pos=content"><%= newsItem['summary'] %></a></p>
        </div>
    </div>
    <% } %>
</div>
<% } %>

<% if (normal_news.length > 0) { %>
<div class="list">
    <ul>
    <% 
    for (var i = 0, l = normal_news.length; i < l; i++) { 
        var newsItem = normal_news[i];
    %>
        <li><em>·</em><a href="<%= newsItem['detail_path'] %>" target="_blank" data-eqselog="/indexnews@etype=click@<%= log_key %>=p<%= i+1 %>"><%= newsItem['title'] %></a></li>
    <% } %>
    </ul>
</div>
<% } %>