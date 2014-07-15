<div class="tip"><a href="javascript:;" class="close"></a><%= tip %></div>
<div class="list <% if (typeof overflow !== 'undefined') { %>overflow<% } %>">
    <ul>
        <li class="vechicle-nav"><a href="javascript:;"></a></li>
        <% 
        for (var i = 0, l = list.length; i < l; i++) { 
            var item = list[i];
        %>
        <li <% if (item.letter) { %>class="letter" id="<%= item.text || '' %>"<% } %>>
            <a href="javascript:;" <% if (item.value) { %>data-value="<%= item.value %>"<% } %> <% if (item.year) { %>data-year="<%= item.year %>"<% } %>><%= item.text %></a>
        </li>
        <% } %>
    </ul>
</div>
<% if (typeof anchors !== 'undefined') { %>
<ul class="anchors">
        <% for (var i = 0, l = anchors.length; i < l; i++) { %>
        <li><a href="javascript:;"><%= anchors[i] %></a></li>
        <% } %>
</ul>
<% } %>

