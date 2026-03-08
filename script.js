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
        slider.style.background = `linear-gradient(to right, var(--gold) ${pct}%, var(--border) ${pct}%)`;
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

    // === DCF CALCULATOR ===
    function initDCFCalculator() {
        const fmt = (n) => {
            if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
            if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
            return '$' + n.toFixed(1) + 'M';
        };
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
                projections.push({ year: i, revenue: rev, ebitda, df, pv });
            }

            // Terminal value
            let tv = 0, pvTv = 0, evDisplay = '', subText = '';
            if (wacc <= tgr) {
                evDisplay = 'N/A';
                subText = 'WACC must exceed terminal growth rate';
            } else {
                const lastEbitda = projections[projections.length - 1].ebitda;
                tv = lastEbitda * (1 + tgr) / (wacc - tgr);
                const dfTv = 1 / Math.pow(1 + wacc, years);
                pvTv = tv * dfTv;
                const ev = pvSum + pvTv;
                evDisplay = fmt(ev);
                const tvPct = ((pvTv / ev) * 100).toFixed(0);
                subText = `${tvPct}% from terminal value`;
            }

            // Update hero
            document.getElementById('dcf-ev').textContent = evDisplay;
            document.getElementById('dcf-ev-sub').textContent = subText;

            // Breakdown
            const breakdown = document.getElementById('dcf-breakdown');
            if (wacc <= tgr) {
                breakdown.innerHTML = '<div class="dcf-breakdown-item"><span class="label">Invalid: WACC ≤ Terminal Growth</span><span class="val">N/A</span></div>';
            } else {
                breakdown.innerHTML = `
                    <div class="dcf-breakdown-item"><span class="label">PV of Projected EBITDA</span><span class="val">${fmtM(pvSum)}</span></div>
                    <div class="dcf-breakdown-item"><span class="label">PV of Terminal Value</span><span class="val">${fmtM(pvTv)}</span></div>
                    <div class="dcf-breakdown-item"><span class="label">Terminal Value (undiscounted)</span><span class="val">${fmtM(tv)}</span></div>
                `;
            }

            // Bar chart
            const chartEl = document.getElementById('dcf-bar-chart');
            const allPVs = projections.map(p => p.pv);
            if (wacc > tgr) allPVs.push(pvTv);
            const maxPV = Math.max(...allPVs, 1);

            let barsHtml = '';
            projections.forEach(p => {
                const hPct = Math.max((p.pv / maxPV) * 100, 2);
                barsHtml += `<div class="dcf-bar-wrap">
                    <span class="dcf-bar-val">${fmtM(p.pv)}</span>
                    <div class="dcf-bar" style="height:${hPct}%"></div>
                    <span class="dcf-bar-label">Y${p.year}</span>
                </div>`;
            });
            if (wacc > tgr) {
                const hPct = Math.max((pvTv / maxPV) * 100, 2);
                barsHtml += `<div class="dcf-bar-wrap">
                    <span class="dcf-bar-val">${fmtM(pvTv)}</span>
                    <div class="dcf-bar terminal" style="height:${hPct}%"></div>
                    <span class="dcf-bar-label">TV</span>
                </div>`;
            }
            chartEl.innerHTML = barsHtml;

            // Table
            const tbody = document.querySelector('#dcf-table tbody');
            let rows = '';
            projections.forEach(p => {
                rows += `<tr>
                    <td>Year ${p.year}</td>
                    <td>${fmtM(p.revenue)}</td>
                    <td>${fmtM(p.ebitda)}</td>
                    <td>${p.df.toFixed(4)}</td>
                    <td>${fmtM(p.pv)}</td>
                </tr>`;
            });
            if (wacc > tgr) {
                rows += `<tr class="total-row">
                    <td>Terminal</td>
                    <td>—</td>
                    <td>${fmtM(tv)}</td>
                    <td>${(1 / Math.pow(1 + wacc, years)).toFixed(4)}</td>
                    <td>${fmtM(pvTv)}</td>
                </tr>`;
            }
            tbody.innerHTML = rows;
        }

        setupSlider('dcf-revenue', 'dcf-revenue-val', v => v, calculate);
        setupSlider('dcf-growth', 'dcf-growth-val', v => v + '%', calculate);
        setupSlider('dcf-margin', 'dcf-margin-val', v => v + '%', calculate);
        setupSlider('dcf-wacc', 'dcf-wacc-val', v => v + '%', calculate);
        setupSlider('dcf-tgr', 'dcf-tgr-val', v => v + '%', calculate);
        setupSlider('dcf-years', 'dcf-years-val', v => v, calculate);
    }

    // === PPA VISUALIZER ===
    function initPPAVisualizer() {
        const assets = [
            { id: 'ppa-customers', label: 'Customer Relationships', color: '#5b8af5' },
            { id: 'ppa-tradename', label: 'Trade Name', color: '#a78bfa' },
            { id: 'ppa-tech', label: 'Developed Technology', color: '#34d399' },
            { id: 'ppa-noncompete', label: 'Non-Compete', color: '#f97316' },
            { id: 'ppa-backlog', label: 'Backlog / Other', color: '#f472b6' },
        ];

        function calculate() {
            const total = parseFloat(document.getElementById('ppa-total').value);
            let allocated = 0;
            const values = [];
            assets.forEach(a => {
                const v = parseFloat(document.getElementById(a.id).value);
                allocated += v;
                values.push({ ...a, value: v });
            });
            const goodwill = total - allocated;

            // Goodwill display
            const gwDisplay = document.getElementById('ppa-goodwill-display');
            const gwVal = document.getElementById('ppa-goodwill-val');
            gwVal.textContent = '$' + goodwill.toFixed(0) + 'M';
            if (goodwill < 0) {
                gwDisplay.classList.add('bargain');
                gwVal.insertAdjacentHTML('afterend', '');
                // Check if warning already exists
                let warn = gwDisplay.querySelector('.warning');
                if (!warn) {
                    warn = document.createElement('div');
                    warn.className = 'warning';
                    gwDisplay.appendChild(warn);
                }
                warn.textContent = 'Bargain purchase — gain recognised in earnings';
            } else {
                gwDisplay.classList.remove('bargain');
                const warn = gwDisplay.querySelector('.warning');
                if (warn) warn.remove();
            }

            // Waterfall SVG
            drawWaterfall(total, values, goodwill);

            // Summary table
            const tbody = document.querySelector('#ppa-summary-table tbody');
            let rows = '';
            values.forEach(v => {
                const pct = total > 0 ? ((v.value / total) * 100).toFixed(1) : '0.0';
                rows += `<tr>
                    <td><span class="color-dot" style="background:${v.color}"></span>${v.label}</td>
                    <td>$${v.value.toFixed(0)}</td>
                    <td>${pct}%</td>
                </tr>`;
            });
            const gwPct = total > 0 ? ((goodwill / total) * 100).toFixed(1) : '0.0';
            rows += `<tr>
                <td><span class="color-dot" style="background:var(--gold-dark)"></span>Goodwill</td>
                <td>$${goodwill.toFixed(0)}</td>
                <td>${gwPct}%</td>
            </tr>`;
            tbody.innerHTML = rows;
        }

        function drawWaterfall(total, values, goodwill) {
            const svg = document.getElementById('ppa-waterfall');
            const w = 700, h = 320;
            const padding = { top: 30, right: 20, bottom: 50, left: 20 };
            const chartW = w - padding.left - padding.right;
            const chartH = h - padding.top - padding.bottom;

            const items = [
                { label: 'Purchase Price', value: total, color: '#4ade80', type: 'total' },
                ...values.map(v => ({ label: v.label, value: v.value, color: v.color, type: 'sub' })),
                { label: 'Goodwill', value: Math.max(goodwill, 0), color: 'var(--gold-dark)', type: 'residual' }
            ];

            const n = items.length;
            const barW = Math.min(chartW / n * 0.65, 70);
            const gap = (chartW - barW * n) / (n + 1);

            const maxVal = Math.max(total, 1);
            const scale = chartH / maxVal;

            let svgContent = '';
            let runningTop = 0;

            items.forEach((item, i) => {
                const x = padding.left + gap + i * (barW + gap);
                let barH, y;

                if (item.type === 'total') {
                    barH = item.value * scale;
                    y = padding.top + (chartH - barH);
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

                svgContent += `<rect class="ppa-waterfall-bar" x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="${item.color}" opacity="0.85"/>`;

                // Connector lines between bars
                if (i > 0 && i < n) {
                    const prevX = padding.left + gap + (i - 1) * (barW + gap) + barW;
                    const lineY = item.type === 'sub' ? y : runningTop;
                    svgContent += `<line x1="${prevX}" y1="${item.type === 'residual' ? y : y}" x2="${x}" y2="${item.type === 'residual' ? y : y}" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3,3" opacity="0.4"/>`;
                }

                // Value label
                const valY = item.type === 'total' ? y - 6 : y - 6;
                svgContent += `<text x="${x + barW / 2}" y="${Math.max(valY, 12)}" text-anchor="middle" fill="var(--text-secondary)" font-family="var(--font-mono)" font-size="10">$${item.value.toFixed(0)}M</text>`;

                // Bottom label
                const labelLines = item.label.split(' ');
                const labelY = padding.top + chartH + 16;
                if (labelLines.length <= 2) {
                    svgContent += `<text x="${x + barW / 2}" y="${labelY}" text-anchor="middle" fill="var(--text-muted)" font-size="9">${labelLines[0]}</text>`;
                    if (labelLines[1]) {
                        svgContent += `<text x="${x + barW / 2}" y="${labelY + 12}" text-anchor="middle" fill="var(--text-muted)" font-size="9">${labelLines.slice(1).join(' ')}</text>`;
                    }
                } else {
                    svgContent += `<text x="${x + barW / 2}" y="${labelY}" text-anchor="middle" fill="var(--text-muted)" font-size="9">${labelLines[0]}</text>`;
                    svgContent += `<text x="${x + barW / 2}" y="${labelY + 12}" text-anchor="middle" fill="var(--text-muted)" font-size="9">${labelLines.slice(1).join(' ')}</text>`;
                }
            });

            svg.innerHTML = svgContent;
        }

        setupSlider('ppa-total', 'ppa-total-val', v => v, calculate);
        assets.forEach(a => {
            setupSlider(a.id, a.id + '-val', v => v, calculate);
        });
    }

    // === BLACK-SCHOLES CALCULATOR ===
    function initBlackScholes() {
        // Normal CDF approximation (Abramowitz & Stegun)
        function normCDF(x) {
            const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
            const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
            const sign = x < 0 ? -1 : 1;
            x = Math.abs(x) / Math.SQRT2;
            const t = 1.0 / (1.0 + p * x);
            const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
            return 0.5 * (1.0 + sign * y);
        }

        function normPDF(x) {
            return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
        }

        function bsCalc(S, K, T, r, sigma) {
            if (T <= 0 || sigma <= 0) {
                const intrinsicCall = Math.max(S - K * Math.exp(-r * T), 0);
                const intrinsicPut = Math.max(K * Math.exp(-r * T) - S, 0);
                return { call: intrinsicCall, put: intrinsicPut, d1: 0, d2: 0, delta: S > K ? 1 : 0, gamma: 0, theta: 0, vega: 0, rho: 0 };
            }
            const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
            const d2 = d1 - sigma * Math.sqrt(T);
            const call = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
            const put = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);

            // Greeks (for call)
            const delta = normCDF(d1);
            const gamma = normPDF(d1) / (S * sigma * Math.sqrt(T));
            const theta = (-(S * normPDF(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normCDF(d2)) / 365;
            const vega = S * normPDF(d1) * Math.sqrt(T) / 100; // per 1% move
            const rho = K * T * Math.exp(-r * T) * normCDF(d2) / 100; // per 1% move

            return { call, put, d1, d2, delta, gamma, theta, vega, rho };
        }

        function calculate() {
            const S = parseFloat(document.getElementById('bs-spot').value);
            const K = parseFloat(document.getElementById('bs-strike').value);
            const T = parseFloat(document.getElementById('bs-time').value);
            const r = parseFloat(document.getElementById('bs-rate').value) / 100;
            const sigma = parseFloat(document.getElementById('bs-vol').value) / 100;

            const res = bsCalc(S, K, T, r, sigma);

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
            const svg = document.getElementById('bs-payoff');
            const w = 600, h = 280;
            const pad = { top: 20, right: 30, bottom: 40, left: 50 };
            const cw = w - pad.left - pad.right;
            const ch = h - pad.top - pad.bottom;

            const sMin = Math.max(K * 0.5, 1);
            const sMax = K * 1.5;
            const steps = 100;
            const sStep = (sMax - sMin) / steps;

            // Compute call and put values
            const callPts = [], putPts = [];
            let maxVal = 0, minVal = 0;
            for (let i = 0; i <= steps; i++) {
                const s = sMin + i * sStep;
                const c = bsCalc(s, K, T, r, sigma);
                const callPayoff = c.call;
                const putPayoff = c.put;
                callPts.push({ s, v: callPayoff });
                putPts.push({ s, v: putPayoff });
                maxVal = Math.max(maxVal, callPayoff, putPayoff);
                minVal = Math.min(minVal, callPayoff, putPayoff);
            }

            // Also show intrinsic payoff
            maxVal = Math.max(maxVal, sMax - K, K - sMin);
            const range = maxVal - minVal || 1;

            const xScale = (s) => pad.left + ((s - sMin) / (sMax - sMin)) * cw;
            const yScale = (v) => pad.top + ch - ((v - minVal) / range) * ch;

            let svg_content = '';

            // Grid lines
            const yZero = yScale(0);
            svg_content += `<line x1="${pad.left}" y1="${yZero}" x2="${w - pad.right}" y2="${yZero}" stroke="var(--text-muted)" stroke-width="0.5" opacity="0.3"/>`;

            // Strike line
            const xStrike = xScale(K);
            svg_content += `<line x1="${xStrike}" y1="${pad.top}" x2="${xStrike}" y2="${h - pad.bottom}" stroke="var(--gold)" stroke-width="1" stroke-dasharray="5,5" opacity="0.5"/>`;
            svg_content += `<text x="${xStrike}" y="${h - pad.bottom + 18}" text-anchor="middle" fill="var(--gold)" font-size="10" font-family="var(--font-mono)">K=$${K}</text>`;

            // Call curve
            let callPath = `M ${xScale(callPts[0].s)} ${yScale(callPts[0].v)}`;
            callPts.forEach((p, i) => { if (i > 0) callPath += ` L ${xScale(p.s)} ${yScale(p.v)}`; });
            svg_content += `<path d="${callPath}" fill="none" stroke="#4ade80" stroke-width="2.5" opacity="0.9"/>`;

            // Put curve
            let putPath = `M ${xScale(putPts[0].s)} ${yScale(putPts[0].v)}`;
            putPts.forEach((p, i) => { if (i > 0) putPath += ` L ${xScale(p.s)} ${yScale(p.v)}`; });
            svg_content += `<path d="${putPath}" fill="none" stroke="#f87171" stroke-width="2.5" opacity="0.9"/>`;

            // Current spot marker
            const xSpot = xScale(S);
            if (S >= sMin && S <= sMax) {
                svg_content += `<circle cx="${xSpot}" cy="${yScale(res.call)}" r="4" fill="#4ade80"/>`;
                svg_content += `<circle cx="${xSpot}" cy="${yScale(res.put)}" r="4" fill="#f87171"/>`;
            }

            // Legend
            svg_content += `<circle cx="${pad.left + 10}" cy="${pad.top + 8}" r="4" fill="#4ade80"/>`;
            svg_content += `<text x="${pad.left + 20}" y="${pad.top + 12}" fill="var(--text-secondary)" font-size="10">Call</text>`;
            svg_content += `<circle cx="${pad.left + 60}" cy="${pad.top + 8}" r="4" fill="#f87171"/>`;
            svg_content += `<text x="${pad.left + 70}" y="${pad.top + 12}" fill="var(--text-secondary)" font-size="10">Put</text>`;

            // Y-axis labels
            const yTicks = 5;
            for (let i = 0; i <= yTicks; i++) {
                const val = minVal + (range * i / yTicks);
                const y = yScale(val);
                svg_content += `<text x="${pad.left - 6}" y="${y + 3}" text-anchor="end" fill="var(--text-muted)" font-size="9" font-family="var(--font-mono)">${val.toFixed(0)}</text>`;
                svg_content += `<line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" stroke="var(--text-muted)" stroke-width="0.3" opacity="0.2"/>`;
            }

            // X-axis label
            svg_content += `<text x="${w / 2}" y="${h - 4}" text-anchor="middle" fill="var(--text-muted)" font-size="10">Spot Price</text>`;

            svg.innerHTML = svg_content;
        }

        function drawHeatmap(S, K, T, r, sigma) {
            const container = document.getElementById('bs-heatmap');
            const spotSteps = 9;
            const volSteps = 7;
            const spotRange = [];
            const volRange = [];

            const spotMin = Math.max(K * 0.7, 1);
            const spotMax = K * 1.3;
            for (let i = 0; i < spotSteps; i++) {
                spotRange.push(spotMin + (spotMax - spotMin) * i / (spotSteps - 1));
            }
            const volMin = Math.max(sigma * 0.4, 0.05);
            const volMax = Math.min(sigma * 2.0, 1.5);
            for (let i = 0; i < volSteps; i++) {
                volRange.push(volMin + (volMax - volMin) * i / (volSteps - 1));
            }

            // Compute all values to find min/max for color scaling
            const grid = [];
            let minC = Infinity, maxC = -Infinity;
            for (let vi = 0; vi < volSteps; vi++) {
                const row = [];
                for (let si = 0; si < spotSteps; si++) {
                    const c = bsCalc(spotRange[si], K, T, r, volRange[vi]).call;
                    row.push(c);
                    if (c < minC) minC = c;
                    if (c > maxC) maxC = c;
                }
                grid.push(row);
            }

            const cols = spotSteps + 1; // +1 for row labels
            container.style.gridTemplateColumns = `40px repeat(${spotSteps}, 1fr)`;

            let html = '';
            // Header row
            html += '<div class="bs-heatmap-cell bs-heatmap-header">S\\σ</div>';
            for (let si = 0; si < spotSteps; si++) {
                html += `<div class="bs-heatmap-cell bs-heatmap-header">${spotRange[si].toFixed(0)}</div>`;
            }

            // Data rows
            for (let vi = volSteps - 1; vi >= 0; vi--) {
                html += `<div class="bs-heatmap-cell bs-heatmap-row-label">${(volRange[vi] * 100).toFixed(0)}%</div>`;
                for (let si = 0; si < spotSteps; si++) {
                    const val = grid[vi][si];
                    const range = maxC - minC || 1;
                    const t = (val - minC) / range;
                    // Interpolate from dark (#1a1525) to gold (#C9A84C)
                    const rr = Math.round(26 + t * (201 - 26));
                    const gg = Math.round(21 + t * (168 - 21));
                    const bb = Math.round(37 + t * (76 - 37));
                    const textColor = t > 0.5 ? '#08090f' : '#f0ece4';
                    html += `<div class="bs-heatmap-cell" style="background:rgb(${rr},${gg},${bb});color:${textColor}">${val.toFixed(1)}</div>`;
                }
            }

            container.innerHTML = html;
        }

        setupSlider('bs-spot', 'bs-spot-val', v => '$' + v, calculate);
        setupSlider('bs-strike', 'bs-strike-val', v => '$' + v, calculate);
        setupSlider('bs-time', 'bs-time-val', v => parseFloat(v).toFixed(2), calculate);
        setupSlider('bs-rate', 'bs-rate-val', v => v + '%', calculate);
        setupSlider('bs-vol', 'bs-vol-val', v => v + '%', calculate);
    }

    // Initialize all calculators
    initDCFCalculator();
    initPPAVisualizer();
    initBlackScholes();

});
