/* ===================================
   SAKSHI LAL — Portfolio Scripts
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 1800);
    });

    // Fallback: hide preloader after 3s regardless
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 3000);

    // --- Cursor Glow (desktop only) ---
    const cursorGlow = document.getElementById('cursorGlow');
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // --- Navigation ---
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const ticker = document.getElementById('ticker');

    // Scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Nav background
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Ticker visibility
        if (scrollY > 100) {
            ticker.classList.add('visible');
        } else {
            ticker.classList.remove('visible');
        }

        lastScroll = scrollY;
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinkEls.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // --- Duplicate ticker content for seamless loop ---
    const tickerContent = document.getElementById('tickerContent');
    if (tickerContent) {
        tickerContent.innerHTML += tickerContent.innerHTML;
    }

    // --- Scroll Reveal ---
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // --- Skill Bars Animation ---
    const skillItems = document.querySelectorAll('.skill-list li');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    skillItems.forEach(item => skillObserver.observe(item));

    // --- Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            if (isDecimal) {
                el.textContent = current.toFixed(2);
            } else {
                el.textContent = Math.round(current);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (isDecimal) {
                    el.textContent = target.toFixed(2);
                } else {
                    el.textContent = target;
                }
            }
        }

        requestAnimationFrame(update);
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Nav Dropdown (touch devices) ---
    const navDropdown = document.getElementById('navDropdown');
    if (navDropdown) {
        const toggle = navDropdown.querySelector('.nav-dropdown-toggle');
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navDropdown.classList.toggle('open');
            toggle.setAttribute('aria-expanded', navDropdown.classList.contains('open'));
        });
        document.addEventListener('click', (e) => {
            if (!navDropdown.contains(e.target)) {
                navDropdown.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
        // Close dropdown when a link inside is clicked
        navDropdown.querySelectorAll('.nav-dropdown-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navDropdown.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                // Also close mobile nav if open
                navToggle.classList.remove('open');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Slider fill utility ---
    function updateSliderFill(slider) {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        const pct = ((val - min) / (max - min)) * 100;
        slider.style.background = 'linear-gradient(to right, #C9A84C ' + pct + '%, rgba(201,168,76,0.1) ' + pct + '%)';
    }

    function setupSlider(id, displayId, formatter, onChange) {
        const slider = document.getElementById(id);
        const display = document.getElementById(displayId);
        if (!slider || !display) return;
        const update = () => {
            display.textContent = formatter(slider.value);
            updateSliderFill(slider);
            if (onChange) onChange();
        };
        slider.addEventListener('input', update);
        update();
    }

    // Helper: render SVG content into a wrapper div (reliable cross-browser)
    function renderSvg(wrapperId, viewBox, content) {
        const wrap = document.getElementById(wrapperId);
        if (!wrap) return;
        wrap.innerHTML = '<svg viewBox="' + viewBox + '" style="width:100%;display:block">' + content + '</svg>';
    }

    // === DCF CALCULATOR ===
    function initDCFCalculator() {
        const fmtM = (n) => '$' + n.toFixed(1) + 'M';

        function calculate() {
            const revenue = parseFloat(document.getElementById('dcf-revenue').value);
            const growth = parseFloat(document.getElementById('dcf-growth').value) / 100;
            const margin = parseFloat(document.getElementById('dcf-margin').value) / 100;
            const wacc = parseFloat(document.getElementById('dcf-wacc').value) / 100;
            const tgr = parseFloat(document.getElementById('dcf-tgr').value) / 100;
            const years = parseInt(document.getElementById('dcf-years').value);

            const projections = [];
            let pvSum = 0;

            for (let i = 1; i <= years; i++) {
                const rev = revenue * Math.pow(1 + growth, i);
                const ebitda = rev * margin;
                const df = 1 / Math.pow(1 + wacc, i);
                const pv = ebitda * df;
                pvSum += pv;
                projections.push({ year: i, revenue: rev, ebitda: ebitda, df: df, pv: pv });
            }

            // Terminal value
            var tv = 0, pvTv = 0, evDisplay = '', subText = '';
            if (wacc <= tgr) {
                evDisplay = 'N/A';
                subText = 'WACC must exceed terminal growth rate';
            } else {
                var lastEbitda = projections[projections.length - 1].ebitda;
                tv = lastEbitda * (1 + tgr) / (wacc - tgr);
                var dfTv = 1 / Math.pow(1 + wacc, years);
                pvTv = tv * dfTv;
                var ev = pvSum + pvTv;
                if (ev >= 1000) {
                    evDisplay = '$' + (ev / 1000).toFixed(2) + 'B';
                } else {
                    evDisplay = '$' + ev.toFixed(1) + 'M';
                }
                var tvPct = ((pvTv / ev) * 100).toFixed(0);
                subText = tvPct + '% from terminal value';
            }

            // Update hero
            document.getElementById('dcf-ev').textContent = evDisplay;
            document.getElementById('dcf-ev-sub').textContent = subText;

            // Breakdown
            var breakdown = document.getElementById('dcf-breakdown');
            if (wacc <= tgr) {
                breakdown.innerHTML = '<div class="dcf-breakdown-item"><span class="label">Invalid: WACC \u2264 Terminal Growth</span><span class="val">N/A</span></div>';
            } else {
                breakdown.innerHTML =
                    '<div class="dcf-breakdown-item"><span class="label">PV of Projected EBITDA</span><span class="val">' + fmtM(pvSum) + '</span></div>' +
                    '<div class="dcf-breakdown-item"><span class="label">PV of Terminal Value</span><span class="val">' + fmtM(pvTv) + '</span></div>' +
                    '<div class="dcf-breakdown-item"><span class="label">Terminal Value (undiscounted)</span><span class="val">' + fmtM(tv) + '</span></div>';
            }

            // Bar chart
            var chartEl = document.getElementById('dcf-bar-chart');
            var allPVs = projections.map(function(p) { return p.pv; });
            if (wacc > tgr) allPVs.push(pvTv);
            var maxPV = Math.max.apply(null, allPVs.concat([1]));

            var barsHtml = '';
            projections.forEach(function(p) {
                var hPct = Math.max((p.pv / maxPV) * 100, 2);
                barsHtml += '<div class="dcf-bar-wrap">' +
                    '<span class="dcf-bar-val">' + fmtM(p.pv) + '</span>' +
                    '<div class="dcf-bar" style="height:' + hPct + '%"></div>' +
                    '<span class="dcf-bar-label">Y' + p.year + '</span>' +
                    '</div>';
            });
            if (wacc > tgr) {
                var hPct = Math.max((pvTv / maxPV) * 100, 2);
                barsHtml += '<div class="dcf-bar-wrap">' +
                    '<span class="dcf-bar-val">' + fmtM(pvTv) + '</span>' +
                    '<div class="dcf-bar terminal" style="height:' + hPct + '%"></div>' +
                    '<span class="dcf-bar-label">TV</span>' +
                    '</div>';
            }
            chartEl.innerHTML = barsHtml;

            // Table
            var tbody = document.querySelector('#dcf-table tbody');
            var rows = '';
            projections.forEach(function(p) {
                rows += '<tr><td>Year ' + p.year + '</td><td>' + fmtM(p.revenue) + '</td><td>' + fmtM(p.ebitda) + '</td><td>' + p.df.toFixed(4) + '</td><td>' + fmtM(p.pv) + '</td></tr>';
            });
            if (wacc > tgr) {
                rows += '<tr class="total-row"><td>Terminal</td><td>\u2014</td><td>' + fmtM(tv) + '</td><td>' + (1 / Math.pow(1 + wacc, years)).toFixed(4) + '</td><td>' + fmtM(pvTv) + '</td></tr>';
            }
            tbody.innerHTML = rows;
        }

        setupSlider('dcf-revenue', 'dcf-revenue-val', function(v) { return v; }, calculate);
        setupSlider('dcf-growth', 'dcf-growth-val', function(v) { return v + '%'; }, calculate);
        setupSlider('dcf-margin', 'dcf-margin-val', function(v) { return v + '%'; }, calculate);
        setupSlider('dcf-wacc', 'dcf-wacc-val', function(v) { return v + '%'; }, calculate);
        setupSlider('dcf-tgr', 'dcf-tgr-val', function(v) { return v + '%'; }, calculate);
        setupSlider('dcf-years', 'dcf-years-val', function(v) { return v; }, calculate);
    }

    // === PPA VISUALIZER ===
    function initPPAVisualizer() {
        var assets = [
            { id: 'ppa-customers', label: 'Customer Relationships', color: '#5b8af5' },
            { id: 'ppa-tradename', label: 'Trade Name', color: '#a78bfa' },
            { id: 'ppa-tech', label: 'Developed Technology', color: '#34d399' },
            { id: 'ppa-noncompete', label: 'Non-Compete', color: '#f97316' },
            { id: 'ppa-backlog', label: 'Backlog / Other', color: '#f472b6' }
        ];

        function calculate() {
            var total = parseFloat(document.getElementById('ppa-total').value);
            var allocated = 0;
            var values = [];
            assets.forEach(function(a) {
                var v = parseFloat(document.getElementById(a.id).value);
                allocated += v;
                values.push({ id: a.id, label: a.label, color: a.color, value: v });
            });
            var goodwill = total - allocated;

            // Goodwill display
            var gwDisplay = document.getElementById('ppa-goodwill-display');
            var gwVal = document.getElementById('ppa-goodwill-val');
            gwVal.textContent = '$' + goodwill.toFixed(0) + 'M';
            if (goodwill < 0) {
                gwDisplay.classList.add('bargain');
                var warn = gwDisplay.querySelector('.warning');
                if (!warn) {
                    warn = document.createElement('div');
                    warn.className = 'warning';
                    gwDisplay.appendChild(warn);
                }
                warn.textContent = 'Bargain purchase \u2014 gain recognised in earnings';
            } else {
                gwDisplay.classList.remove('bargain');
                var warn = gwDisplay.querySelector('.warning');
                if (warn) warn.remove();
            }

            // Waterfall SVG
            drawWaterfall(total, values, goodwill);

            // Summary table
            var tbody = document.querySelector('#ppa-summary-table tbody');
            var rows = '';
            values.forEach(function(v) {
                var pct = total > 0 ? ((v.value / total) * 100).toFixed(1) : '0.0';
                rows += '<tr><td><span class="color-dot" style="background:' + v.color + '"></span>' + v.label + '</td><td>$' + v.value.toFixed(0) + '</td><td>' + pct + '%</td></tr>';
            });
            var gwPct = total > 0 ? ((goodwill / total) * 100).toFixed(1) : '0.0';
            rows += '<tr><td><span class="color-dot" style="background:#9e832e"></span>Goodwill</td><td>$' + goodwill.toFixed(0) + '</td><td>' + gwPct + '%</td></tr>';
            tbody.innerHTML = rows;
        }

        function drawWaterfall(total, values, goodwill) {
            var w = 700, h = 320;
            var pad = { top: 30, right: 20, bottom: 50, left: 20 };
            var chartW = w - pad.left - pad.right;
            var chartH = h - pad.top - pad.bottom;

            var items = [{ label: 'Purchase Price', value: total, color: '#4ade80', type: 'total' }];
            values.forEach(function(v) {
                items.push({ label: v.label, value: v.value, color: v.color, type: 'sub' });
            });
            items.push({ label: 'Goodwill', value: Math.max(goodwill, 0), color: '#9e832e', type: 'residual' });

            var n = items.length;
            var barW = Math.min(chartW / n * 0.65, 70);
            var gap = (chartW - barW * n) / (n + 1);
            var maxVal = Math.max(total, 1);
            var scale = chartH / maxVal;

            var s = '';
            var runningTop = 0;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var x = pad.left + gap + i * (barW + gap);
                var barH, y;

                if (item.type === 'total') {
                    barH = item.value * scale;
                    y = pad.top + (chartH - barH);
                    runningTop = y;
                } else if (item.type === 'sub') {
                    barH = item.value * scale;
                    y = runningTop;
                    runningTop = y + barH;
                } else {
                    barH = Math.max(item.value, 0) * scale;
                    y = runningTop;
                }
                barH = Math.max(barH, 1);

                s += '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + barH + '" rx="3" fill="' + item.color + '" opacity="0.85"/>';

                // Connector line
                if (i > 0) {
                    var prevX = pad.left + gap + (i - 1) * (barW + gap) + barW;
                    s += '<line x1="' + prevX + '" y1="' + y + '" x2="' + x + '" y2="' + y + '" stroke="#5e5b6a" stroke-width="1" stroke-dasharray="3,3" opacity="0.4"/>';
                }

                // Value label
                var valY = Math.max(y - 6, 12);
                s += '<text x="' + (x + barW / 2) + '" y="' + valY + '" text-anchor="middle" fill="#9a96a6" font-size="10" font-family="JetBrains Mono,monospace">$' + item.value.toFixed(0) + 'M</text>';

                // Bottom label
                var labelParts = item.label.split(' ');
                var labelY = pad.top + chartH + 16;
                s += '<text x="' + (x + barW / 2) + '" y="' + labelY + '" text-anchor="middle" fill="#5e5b6a" font-size="9">' + labelParts[0] + '</text>';
                if (labelParts.length > 1) {
                    s += '<text x="' + (x + barW / 2) + '" y="' + (labelY + 12) + '" text-anchor="middle" fill="#5e5b6a" font-size="9">' + labelParts.slice(1).join(' ') + '</text>';
                }
            }

            renderSvg('ppa-waterfall-wrap', '0 0 700 320', s);
        }

        setupSlider('ppa-total', 'ppa-total-val', function(v) { return v; }, calculate);
        assets.forEach(function(a) {
            setupSlider(a.id, a.id + '-val', function(v) { return v; }, calculate);
        });
    }

    // === BLACK-SCHOLES CALCULATOR ===
    function initBlackScholes() {
        // Normal CDF approximation (Abramowitz & Stegun)
        function normCDF(x) {
            var a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
            var a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
            var sign = x < 0 ? -1 : 1;
            x = Math.abs(x) / Math.SQRT2;
            var t = 1.0 / (1.0 + p * x);
            var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
            return 0.5 * (1.0 + sign * y);
        }

        function normPDF(x) {
            return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
        }

        function bsCalc(S, K, T, r, sigma) {
            if (T <= 0 || sigma <= 0) {
                var ic = Math.max(S - K * Math.exp(-r * Math.max(T, 0)), 0);
                var ip = Math.max(K * Math.exp(-r * Math.max(T, 0)) - S, 0);
                return { call: ic, put: ip, d1: 0, d2: 0, delta: S > K ? 1 : 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
            }
            var d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
            var d2 = d1 - sigma * Math.sqrt(T);
            var callVal = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
            var putVal = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);

            var delta = normCDF(d1);
            var gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));
            var theta = (-(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normCDF(d2)) / 365;
            var vega = S * normPDF(d1) * Math.sqrt(T) / 100;
            var rho = K * T * Math.exp(-r * T) * normCDF(d2) / 100;

            return { call: callVal, put: putVal, d1: d1, d2: d2, delta: delta, gamma: gamma, theta: theta, vega: vega, rho: rho };
        }

        function calculate() {
            var S = parseFloat(document.getElementById('bs-spot').value);
            var K = parseFloat(document.getElementById('bs-strike').value);
            var T = parseFloat(document.getElementById('bs-time').value);
            var r = parseFloat(document.getElementById('bs-rate').value) / 100;
            var sigma = parseFloat(document.getElementById('bs-vol').value) / 100;

            var res = bsCalc(S, K, T, r, sigma);

            document.getElementById('bs-call-price').textContent = '$' + res.call.toFixed(2);
            document.getElementById('bs-put-price').textContent = '$' + res.put.toFixed(2);
            document.getElementById('bs-delta').textContent = res.delta.toFixed(4);
            document.getElementById('bs-gamma').textContent = res.gamma.toFixed(4);
            document.getElementById('bs-theta').textContent = res.theta.toFixed(4);
            document.getElementById('bs-vega').textContent = res.vega.toFixed(4);
            document.getElementById('bs-rho').textContent = res.rho.toFixed(4);

            drawPayoff(S, K, T, r, sigma, res);
            drawHeatmap(S, K, T, r, sigma);
        }

        function drawPayoff(S, K, T, r, sigma, res) {
            var w = 600, h = 280;
            var pad = { top: 20, right: 30, bottom: 40, left: 50 };
            var cw = w - pad.left - pad.right;
            var ch = h - pad.top - pad.bottom;

            var sMin = Math.max(K * 0.5, 1);
            var sMax = K * 1.5;
            var steps = 100;
            var sStep = (sMax - sMin) / steps;

            var callPts = [], putPts = [];
            var maxVal = 0, minVal = 0;
            for (var i = 0; i <= steps; i++) {
                var sp = sMin + i * sStep;
                var c = bsCalc(sp, K, T, r, sigma);
                callPts.push({ s: sp, v: c.call });
                putPts.push({ s: sp, v: c.put });
                maxVal = Math.max(maxVal, c.call, c.put);
                minVal = Math.min(minVal, c.call, c.put);
            }

            maxVal = Math.max(maxVal, sMax - K, K - sMin);
            var range = maxVal - minVal || 1;

            function xScale(s) { return pad.left + ((s - sMin) / (sMax - sMin)) * cw; }
            function yScale(v) { return pad.top + ch - ((v - minVal) / range) * ch; }

            var svg = '';

            // Zero line
            svg += '<line x1="' + pad.left + '" y1="' + yScale(0) + '" x2="' + (w - pad.right) + '" y2="' + yScale(0) + '" stroke="#5e5b6a" stroke-width="0.5" opacity="0.3"/>';

            // Strike line
            var xK = xScale(K);
            svg += '<line x1="' + xK + '" y1="' + pad.top + '" x2="' + xK + '" y2="' + (h - pad.bottom) + '" stroke="#C9A84C" stroke-width="1" stroke-dasharray="5,5" opacity="0.5"/>';
            svg += '<text x="' + xK + '" y="' + (h - pad.bottom + 18) + '" text-anchor="middle" fill="#C9A84C" font-size="10" font-family="JetBrains Mono,monospace">K=$' + K + '</text>';

            // Call curve
            var callD = 'M ' + xScale(callPts[0].s) + ' ' + yScale(callPts[0].v);
            for (var i = 1; i < callPts.length; i++) {
                callD += ' L ' + xScale(callPts[i].s) + ' ' + yScale(callPts[i].v);
            }
            svg += '<path d="' + callD + '" fill="none" stroke="#4ade80" stroke-width="2.5" opacity="0.9"/>';

            // Put curve
            var putD = 'M ' + xScale(putPts[0].s) + ' ' + yScale(putPts[0].v);
            for (var i = 1; i < putPts.length; i++) {
                putD += ' L ' + xScale(putPts[i].s) + ' ' + yScale(putPts[i].v);
            }
            svg += '<path d="' + putD + '" fill="none" stroke="#f87171" stroke-width="2.5" opacity="0.9"/>';

            // Spot markers
            if (S >= sMin && S <= sMax) {
                svg += '<circle cx="' + xScale(S) + '" cy="' + yScale(res.call) + '" r="4" fill="#4ade80"/>';
                svg += '<circle cx="' + xScale(S) + '" cy="' + yScale(res.put) + '" r="4" fill="#f87171"/>';
            }

            // Legend
            svg += '<circle cx="' + (pad.left + 10) + '" cy="' + (pad.top + 8) + '" r="4" fill="#4ade80"/>';
            svg += '<text x="' + (pad.left + 20) + '" y="' + (pad.top + 12) + '" fill="#9a96a6" font-size="10">Call</text>';
            svg += '<circle cx="' + (pad.left + 60) + '" cy="' + (pad.top + 8) + '" r="4" fill="#f87171"/>';
            svg += '<text x="' + (pad.left + 70) + '" y="' + (pad.top + 12) + '" fill="#9a96a6" font-size="10">Put</text>';

            // Y-axis
            for (var i = 0; i <= 5; i++) {
                var val = minVal + (range * i / 5);
                var yy = yScale(val);
                svg += '<text x="' + (pad.left - 6) + '" y="' + (yy + 3) + '" text-anchor="end" fill="#5e5b6a" font-size="9" font-family="JetBrains Mono,monospace">' + val.toFixed(0) + '</text>';
                svg += '<line x1="' + pad.left + '" y1="' + yy + '" x2="' + (w - pad.right) + '" y2="' + yy + '" stroke="#5e5b6a" stroke-width="0.3" opacity="0.2"/>';
            }

            // X-axis label
            svg += '<text x="' + (w / 2) + '" y="' + (h - 4) + '" text-anchor="middle" fill="#5e5b6a" font-size="10">Spot Price</text>';

            renderSvg('bs-payoff-wrap', '0 0 600 280', svg);
        }

        function drawHeatmap(S, K, T, r, sigma) {
            var container = document.getElementById('bs-heatmap');
            var spotSteps = 9, volSteps = 7;
            var spotRange = [], volRange = [];

            var spotMin = Math.max(K * 0.7, 1);
            var spotMax = K * 1.3;
            for (var i = 0; i < spotSteps; i++) {
                spotRange.push(spotMin + (spotMax - spotMin) * i / (spotSteps - 1));
            }
            var volMin = Math.max(sigma * 0.4, 0.05);
            var volMax = Math.min(sigma * 2.0, 1.5);
            for (var i = 0; i < volSteps; i++) {
                volRange.push(volMin + (volMax - volMin) * i / (volSteps - 1));
            }

            var grid = [];
            var minC = Infinity, maxC = -Infinity;
            for (var vi = 0; vi < volSteps; vi++) {
                var row = [];
                for (var si = 0; si < spotSteps; si++) {
                    var c = bsCalc(spotRange[si], K, T, r, volRange[vi]).call;
                    row.push(c);
                    if (c < minC) minC = c;
                    if (c > maxC) maxC = c;
                }
                grid.push(row);
            }

            container.style.gridTemplateColumns = '40px repeat(' + spotSteps + ', 1fr)';

            var html = '<div class="bs-heatmap-cell bs-heatmap-header">S\\\u03C3</div>';
            for (var si = 0; si < spotSteps; si++) {
                html += '<div class="bs-heatmap-cell bs-heatmap-header">' + spotRange[si].toFixed(0) + '</div>';
            }

            for (var vi = volSteps - 1; vi >= 0; vi--) {
                html += '<div class="bs-heatmap-cell bs-heatmap-row-label">' + (volRange[vi] * 100).toFixed(0) + '%</div>';
                for (var si = 0; si < spotSteps; si++) {
                    var val = grid[vi][si];
                    var rng = maxC - minC || 1;
                    var t = (val - minC) / rng;
                    var rr = Math.round(26 + t * 175);
                    var gg = Math.round(21 + t * 147);
                    var bb = Math.round(37 + t * 39);
                    var tc = t > 0.5 ? '#08090f' : '#f0ece4';
                    html += '<div class="bs-heatmap-cell" style="background:rgb(' + rr + ',' + gg + ',' + bb + ');color:' + tc + '">' + val.toFixed(1) + '</div>';
                }
            }

            container.innerHTML = html;
        }

        setupSlider('bs-spot', 'bs-spot-val', function(v) { return '$' + v; }, calculate);
        setupSlider('bs-strike', 'bs-strike-val', function(v) { return '$' + v; }, calculate);
        setupSlider('bs-time', 'bs-time-val', function(v) { return parseFloat(v).toFixed(2); }, calculate);
        setupSlider('bs-rate', 'bs-rate-val', function(v) { return v + '%'; }, calculate);
        setupSlider('bs-vol', 'bs-vol-val', function(v) { return v + '%'; }, calculate);
    }

    // Initialize all calculators with error handling
    try { initDCFCalculator(); } catch(e) { console.error('DCF init error:', e); }
    try { initPPAVisualizer(); } catch(e) { console.error('PPA init error:', e); }
    try { initBlackScholes(); } catch(e) { console.error('BS init error:', e); }

});
