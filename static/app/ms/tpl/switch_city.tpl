<li>
    <% var style = !province_id ? 'on' : '';%>
    <span class="<%= style %>"><a href="http://www.273.cn/<% if (page_type === 'list') {%>sale/<%}%>" class="js-s-p">全国</a></span>
    <% 
        for (var i = 0, l = munis.length; i < l; i++)  { 
            var item = munis[i];
            var style = item['id'] == province_id ? 'on' : '';
    %>
    <span class="<%= style %>"><a href="<%= item['url']%>" class="js-s-p"><%= item['name']%></a></span>
    <% } %>
    <span class="more"><a href="http://chain.273.cn/map/">全部地区门店</a></span>
</li>

<li>
    <% 
        for (var i = 0, l = provs.length; i < l; i++)  { 
            var item = provs[i];
            var style = item['id'] == province_id ? 'on' : '';
    %>
    <span class="<%= style %>"><a  class="js-n-p" href="<%= item['url']%>"><%= item['name']%></a></span>
    <% } %>
</li>

<% 
    for (var i = 0, l = provs.length; i < l; i++)  { 
        var item = provs[i];
        var style = item['id'] == province_id ? 'block' : 'none';
        var children = item['children'] || [];
%>
<li class="side js-n-c" style="display:<%= style %>;">
        <%  style = province_id == item['id'] && !city_id ? 'on' : '';%>
        <span class="<%= style %>"><a href="<%= item['url']%>">全省</a></span>
        <% 
            for (var j = 0, m = children.length; j < m; j++) { 
                var sitem = children[j];
                var style = sitem['id'] == city_id ? 'on' : '';
        %>
        <span class="<%= style %>"><a href="<%= sitem['url']%>"><%= sitem['name']%></a></span>
        <% } %>
</li>
<% } %>