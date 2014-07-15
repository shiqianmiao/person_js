<dl class="clearfix other">
    <dt>品&nbsp;&nbsp;牌：</dt>
    <%
        for (var i = 0, l = brands.length; i < l; i++) { 
            var item = brands[i];
    %>
    <dd><a href="<%=item['url']%>" title="<%= item['name'] %>" data-273-click-log="<%= item['log'] %>" target="_blank"><%= item['name'] %></a></dd>
    <% } %>
</dl>
<dl class="clearfix other">
    <dt>价&nbsp;&nbsp;格：</dt>
    <%
        for (var i = 0, l = prices.length; i < l; i++) { 
            var item = prices[i];
    %>
    <dd><a href="<%=item['url']%>" title="<%= item['name'] %>" data-273-click-log="<%= item['log'] %>" target="_blank"><%= item['name'] %></a></dd>
    <% } %>
</dl>
<dl class="clearfix other">
    <dt>车&nbsp;&nbsp;龄：</dt>
    <%
        for (var i = 0, l = ages.length; i < l; i++) { 
            var item = ages[i];
    %>
    <dd><a href="<%=item['url']%>" title="<%= item['name'] %>" data-273-click-log="<%= item['log'] %>" target="_blank"><%= item['name'] %></a></dd>
    <% } %>
</dl>
<dl class="clearfix other last">
    <dt>热&nbsp;&nbsp;卖：</dt>
    <%
        for (var i = 0, l = series.length; i < l; i++) { 
            var item = series[i];
    %>
    <dd><a href="<%=item['url']%>" title="<%= item['name'] %>" data-273-click-log="<%= item['log'] %>" target="_blank"><%= item['name'] %></a></dd>
    <% } %>
</dl>