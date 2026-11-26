// landing-profile.js - the "Your profile" section of the front page (2026-11-26). The profile itself lives in
// Utils/HubProfile.js (this browser's localStorage); this file is only the form and the three "what uses it" cards.
// Every address and name shown goes through esc() before it reaches innerHTML.
(function () {
    'use strict';
    const H = window.HubProfile;
    const $ = id => document.getElementById(id);
    if (!H || !$('hpForm')) return;
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const short = a => (a && a.length > 12 ? a.slice(0, 4) + '...' + a.slice(-4) : a || '');
    const num = v => (v || 0).toLocaleString('en-US');
    const plural = (n, one, many) => num(n) + ' ' + (n === 1 ? one : many);
    function ago(sec) {
        const s = Math.max(0, Math.round(Date.now() / 1000 - sec));
        if (s < 90) return 'just now';
        if (s < 5400) return Math.round(s / 60) + ' min ago';
        if (s < 172800) return Math.round(s / 3600) + ' h ago';
        return Math.round(s / 86400) + ' days ago';
    }
    const st = { c4: null, why: '', ready: false };

    function msg(text, cls) { const m = $('hpMsg'); m.textContent = text || ''; m.className = 'profile-msg' + (cls ? ' ' + cls : ''); m.hidden = !text; }

    function c4Card(p) {
        let body;
        if (!H.isSet(p)) body = 'Your fleets and claim stakes are drawn in their own colour on the map and marked in every list.';
        else if (!st.ready) body = 'Looking for your fleets...';
        else if (!st.c4) body = esc(st.why) || 'No C4 Live data in this browser yet.';
        else {
            const m = H.assets(st.c4, p);
            body = m.owners.length
                ? '<span class="mine">' + m.owners.map(o => esc(o.name || short(o.p))).join(', ') + '</span>: <b>' + plural(m.fleets.length, 'fleet', 'fleets') + '</b>, <b>' + plural(m.stakes.length, 'claim stake', 'claim stakes') + '</b>, ' + plural(m.stock.length, 'kind of cargo', 'kinds of cargo') + ' in the read of ' + esc(ago(m.at)) + '. They are marked on the map and in every list.'
                : 'No C4 player in the read of ' + esc(ago(m.at)) + ' matches this wallet or profile. The C4 game runs on another chain: open C4 Live, click your name and press <b>This is me</b>.';
        }
        return '<a class="profile-use" href="C4Live/index.html"><h3>C4 Live</h3><p>' + body + '</p></a>';
    }
    function render() {
        const p = H.get(), set = H.isSet(p);
        $('profile').classList.toggle('set', set);
        $('hpClear').hidden = !set;
        if (document.activeElement !== $('hpWallet')) $('hpWallet').value = p.wallet;
        if (document.activeElement !== $('hpProfile')) $('hpProfile').value = p.profile;
        const crew = set && (p.wallet || p.profile)
            ? 'Opens with ' + [p.wallet && 'wallet <b>' + esc(short(p.wallet)) + '</b>', p.profile && 'profile <b>' + esc(short(p.profile)) + '</b>'].filter(Boolean).join(' and ') + ' filled in: press Load crew.'
            : 'Your crew roster, from the wallet and from the crew deposited into SAGE.';
        const recipe = set ? 'The planner counts the cargo of your C4 fleets and claim stakes and shows what is covered and what is left to gather and craft.' : 'Plan a build against what you already hold in C4: what is covered, what is left.';
        $('hpUses').innerHTML = '<a class="profile-use" href="CrewExplorer/index.html"><h3>Crew Explorer</h3><p>' + crew + '</p></a>' + c4Card(p) +
            '<a class="profile-use" href="RecipeExplorer/index.html"><h3>Recipe Explorer</h3><p>' + recipe + '</p></a>';
    }

    $('hpForm').addEventListener('submit', ev => {
        ev.preventDefault();
        const input = { wallet: $('hpWallet').value, profile: $('hpProfile').value };
        const bad = H.problem(input);
        if (bad) return msg(bad, 'bad');
        const saved = H.update(input);
        if (!saved) return msg('This browser refused to save the profile (private mode or storage switched off).', 'bad');
        msg(H.isSet(saved) ? 'Saved in this browser.' : 'Nothing to save: enter a wallet, a player profile, or both.', H.isSet(saved) ? 'ok' : '');
    });
    $('hpClear').addEventListener('click', () => { H.clear(); $('hpWallet').value = ''; $('hpProfile').value = ''; msg('Profile forgotten on this browser.', ''); });
    H.onChange(render);
    render();
    H.loadC4('').then(r => { st.c4 = r.latest; st.why = r.why || ''; }, () => { st.why = 'The C4 Live data could not be read.'; }).then(() => { st.ready = true; render(); });
})();
