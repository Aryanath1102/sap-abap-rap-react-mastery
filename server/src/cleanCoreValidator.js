/**
 * Clean Core & Modern ABAP Static Code Analyzer
 * Enforces ABAP Cloud, S/4HANA Clean Core, RAP strict ( 2 ), and OData V4 best practices.
 */

const UNRELEASED_TABLES = [
  'but000', 'mara', 'marc', 'mard', 'vbak', 'vbap', 'kna1', 'lfa1',
  'bseg', 'bkpf', 'ekko', 'ekpo', 'mast', 'stko', 'stpo', 'aufk', 'afko'
];

const TABLE_REPLACEMENTS = {
  'but000': 'I_BusinessPartner / I_BusinessPartnerAddress',
  'mara': 'I_Product / I_ProductDescription',
  'marc': 'I_ProductPlant',
  'mard': 'I_ProductStorageLocation',
  'vbak': 'I_SalesOrderTP / I_SalesOrder',
  'vbap': 'I_SalesOrderItemTP / I_SalesOrderItem',
  'kna1': 'I_Customer',
  'lfa1': 'I_Supplier',
  'bseg': 'I_JournalEntryItem',
  'bkpf': 'I_JournalEntry',
  'ekko': 'I_PurchaseOrderAPI01',
  'ekpo': 'I_PurchaseOrderItemAPI01'
};

