<bread>
    <a  href="javascript:void(0);" class="first"><% if(typeof(channel)=="undefined") { %>高级搜索<% }else{ %><%= channel %><%}%></a><span><%=name %></span>
</bread>
<adsearch>
<div class="search-list2">
    <input id="option_type" value="<%= key %>" type="hidden" />
    <ul>
        <% if(!value) { %>
        <li><a href="javascript:void(0);" onclick="return false;" style="background-color:#888">不限</a></li>
        <% } else{ %>
        <li><a href="javascript:void(0);" onclick="return false;" style="background-color:#888"><%= value_name %></a></li>
        <li><a href="javascript:void(0);">不限</a></li>
        <% } %>
        <% 
        for (var i = 0, l = data.length; i < l; i++)  { 
            var item = data[i];
        %>
            <% if (value != item.key) { %>
             <li><a href="javascript:void(0);" data-value="<%= item.key %>"><%= item.value %></a></li>
            <% } %>
        <% } %>
    </ul>
</div>

<% if (key=="price") {%>
    <form class="adsearch mileage">
    <p><input type="text" name="low" data-custom-input="1" placeholder="最低价格" /><span>-</span><input name="high" data-custom-input="1" type="text" placeholder="最高价格">万元</p>
    <p class="btn"><input type="submit" value="确定选择" /></p>
    </form>
<% } %>

<% if (key=="years") {%>
    <form class="adsearch mileage">
    <p><input type="text" name="low" data-custom-input="2" placeholder="最低车龄" /><span>-</span><input name="high" data-custom-input="2" type="text" placeholder="最高车龄">年</p>
    <p class="btn"><input type="submit" value="确定选择" /></p>
    </form>
<% } %>

<% if (key=="displace") {%>
    <form class="adsearch mileage">
    <p><input type="text" name="low" data-custom-input="20" placeholder="最小排量" /><span>-</span><input name="high" data-custom-input="20" type="text" placeholder="最大排量">L</p>
    <p class="btn"><input type="submit" value="确定选择" /></p>
    </form>
<% } %>

<% if (key=="kilometer") {%>
    <form class="adsearch mileage">
    <p><input type="text" name="low" data-custom-input="3" placeholder="最短里程" /><span>-</span><input name="high" data-custom-input="3" type="text" placeholder="最长里程">万公里</p>
    <p class="btn"><input type="submit" value="确定选择" /></p>
    </form>
<% } %>

</adsearch>