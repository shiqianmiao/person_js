<div class="shaixuan-page shaixuan-page-pinggu-ppcx">
    <h3 class="js_back_brand"><img src="<%= brand.icon_path %>" /><%= brand.name %></h3>
    <ul>
        <% if (typeof(unlimit)!="undefined" && unlimit){ %>
            <li class="unlimit"><a href="javascript:void(0);">不选</a></li>
        <% } %>
        <% for (var i = 0, l = data.length; i < l; i++)  { 
            var item = data[i];
        %>
         <li><a href="javascript:void(0);" data-id="<%= item.id %>" data-url="<%= item.url %>"><%= item.name %></a></li>
        <% } %>
    </ul>
</div>