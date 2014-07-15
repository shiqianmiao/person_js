<li id="<%= id %>" class="js-ui-uploader-li <%= processStyle %>" style="width:<%= width %>px;height:<%= _height %>px;">
        <% if (coverStyle == 'v2') { %><span class="f">封面</span><% } %>
        <div class="js-ui-uploader-content">
            <span class="js-ui-uploader-percent" style="width:<%= width %>px;line-height:<%= height %>px;"><%= percent %></span>
            <div class="js-ui-uploader-error-msg"><%= msg %></div>
            <img src="<%= url %>" style="width:<%= width %>px;height:<%= height %>px;" data-url="<%= org_url %>">
            <div class="js-ui-uploader-edit-bar" <% if (!editAble) { %> style="display:none;" <% } %>>
                <a class="js-ui-uploader-rotate js-ui-uploader-left" href="javascript:void(0);" data-action="left">&nbsp;</a>
                <a class="js-ui-uploader-rotate js-ui-uploader-right" href="javascript:void(0);" data-action="right">&nbsp;</a>
                <a class="js-ui-uploader-edit" href="javascript:void(0);" data-action="<%= editAction%>">&nbsp;</a>
            </div>
            <div class="js-ui-uploader-bar" style="width:<%= width %>px;<%if (!editAble) {%>display:none;<%}%>">
                <a class="js-ui-uploader-move js-ui-uploader-right" href="javascript:void(0);" data-action="right">&nbsp;</a>
                <a class="js-ui-uploader-move js-ui-uploader-left" href="javascript:void(0);" data-action="left">&nbsp;</a>
                <a class="js-ui-uploader-status <%= statusStyle%>" href="javascript:void(0);" data-action="<%= coverAction%>"><%= status %></a>
            </div>
        </div>
        <a class="js-ui-uploader-close" href="javascript:void(0);" data-action="<%= closeAction%>">&nbsp;</a>
</li>
