<% for (var i = 0, length = data.length; i < length; i++) {
    var item = data[i];
    var adviserUrl = shopUrl + "p_" + item.user_id + "/";
%>
<li class="clearfix">
    <div class="tel"><i class="i<%= parseInt(item.is_complaints)+parseInt(item.major_complaints)+1 %>"></i><p><%=item.mobile_caption%></p><span></span></div>
    <div class="comment"><p><%=item.report_content%></p>
        <% if (item.username) { %>
            <div class="other_info">
                <span>被评价顾问：
                    <% if (item.status == 1) { %>
                    <a href="<%= adviserUrl %>" target="_blank"><%=item.username%></a>
                    <% } else { %>
                    <%=item.username%></a>
                    <% } %>
                </span>
                <% if (item.is_complaints > 0 && item.major_complaints > 0) { %>
                <em class="tag1">重大投诉</em>
                <% } %>
            </div>
        <% } %>
    </div>
    <div class="time"><%=item.time_caption%></div>
</li>
<% } %>

