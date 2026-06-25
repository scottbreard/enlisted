-- Migration 003: Seed static reference data
-- markets, exchanges, service_categories already seeded in 001 via INSERT … ON CONFLICT DO NOTHING
-- This migration seeds exchange_deadline_templates (compliance calendar rules)
-- Sources:
--   TSX/TSXV: NI 51-102 Continuous Disclosure Obligations
--   CSE: CSE Policy 3 / NI 51-102
--   NEO: NEO Exchange Listing Manual

-- Wipe and re-seed so this is idempotent
delete from exchange_deadline_templates;

insert into exchange_deadline_templates
  (exchange_code, event_name, event_category, months_after_fiscal_year_end, days_offset, description, rule_reference)
values

-- ── TSX ─────────────────────────────────────────────────────────────────────

('TSX', 'Annual Financial Statements',          'Financial Reporting', 3,  0,
 'Audited annual financial statements and MD&A must be filed within 90 days of fiscal year end.',
 'NI 51-102 s.4.2'),

('TSX', 'Annual Information Form (AIF)',        'Financial Reporting', 3,  0,
 'AIF due within 90 days of fiscal year end (if required).',
 'NI 51-102 s.6.1'),

('TSX', 'Annual MD&A',                          'Financial Reporting', 3,  0,
 'Annual Management Discussion & Analysis filed with annual financials.',
 'NI 51-102 s.5.1'),

('TSX', 'Q1 Interim Financial Statements',      'Financial Reporting', 5, -15,
 'Interim financials for Q1 due 45 days after Q1 period end (60 days for venture issuers — TSX uses 45).',
 'NI 51-102 s.4.3'),

('TSX', 'Q2 Interim Financial Statements',      'Financial Reporting', 8, -15,
 'Interim financials for Q2 due 45 days after Q2 period end.',
 'NI 51-102 s.4.3'),

('TSX', 'Q3 Interim Financial Statements',      'Financial Reporting', 11, -15,
 'Interim financials for Q3 due 45 days after Q3 period end.',
 'NI 51-102 s.4.3'),

('TSX', 'Annual General Meeting',               'Corporate Governance', 6,  0,
 'AGM must be held within 6 months of fiscal year end.',
 'CBCA s.133 / TSX Company Manual s.464'),

('TSX', 'Management Information Circular',      'Corporate Governance', 5,  0,
 'Proxy circular must be filed and sent to shareholders at least 21 days before AGM.',
 'NI 54-101'),

('TSX', 'Executive Compensation Disclosure',    'Corporate Governance', 3,  0,
 'Compensation discussion and analysis filed with annual proxy or AIF.',
 'NI 51-102 Form 51-102F6'),

('TSX', 'Material Change Report',               'Continuous Disclosure', 0,  0,
 'Must be filed within 10 days of a material change. (Calendar reminder — trigger manually.)',
 'NI 51-102 s.7.1'),

('TSX', 'TSX Annual Listing Fee',               'Exchange Fees', 3,  0,
 'Annual sustaining fee invoiced by TSX — due approximately 90 days after fiscal year end.',
 'TSX Company Manual s.318'),

-- ── TSXV ────────────────────────────────────────────────────────────────────

('TSXV', 'Annual Financial Statements',         'Financial Reporting', 4,  0,
 'Audited annual financials due within 120 days of fiscal year end for TSXV issuers.',
 'NI 51-102 s.4.2 (Venture Issuer)'),

('TSXV', 'Annual MD&A',                         'Financial Reporting', 4,  0,
 'Annual MD&A filed with annual financials within 120 days.',
 'NI 51-102 s.5.1'),

('TSXV', 'Q1 Interim Financial Statements',     'Financial Reporting', 5,  0,
 'Interim financials for Q1 due 60 days after Q1 period end.',
 'NI 51-102 s.4.3 (Venture Issuer)'),

('TSXV', 'Q2 Interim Financial Statements',     'Financial Reporting', 8,  0,
 'Interim financials for Q2 due 60 days after Q2 period end.',
 'NI 51-102 s.4.3 (Venture Issuer)'),

('TSXV', 'Q3 Interim Financial Statements',     'Financial Reporting', 11, 0,
 'Interim financials for Q3 due 60 days after Q3 period end.',
 'NI 51-102 s.4.3 (Venture Issuer)'),

('TSXV', 'Annual General Meeting',              'Corporate Governance', 6,  0,
 'AGM must be held within 6 months of fiscal year end.',
 'CBCA s.133 / TSXV Policy 3.1'),

('TSXV', 'Management Information Circular',     'Corporate Governance', 5,  0,
 'Proxy circular filed and sent at least 21 days before AGM.',
 'NI 54-101'),

