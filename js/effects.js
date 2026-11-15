/* NullClient premium polish — 15 steel-grade touches.
   All of it degrades gracefully: reduced-motion gets stillness, touch gets no tilt/spotlight. */
(function () {
	"use strict";

	var reduceMotion = false;
	try { reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (err) { }
	var finePointer = false;
	try { finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches; } catch (err) { }

	/* ---------- 2 · preloader: steel mark, quick fade ---------- */
	var pre = document.querySelector(".xc-preloader");
	if (pre) {
		var boot = document.documentElement.className.indexOf("xc-boot") >= 0;
		var kill = function () {
			pre.classList.add("xc-gone");
			setTimeout(function () { if (pre.parentNode) { pre.parentNode.removeChild(pre); } }, 500);
		};
		if (document.readyState === "complete") {
			setTimeout(kill, 250);
		} else {
			window.addEventListener("load", function () { setTimeout(kill, 250); });
		}
		if (!boot) { kill(); } // no boot class: never block the page
	}

	/* ---------- 1 · scroll progress bar ---------- */
	var bar = document.createElement("div");
	bar.className = "xc-progress";
	document.body.appendChild(bar);
	var setBar = function () {
		var h = document.documentElement;
		var max = h.scrollHeight - h.clientHeight;
		var y = window.pageYOffset || 0;
		bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
	};
	window.addEventListener("scroll", setBar, { passive: true });
	window.addEventListener("resize", setBar);
	setBar();

	/* ---------- 3 · reveal on scroll ---------- */
	var revealTargets = [].slice.call(document.querySelectorAll(".block, .card, .theme-card, .stat, .hero > div"));
	if ("IntersectionObserver" in window && !reduceMotion) {
		revealTargets.forEach(function (el) { el.classList.add("xc-reveal"); });
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (e.isIntersecting) {
					e.target.classList.add("xc-in");
					io.unobserve(e.target);
				}
			});
		}, { threshold: 0.12 });
		revealTargets.forEach(function (el) { io.observe(el); });
	}

	/* ---------- 4 · animated stat counters ---------- */
	var stats = [].slice.call(document.querySelectorAll("[data-count]"));
	var runCounter = function (el) {
		var end = parseInt(el.getAttribute("data-count"), 10) || 0;
		var suffix = el.getAttribute("data-suffix") || "";
		if (reduceMotion) { el.textContent = end.toLocaleString() + suffix; return; }
		var t0 = null, DUR = 1400;
		var step = function (t) {
			if (!t0) { t0 = t; }
			var p = Math.min((t - t0) / DUR, 1);
			var eased = 1 - Math.pow(1 - p, 3);
			el.textContent = Math.round(end * eased).toLocaleString() + suffix;
			if (p < 1) { requestAnimationFrame(step); }
		};
		requestAnimationFrame(step);
	};
	if ("IntersectionObserver" in window) {
		var cio = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (e.isIntersecting) {
					runCounter(e.target);
					cio.unobserve(e.target);
				}
			});
		}, { threshold: 0.4 });
		stats.forEach(function (el) { cio.observe(el); });
	} else {
		stats.forEach(runCounter);
	}

	/* ---------- 5 · 3d tilt on cards ---------- */
	if (finePointer && !reduceMotion) {
		[].slice.call(document.querySelectorAll(".card")).forEach(function (card) {
			card.addEventListener("mousemove", function (e) {
				var r = card.getBoundingClientRect();
				var px = (e.clientX - r.left) / r.width - 0.5;
				var py = (e.clientY - r.top) / r.height - 0.5;
				card.style.transform = "perspective(700px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 5).toFixed(2) + "deg) translateY(-3px)";
			});
			card.addEventListener("mouseleave", function () { card.style.transform = ""; });
		});
	}

	/* ---------- 6 · hero spotlight follows the mouse ---------- */
	var hero = document.querySelector(".hero");
	if (hero && finePointer && !reduceMotion) {
		hero.classList.add("xc-spot");
		hero.addEventListener("mousemove", function (e) {
			var r = hero.getBoundingClientRect();
			hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
			hero.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
		});
	}

	/* ---------- 7 · magnetic buttons + brand ---------- */
	if (finePointer && !reduceMotion) {
		[].slice.call(document.querySelectorAll(".btn, .brand")).forEach(function (el) {
			el.addEventListener("mousemove", function (e) {
				var r = el.getBoundingClientRect();
				var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
				var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
				el.style.transform = "translate(" + (dx * 5).toFixed(1) + "px," + (dy * 4).toFixed(1) + "px)";
			});
			el.addEventListener("mouseleave", function () { el.style.transform = ""; });
		});
	}

	/* ---------- 8 · click ripple on buttons ---------- */
	if (!reduceMotion) {
		document.addEventListener("click", function (e) {
			var btn = e.target.closest ? e.target.closest(".btn, .tbtn") : null;
			if (!btn) { return; }
			var r = btn.getBoundingClientRect();
			var s = document.createElement("span");
			s.className = "xc-ripple";
			s.style.left = (e.clientX - r.left) + "px";
			s.style.top = (e.clientY - r.top) + "px";
			btn.appendChild(s);
			s.addEventListener("animationend", function () { if (s.parentNode) { s.parentNode.removeChild(s); } });
		});
	}

	/* ---------- 10 · back-to-top floating button ---------- */
	var top = document.createElement("button");
	top.className = "xc-top";
	top.type = "button";
	top.innerHTML = "&#9650;";
	top.setAttribute("aria-label", "back to top");
	top.addEventListener("click", function () {
		window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
	});
	document.body.appendChild(top);
	var setTop = function () {
		top.classList.toggle("xc-show", (window.pageYOffset || 0) > 600);
	};
	window.addEventListener("scroll", setTop, { passive: true });
	setTop();

	/* ---------- 15 · typed "null" easter egg: steel hardcore ---------- */
	var typed = "";
	var toast = null;
	var showToast = function (text) {
		if (toast && toast.parentNode) { toast.parentNode.removeChild(toast); }
		toast = document.createElement("div");
		toast.className = "xc-toast";
		toast.textContent = text;
		document.body.appendChild(toast);
		setTimeout(function () { toast.classList.add("xc-toast-out"); }, 2200);
		setTimeout(function () { if (toast && toast.parentNode) { toast.parentNode.removeChild(toast); } }, 2700);
	};
	document.addEventListener("keydown", function (e) {
		if (e.key && e.key.length === 1) {
			typed = (typed + e.key.toLowerCase()).slice(-4);
			if (typed === "null") {
				var on = document.documentElement.classList.toggle("xc-hardcore");
				showToast(on ? "steel mode: max" : "steel mode: normal");
				typed = "";
			}
		}
	});
})();