export function validateAssignment(lessonId, code) {
  if (!code || typeof code !== 'string' || !code.trim()) {
    return {
      status: 'needs_revision',
      complianceScore: 0,
      grade: 'F',
      violations: [{
        rule: 'EMPTY_CODE',
        severity: 'ERROR',
        message: 'No code was submitted. Please write your modern ABAP / RAP implementation.',
        remediation: 'Implement the exercise according to the prompt instructions.'
      }],
      strengths: [],
      architectNotes: 'An empty submission cannot be verified against the SAP Clean Core standards.'
    };
  }

  const cleanLines = code.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('*') && !line.startsWith('//') && !line.startsWith('"'));
  const cleanCode = cleanLines.join(' ');
  const lowerCode = cleanCode.toLowerCase();

  const violations = [];
  const strengths = [];

  // ==========================================
  // 1. UNIVERSAL CLEAN CORE CHECKS
  // ==========================================

  // Check 1: Classic WRITE statement
  if (/\bwrite\s*:/i.test(code) || (/\bwrite\s+['a-z0-9_]/i.test(code) && !/out->write/i.test(code))) {
    violations.push({
      rule: 'NO_CLASSIC_WRITE',
      severity: 'ERROR',
      message: 'Classic Dynpro WRITE statement detected.',
      remediation: 'In ABAP Cloud, classic WRITE is forbidden. Use `out->write( )` via `IF_OO_ADT_CLASSRUN` for console testing, or expose data via CDS View Entities + RAP OData V4 services.',
      example: 'out->write( |Employee: { ls_emp-name }| ).'
    });
  }

  // Check 2: Unreleased standard tables
  for (const table of UNRELEASED_TABLES) {
    const tableRegex = new RegExp(`\\bfrom\\s+${table}\\b|\\binto\\s+table\\s+.*${table}\\b`, 'i');
    if (tableRegex.test(lowerCode)) {
      const replacement = TABLE_REPLACEMENTS[table] || 'released Level A CDS View Entity';
      violations.push({
        rule: 'UNRELEASED_TABLE_READ',
        severity: 'ERROR',
        message: `Direct read on unreleased standard table '${table.toUpperCase()}' violates Clean Core!`,
        remediation: `In ABAP Cloud & S/4HANA Clean Core, direct access to unreleased standard tables is strictly blocked by ATC. Query released CDS View Entities like '${replacement}'.`,
        example: `SELECT FROM ${replacement.split(' ')[0]} FIELDS ... INTO TABLE @DATA(lt_res).`
      });
    }
  }

  // Check 3: Obsolete Header Lines and OCCURS 0
  if (/\bheader\s+line\b/i.test(code) || /\boccurs\s+0\b/i.test(code)) {
    violations.push({
      rule: 'OBSOLETE_HEADER_LINE',
      severity: 'ERROR',
      message: 'Obsolete table declaration with HEADER LINE or OCCURS 0 found.',
      remediation: 'Internal tables with header lines have been obsolete for 15+ years and fail ABAP Cloud syntax checks. Use explicit table types with empty keys.',
      example: 'TYPES tt_items TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.'
    });
  }

  // Check 4: Obsolete Subroutines (FORM / PERFORM)
  if (/\bform\s+[a-z0-9_]/i.test(code) || /\bperform\s+[a-z0-9_]/i.test(code)) {
    violations.push({
      rule: 'NO_FORM_PERFORM',
      severity: 'ERROR',
      message: 'Subroutines (FORM / PERFORM) are obsolete and forbidden in ABAP Cloud.',
      remediation: 'Replace subroutines with Object-Oriented ABAP methods inside local or global classes.',
      example: 'METHODS calculate_discount IMPORTING iv_amount TYPE decfloat16 RETURNING VALUE(rv_res) TYPE decfloat16.'
    });
  }

  // Check 5: Obsolete MOVE ... TO ...
  if (/\bmove\s+[a-z0-9_().-]+\s+to\s+[a-z0-9_().-]+/i.test(code)) {
    violations.push({
      rule: 'OBSOLETE_MOVE_STATEMENT',
      severity: 'WARNING',
      message: 'Legacy MOVE ... TO ... statement detected.',
      remediation: 'Use direct assignment (=) or the modern constructor expression CORRESPONDING #( ).',
      example: 'ls_target = CORRESPONDING #( ls_source ).'
    });
  }

  // Check 6: Unreleased Function Modules
  if (/\bcall\s+function\b/i.test(code)) {
    violations.push({
      rule: 'UNRELEASED_FUNCTION_MODULE',
      severity: 'WARNING',
      message: 'CALL FUNCTION detected. Classic function modules are rarely released for ABAP Cloud.',
      remediation: 'Use RAP Business Object operations (EML), released classes, or HTTP client destinations.',
      example: 'MODIFY ENTITIES OF zi_order ...'
    });
  }

  // Check 7: Classic CDS DEFINE VIEW (instead of DEFINE VIEW ENTITY)
  if (/\bdefine\s+view\s+z/i.test(code) && !/\bdefine\s+(root\s+)?view\s+entity\b/i.test(code)) {
    violations.push({
      rule: 'OBSOLETE_CDS_DEFINE_VIEW',
      severity: 'ERROR',
      message: 'Obsolete DEFINE VIEW used instead of DEFINE VIEW ENTITY.',
      remediation: 'DDIC-based CDS views (DEFINE VIEW) generate an SE11 SQL view and are deprecated in modern RAP. Use DEFINE [ROOT] VIEW ENTITY.',
      example: 'define root view entity ZI_Employee as select from zemp_db { ... }'
    });
  }

  // ==========================================
  // 2. POSITIVE PATTERN RECOGNITION (STRENGTHS)
  // ==========================================

  if (/\b(value\s+#|value\s+[a-z0-9_]+)\s*\(/i.test(code)) {
    strengths.push('Constructor expression VALUE #( ) utilized for clean inline data creation.');
  }
  if (/\breduce\s+(i|decfloat[0-9]*|[a-z0-9_]+)\s*\(/i.test(code)) {
    strengths.push('Modern REDUCE expression applied for declarative table aggregation.');
  }
  if (/\bcond\s+(i|string|[a-z0-9_]+)\s*\(/i.test(code)) {
    strengths.push('Conditional constructor expression COND #( ) utilized.');
  }
  if (/\bdata\s*\([a-z0-9_]+\)/i.test(code) || /\bfinal\s*\([a-z0-9_]+\)/i.test(code)) {
    strengths.push('Inline variable declaration (DATA(...) / FINAL(...)) properly leveraged.');
  }
  if (/\bfinal\s*\([a-z0-9_]+\)/i.test(code)) {
    strengths.push('ABAP 7.57+ immutable FINAL(...) used for functional immutability.');
  }
  if (/\bdefine\s+(root\s+)?view\s+entity\b/i.test(code)) {
    strengths.push('Modern CDS View Entity (7.55+) declared without legacy DDIC views.');
  }
  if (/\bstrict\s*\(\s*2\s*\)\s*;/i.test(code)) {
    strengths.push('RAP BDEF strict ( 2 ) mode enforced for Cloud compliance.');
  }
  if (/\bin\s+local\s+mode\b/i.test(code)) {
    strengths.push('EML IN LOCAL MODE used correctly for intra-BO operational isolation.');
  }
  if (/x-csrf-token/i.test(code)) {
    strengths.push('X-CSRF-Token security handshake present for stateful OData V4 operations.');
  }
  if (/\bpatch\b/i.test(code)) {
    strengths.push('HTTP PATCH method correctly targeted for OData V4 delta updates.');
  }

  // ==========================================
  // 3. LESSON-SPECIFIC VALIDATIONS
  // ==========================================

  let lessonSpecificPassed = true;

  if (lessonId === 'modern-abap') {
    if (!/reduce/i.test(code)) {
      violations.push({
        rule: 'MISSING_REDUCE',
        severity: 'ERROR',
        message: 'Day 1 exercise requires a REDUCE constructor expression to aggregate employee records.',
        remediation: 'Use REDUCE i( INIT cnt = 0 FOR ls IN lt_emps NEXT cnt = cnt + COND i( WHEN ls-salary > 70000 THEN 1 ELSE 0 ) ).'
      });
      lessonSpecificPassed = false;
    }
  } else if (lessonId === 'oop-abap') {
    if (!/for\s+testing/i.test(code)) {
      violations.push({
        rule: 'MISSING_TEST_ANNOTATION',
        severity: 'ERROR',
        message: 'Day 2 exercise requires an ABAP Unit test class declaration with FOR TESTING.',
        remediation: 'Declare the local class with `CLASS ltc_... DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.`'
      });
      lessonSpecificPassed = false;
    }
  } else if (lessonId === 'cds-entities') {
    if (!/projection\s+on/i.test(code) && !/view\s+entity/i.test(code)) {
      violations.push({
        rule: 'MISSING_PROJECTION_SYNTAX',
        severity: 'WARNING',
        message: 'CDS projection view should specify `provider contract transactional_query as projection on ZI_*`.',
        remediation: 'Use `define root view entity ZC_Employee provider contract transactional_query as projection on ZI_Employee { ... }`'
      });
    }
  } else if (lessonId === 'rap-arch' || lessonId === 'rap-bdef') {
    if (!/strict\s*\(\s*2\s*\)/i.test(code) && /define\s+behavior/i.test(code)) {
      violations.push({
        rule: 'MISSING_STRICT_2',
        severity: 'ERROR',
        message: 'All modern RAP Behavior Definitions must declare `strict ( 2 );`.',
        remediation: 'Add `strict ( 2 );` immediately below `managed implementation in class ... unique;`.'
      });
      lessonSpecificPassed = false;
    }
  } else if (lessonId === 'rap-eml') {
    if (!/%cid/i.test(code) && !/%tky/i.test(code) && !/modify\s+entities/i.test(code) && !/read\s+entities/i.test(code)) {
      violations.push({
        rule: 'MISSING_EML_STRUCTURE',
        severity: 'WARNING',
        message: 'Expected modern EML statements or %cid / %tky operational identifiers.',
        remediation: 'Utilize MODIFY ENTITIES OF ... or READ ENTITIES OF ... with %cid for new instances.'
      });
    }
  } else if (lessonId === 'odata-v4') {
    if (!/patch/i.test(code) && !/define\s+service/i.test(code)) {
      violations.push({
        rule: 'ODATA_V4_METHOD',
        severity: 'WARNING',
        message: 'Ensure OData V4 PATCH method is specified for partial updates.',
        remediation: 'OData V4 mandates PATCH (with only modified attributes) rather than PUT.'
      });
    }
  } else if (lessonId === 'react-rap') {
    if (!/value/i.test(code) && !/csrf/i.test(code)) {
      violations.push({
        rule: 'REACT_ODATA_PATTERN',
        severity: 'WARNING',
        message: 'In React + OData V4, remember to fetch X-CSRF-Token and extract records from data.value.',
        remediation: 'Read array data from `data.value` and total records from `data["@odata.count"]`.'
      });
    }
  } else if (lessonId === 'clean-core') {
    if (/mara|but000|vbak/i.test(code)) {
      lessonSpecificPassed = false;
    }
  }

  // ==========================================
  // 4. SCORING & FINAL EVALUATION
  // ==========================================

  const errorCount = violations.filter(v => v.severity === 'ERROR').length;
  const warningCount = violations.filter(v => v.severity === 'WARNING').length;

  let complianceScore = 100 - (errorCount * 35) - (warningCount * 10);
  if (strengths.length > 0) complianceScore += Math.min(15, strengths.length * 5);
  complianceScore = Math.max(0, Math.min(100, complianceScore));

  let grade = 'F';
  if (complianceScore >= 90) grade = 'A+';
  else if (complianceScore >= 80) grade = 'A';
  else if (complianceScore >= 65) grade = 'B';
  else if (complianceScore >= 50) grade = 'C';

  const status = (errorCount === 0 && lessonSpecificPassed && complianceScore >= 70)
    ? 'passed'
    : 'needs_revision';

  let architectNotes = '';
  if (status === 'passed') {
    architectNotes = `Excellent Clean Core execution! Your code demonstrates full compliance with Modern ABAP and ABAP Cloud principles. ${strengths.length > 0 ? 'Notable strengths: ' + strengths.join(' ') : ''}`;
  } else {
    architectNotes = `Your submission has ${errorCount} Clean Core violation(s) that would fail SAP S/4HANA Cloud ATC checks. Review the detailed remediation instructions below to make your solution production-grade.`;
  }

  return {
    status,
    complianceScore,
    grade,
    violations,
    strengths,
    architectNotes
  };
}

/**
 * Built-in SAP Technical Architect Code Reviewer & Assistant
 */
export function analyzeMentorPrompt(prompt) {
  const lower = prompt.toLowerCase();
  const issues = [];
  const suggestions = [];

  // Static checks on user prompt
  if (lower.includes('write:') || /\bwrite\s+['a-z0-9]/i.test(prompt)) {
    issues.push('Classic `WRITE` detected: in Modern ABAP & ABAP Cloud, use `out->write()` in console apps or expose via RAP OData V4.');
  }
  if (lower.includes('select * from but000') || lower.includes('select * from mara') || lower.includes('select * from vbak')) {
    issues.push('Clean Core violation: Direct read on unreleased standard table. In ABAP Cloud, query released Level A CDS View Entities (e.g., `I_BusinessPartner`, `I_Product`, `I_SalesOrderTP`).');
  }
  if (lower.includes('header line') || lower.includes('occurs 0')) {
    issues.push('Obsolete syntax (`HEADER LINE / OCCURS 0`): use modern `TYPES tt_... TYPE STANDARD TABLE OF ... WITH EMPTY KEY` and inline `VALUE #()`.');
  }
  if (lower.includes('define behavior') && !lower.includes('strict')) {
    issues.push('Missing `strict ( 2 );` in Behavior Definition: `strict ( 2 )` is mandatory for cloud-certified RAP BOs.');
  }
  if (lower.includes('modify entities') && !lower.includes('%cid') && lower.includes('create')) {
    suggestions.push('When using EML `CREATE`, always provide a `%cid` (Content ID) to correlate input instances with `MAPPED`, `FAILED`, and `REPORTED`.');
  }
  if (lower.includes('read entities') && !lower.includes('local mode')) {
    suggestions.push('Inside your own Behavior Pool implementation, use `IN LOCAL MODE` to bypass external authorization and feature control checks.');
  }
  if (lower.includes('fetch(') || lower.includes('react')) {
    if (!lower.includes('x-csrf-token') && (lower.includes('post') || lower.includes('patch') || lower.includes('delete'))) {
      issues.push('SAP RAP OData V4 requires a security handshake: fetch `X-CSRF-Token: Fetch` via a HEAD or GET request before executing POST, PATCH, or DELETE.');
    }
  }

  // Generate responsive architectural advice
  let response = '';

  if (issues.length > 0) {
    response += `### ⚠️ Clean Core & Architecture Code Review\n\n`;
    response += `I analyzed your snippet against **SAP S/4HANA Clean Core & ABAP Cloud** standards:\n\n`;
    issues.forEach(issue => {
      response += `- ❌ **Violation**: ${issue}\n`;
    });
    if (suggestions.length > 0) {
      response += `\n**Architectural Best Practices:**\n`;
      suggestions.forEach(sug => {
        response += `- 💡 **Recommendation**: ${sug}\n`;
      });
    }
    response += `\n---\n`;
  }

  // Answer topic-specific queries
  if (lower.includes('eml') || lower.includes('entity manipulation language')) {
    response += `### 📘 EML (Entity Manipulation Language) Deep Dive\n\n` +
      `**Level 1 (Layman's Analogy):**\n` +
      `Think of EML like Prisma or an ORM client built directly into the ABAP kernel. Instead of raw SQL INSERT/UPDATE, you invoke business logic methods with full validation, locking, and authorization.\n\n` +
      `**Level 2 (SAP Technical Internal Mechanics):**\n` +
      `EML statements (\`READ ENTITIES\`, \`MODIFY ENTITIES\`, \`COMMIT ENTITIES\`) communicate with RAP Business Objects. In behavior pools, use \`IN LOCAL MODE\` to bypass external authorization checks. Always check the \`FAILED\` and \`REPORTED\` internal tables for validation errors.\n\n` +
      `\`\`\`abap\nMODIFY ENTITIES OF zi_employee IN LOCAL MODE\n  ENTITY Employee\n  UPDATE FIELDS ( Salary )\n  WITH VALUE #( ( %tky = ls_key-%tky Salary = 95000 ) )\n  FAILED DATA(lt_failed)\n  REPORTED DATA(lt_reported).\n\`\`\``;
  } else if (lower.includes('draft') || lower.includes('draft handling')) {
    response += `### 📝 RAP Draft Handling\n\n` +
      `**Level 1 (Layman's Analogy):**\n` +
      `Just like Google Docs auto-saves as you type, RAP Draft keeps incomplete work in a temporary draft table without polluting the active production table. You can close your laptop and resume editing later.\n\n` +
      `**Level 2 (SAP Technical Internal Mechanics):**\n` +
      `Draft BOs declare \`with draft;\` in the BDEF and define a draft table with \`draft table zemp_d\`. RAP manages two instances: Active (\`%is_draft = if_abap_behv=>mk-off\`) and Draft (\`%is_draft = if_abap_behv=>mk-on\`). The \`PREPARE\` action triggers validations before activation into the active table.`;
  } else if (lower.includes('csrf') || lower.includes('react') || lower.includes('token')) {
    response += `### 🔐 React + SAP OData V4 Security & CSRF Handshake\n\n` +
      `**Level 1 (Layman's Analogy):**\n` +
      `Imagine entering an office building where the front desk gives you a day pass badge before letting you enter private rooms. SAP Gateway requires React to get a badge (\`X-CSRF-Token\`) on an initial read request before allowing any create, edit, or delete actions.\n\n` +
      `**Level 2 (SAP Technical Implementation):**\n` +
      `1. Send a \`HEAD\` or \`GET\` request with header \`X-CSRF-Token: Fetch\` and \`credentials: 'include'\`.\n` +
      `2. Extract \`res.headers.get('x-csrf-token')\`.\n` +
      `3. Send \`POST\` / \`PATCH\` / \`DELETE\` with headers: \`'X-CSRF-Token': csrfToken\` and \`'If-Match': etag\` (or \`'*'\`).\n` +
      `4. In OData V4, records live in \`data.value\` and error messages live in \`data.error.details\`.`;
  } else if (lower.includes('clean core') || lower.includes('abap cloud')) {
    response += `### 🏛️ S/4HANA Clean Core Principles\n\n` +
      `**Level 1 (Layman's Analogy):**\n` +
      `Never modify the vehicle engine with duct tape and custom soldering; use the factory-approved plug-and-play ports. Clean Core ensures your SAP system can upgrade to the next release without touching a single line of custom code.\n\n` +
      `**Level 2 (SAP Technical Specifications):**\n` +
      `- Set ABAP Language Version to **ABAP for Cloud Development** in Eclipse ADT.\n` +
      `- Access standard SAP tables strictly through **Level A Released APIs** (e.g. \`I_BusinessPartner\`, \`I_Product\`).\n` +
      `- Build transactional extensions exclusively using the **ABAP RESTful Application Programming Model (RAP)**.\n` +
      `- Enforce **strict ( 2 )** in all BDEFs and run **ABAP Test Cockpit (ATC)** with Clean Core check variants.`;
  } else if (issues.length === 0) {
    response += `### 💡 SAP Technical Architect Insight\n\n` +
      `I have received your inquiry. As an SAP Full-Stack Architect specializing in Modern ABAP, CDS View Entities, RAP, and React OData V4:\n\n` +
      `- **Clean Core Focus**: Always build extensions using released APIs and RAP BOs with \`strict ( 2 )\`. Avoid unreleased tables like \`BUT000\` or \`MARA\`.\n` +
      `- **Data Virtualization**: Use \`DEFINE VIEW ENTITY\` for Interface (\`ZI_*\`) and Projection (\`ZC_*\`) views.\n` +
      `- **React Integration**: Connect via OData V4 using \`fetch()\`, remember the CSRF handshake, and handle delta updates with \`PATCH\`.\n\n` +
      `Paste any ABAP, CDS, BDEF, or React snippet, or ask about specific concepts like Determinations, Validations, EML, or Draft handling!`;
  }

  return response;
}