('TSXV', 'Annual Listing Maintenance Fee',      'Exchange Fees', 3,  0,
 'TSXV annual maintenance fee — amount based on market cap tier.',
 'TSXV Policy 1.5'),

('TSXV', 'Material Change Report',              'Continuous Disclosure', 0,  0,
 'Must be filed within 10 days of a material change. (Calendar reminder — trigger manually.)',
 'NI 51-102 s.7.1'),

('TSXV', 'Form 10 — Notice of Meeting',         'Corporate Governance', 5, -7,
 'TSXV Form 10 must be submitted to the Exchange at least 25 days before the AGM.',
 'TSXV Policy 3.3'),

-- ── CSE ─────────────────────────────────────────────────────────────────────

('CSE', 'Annual Financial Statements',          'Financial Reporting', 4,  0,
 'Audited annual financials due within 120 days of fiscal year end.',
 'CSE Policy 3 / NI 51-102'),

('CSE', 'Annual MD&A',                          'Financial Reporting', 4,  0,
 'Annual MD&A filed with annual financials within 120 days.',
 'NI 51-102 s.5.1'),

('CSE', 'Q1 Interim Financial Statements',      'Financial Reporting', 5,  0,
 'Interim financials for Q1 due 60 days after Q1 period end.',
 'NI 51-102 s.4.3 (Venture Issuer)'),

('CSE', 'Q2 Interim Financial Statements',      'Financial Reporting', 8,  0,
 'Interim financials for Q2 due 60 days after Q2 period end.',
 'NI 51-102 s.4.3 (Venture Issuer)'),

('CSE', 'Q3 Interim Financial Statements',      'Financial Reporting', 11, 0,
 'Interim financials for Q3 due 60 days after Q3 period end.',
 'NI 51-102 s.4.3 (Venture Issuer)'),

('CSE', 'Annual General Meeting',               'Corporate Governance', 6,  0,
 'AGM must be held within 6 months of fiscal year end.',
 'CSE Policy 3 / CBCA s.133'),

('CSE', 'Management Information Circular',      'Corporate Governance', 5,  0,
 'Proxy circular filed and sent at least 21 days before AGM.',
 'NI 54-101'),

('CSE', 'Annual Listing Fee',                   'Exchange Fees', 3,  0,
 'CSE annual listing fee — invoiced annually.',
 'CSE Fee Schedule'),

('CSE', 'Material Change Report',               'Continuous Disclosure', 0,  0,
 'Must be filed within 10 days of a material change. (Calendar reminder — trigger manually.)',
 'NI 51-102 s.7.1'),

-- ── NEO ─────────────────────────────────────────────────────────────────────

('NEO', 'Annual Financial Statements',          'Financial Reporting', 3,  0,
 'Audited annual financials due within 90 days of fiscal year end.',
 'NI 51-102 s.4.2 / NEO Listing Manual'),

('NEO', 'Annual MD&A',                          'Financial Reporting', 3,  0,
 'Annual MD&A filed with annual financials within 90 days.',
 'NI 51-102 s.5.1'),

('NEO', 'Q1 Interim Financial Statements',      'Financial Reporting', 5, -15,
 'Interim financials for Q1 due 45 days after Q1 period end.',
 'NI 51-102 s.4.3'),

('NEO', 'Q2 Interim Financial Statements',      'Financial Reporting', 8, -15,
 'Interim financials for Q2 due 45 days after Q2 period end.',
 'NI 51-102 s.4.3'),

('NEO', 'Q3 Interim Financial Statements',      'Financial Reporting', 11, -15,
 'Interim financials for Q3 due 45 days after Q3 period end.',
 'NI 51-102 s.4.3'),

('NEO', 'Annual General Meeting',               'Corporate Governance', 6,  0,
 'AGM must be held within 6 months of fiscal year end.',
 'CBCA s.133 / NEO Listing Manual'),

('NEO', 'Management Information Circular',      'Corporate Governance', 5,  0,
 'Proxy circular filed and sent at least 21 days before AGM.',
 'NI 54-101'),

('NEO', 'Annual Listing Fee',                   'Exchange Fees', 3,  0,
 'NEO annual listing fee — invoiced annually.',
 'NEO Exchange Fee Schedule'),

('NEO', 'Material Change Report',               'Continuous Disclosure', 0,  0,
 'Must be filed within 10 days of a material change. (Calendar reminder — trigger manually.)',
 'NI 51-102 s.7.1');

-- Verify
select exchange_code, count(*) as rules from exchange_deadline_templates group by exchange_code order by exchange_code;
