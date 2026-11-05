/* NullClient theme switcher — persists in localStorage, applied to both pages. */
(function () {
	var KEY = "nullclient-theme";
	var code = function (t) {
		document.documentElement.setAttribute("data-theme", t);
		document.querySelectorAll("[data-head-to]").forEach(function (b) {
			var on = b.getAttribute("data-head-to") === t;
			b.classList.toggle("active", on);
			if (b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", on);
		});
	};
	document.addEventListener("click", function (e) {
		var b = e.target.closest("[data-head-to]");
		if (b) code(b.getAttribute("data-head-to"));
	});
	var saved = null;
	try { saved = localStorage.getItem(KEY); } catch (err) { /* ignore */ }
	code(saved || "femboy");
	// remember changes
	new MutationObserver(function () {
		try { localStorage.setItem(KEY, document.documentElement.getAttribute("data-theme")); } catch (err) { /* ignore */ }
	}).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
