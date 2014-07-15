<% for (var i = 0, length = data.length; i < length; i++) {
    var item = data[i];
%>
<li>
    <div class="car_list_box clearfix">
        <div class="pic lazy_load">
        <a href="<%= item.detail_url %>" target="_blank">
        <img class="js_scroll" src="" data-url="<%= item.cover_photo %>" alt="<%= item.title %>" /><i></i>
        </a>
        </div>
        <div class="info">
        <h4>
        <a href="<%= item.detail_url %>" target="_blank"><%= item.title %></a>
        <% if (item.is_quality_car == 1) { %>
        <i></i>
        <% } %>
        </h4>
            <p class="p1">
                <strong>
                <%= item.card_time %>
                </strong>上牌<b>|</b>
                <strong><%= item.kilometer %></strong>万公里
                <b>|</b>
                <%= item.emission_name %>
                <b>|</b>
                <%= item.province_info.name%> <%= item.city_info.name %>
            </p>
            <p><%= item.description %></p>
            <p class="p2"><span class="time"><%= item.create_time %></span> 发布
            <% if (item.mark_type == 2) { %>
            <span class="tag">顾问已看车</span>
            <% } else if (item.mark_type == 1) { %>
            <span class="tag">行驶证已审核</span>
            <% } else if (item.mark_type == 3) { %>
            <span class="tag">顾问已看车</span>
            <span class="tag">行驶证已审核</span>
            <% } %>
            <% if (item.is_look_ck == 1) { %>
                <span class="tag">门店已验车</span>
            <% } %>
            <% if (item.condition_id > 0) { %>
                <span class="tag">车况已检测</span>
            <% } %>
        </p>
        </div>
        <p class="price">
            <% if (item.is_sold == 1) { %>
            （已下架）
            <% } else { %>
            <strong><%= item.price %></strong>万
            <% } %>
        </p>
        <div class="mark icon1">
            <% if (item.is_seven == 1) { %>
            <p><a href="http://www.273.cn/static/seven.html" title="该车支持7天无理由退车服务" target="_blank"><i class="i-sev"></i>7天无理由退车</a></p>
            <% } %>
            <% if (item.free_check == 1) { %>
            <p><a href="http://ckb.273.cn/" title="该车已经过车况宝检测" target="_blank"><i class="i-free"></i>免费车况检测</a></p>
            <% } %>
            <% if (item.installment_car == 1) { %>
            <p><a href="http://dk.273.cn/" title="该车可享受分期购车服务" target="_blank"><i class="i-dk"></i>分期购车</a></p>
            <% } %>
        </div>
    </div>
</li>

<% } %>
