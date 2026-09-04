/**
 * FORECOURT WORKS LIMITED – Technical Service Work Order App
 * Progressive web form with auto-population, GPS, camera, signatures & PDF export
 */

(function () {
  'use strict';

  // ---------- State ----------
  const state = {
    currentStep: 0,
    totalSteps: 10,
    photos: [],          // {id, dataUrl, name}
    signatures: {},      // canvas id → dataUrl
    autoPopulated: false,
    pdfBlob: null,
    pdfFileName: ''
  };

  const LOGO_DATA_URL = 'data:image/png;base64,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';
  const sigPads = {};

  // ---------- Templates for auto-population ----------
  const TEMPLATES = {
    'Fuel Dispenser|Diagnosis & On-Site Corrective Repair + Calibration Verification': {
      hazards: [
        { hazard: 'Flammable fuel vapors / fire & explosion', risk: 'High', control: 'Continuous LEL monitoring; no ignition sources within 25 ft; fire extinguisher & spill kit staged; hot-work prohibited', verified: true },
        { hazard: 'Electrical energy (dispenser power)', risk: 'High', control: 'Lockout/Tagout of dispenser power supply; verified zero energy state before opening panels', verified: true },
        { hazard: 'Pressurized product lines', risk: 'Medium', control: 'Isolation of product supply where required; controlled depressurization; secondary containment monitored', verified: true },
        { hazard: 'Vehicle / public traffic on forecourt', risk: 'Medium', control: 'Work zone cones & barrier tape; high-visibility PPE; spotter during critical lifts', verified: true },
        { hazard: 'Manual handling / awkward postures', risk: 'Low-Med', control: 'Two-person lift for meter assembly; correct body mechanics; mechanical aids used where available', verified: true },
        { hazard: 'Slip / trip on wet or contaminated surfaces', risk: 'Medium', control: 'Immediate clean-up of any product; absorbent available; good housekeeping enforced', verified: true }
      ],
      safetyDeclaration: 'I confirm that the Job Hazard Analysis was completed, all identified controls were implemented, and the work area was verified safe before commencement of diagnostic and repair activities.',
      toolboxTime: '09:05',
      scopeSummary: 'The scope was limited to diagnosis of the reported volumetric over-issuance, identification of root cause, corrective action on the flowmetering system, post-repair calibration verification, and return of the dispenser to safe, accurate service. No additional work outside this scope was performed without client authorization.',
      scopeSteps: `1. Arrival briefing, site induction compliance, and completion of Job Hazard Analysis / Pre-Job Safety Checklist.
2. Isolation of electrical power and product supply to the dispenser under LOTO.
3. Visual and functional inspection of the diesel metering system, associated piping, filters, and electronic interfaces.
4. Quantitative verification of meter performance using approved volumetric proving / master meter methodology.
5. Diagnosis of root cause of the reported over-issuance.
6. Removal of the defective flowmeter assembly under controlled conditions.
7. Installation of new OEM-equivalent flowmeter, correct torque, seals, and orientation.
8. System reassembly, restoration of power and product, leak checks, and functional testing.
9. Post-repair calibration / accuracy verification to confirm performance within statutory and manufacturer tolerance.
10. Documentation of all findings, parts, test results, and recommendations; client handover.`,
      deliverables: `• Completed and signed Technical Service Work Order (this document)
• Photographic evidence of nameplate, as-found condition, removed component, installed component, and final condition
• Calibration / accuracy test results (before and after)
• Parts traceability records and warranty information
• Recommendations for ongoing reliability`,
      findingsArrival: 'The team arrived on site, reported to the Station Manager / Duty Supervisor, completed site induction requirements, and conducted a toolbox talk. The Job Hazard Analysis was completed and signed off. The dispenser was taken out of service, isolated under Lockout/Tagout, and a clear work zone was established.',
      findingsDiagnosis: 'Visual inspection revealed no external leakage at the meter or associated joints. The diesel filter was within service life and showed normal differential pressure. Electronic totalizer and pulser signals were present and coherent. A controlled volumetric accuracy test was performed using a certified prover / master meter method. Results confirmed the reported condition of volumetric over-issuance outside acceptable tolerance under Weights & Measures / metrology practice (typically ±0.25% to ±0.5% depending on jurisdiction and meter class).',
      findingsRootCause: 'Internal wear and loss of volumetric accuracy within the flowmeter measuring chamber was determined to be the primary cause. No evidence of unauthorized adjustment, electronic manipulation, or external interference was found. The meter had reached the end of its reliable service life for accurate fiscal measurement.',
      findingsAction: 'The existing flowmeter was carefully removed, tagged, and retained for client inspection if required. A new OEM-specification flowmeter was installed in accordance with manufacturer torque and orientation requirements. All sealing faces were cleaned and new seals fitted. The assembly was leak-tested under pressure. Electrical connections and pulser interface were verified. Power and product supply were restored under controlled conditions.',
      findingsVerification: 'After stabilization, a full series of accuracy tests was conducted across the normal operating flow range. The dispenser was confirmed to be operating within acceptable tolerance. Functional tests of the nozzle, interlock, emergency stop, and totalizer were satisfactory. The work area was restored to a clean and safe condition. The dispenser was formally returned to service after client representative acknowledgment.',
      qcIntro: 'All tests were performed using calibrated reference equipment traceable to national standards. Environmental conditions were within acceptable limits for metering work. Results are summarized below.',
      qcRows: [
        { test: 'Volumetric Accuracy – Diesel (mid flow)', asFound: '+0.60% over-issuance', asLeft: '+0.12% (within tolerance)', criterion: 'Typically ±0.25% to ±0.50%', result: 'PASS' },
        { test: 'Volumetric Accuracy – Diesel (low flow)', asFound: 'Consistent trend', asLeft: '+0.18%', criterion: 'Within applicable tolerance', result: 'PASS' },
        { test: 'Leak Test – Meter & Joints', asFound: 'No external leaks observed', asLeft: 'No leaks under pressure', criterion: 'Zero visible leakage', result: 'PASS' },
        { test: 'Pulser / Electronic Interface', asFound: 'Signal present & coherent', asLeft: 'Signal present & coherent', criterion: 'Stable, correct pulse count', result: 'PASS' },
        { test: 'Nozzle, Interlock & E-Stop Function', asFound: 'Functional', asLeft: 'Fully functional', criterion: 'Correct operation', result: 'PASS' },
        { test: 'Totalizer Continuity', asFound: 'Reading continuous', asLeft: 'Reading continuous & consistent', criterion: 'No loss of count', result: 'PASS' }
      ],
      qcConclusion: 'All critical quality control tests passed. The dispenser now meets the required accuracy and functional standards for safe return to commercial service. Calibration certificate / test record is retained in the job file and a copy is available to the client upon request.',
      parts: [
        { desc: 'Diesel Flowmeter Assembly (OEM-spec, compatible with Encore / equivalent platform) – complete with seals', qty: '1', status: 'New', vendor: 'Authorized Distributor', installDate: '', warrantyStart: '', warrantyEnd: '' },
        { desc: 'Meter seals / gasket kit (as required for installation)', qty: '1 set', status: 'New', vendor: 'Same as above', installDate: '', warrantyStart: '', warrantyEnd: '' }
      ],
      partsTrace: 'Removed flowmeter retained and tagged with Work Order number for client inspection or further analysis if required. New part serial number and batch details are recorded in the job file and on the photographic evidence pack. Warranty is subject to correct operation and exclusion of damage from misuse, contamination, or unauthorized adjustment.',
      recommendations: `1. Immediate: The dispenser has been returned to service within tolerance. Continue normal commercial operation.
2. Short-term (next 30–60 days): Monitor the newly installed meter for any drift or unusual noise/vibration. Report any anomaly immediately.
3. Preventive Maintenance: Include this dispenser in the next scheduled quarterly PM cycle. Particular attention should be paid to filter condition, pulser cleanliness, and verification of accuracy at least annually or as required by local Weights & Measures regulations.
4. Fleet-wide Opportunity: Consider a systematic accuracy audit of remaining diesel dispensers at this station and sister sites to identify any other meters approaching end-of-life accuracy limits. Proactive replacement prevents revenue loss from over-issuance and protects the client from under-delivery claims.
5. Record Keeping: This Work Order and associated calibration data should be retained in the site equipment history file for the life of the asset and for regulatory audit readiness.`,
      finalStatus: 'REPAIRED AND RETURNED TO SERVICE',
      finalStatusText: 'The diesel flowmeter has been successfully diagnosed, replaced, and verified. All quality control tests have been passed. The dispenser has been functionally tested, leak-checked, and is hereby declared REPAIRED AND RETURNED TO SERVICE in a safe, accurate, and commercially usable condition. The equipment is NOT locked out. It is released for normal customer fuelling operations under the supervision of the site operator.',
      techDeclaration: 'I, the undersigned Lead Technician, confirm that the work described herein was performed in accordance with the applicable Standard Operating Procedure, manufacturer guidelines, and all site safety requirements. All statements of fact are true and accurate to the best of my knowledge. The equipment has been left in a safe condition.',
      acceptanceText: `I, the undersigned authorized representative of the Client at this Station, acknowledge that:
• The work described in this Work Order has been explained to me.
• I have been given the opportunity to inspect the completed work and the photographic / test evidence.
• The dispenser has been returned to service in my presence (or with my knowledge).
• I accept the equipment back into operational control of the Station.
• Any outstanding recommendations have been noted for management attention.`
    }
  };

  // Generic fallback template
  const GENERIC = {
    hazards: [
      { hazard: 'Flammable fuel vapors / fire & explosion', risk: 'High', control: 'Continuous gas monitoring; ignition source control; fire extinguisher staged', verified: true },
      { hazard: 'Electrical energy', risk: 'High', control: 'LOTO applied and verified', verified: true },
      { hazard: 'Vehicle / public traffic', risk: 'Medium', control: 'Work zone barriers and high-visibility PPE', verified: true }
    ],
    safetyDeclaration: 'I confirm that the Job Hazard Analysis was completed and all controls were implemented before work commenced.',
    toolboxTime: '',
    scopeSummary: 'Scope limited to the work type selected and the equipment identified. All work performed under controlled conditions.',
    scopeSteps: '1. Site arrival, induction and toolbox talk.\n2. Isolation and LOTO where required.\n3. Diagnosis / inspection as applicable.\n4. Corrective or preventive actions.\n5. Testing and verification.\n6. Documentation and handover.',
    deliverables: '• Completed Work Order\n• Photos of work\n• Test / calibration results (if applicable)\n• Recommendations',
    findingsArrival: 'Team arrived, completed induction and toolbox talk. Work area established and equipment isolated as required.',
    findingsDiagnosis: 'Inspection and diagnosis performed as per applicable SOP.',
    findingsRootCause: 'Root cause determined from diagnostic findings.',
    findingsAction: 'Corrective / preventive actions completed.',
    findingsVerification: 'Functional and safety checks completed. Equipment returned to service or left in safe state as recorded.',
    qcIntro: 'Quality control checks performed with calibrated equipment where applicable.',
    qcRows: [
      { test: 'Visual / Functional Check', asFound: 'As found', asLeft: 'Satisfactory', criterion: 'Safe & functional', result: 'PASS' }
    ],
    qcConclusion: 'All required QC checks completed satisfactorily.',
    parts: [],
    partsTrace: 'Any removed components tagged and retained as required. New parts recorded with warranty information.',
    recommendations: '1. Continue normal operation.\n2. Include equipment in next scheduled PM cycle.\n3. Retain this Work Order in the site equipment history file.',
    finalStatus: 'REPAIRED AND RETURNED TO SERVICE',
    finalStatusText: 'Work completed. Equipment returned to service in a safe condition.',
    techDeclaration: 'I confirm the work was performed in accordance with applicable SOPs and safety requirements. The equipment has been left in a safe condition.',
    acceptanceText: `I acknowledge that:
• The work has been explained to me.
• I have had the opportunity to inspect the completed work.
• I accept the equipment back into operational control.
• Recommendations have been noted.`
  };

  // ---------- Helpers ----------
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function toast(msg, type = '') {
    const el = $('#toast');
    el.textContent = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    setTimeout(() => el.classList.remove('show'), 3200);
  }

  function showOverlay(text) {
    $('#overlay-text').textContent = text || 'Please wait…';
    $('#overlay').classList.add('show');
  }
  function hideOverlay() {
    $('#overlay').classList.remove('show');
  }

  function generateWONumber() {
    const now = new Date();
    const y = now.getFullYear();
    const r = String(Math.floor(Math.random() * 9000) + 1000);
    return `WO-${y}-${r}`;
  }

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function updateProgress() {
    const pct = ((state.currentStep + 1) / state.totalSteps) * 100;
    $('#progress-fill').style.width = pct + '%';
  }

  function showStep(n) {
    $$('.step-card').forEach(c => c.classList.remove('active'));
    const card = $(`#step-${n}`);
    if (card) card.classList.add('active');
    state.currentStep = n;
    updateProgress();
    $('#btn-prev').disabled = n === 0;
    $('#btn-next').style.display = n === 9 ? 'none' : 'inline-flex';
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- GPS ----------
  function getGPS() {
    const status = $('#gps-status');
    if (!navigator.geolocation) {
      status.textContent = 'Geolocation not supported on this device.';
      return;
    }
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        status.textContent = `Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        // Attempt reverse geocode via free OpenStreetMap Nominatim (no key required)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data.display_name) {
              $('#site-address').value = data.display_name;
              toast('Address filled from GPS', 'success');
            }
          }
        } catch (e) {
          $('#site-address').value = `Lat ${latitude.toFixed(5)}, Lon ${longitude.toFixed(5)} (reverse geocode unavailable)`;
          toast('Coordinates captured. Please refine address manually.');
        }
      },
      (err) => {
        status.textContent = 'Location access denied or unavailable.';
        toast('Could not get location. Enter address manually.', 'error');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  // ---------- Auto-populate ----------
  function getTemplateKey() {
    const cat = $('#equip-category').value;
    const wt = $('#work-type').value;
    return `${cat}|${wt}`;
  }

  function getTemplate() {
    const key = getTemplateKey();
    return TEMPLATES[key] || GENERIC;
  }

  function fillHazards(list) {
    const container = $('#hazards-container');
    container.innerHTML = '';
    list.forEach((h, i) => {
      const div = document.createElement('div');
      div.className = 'form-group';
      div.style.border = '1px solid var(--border)';
      div.style.padding = '10px';
      div.style.borderRadius = '8px';
      div.style.marginBottom = '8px';
      div.innerHTML = `
        <div class="row">
          <div class="form-group" style="margin:0">
            <label>Hazard</label>
            <input type="text" class="haz-hazard auto-filled" value="${escapeAttr(h.hazard)}" />
          </div>
          <div class="form-group" style="margin:0">
            <label>Risk</label>
            <select class="haz-risk auto-filled">
              <option ${h.risk==='High'?'selected':''}>High</option>
              <option ${h.risk==='Medium'?'selected':''}>Medium</option>
              <option ${h.risk==='Low-Med'?'selected':''}>Low-Med</option>
              <option ${h.risk==='Low'?'selected':''}>Low</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-top:8px;margin-bottom:0">
          <label>Control / Mitigation</label>
          <textarea class="haz-control auto-filled" rows="2">${escapeHtml(h.control)}</textarea>
        </div>
        <label class="check-item" style="margin-top:6px">
          <input type="checkbox" class="haz-verified" ${h.verified ? 'checked' : ''}> Verified
        </label>
      `;
      container.appendChild(div);
    });
  }

  function fillQC(rows) {
    const container = $('#qc-table-container');
    // Mandatory columns per correction plan: Item Name | Acceptance Criteria | Status (full text) | Remarks
    let html = `<table class="data-table"><thead><tr>
      <th>Item Name</th><th>Acceptance Criteria</th><th>Status</th><th>Remarks</th>
    </tr></thead><tbody>`;
    rows.forEach(r => {
      // Map legacy fields to new structure; auto-populate Item + Criteria
      const item = r.test || r.item || '';
      const criteria = r.criterion || r.criteria || r.asLeft || '';
      let status = (r.result || r.status || 'YES').toUpperCase();
      if (status === 'PASS' || status === 'Y' || status === 'OK') status = 'YES';
      if (status === 'FAIL' || status === 'N' || status === 'NC') status = 'NON CONFORMING';
      const remarks = r.remarks || r.asFound || '';
      html += `<tr>
        <td><input class="qc-item auto-filled" value="${escapeAttr(item)}" /></td>
        <td><input class="qc-criteria auto-filled" value="${escapeAttr(criteria)}" /></td>
        <td>
          <select class="qc-status auto-filled">
            <option value="YES" ${status==='YES'?'selected':''}>YES</option>
            <option value="NON CONFORMING" ${status==='NON CONFORMING'?'selected':''}>NON CONFORMING</option>
            <option value="N/A" ${status==='N/A'?'selected':''}>N/A</option>
          </select>
        </td>
        <td><input class="qc-remarks auto-filled" value="${escapeAttr(remarks)}" /></td>
      </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  function fillParts(parts) {
    const container = $('#parts-container');
    container.innerHTML = '';
    const today = todayISO();
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    const endDate = oneYear.toISOString().slice(0, 10);

    if (!parts.length) {
      container.innerHTML = '<p class="help">No parts auto-suggested. Add any parts used.</p>';
      return;
    }
    parts.forEach(p => {
      const div = document.createElement('div');
      div.style.border = '1px solid var(--border)';
      div.style.padding = '10px';
      div.style.borderRadius = '8px';
      div.style.marginBottom = '10px';
      div.innerHTML = `
        <div class="form-group"><label>Description</label>
          <input type="text" class="part-desc auto-filled" value="${escapeAttr(p.desc)}" /></div>
        <div class="row">
          <div class="form-group"><label>Qty</label>
            <input type="text" class="part-qty auto-filled" value="${escapeAttr(p.qty)}" /></div>
          <div class="form-group"><label>Status</label>
            <select class="part-status auto-filled">
              <option ${p.status==='New'?'selected':''}>New</option>
              <option ${p.status==='Reconditioned'?'selected':''}>Reconditioned</option>
              <option>Used</option>
            </select></div>
        </div>
        <div class="form-group"><label>Vendor / Source</label>
          <input type="text" class="part-vendor auto-filled" value="${escapeAttr(p.vendor)}" /></div>
        <div class="row">
          <div class="form-group"><label>Install Date</label>
            <input type="date" class="part-install auto-filled" value="${p.installDate || today}" /></div>
          <div class="form-group"><label>Warranty Start</label>
            <input type="date" class="part-wstart auto-filled" value="${p.warrantyStart || today}" /></div>
        </div>
        <div class="form-group"><label>Warranty End</label>
          <input type="date" class="part-wend auto-filled" value="${p.warrantyEnd || endDate}" /></div>
      `;
      container.appendChild(div);
    });
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function escapeAttr(s) {
    return String(s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function runAutoPopulate() {
    // Validate compulsory basics first
    const required = [
      ['client-name', 'Client name'],
      ['site-name', 'Site / Station'],
      ['site-address', 'Site address'],
      ['equip-id', 'Equipment ID'],
      ['equip-category', 'Equipment category'],
      ['equip-desc', 'Equipment description'],
      ['work-type', 'Work type'],
      ['reported-problem', 'Reported problem'],
      ['work-date', 'Date of work'],
      ['tech-lead', 'Lead Technician']
    ];
    for (const [id, label] of required) {
      const el = $(`#${id}`);
      if (!el || !el.value.trim()) {
        toast(`Please complete: ${label}`, 'error');
        el && el.focus();
        return false;
      }
    }

    // Generate WO number if empty
    {
      let num = $('#wo-number').value.trim();
      if (!num) {
        num = generateWONumber();
        $('#wo-number').value = num;
      }
      $('#wo-number-display').textContent = num;
    }
    $('#wo-date-display').textContent = $('#doc-date').value || todayISO();
    $('#wo-status-display').textContent = $('#wo-status').value;

    const t = getTemplate();
    const workDate = $('#work-date').value || todayISO();

    // Part B
    fillHazards(t.hazards);
    $('#toolbox-time').value = t.toolboxTime || '';
    $('#safety-declaration').value = t.safetyDeclaration;

    // Part C
    $('#scope-summary').value = t.scopeSummary;
    $('#scope-steps').value = t.scopeSteps;
    $('#deliverables').value = t.deliverables;

    // Part D – inject reported problem into diagnosis if present
    let diagnosis = t.findingsDiagnosis;
    const problem = $('#reported-problem').value;
    if (problem && diagnosis.indexOf(problem) === -1) {
      diagnosis = diagnosis.replace(
        'reported condition of volumetric over-issuance',
        `reported condition: "${problem}"`
      );
    }
    $('#findings-arrival').value = t.findingsArrival;
    $('#findings-diagnosis').value = diagnosis;
    $('#findings-rootcause').value = t.findingsRootCause;
    $('#findings-action').value = t.findingsAction;
    $('#findings-verification').value = t.findingsVerification;

    // Part E
    $('#qc-intro').value = t.qcIntro;
    fillQC(t.qcRows);
    $('#qc-conclusion').value = t.qcConclusion;

    // Part F
    fillParts(t.parts);
    $('#parts-traceability').value = t.partsTrace;

    // Part G
    $('#recommendations').value = t.recommendations;

    // Part H
    $('#final-status').value = t.finalStatus;
    $('#final-status-text').value = t.finalStatusText;
    $('#tech-declaration').value = t.techDeclaration;

    // Part I
    $('#acceptance-text').value = t.acceptanceText;
    $('#sig-tech-name').value = $('#tech-lead').value;
    $('#sig-tech-date').value = workDate;
    $('#sig-client-date').value = workDate;

    state.autoPopulated = true;
    toast('Technical sections auto-populated. Review each step and Confirm.', 'success');
    showStep(1);
    return true;
  }

  // ---------- Photos ----------
  function addPhotos(fileList) {
    Array.from(fileList).forEach(file => {
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const id = 'ph_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        state.photos.push({ id, dataUrl: e.target.result, name: file.name });
        renderPhotos();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderPhotos() {
    const grid = $('#photo-grid');
    grid.innerHTML = '';
    state.photos.forEach(p => {
      const div = document.createElement('div');
      div.className = 'photo-thumb';
      if (p.dataUrl.startsWith('data:image')) {
        div.innerHTML = `<img src="${p.dataUrl}" alt="${escapeAttr(p.name)}" /><button class="remove" data-id="${p.id}">×</button>`;
      } else {
        div.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:0.7rem;padding:4px;text-align:center;">${escapeHtml(p.name)}</div><button class="remove" data-id="${p.id}">×</button>`;
      }
      grid.appendChild(div);
    });
    grid.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', () => {
        state.photos = state.photos.filter(x => x.id !== btn.dataset.id);
        renderPhotos();
      });
    });
  }

  // ---------- Signatures ----------
  function initSignatures() {
    ['sig-tech', 'sig-assist', 'sig-client'].forEach(id => {
      const canvas = document.getElementById(id);
      if (!canvas) return;
      // Clear previous
      if (sigPads[id]) {
        try { sigPads[id].off(); } catch(e) {}
      }
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const w = canvas.offsetWidth || 300;
      const h = 150;
      canvas.width = w * ratio;
      canvas.height = h * ratio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      const ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      // White background for print
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      sigPads[id] = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255,255,255)',
        penColor: 'rgb(20,20,20)',
        minWidth: 1.2,
        maxWidth: 3.0
      });
    });
  }

  function clearSig(id) {
    if (sigPads[id]) sigPads[id].clear();
  }

  function getSigData(id) {
    if (!sigPads[id] || sigPads[id].isEmpty()) return null;
    try {
      const canvas = document.getElementById(id);
      if (!canvas) return sigPads[id].toDataURL('image/jpeg', 0.92);
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width;
      tmp.height = canvas.height;
      const ctx = tmp.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, tmp.width, tmp.height);
      ctx.drawImage(canvas, 0, 0);
      return tmp.toDataURL('image/jpeg', 0.92);
    } catch (e) {
      try { return sigPads[id].toDataURL('image/jpeg', 0.9); } catch (_) { return null; }
    }
  }

  // ---------- Validation for compulsory fields per step ----------
  function validateStep(step) {
    if (step === 0) return true; // handled in autofill
    if (step === 7) {
      if (!$('#final-status').value) {
        toast('Select final equipment status', 'error');
        return false;
      }
    }
    if (step === 8) {
      if (sigPads['sig-tech'] && sigPads['sig-tech'].isEmpty()) {
        toast('Lead Technician signature is required', 'error');
        return false;
      }
      if (!$('#client-rep-name').value.trim()) {
        toast('Site Representative name is required', 'error');
        return false;
      }
      if (sigPads['sig-client'] && sigPads['sig-client'].isEmpty()) {
        toast('Site Representative signature is required', 'error');
        return false;
      }
    }
    return true;
  }

  // ---------- Review summary ----------
  function buildReview() {
    const el = $('#review-summary');
    const wo = $('#wo-number').value;
    const client = $('#client-name').value;
    const site = $('#site-name').value;
    const equip = $('#equip-id').value + ' – ' + $('#equip-desc').value;
    const status = $('#final-status').value;
    el.innerHTML = `
      <div class="review-section"><h4>Header</h4>
        <div class="content"><strong>${wo}</strong> · ${$('#doc-date').value} · Status: ${$('#wo-status').value}</div></div>
      <div class="review-section"><h4>Client & Site</h4>
        <div class="content">${escapeHtml(client)} · ${escapeHtml(site)}<br/>${escapeHtml($('#site-address').value)}</div></div>
      <div class="review-section"><h4>Equipment</h4>
        <div class="content">${escapeHtml(equip)}<br/>Work: ${escapeHtml($('#work-type').value)}</div></div>
      <div class="review-section"><h4>Reported Problem</h4>
        <div class="content">${escapeHtml($('#reported-problem').value)}</div></div>
      <div class="review-section"><h4>Final Status</h4>
        <div class="content"><strong>${escapeHtml(status)}</strong></div></div>
      <div class="review-section"><h4>Technicians</h4>
        <div class="content">Lead: ${escapeHtml($('#tech-lead').value)}<br/>Assist: ${escapeHtml($('#tech-assist').value || '—')}</div></div>
      <div class="review-section"><h4>Photos attached</h4>
        <div class="content">${state.photos.length} file(s)</div></div>
      <div class="review-section"><h4>Signatures</h4>
        <div class="content">
          Tech: ${getSigData('sig-tech') ? '✓ Captured' : '✗ Missing'} ·
          Client: ${getSigData('sig-client') ? '✓ Captured' : '✗ Missing'}
        </div></div>
    `;
  }

  // ---------- PDF Generation ----------
  async function generatePDF() {
    showOverlay('Building professional PDF…');
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();   // 210
      const pageH = 297;
      const outer = 8;
      const inner = 10;
      const margin = 14;
      let y = 0;

      const navy   = [13, 71, 140];
      const accent = [217, 115, 13];
      const grey   = [90, 90, 90];
      const lightGrey = [245, 247, 250];
      const green  = [22, 120, 70];
      const red    = [180, 40, 40];

      /* ---------- Page frame (outer + inner boundary) ---------- */
      function drawPageFrame() {
        // Outer boundary – lighter weight
        doc.setDrawColor(...navy);
        doc.setLineWidth(0.35);
        doc.rect(outer, outer, pageW - outer * 2, pageH - outer * 2);
        // Inner boundary
        doc.setLineWidth(0.20);
        doc.rect(inner, inner, pageW - inner * 2, pageH - inner * 2);
      }

      /* ---------- Header (every page) ---------- */
      function drawHeader() {
        // White header band
        doc.setFillColor(255, 255, 255);
        doc.rect(inner, inner, pageW - inner * 2, 32, 'F');

        // Company address – left aligned
        doc.setTextColor(...navy);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('FORECOURT WORKS LTD', margin, 14.5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(40, 40, 40);
        doc.text('Ramco Court, Gate 3B, Bellevue, South C.', margin, 18.5);
        doc.text('Phone: +(254) 729-002-087', margin, 22.0);
        doc.text('Email: sales@forecourtworks.co.ke', margin, 25.5);

        // Logo – top right, properly sized, clear of boundaries
        const logoW = 42;
        const logoH = 7.5;
        const logoX = pageW - margin - logoW;
        const logoY = 12.0;
        try {
          doc.addImage(LOGO_DATA_URL, 'PNG', logoX, logoY, logoW, logoH);
        } catch (e) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(...navy);
          doc.text('FORECOURT-SWL™', logoX, logoY + 5);
        }

        // Document title – right aligned, two lines, under logo
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...navy);
        doc.text('WORK ORDER', pageW - margin, 22.5, { align: 'right' });
        doc.setFontSize(8);
        doc.text('COMPLETION & SIGN-OFF', pageW - margin, 26.5, { align: 'right' });

        // Thick horizontal rule under header content – terminates on inner boundaries
        doc.setDrawColor(...navy);
        doc.setLineWidth(0.9);
        doc.line(inner, 34.5, pageW - inner, 34.5);
      }

      /* ---------- Footer (every page) ---------- */
      function drawFooter(pageNum, pageCount) {
        // Content above inner boundary
        const footY = pageH - outer - 12;
        doc.setDrawColor(...navy);
        doc.setLineWidth(0.25);
        doc.line(inner, footY - 2, pageW - inner, footY - 2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.2);
        doc.setTextColor(...navy);
        doc.text('FSW | Technical Service Work Order – Completion & Sign-Off', margin, footY + 2);
        doc.text(`CONTROLLED DOCUMENT  |  ${$('#wo-number').value || 'WO'}  |  Rev 1.0  |  Page ${pageNum} of ${pageCount}`,
                 pageW - margin, footY + 2, { align: 'right' });

        // Tagline BELOW outer boundary – bold + italic, centred
        doc.setFont('helvetica', 'bolditalic');
        doc.setFontSize(6.5);
        doc.setTextColor(...navy);
        doc.text('Engineering Reliability into Every Forecourt', pageW / 2, pageH - 4.5, { align: 'center' });
      }

      /* ---------- Helpers ---------- */
      function checkPage(need) {
        if (y + need > pageH - outer - 18) {
          doc.addPage();
          drawPageFrame();
          drawHeader();
          y = 40;
        }
      }

      function sectionHeader(title, bgColor) {
        checkPage(11);
        const col = bgColor || navy;
        doc.setFillColor(...col);
        doc.rect(margin, y, pageW - margin * 2, 7.2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text(title, margin + 2.5, y + 4.9);
        y += 10;
        doc.setTextColor(30, 30, 30);
      }

      /* Field container: grey label | white value */
      function fieldBox(label, value, x, boxW, boxH) {
        // Label side (light grey)
        const labelW = boxW * 0.38;
        doc.setFillColor(...lightGrey);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.15);
        doc.rect(x, y, labelW, boxH, 'FD');
        // Value side (white)
        doc.setFillColor(255, 255, 255);
        doc.rect(x + labelW, y, boxW - labelW, boxH, 'FD');
        // Text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(...grey);
        const labLines = doc.splitTextToSize(label, labelW - 3);
        doc.text(labLines, x + 1.5, y + 3.8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(20, 20, 20);
        const valLines = doc.splitTextToSize(String(value || '—'), boxW - labelW - 3);
        doc.text(valLines, x + labelW + 1.5, y + 3.8);
      }

      /* True table with 15 % opacity borders */
      function drawTable(headers, rows, colWidths) {
        const rowH = 7.5;
        const headerH = 8;
        const tableW = colWidths.reduce((a, b) => a + b, 0);
        checkPage(headerH + rowH * Math.min(rows.length, 3) + 4);

        // Header
        doc.setFillColor(...navy);
        doc.rect(margin, y, tableW, headerH, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        let cx = margin;
        headers.forEach((h, i) => {
          doc.text(h, cx + 1.5, y + 5.2);
          cx += colWidths[i];
        });
        y += headerH;

        // Rows
        rows.forEach((row, rIdx) => {
          checkPage(rowH + 2);
          // Alternating fill
          if (rIdx % 2 === 0) {
            doc.setFillColor(252, 252, 253);
            doc.rect(margin, y, tableW, rowH, 'F');
          }
          // 15 % opacity borders (approx via light grey)
          doc.setDrawColor(180, 180, 185);
          doc.setLineWidth(0.12);
          doc.rect(margin, y, tableW, rowH);
          cx = margin;
          row.forEach((cell, i) => {
            doc.setDrawColor(180, 180, 185);
            doc.line(cx, y, cx, y + rowH);
            // Status colouring
            if (i === 2) { // Status column
              const s = String(cell).toUpperCase();
              if (s === 'YES' || s === 'PASS' || s === 'CONFORMING') {
                doc.setTextColor(...green);
                doc.setFont('helvetica', 'bold');
              } else if (s.includes('NON') || s === 'FAIL' || s === 'NO') {
                doc.setTextColor(...red);
                doc.setFont('helvetica', 'bold');
              } else {
                doc.setTextColor(30, 30, 30);
                doc.setFont('helvetica', 'normal');
              }
            } else {
              doc.setTextColor(30, 30, 30);
              doc.setFont('helvetica', 'normal');
            }
            doc.setFontSize(6.8);
            const txt = doc.splitTextToSize(String(cell || ''), colWidths[i] - 2.5);
            doc.text(txt, cx + 1.2, y + 4.8);
            cx += colWidths[i];
          });
          // closing right line
          doc.setDrawColor(180, 180, 185);
          doc.line(margin + tableW, y, margin + tableW, y + rowH);
          y += rowH;
        });
        y += 4;
      }

      /* ---------- Build document ---------- */
      drawPageFrame();
      drawHeader();
      y = 40;

      // Meta bar
      doc.setFillColor(232, 238, 247);
      doc.rect(margin, y, pageW - margin * 2, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...navy);
      doc.text(`WO: ${$('#wo-number').value || '—'}`, margin + 2, y + 4.8);
      doc.text(`Date: ${$('#doc-date').value || '—'}`, margin + 55, y + 4.8);
      doc.text(`Status: ${$('#wo-status').value || '—'}`, pageW - margin - 2, y + 4.8, { align: 'right' });
      y += 11;

      // ===== PART A – Field containers (3-column grid) =====
      sectionHeader('PART A — JOB & EQUIPMENT PARTICULARS', navy);
      const colW = (pageW - margin * 2 - 4) / 3;
      const boxH = 11;
      const gap = 2;

      // Row 1
      fieldBox('Client / Asset Owner', $('#client-name').value, margin, colW, boxH);
      fieldBox('Site / Station', $('#site-name').value, margin + colW + gap, colW, boxH);
      fieldBox('Site Contact', $('#site-contact').value, margin + 2 * (colW + gap), colW, boxH);
      y += boxH + gap;

      // Row 2
      fieldBox('Site Address', $('#site-address').value, margin, colW * 2 + gap, boxH);
      fieldBox('Equipment ID', $('#equip-id').value, margin + 2 * (colW + gap), colW, boxH);
      y += boxH + gap;

      // Row 3
      fieldBox('Equipment Description', $('#equip-desc').value, margin, colW, boxH);
      fieldBox('Manufacturer / Model', $('#equip-mfr').value, margin + colW + gap, colW, boxH);
      fieldBox('Serial Number', $('#equip-serial').value, margin + 2 * (colW + gap), colW, boxH);
      y += boxH + gap;

      // Row 4
      fieldBox('Product / Location', `${$('#product-handled').value || ''} | ${$('#equip-location').value || ''}`, margin, colW, boxH);
      fieldBox('Work Type', $('#work-type').value, margin + colW + gap, colW, boxH);
      fieldBox('Work Date', $('#work-date').value, margin + 2 * (colW + gap), colW, boxH);
      y += boxH + gap;

      // Reported problem full width
      fieldBox('Reported Problem', $('#reported-problem').value, margin, pageW - margin * 2, 14);
      y += 16;

      // Technicians
      fieldBox('Lead Technician', $('#tech-lead').value, margin, colW * 1.5 + gap, boxH);
      fieldBox('Assist Technician', $('#tech-assist').value, margin + colW * 1.5 + gap * 2, colW * 1.5, boxH);
      y += boxH + 6;

      // ===== PART B – JHA =====
      sectionHeader('PART B — JOB HAZARD ANALYSIS & MITIGATION', [40, 80, 130]);
      const hazNodes = Array.from(document.querySelectorAll('#hazards-container > div'));
      if (hazNodes.length) {
        const hazHeaders = ['Hazard', 'Risk', 'Verified', 'Control Measures'];
        const hazCols = [55, 22, 22, pageW - margin * 2 - 99];
        const hazRows = hazNodes.map(node => {
          const h = node.querySelector('.haz-hazard')?.value || node.querySelector('[data-hazard]')?.textContent || '';
          const r = node.querySelector('.haz-risk')?.value || '';
          const v = node.querySelector('.haz-verified')?.checked ? 'YES' : 'NO';
          const c = node.querySelector('.haz-control')?.value || '';
          return [h, r, v, c];
        });
        drawTable(hazHeaders, hazRows, hazCols);
      } else {
        doc.setFontSize(8);
        doc.text('No hazards recorded.', margin, y);
        y += 8;
      }

      // ===== PART C – Scope =====
      sectionHeader('PART C — SCOPE OF WORK & DELIVERABLES', [50, 90, 140]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...grey);
      doc.text('Scope Summary', margin, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(20, 20, 20);
      const scopeSum = doc.splitTextToSize($('#scope-summary').value || '—', pageW - margin * 2);
      checkPage(scopeSum.length * 4 + 4);
      doc.text(scopeSum, margin, y);
      y += scopeSum.length * 4 + 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...grey);
      doc.text('Scope Steps', margin, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(20, 20, 20);
      const steps = ($('#scope-steps').value || '').split('\n').filter(Boolean);
      steps.forEach(s => {
        checkPage(6);
        const lines = doc.splitTextToSize(s, pageW - margin * 2 - 2);
        doc.text(lines, margin, y);
        y += lines.length * 3.6 + 1.5;
      });
      y += 3;

      // ===== PART D – Work Done =====
      sectionHeader('PART D — SUMMARY OF WORK DONE AND FINDINGS', [60, 100, 150]);
      const findingsMap = [
        ['findings-arrival', 'Arrival & Preparation'],
        ['findings-diagnosis', 'As-Found & Diagnosis'],
        ['findings-rootcause', 'Root Cause'],
        ['findings-action', 'Corrective Action'],
        ['findings-verification', 'Post-Repair Verification']
      ];
      findingsMap.forEach(([id, label]) => {
        const el = document.getElementById(id);
        if (!el || !el.value) return;
        const labels = { [id]: label };
        checkPage(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...navy);
        doc.text(label, margin, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(25, 25, 25);
        const lines = doc.splitTextToSize(el.value, pageW - margin * 2);
        checkPage(lines.length * 3.6 + 4);
        doc.text(lines, margin, y);
        y += lines.length * 3.6 + 4;
      });

      // ===== PART E – QC Tables =====
      sectionHeader('PART E — QUALITY CONTROL TESTS AND RESULTS', [30, 100, 80]);
      const qcRows = [];
      document.querySelectorAll('#qc-table-container tbody tr').forEach(tr => {
        const item     = tr.querySelector('.qc-item')?.value || tr.querySelector('td:nth-child(1) input')?.value || '';
        const criteria = tr.querySelector('.qc-criteria')?.value || tr.querySelector('td:nth-child(2) input')?.value || '';
        let status     = tr.querySelector('.qc-status')?.value || tr.querySelector('td:nth-child(3) select')?.value || 'YES';
        status = String(status).toUpperCase();
        if (status === 'PASS' || status === 'Y' || status === 'OK') status = 'YES';
        if (status === 'FAIL' || status === 'N' || status === 'NC') status = 'NON CONFORMING';
        const remarks  = tr.querySelector('.qc-remarks')?.value || tr.querySelector('td:nth-child(4) input')?.value || '';
        if (item || criteria) qcRows.push([item, criteria, status, remarks]);
      });
      if (qcRows.length) {
        drawTable(
          ['Item Name', 'Acceptance Criteria', 'Status', 'Remarks'],
          qcRows,
          [48, 55, 32, pageW - margin * 2 - 135]
        );
      } else {
        doc.setFontSize(8);
        doc.text('No QC tests recorded.', margin, y);
        y += 8;
      }

      // ===== PART F – Parts =====
      sectionHeader('PART F — LIST OF SPARE PARTS USED', [100, 70, 40]);
      const partRows = [];
      document.querySelectorAll('#parts-container > div').forEach(node => {
        const desc = node.querySelector('.part-desc')?.value || '';
        const qty  = node.querySelector('.part-qty')?.value || '1';
        const cond = node.querySelector('.part-status')?.value || node.querySelector('.part-cond')?.value || 'New';
        const vendor = node.querySelector('.part-vendor')?.value || '';
        const installed = node.querySelector('.part-install')?.value || node.querySelector('.part-installed')?.value || '';
        const warranty = node.querySelector('.part-wend')?.value || node.querySelector('.part-warranty')?.value || '';
        if (desc) partRows.push([desc, qty, cond, vendor, installed, warranty]);
      });
      if (partRows.length) {
        drawTable(
          ['Part Description', 'Qty', 'Condition', 'Vendor', 'Installed', 'Warranty'],
          partRows,
          [58, 12, 22, 35, 28, pageW - margin * 2 - 155]
        );
      } else {
        doc.setFontSize(8);
        doc.text('No spare parts used.', margin, y);
        y += 8;
      }

      // ===== PART G – Recommendations =====
      sectionHeader('PART G — TECHNICIAN\'S RECOMMENDATIONS', [80, 60, 120]);
      const recs = ($('#recommendations').value || '').split('\n').filter(Boolean);
      recs.forEach((r, i) => {
        checkPage(8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(25, 25, 25);
        const lines = doc.splitTextToSize(`${i + 1}. ${r.replace(/^\d+\.\s*/, '')}`, pageW - margin * 2 - 2);
        doc.text(lines, margin, y);
        y += lines.length * 3.6 + 2;
      });
      y += 3;

      // ===== PART H – Final Status =====
      sectionHeader('PART H — EQUIPMENT FINAL STATUS', [26, 115, 70]);
      const statusVal = $('#final-status').value || 'REPAIRED AND RETURNED TO SERVICE';
      const statusTxt = $('#final-status-text').value || '';
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(...green);
      doc.setLineWidth(0.5);
      const stLines = doc.splitTextToSize(statusTxt, pageW - margin * 2 - 6);
      const boxHeight = Math.max(14, stLines.length * 3.8 + 10);
      checkPage(boxHeight + 6);
      doc.roundedRect(margin, y, pageW - margin * 2, boxHeight, 1.5, 1.5, 'FD');
      doc.setTextColor(...green);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(statusVal, margin + 3, y + 5.5);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(stLines, margin + 3, y + 10);
      y += boxHeight + 6;

      if ($('#tech-declaration').value) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...grey);
        doc.text('Technician Declaration', margin, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(25, 25, 25);
        const decLines = doc.splitTextToSize($('#tech-declaration').value, pageW - margin * 2);
        checkPage(decLines.length * 3.6 + 4);
        doc.text(decLines, margin, y);
        y += decLines.length * 3.6 + 5;
      }

      // ===== SIGNATURES =====
      sectionHeader('SIGNATURES', navy);
      const techSig   = (typeof getSigDataSafe === 'function') ? getSigDataSafe('sig-tech')   : null;
      const assistSig = (typeof getSigDataSafe === 'function') ? getSigDataSafe('sig-assist') : null;
      const clientSig = (typeof getSigDataSafe === 'function') ? getSigDataSafe('sig-client') : null;

      function sigBlock(label, name, date, sigData, xPos) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...navy);
        doc.text(label, xPos, y);
        if (sigData) {
          try { doc.addImage(sigData, 'JPEG', xPos, y + 2, 50, 16); } catch (_) {}
        } else {
          doc.setDrawColor(180);
          doc.setLineWidth(0.2);
          doc.rect(xPos, y + 2, 50, 16);
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(40, 40, 40);
        doc.text(name || '', xPos, y + 21);
        doc.text(date || '', xPos, y + 24.5);
      }

      checkPage(32);
      sigBlock('Lead Technician',
               $('#sig-tech-name').value || $('#tech-lead').value,
               $('#sig-tech-date').value,
               techSig, margin);
      if (assistSig || $('#tech-assist').value) {
        sigBlock('Assisting Technician',
                 $('#sig-assist-name').value || $('#tech-assist').value,
                 $('#sig-assist-date').value || '',
                 assistSig, margin + 60);
      }
      y += 30;

      // ===== PART I – Acceptance =====
      sectionHeader('PART I — SITE REPRESENTATIVE ACCEPTANCE', [70, 90, 130]);
      if ($('#acceptance-text').value) {
        const accLines = doc.splitTextToSize($('#acceptance-text').value, pageW - margin * 2);
        checkPage(accLines.length * 3.6 + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(25, 25, 25);
        doc.text(accLines, margin, y);
        y += accLines.length * 3.6 + 5;
      }
      fieldBox('Representative', `${$('#client-rep-name').value || ''} · ${$('#client-rep-title').value || ''}`, margin, pageW - margin * 2, 10);
      y += 12;
      checkPage(28);
      sigBlock('Client Signature',
               $('#client-rep-name').value,
               `${$('#sig-client-date').value || ''} ${$('#sig-client-time').value || ''}`,
               clientSig, margin);
      y += 28;
      if ($('#client-comments').value) {
        fieldBox('Comments', $('#client-comments').value, margin, pageW - margin * 2, 12);
        y += 14;
      }

      // ===== Photos =====
      if (state.photos && state.photos.length) {
        state.photos.forEach((p, idx) => {
          if (!p.dataUrl || !p.dataUrl.startsWith('data:image')) return;
          doc.addPage();
          drawPageFrame();
          drawHeader();
          y = 40;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(...navy);
          doc.text(`Photographic Evidence – ${p.name || ('Photo ' + (idx + 1))}`, margin, y);
          y += 6;
          try {
            const imgW = pageW - margin * 2;
            doc.addImage(p.dataUrl, 'JPEG', margin, y, imgW, 0);
          } catch (e) {
            try { doc.addImage(p.dataUrl, 'PNG', margin, y, pageW - margin * 2, 0); } catch (_) {}
          }
        });
      }

      // Apply footer + ensure logo on every page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        drawPageFrame();
        // Re-draw small logo top-right on every page (clear of boundary)
        try {
          doc.addImage(LOGO_DATA_URL, 'PNG', pageW - margin - 28, outer + 1.5, 24, 4.2);
        } catch (e) {}
        drawFooter(i, pageCount);
      }

      // First page header was already drawn; ensure logo is prominent on page 1
      doc.setPage(1);
      try {
        doc.addImage(LOGO_DATA_URL, 'PNG', pageW - margin - 42, 12.0, 42, 7.5);
      } catch (e) {}

      const fileName = `${$('#wo-number').value || 'WO'}_${($('#site-name').value || 'WorkOrder').replace(/\s+/g, '_')}.pdf`;
      state.pdfBlob = doc.output('blob');
      state.pdfFileName = fileName;
      doc.save(fileName);

      $('#btn-share').style.display = 'inline-flex';
      $('#pdf-status').textContent = `PDF generated: ${fileName}`;
      toast('PDF generated successfully', 'success');
      $('#wo-status').value = 'COMPLETED';
      if ($('#wo-status-display')) $('#wo-status-display').textContent = 'COMPLETED';
    } catch (err) {
      console.error(err);
      toast('PDF generation failed: ' + err.message, 'error');
    } finally {
      hideOverlay();
    }
  }

  async function sharePDF() {
    if (!state.pdfBlob) {
      toast('Generate the PDF first', 'error');
      return;
    }
    const file = new File([state.pdfBlob], state.pdfFileName, { type: 'application/pdf' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: state.pdfFileName,
          text: `Technical Service Work Order – ${$('#wo-number').value}`,
          files: [file]
        });
      } catch (e) {
        if (e.name !== 'AbortError') fallbackShare(file);
      }
    } else {
      fallbackShare(file);
    }
  }

  function fallbackShare(file) {
    // Download again + open WhatsApp / mailto tips
    const url = URL.createObjectURL(state.pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = state.pdfFileName;
    a.click();
    toast('PDF downloaded. You can attach it in WhatsApp, Email or any app.');
  }

  // ---------- Local draft save ----------
  function saveDraft() {
    const data = {
      wo: $('#wo-number').value,
      fields: {}
    };
    $$('input, select, textarea').forEach(el => {
      if (el.id) data.fields[el.id] = el.type === 'checkbox' ? el.checked : el.value;
    });
    data.photos = state.photos;
    data.step = state.currentStep;
    try {
      localStorage.setItem('fw_wo_draft', JSON.stringify(data));
      toast('Draft saved on this device', 'success');
    } catch (e) {
      toast('Could not save draft (storage full?)', 'error');
    }
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem('fw_wo_draft');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.fields) {
        Object.entries(data.fields).forEach(([id, val]) => {
          const el = document.getElementById(id);
          if (!el) return;
          if (el.type === 'checkbox') el.checked = !!val;
          else el.value = val;
        });
      }
      if (data.wo) {
        $('#wo-number-display').textContent = data.wo;
      }
      if (data.photos) {
        state.photos = data.photos;
        renderPhotos();
      }
      toast('Draft restored', 'success');
    } catch (_) {}
  }

  // ---------- Init & Events ----------
  function init() {
    // Defaults
    $('#doc-date').value = todayISO();
    $('#work-date').value = todayISO();
    $('#wo-number').value = generateWONumber();
    $('#wo-number-display').textContent = $('#wo-number').value;
    $('#wo-date-display').textContent = todayISO();

    // GPS
    $('#btn-gps').addEventListener('click', getGPS);

    // Auto-fill
    $('#btn-autofill').addEventListener('click', runAutoPopulate);

    // Confirm buttons
    $$('[data-confirm]').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.confirm, 10);
        if (!validateStep(step)) return;
        showStep(step + 1);
        if (step + 1 === 9) buildReview();
      });
    });

    // Nav
    $('#btn-prev').addEventListener('click', () => {
      if (state.currentStep > 0) showStep(state.currentStep - 1);
    });
    $('#btn-next').addEventListener('click', () => {
      // On step 0 force autofill path
      if (state.currentStep === 0) {
        runAutoPopulate();
        return;
      }
      const next = state.currentStep + 1;
      if (!validateStep(state.currentStep)) return;
      showStep(next);
      if (next === 9) buildReview();
    });

    // Photos
    $('#photo-input').addEventListener('change', e => addPhotos(e.target.files));
    $('#file-input').addEventListener('change', e => addPhotos(e.target.files));

    // Clear sigs
    $$('[data-clear-sig]').forEach(btn => {
      btn.addEventListener('click', () => clearSig(btn.dataset.clearSig));
    });

    // PDF
    $('#btn-generate-pdf').addEventListener('click', generatePDF);
    $('#btn-share').addEventListener('click', sharePDF);
    $('#btn-save-draft').addEventListener('click', saveDraft);

    // Add hazard / qc / part
    $('#btn-add-hazard').addEventListener('click', () => {
      fillHazards([{ hazard: '', risk: 'Medium', control: '', verified: false },
        ...Array.from($$('#hazards-container .haz-hazard')).map((_, i) => {
          const node = $$('#hazards-container > div')[i];
          return {
            hazard: node.querySelector('.haz-hazard').value,
            risk: node.querySelector('.haz-risk').value,
            control: node.querySelector('.haz-control').value,
            verified: node.querySelector('.haz-verified').checked
          };
        })
      ]);
    });

    // Resize sig pads on orientation change
    window.addEventListener('resize', () => {
      // re-init only if empty to avoid wiping
    });

    // Init signature pads after layout
    setTimeout(initSignatures, 300);

    // Restore draft?
    loadDraft();
    showStep(0);
  }

  document.addEventListener('DOMContentLoaded', init);
})();


