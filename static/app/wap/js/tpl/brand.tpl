<bread>
  <div class="bread-left"><a href="javascript:void(0);" class="first"><% if(typeof(channel)=="undefined") { %>高级搜索<% }else{ %><%= channel %><%}%></a><span>品牌</span></div>
</bread>
<div class="area-list">
    <dl class="letter">
        <dt>按字母排序</dt>
        <% for (var i = 0, l = chars.length; i < l; i++)  { %>
           <dd><a href="#brand_<%= chars[i] %>"><%= chars[i] %></a></dd>
        <% } %>
    </dl>
    <% for (var i = 0, l = data.length; i < l; i++)  { %>
    <dl id = "brand_<%= data[i]['char'] %>">
        <dt class="sub-title"><%= data[i]['char'] %>（以<%= data[i]['char'] %>为开头的品牌）</dt>
        <% for (var j = 0, k = data[i]['brands'].length; j < k; j++)  { %>
            <dd>
            <a href="javascript:void(0)" class="brand-item" data-brand-url="<%= data[i]['brands'][j]['key'] %>"><%= data[i]['brands'][j]['value'] %></a>
            </dd>
        <% } %>
    </dl>
    <% } %>
</div>
