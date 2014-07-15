<div class="shaixuan-page" id="brand_page">
    <h4>热门品牌</h4>
    <div class="row">
        <table cellspacing="1" id="hot_brand">
        <tbody>
            <% 
             var bodyStr = '';
             var trStr = '<tr>'; 
             for (var i = 0, l = hot_brand.length; i < l; i++) {
                trStr += '<td><a href="javascript:void(0);" data-273-click-log="/wap/list/choice@etype=click@choice=brand_'+hot_brand[i]['key']+'" data-brand-url="' + hot_brand[i]['key'] + '">' + hot_brand[i]['value'] + '</a></td>';
                if ((i+1) % 3 == 0) {
                    trStr += '</tr>';
                    bodyStr += trStr;
                    trStr = '<tr>';
                } else if (i == (hot_brand.length-1)) {
                    trStr += '<td><a href="javascript:void(0);">不限</a></td>';
                    trStr += '</tr>';
                    bodyStr += trStr;
                }
             }
            %>
            <%= bodyStr %>
        </tbody>
        </table>
    </div>
    <h4>按字母检索</h4>
    <div class="zimu">
        <table cellspacing="1">
        <tbody>
        <% 
         var bodyStr = '';
         var trStr = '<tr>'; 
         for (var i = 0, l = chars.length; i < l; i++) {
            trStr += '<td><a href="#brand_' + chars[i] + '">' + chars[i] + '</a></td>';
            if ((i+1) % 6 == 0) {
                trStr += '</tr>';
                bodyStr += trStr;
                trStr = '<tr>';
            } else if (i == (chars.length-1)) {
                var remainNum = 6 - (i+1) % 6;
                for (var j=0; j < remainNum ; j++) { 
                    trStr += "<td></td>";
                }
                trStr += '</tr>';
                bodyStr += trStr;
            }
         }
        %>
        <%= bodyStr %>
        </tbody>
        </table>
    </div>
    
    <% for (var i = 0, l = data.length; i < l; i++)  { %>
        <h4 id = "brand_<%= data[i]['char'] %>"><%= data[i]['char'] %> <span class="ml10 color-999">（以<%= data[i]['char'] %>为开头的品牌）</span></h4>
        <ul>
            <% for (var j = 0, k = data[i]['brands'].length; j < k; j++)  { %>
                <li>
                <a href="javascript:void(0)" data-273-click-log="/wap/list/choice@etype=click@choice=brand_<%= data[i]['brands'][j]['key'] %>" data-brand-url="<%= data[i]['brands'][j]['key'] %>"><%= data[i]['brands'][j]['value'] %></a>
                </li>
            <% } %>
        </ul>
    <% } %>
</div>