// ===== FIXES OVERRIDE =====
(function() {
  // Re-bind Add QC
  const btnQc = document.getElementById('btn-add-qc');
  if (btnQc) {
    btnQc.onclick = function() {
      const container = document.getElementById('qc-table-container');
      if (!container) return;
      let tbody = container.querySelector('tbody');
      if (!tbody) {
        container.innerHTML = `<table class="data-table"><thead><tr>
          <th>Test Description</th><th>As-Found</th><th>As-Left</th><th>Criterion</th><th>Result</th>
        </tr></thead><tbody></tbody></table>`;
        tbody = container.querySelector('tbody');
      }
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input class="qc-test" value="" placeholder="Test name" /></td>
        <td><input class="qc-found" value="" /></td>
        <td><input class="qc-left" value="" /></td>
        <td><input class="qc-crit" value="" /></td>
        <td><select class="qc-result"><option>PASS</option><option>FAIL</option><option>N/A</option></select></td>`;
      tbody.appendChild(tr);
    };
  }

  // Re-bind Add Part
  const btnPart = document.getElementById('btn-add-part');
  if (btnPart) {
    btnPart.onclick = function() {
      const container = document.getElementById('parts-container');
      if (!container) return;
      const today = new Date().toISOString().slice(0,10);
      const end = new Date(); end.setFullYear(end.getFullYear()+1);
      const endDate = end.toISOString().slice(0,10);
      const div = document.createElement('div');
      div.className = 'item-card';
      div.innerHTML = `
        <div class="form-group"><label>Description</label>
          <input type="text" class="part-desc" value="" /></div>
        <div class="row">
          <div class="form-group"><label>Qty</label><input type="text" class="part-qty" value="1" /></div>
          <div class="form-group"><label>Status</label>
            <select class="part-status"><option>New</option><option>Reconditioned</option><option>Used</option></select></div>
        </div>
        <div class="form-group"><label>Vendor / Source</label>
          <input type="text" class="part-vendor" value="" /></div>
        <div class="row">
          <div class="form-group"><label>Install Date</label>
            <input type="date" class="part-install" value="${today}" /></div>
          <div class="form-group"><label>Warranty Start</label>
            <input type="date" class="part-wstart" value="${today}" /></div>
        </div>
        <div class="form-group"><label>Warranty End</label>
          <input type="date" class="part-wend" value="${endDate}" /></div>
        <button type="button" class="btn btn-outline btn-sm" onclick="this.parentElement.remove()">Remove</button>`;
      container.appendChild(div);
    };
  }

  // Force re-init signatures when step 8 is shown
  const origShowStep = window.showStep;
  // Hook into confirm buttons for step 7 -> 8
  document.querySelectorAll('[data-confirm="7"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        if (typeof initSignatures === 'function') initSignatures();
      }, 200);
    });
  });

  // Also re-init on DOM ready with delay
  setTimeout(() => {
    if (typeof initSignatures === 'function') initSignatures();
  }, 600);

  // Fix Save Draft to actually download a file
  const btnSave = document.getElementById('btn-save-draft');
  if (btnSave) {
    btnSave.onclick = function() {
      const data = { version: 1, savedAt: new Date().toISOString(), fields: {} };
      document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.id) data.fields[el.id] = el.type === 'checkbox' ? el.checked : el.value;
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (document.getElementById('wo-number')?.value || 'WorkOrder') + '_draft.json';
      a.click();
      URL.revokeObjectURL(a.href);
      if (typeof toast === 'function') toast('Draft downloaded to your device', 'success');
    };
  }

  // Improve PDF signature handling – convert to JPEG to avoid PNG corruption
  // (jsPDF sometimes fails on certain PNG signatures)
  const origGetSig = window.getSigData;
  window.getSigDataSafe = function(id) {
    const pad = (typeof sigPads !== 'undefined') ? sigPads[id] : null;
    if (!pad || pad.isEmpty()) return null;
    try {
      // Force white background JPEG
      const canvas = document.getElementById(id);
      if (!canvas) return pad.toDataURL('image/png');
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width;
      tmp.height = canvas.height;
      const ctx = tmp.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, tmp.width, tmp.height);
      ctx.drawImage(canvas, 0, 0);
      return tmp.toDataURL('image/jpeg', 0.92);
    } catch (e) {
      return pad.toDataURL('image/png');
    }
  };
})();
