<div class="shaixuan-page shaixuan-page-pinggu-ppcx">
    <h3 class="js_back_brand"><img src="<%= brand.icon_path %>" /><%= brand.name %></h3>
    <ul>
        <li class="chexi js_back_series"><a href="javascript:;"><%= series.name %></a></li>
        <% if (typeof(unlimit)!="undefined" && unlimit){ %>
            <li class="unlimit"><a href="javascript:;">不选</a></li>
        <% } %>
    </ul>
    <% for(index in year_keys) { 
        var key = year_keys[index];
    %>
     <h4><%= key=='#' ? key : key + '款' %></h4>
     <ul>
        <% for (var i = 0, l = data[key].length; i < l; i++)  { 
            var item = data[key][i];
        %>
         <li><a href="javascript:void(0);" data-id="<%= item.id %>" data-title="<%= item.title%>"><%= item.name %></a></li>
        <% } %>
     </ul>
    <% } %>
</div>