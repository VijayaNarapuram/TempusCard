(function(a) {
	a.fn.confirm = function(b) {
		if (typeof b === "undefined") {
			b = {}
		}
		this.click(function(c) {
			c.preventDefault();
			var d = a.extend({
				button : a(this)
			}, b);
			a.confirm(d, c)
		});
		return this
	};
	a.confirm = function(f, i) {
		if (a(".confirmation-modal").length > 0) {
			return
		}
		var j = {};
		if (f.button) {
			var b = {
				title : "title",
				text : "text",
				"confirm-button" : "confirmButton",
				"cancel-button" : "cancelButton",
				"confirm-button-class" : "confirmButtonClass",
				"cancel-button-class" : "cancelButtonClass",
				"dialog-class" : "dialogClass"
			};
			a.each(b, function(e, k) {
				var l = f.button.data(e);
				if (l) {
					j[k] = l
				}
			})
		}
		var g = a
				.extend(
						{},
						a.confirm.options,
						{
							confirm : function() {
								var e = i
										&& (("string" === typeof i && i) || (i.currentTarget && i.currentTarget.attributes.href.value));
								if (e) {
									if (f.post) {
										var k = a('<form method="post" class="hide" action="'
												+ e + '"></form>');
										a("body").append(k);
										k.submit()
									} else {
										window.location = e
									}
								}
							},
							cancel : function(e) {
							},
							button : null
						}, j, f);
		var c = "";
		if (g.title !== "") {
			c = '<div class="modal-header bg-primary no-border" style="padding:5px" "><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">'
					+ g.title + "</h4></div>"
		}
		var d = '<div class="confirmation-modal modal fade" tabindex="-1" role="dialog"><div class="'
				+ g.dialogClass
				+ '"><div class="modal-content">'
				+ c
				+ '<div class="modal-body">'
				+ g.text
				+ '</div><div class="modal-footer"><button class="cancel btn '
				+ g.cancelButtonClass
				+ '" type="button" data-dismiss="modal">'
				+ g.cancelButton
				+ '</button><button class="confirm btn '
				+ g.confirmButtonClass
				+ '" type="button" data-dismiss="modal">'
				+ g.confirmButton
				+ "</button></div></div></div></div>";
		var h = a(d);
		h.on("shown.bs.modal", function() {
			h.find(".btn-primary:first").focus()
		});
		h.on("hidden.bs.modal", function() {
			h.remove()
		});
		h.find(".confirm").click(function() {
			g.confirm(g.button)
		});
		h.find(".cancel").click(function() {
			g.cancel(g.button)
		});
		a("body").append(h);
		h.modal("show")
	};
	a.confirm.options = {
		text : "Are you sure?",
		title : "Confirm",
		confirmButton : "Yes",
		cancelButton : "No",
		post : false,
		confirmButtonClass : "btn-primary",
		cancelButtonClass : "btn-danger",
		dialogClass : "modal-dialog"
	}
})(jQuery);